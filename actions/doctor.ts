"use server"
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Availability, SlotStatus, User } from "@prisma/client";
import { db } from "@/lib/prisma";

/**
 * Set doctor's availability slots
 */
export async function setAvailabilitySlots(formData: FormData): Promise<{ success: true; slot: Availability } | never> {
        const { userId } = await auth();

        if (!userId) {
                throw new Error("Unauthorized");
        }

        try {
                // Get the doctor
                const doctor: User | null = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                                role: "DOCTOR",
                        },
                });

                if (!doctor) {
                        throw new Error("Doctor not found");
                }

                // Get form data
                const startTimeRaw = formData.get("startTime");
                const endTimeRaw = formData.get("endTime");

                if (typeof startTimeRaw !== "string" || typeof endTimeRaw !== "string") {
                        throw new Error("Invalid input types for start or end time");
                }

                const startTime = new Date(startTimeRaw);
                const endTime = new Date(endTimeRaw);

                // Validate input
                if (!startTime || !endTime || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                        throw new Error("Start time and end time must be valid date strings");
                }

                if (startTime >= endTime) {
                        throw new Error("Start time must be before end time");
                }

                // Get existing availability slots
                const existingSlots = await db.availability.findMany({
                        where: {
                                doctorId: doctor.id,
                        },
                        include: {
                                // Check for associated appointments
                                doctor: {
                                        select: {
                                                doctorAppointments: true,
                                        },
                                },
                        },
                });

                // Filter out slots that have appointments
                const slotsWithNoAppointments = existingSlots.filter((slot) => {
                        // Check if the slot's doctor has appointments at this slot's start time
                        const hasAppointment = slot.doctor.doctorAppointments?.some((appt) => {
                                return appt.startTime.getTime() === slot.startTime.getTime();
                        });
                        return !hasAppointment;
                });

                // Delete old slots with no appointments
                if (slotsWithNoAppointments.length > 0) {
                        await db.availability.deleteMany({
                                where: {
                                        id: {
                                                in: slotsWithNoAppointments.map((slot) => slot.id),
                                        },
                                },
                        });
                }

                // Create new availability slot
                const newSlot = await db.availability.create({
                        data: {
                                doctorId: doctor.id,
                                startTime,
                                endTime,
                                status: SlotStatus.AVAILABLE,
                        },
                });

                revalidatePath("/doctor");
                return { success: true, slot: newSlot };
        } catch (error) {
                console.error("Failed to set availability slots:", error);
                if (error instanceof Error) {
                        throw new Error("Failed to set availability: " + error.message);
                } else {
                        throw new Error("Failed to set availability: Unknown error");
                }
        }
}

/**
 * Get doctor's current availability slots
 */
export async function getDoctorAvailability(): Promise<{ slots: Availability[] }> {
        const { userId } = await auth();
        if (!userId) {
                throw new Error("Unauthorized");
        }
        try {
                const doctor: User | null = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                                role: "DOCTOR",
                        },
                });
                if (!doctor) {
                        throw new Error("Doctor not found");
                }
                const availabilitySlots: Availability[] = await db.availability.findMany({
                        where: {
                                doctorId: doctor.id,
                        },
                        orderBy: {
                                startTime: "asc",
                        },
                });
                return { slots: availabilitySlots };
        } catch (error) {
                console.error("Error fetching availability:", error);
                if (error instanceof Error) {
                        throw new Error("Failed to fetch availability slots: " + error.message);
                } else {
                        throw new Error("Failed to fetch availability slots: Unknown error");
                }
        }
}



/**
 * Get doctor's upcoming appointments
 */
export async function getDoctorAppointments() { }

