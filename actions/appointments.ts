"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, format, isBefore, endOfDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { deductCreditsForAppointment } from "@/actions/credit";
import type { Appointment } from "@prisma/client"

type Slot = {
        startTime: string;
        endTime: string;
        formatted: string;
        day: string
};

/**
 * Get doctor by ID
 */
export async function getDoctorById(doctorId: string) {
        try {
                const doctor = await db.user.findUnique({
                        where: {
                                id: doctorId,
                                role: "DOCTOR",
                                verificationStatus: "VERIFIED",
                        },
                });

                if (!doctor) {
                        throw new Error("Doctor not found");
                }

                return { doctor };
        } catch (error) {
                console.error("Failed to fetch doctor:", error);
                throw new Error("Failed to fetch doctor details");
        }
}

/**
 * Get available time slots for booking for the next 4 days
 */
export async function getAvailableTimeSlots(doctorId: string) {
        try {
                // Validate doctor existence and verification
                const doctor = await db.user.findUnique({
                        where: {
                                id: doctorId,
                                role: "DOCTOR",
                                verificationStatus: "VERIFIED",
                        },
                });
                if (!doctor) {
                        throw new Error("Doctor not found or not verified");
                }

                // Fetch a single availability record
                const availability = await db.availability.findFirst({
                        where: {
                                doctorId: doctor.id,
                                status: "AVAILABLE",
                        },
                });

                if (!availability) {
                        throw new Error("No availability set by doctor");
                }

                // Get the next 4 days
                const now = new Date();
                const days = [now, addDays(now, 1), addDays(now, 2), addDays(now, 3)];

                // Fetch existing appointments for the doctor over the next 4 days
                const lastDay = endOfDay(days[3]);
                const existingAppointments = await db.appointment.findMany({
                        where: {
                                doctorId: doctor.id,
                                status: "SCHEDULED",
                                startTime: {
                                        lte: lastDay,
                                },
                        },
                });

                const availableSlotsByDay: { [key: string]: Slot[] } = {};
                // For each of the next 4 days, generate available slots
                for (const day of days) {
                        const dayString = format(day, "yyyy-MM-dd");
                        availableSlotsByDay[dayString] = [];
                        // Create a copy of the availability start/end times for this day
                        const availabilityStart = new Date(availability.startTime);
                        const availabilityEnd = new Date(availability.endTime);
                        // Set the day to the current day we're processing
                        availabilityStart.setFullYear(
                                day.getFullYear(),
                                day.getMonth(),
                                day.getDate()
                        );
                        availabilityEnd.setFullYear(
                                day.getFullYear(),
                                day.getMonth(),
                                day.getDate()
                        );

                        let current = new Date(availabilityStart);
                        const end = new Date(availabilityEnd);

                        while (
                                isBefore(addMinutes(current, 30), end) ||
                                +addMinutes(current, 30) === +end
                        ) {
                                const next = addMinutes(current, 30);

                                // Skip past slots
                                if (isBefore(current, now)) {
                                        current = next;
                                        continue;
                                }

                                const overlaps = existingAppointments.some((appointment) => {
                                        const aStart = new Date(appointment.startTime);
                                        const aEnd = new Date(appointment.endTime);

                                        return (
                                                (current >= aStart && current < aEnd) ||
                                                (next > aStart && next <= aEnd) ||
                                                (current <= aStart && next >= aEnd)
                                        );
                                });

                                if (!overlaps) {
                                        availableSlotsByDay[dayString].push({
                                                startTime: current.toISOString(),
                                                endTime: next.toISOString(),
                                                formatted: `${format(current, "h:mm a")} - ${format(
                                                        next,
                                                        "h:mm a"
                                                )}`,
                                                day: format(current, "EEEE, MMMM d"),
                                        });
                                }

                                current = next;
                        }
                }

                // Convert to array of slots grouped by day for easier consumption by the UI
                const result = Object.entries(availableSlotsByDay).map(([date, slots]) => ({
                        date,
                        displayDate:
                                slots.length > 0
                                        ? slots[0].day
                                        : format(new Date(date), "EEEE, MMMM d"),
                        slots,
                }));

                return { days: result };

        } catch (error) {
                console.error("Failed to fetch available slots:", error);
                if (error instanceof Error) {
                        throw new Error("Failed to fetch available time slots: " + error.message);
                } else {
                        throw new Error("Failed to fetch available time slots: " + String(error));
                }
        }
}

/**
 * Book a new appointment with a doctor
 */
export interface BookAppointmentFormData {
        patientId: string;
        doctorId: string;
        startTime: string | Date;
        endTime: string | Date;
        description?: string;
}

export interface BookAppointmentResult {
        success: boolean;
        appointment: Appointment;
}

export async function bookAppointment(formData: BookAppointmentFormData): Promise<BookAppointmentResult> {
        const { userId } = await auth();

        if (!userId) {
                throw new Error("Unauthorized");
        }

        try {
                const patient = await db.user.findUnique({
                        where: {
                                id: formData.patientId,
                                role: "PATIENT",
                        },
                });
                if (!patient) {
                        throw new Error("Patient not found");
                }

                const doctorId: string = formData.doctorId;
                const startTime: Date = new Date(formData.startTime);
                const endTime: Date = new Date(formData.endTime);
                const patientDescription: string = formData.description || "";

                // Validate input
                if (!doctorId || !startTime || !endTime) {
                        throw new Error("Doctor, start time, and end time are required");
                }

                // Check if the doctor exists and is verified
                const doctor = await db.user.findUnique({
                        where: {
                                id: doctorId,
                                role: "DOCTOR",
                                verificationStatus: "VERIFIED",
                        },
                });

                if (!doctor) {
                        throw new Error("Doctor not found or not verified");
                }

                // Check if the patient has enough credits (2 credits per appointment)
                if (patient.credits < 2) {
                        throw new Error("Insufficient credits to book an appointment");
                }

                // Check if the requested time slot is available
                const overlappingAppointment = await db.appointment.findFirst({
                        where: {
                                doctorId: doctorId,
                                status: "SCHEDULED",
                                OR: [
                                        {
                                                // New appointment starts during an existing appointment
                                                startTime: {
                                                        lte: startTime,
                                                },
                                                endTime: {
                                                        gt: startTime,
                                                },
                                        },
                                        {
                                                // New appointment ends during an existing appointment
                                                startTime: {
                                                        lt: endTime,
                                                },
                                                endTime: {
                                                        gte: endTime,
                                                },
                                        },
                                        {
                                                // New appointment completely overlaps an existing appointment
                                                startTime: {
                                                        gte: startTime,
                                                },
                                                endTime: {
                                                        lte: endTime,
                                                },
                                        },
                                ],
                        },
                });

                if (overlappingAppointment) {
                        throw new Error("This time slot is already booked");
                }

                // Deduct credits from patient and add to doctor
                const { success, error }: { success: boolean; error?: string } = await deductCreditsForAppointment(
                        patient.id,
                        doctor.id
                );

                if (!success) {
                        throw new Error(error || "Failed to deduct credits");
                }

                // Create the appointment
                const appointment = await db.appointment.create({
                        data: {
                                patientId: patient.id,
                                doctorId: doctor.id,
                                startTime,
                                endTime,
                                patientDescription,
                                status: "SCHEDULED",
                        },
                });

                revalidatePath("/appointments");
                return { success: true, appointment: appointment };
        } catch (error) {
                console.error("Failed to book appointment:", error);
                if (error instanceof Error) {
                        throw new Error("Failed to book appointment: " + error.message);
                } else {
                        throw new Error("Failed to book appointment: Unknown error");
                }
        }
}