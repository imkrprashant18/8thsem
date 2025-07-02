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
export async function getDoctorAppointments() {
        const { userId } = await auth();

        if (!userId) {
                throw new Error("Unauthorized");
        }

        try {
                const doctor = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                                role: "DOCTOR",
                        },
                });

                if (!doctor) {
                        throw new Error("Doctor not found");
                }

                const appointments = await db.appointment.findMany({
                        where: {
                                doctorId: doctor.id,
                                status: {
                                        in: ["SCHEDULED"],
                                },
                        },
                        include: {
                                patient: true,
                                doctor: true,
                        },
                        orderBy: {
                                startTime: "asc",
                        },
                });

                return { appointments };
        } catch (error) {
                if (error instanceof Error) {
                        throw new Error("Failed to fetch appointments " + error.message);
                } else {
                        throw new Error("Failed to fetch appointments: Unknown error");
                }
        }
}
/**
 * Cancel an appointment (can be done by both doctor and patient)
 */
export async function cancelAppointment(formData: FormData) {
        const { userId } = await auth();

        if (!userId) {
                throw new Error("Unauthorized");
        }

        try {
                const user = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                        },
                });

                if (!user) {
                        throw new Error("User not found");
                }

                const appointmentIdRaw = formData.get("appointmentId");
                const appointmentId = typeof appointmentIdRaw === "string" ? appointmentIdRaw : undefined;

                if (!appointmentId) {
                        throw new Error("Appointment ID is required");
                }

                // Find the appointment with both patient and doctor details
                const appointment = await db.appointment.findUnique({
                        where: {
                                id: appointmentId,
                        },
                        include: {
                                patient: true,
                                doctor: true,
                        },
                });

                if (!appointment) {
                        throw new Error("Appointment not found");
                }

                // Verify the user is either the doctor or the patient for this appointment
                if (appointment.doctorId !== user.id && appointment.patientId !== user.id) {
                        throw new Error("You are not authorized to cancel this appointment");
                }

                // Perform cancellation in a transaction
                await db.$transaction(async (tx) => {
                        // Update the appointment status to CANCELLED
                        await tx.appointment.update({
                                where: {
                                        id: appointmentId,
                                },
                                data: {
                                        status: "CANCELLED",
                                },
                        });

                        // Always refund credits to patient and deduct from doctor
                        // Create credit transaction for patient (refund)
                        await tx.creditTransaction.create({
                                data: {
                                        userId: appointment.patientId,
                                        amount: 2,
                                        type: "APPOINTMENT_DEDUCTION",
                                },
                        });

                        // Create credit transaction for doctor (deduction)
                        await tx.creditTransaction.create({
                                data: {
                                        userId: appointment.doctorId,
                                        amount: -2,
                                        type: "APPOINTMENT_DEDUCTION",
                                },
                        });

                        // Update patient's credit balance (increment)
                        await tx.user.update({
                                where: {
                                        id: appointment.patientId,
                                },
                                data: {
                                        credits: {
                                                increment: 2,
                                        },
                                },
                        });

                        // Update doctor's credit balance (decrement)
                        await tx.user.update({
                                where: {
                                        id: appointment.doctorId,
                                },
                                data: {
                                        credits: {
                                                decrement: 2,
                                        },
                                },
                        });
                });

                // Determine which path to revalidate based on user role
                if (user.role === "DOCTOR") {
                        revalidatePath("/doctor");
                } else if (user.role === "PATIENT") {
                        revalidatePath("/appointments");
                }

                return { success: true };
        } catch (error) {
                console.error("Failed to cancel appointment:", error);
                if (error instanceof Error) {
                        throw new Error("Failed to cancel appointment: " + error.message);
                } else {
                        throw new Error("Failed to cancel appointment: Unknown error");
                }
        }
}

/**
 * Add notes to an appointment
 */
export async function addAppointmentNotes(formData: FormData) {
        const { userId } = await auth();

        if (!userId) {
                throw new Error("Unauthorized");
        }

        try {
                const doctor = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                                role: "DOCTOR",
                        },
                });

                if (!doctor) {
                        throw new Error("Doctor not found");
                }

                const appointmentId = formData.get("appointmentId");
                const notesRaw = formData.get("notes");
                const notes = typeof notesRaw === "string" ? notesRaw : undefined;

                if (!appointmentId || !notes) {
                        throw new Error("Appointment ID and notes are required");
                }

                // Verify the appointment belongs to this doctor
                const appointment = await db.appointment.findUnique({
                        where: {
                                id: appointmentId as string,
                                doctorId: doctor.id,
                        },
                });

                if (!appointment) {
                        throw new Error("Appointment not found");
                }

                // Update the appointment notes
                const updatedAppointment = await db.appointment.update({
                        where: {
                                id: appointmentId as string,
                        },
                        data: {
                                notes,
                        },
                });

                revalidatePath("/doctor");
                return { success: true, appointment: updatedAppointment };
        } catch (error) {
                console.error("Failed to add appointment notes:", error);
                if (error instanceof Error) {
                        throw new Error("Failed to update notes: " + error.message);
                } else {
                        throw new Error("Failed to update notes: Unknown error");
                }
        }
}

/**
 * Mark an appointment as completed (only by doctor after end time)
 */
export async function markAppointmentCompleted(formData: FormData) {
        const { userId } = await auth();

        if (!userId) {
                throw new Error("Unauthorized");
        }

        try {
                const doctor = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                                role: "DOCTOR",
                        },
                });

                if (!doctor) {
                        throw new Error("Doctor not found");
                }

                const appointmentIdRaw = formData.get("appointmentId");
                const appointmentId = typeof appointmentIdRaw === "string" ? appointmentIdRaw : undefined;

                if (!appointmentId) {
                        throw new Error("Appointment ID is required");
                }

                // Find the appointment
                const appointment = await db.appointment.findUnique({
                        where: {
                                id: appointmentId as string,
                                doctorId: doctor.id, // Ensure appointment belongs to this doctor
                        },
                        include: {
                                patient: true,
                        },
                });

                if (!appointment) {
                        throw new Error("Appointment not found or not authorized");
                }

                // Check if appointment is currently scheduled
                if (appointment.status !== "SCHEDULED") {
                        throw new Error("Only scheduled appointments can be marked as completed");
                }

                // Check if current time is after the appointment end time
                const now = new Date();
                const appointmentEndTime = new Date(appointment.endTime);

                if (now < appointmentEndTime) {
                        throw new Error(
                                "Cannot mark appointment as completed before the scheduled end time"
                        );
                }

                // Update the appointment status to COMPLETED
                const updatedAppointment = await db.appointment.update({
                        where: {
                                id: appointmentId,
                        },
                        data: {
                                status: "COMPLETED",
                        },
                });

                revalidatePath("/doctor");
                return { success: true, appointment: updatedAppointment };
        } catch (error) {
                console.error("Failed to mark appointment as completed:", error);
                if (error instanceof Error) {
                        throw new Error(
                                "Failed to mark appointment as completed: " + error.message
                        );
                } else {
                        throw new Error(
                                "Failed to mark appointment as completed: Unknown error"
                        );
                }
        }
}


