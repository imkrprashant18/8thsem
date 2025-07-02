// app/api/appointments/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Video, MediaMode } from "@vonage/video"
import { Auth } from "@vonage/auth";
import { deductCreditsForAppointment } from "@/actions/credit";

const credentials = new Auth({
        applicationId: process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID!,
        privateKey: process.env.VONAGE_PRIVATE_KEY!,
});
const options = {};

const video = new Video(credentials, options);

async function createVideoSession(): Promise<string> {
        try {
                const session = await video.createSession({ mediaMode: MediaMode.ROUTED });
                return session.sessionId;
        } catch (error) {
                throw new Error(
                        error instanceof Error ? `Failed to create video session: ${error.message}` : "Failed to create video session"
                );
        }
}

export interface BookAppointmentFormData {
        patientId: string;
        doctorId: string;
        startTime: string | Date;
        endTime: string | Date;
        description?: string;
}

export async function POST(req: NextRequest) {
        try {
                const { userId } = await auth();
                if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

                const formData: BookAppointmentFormData = await req.json();

                // Validate patient
                const patient = await db.user.findUnique({
                        where: { id: formData.patientId, role: "PATIENT" },
                });
                if (!patient) throw new Error("Patient not found");

                // Validate doctor
                const doctor = await db.user.findUnique({
                        where: { id: formData.doctorId, role: "DOCTOR", verificationStatus: "VERIFIED" },
                });
                if (!doctor) throw new Error("Doctor not found or not verified");

                // Validate credits
                if (patient.credits < 2) throw new Error("Insufficient credits to book an appointment");

                const startTime = new Date(formData.startTime);
                const endTime = new Date(formData.endTime);

                // Check overlapping appointments
                const overlapping = await db.appointment.findFirst({
                        where: {
                                doctorId: doctor.id,
                                status: "SCHEDULED",
                                OR: [
                                        { startTime: { lte: startTime }, endTime: { gt: startTime } },
                                        { startTime: { lt: endTime }, endTime: { gte: endTime } },
                                        { startTime: { gte: startTime }, endTime: { lte: endTime } },
                                ],
                        },
                });
                if (overlapping) throw new Error("This time slot is already booked");

                // Create video session
                const sessionId = await createVideoSession();

                // Deduct credits
                const { success, error } = await deductCreditsForAppointment(patient.id, doctor.id);
                if (!success) throw new Error(error || "Failed to deduct credits");

                // Create appointment
                const appointment = await db.appointment.create({
                        data: {
                                patientId: patient.id,
                                doctorId: doctor.id,
                                startTime,
                                endTime,
                                patientDescription: formData.description || "",
                                status: "SCHEDULED",
                                videoSessionId: sessionId,
                        },
                });

                revalidatePath("/appointments");

                return NextResponse.json({ success: true, appointment });
        } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                console.error("Failed to book appointment:", message);
                return NextResponse.json({ error: message }, { status: 400 });
        }
}
