"use server";

import { db } from "@/lib/prisma";

interface GetDoctorsBySpecialtyResult {
        doctors?: Doctor[];
        error?: string;
}

interface Doctor {
        id: string;
        clerkUserId: string;
        email: string;
        name?: string;
        imageUrl?: string;
        role: "UNASSIGNED" | "PATIENT" | "DOCTOR" | "ADMIN"; // Adjust based on your enum
        createdAt: string;
        updatedAt: string;
        credits: number;
        specialty?: string;
        experience?: number;
        credentialUrl?: string;
        description?: string;
        verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
}

export async function getDoctorsBySpecialty(specialty: string): Promise<GetDoctorsBySpecialtyResult> {
        try {
                const users = await db.user.findMany({
                        where: {
                                role: "DOCTOR",
                                verificationStatus: "VERIFIED",
                                specialty: specialty.split("%20").join(" "),
                        },
                        orderBy: {
                                name: "asc",
                        },
                });

                const doctors: Doctor[] = users.map((user) => ({
                        id: user.id,
                        clerkUserId: user.clerkUserId,
                        email: user.email,
                        name: user.name ?? undefined,
                        imageUrl: user.imageUrl ?? undefined,
                        role: user.role,
                        createdAt: user.createdAt.toISOString(),
                        updatedAt: user.updatedAt.toISOString(),
                        credits: user.credits,
                        specialty: user.specialty ?? undefined,
                        experience: user.experience ?? undefined,
                        credentialUrl: user.credentialUrl ?? undefined,
                        description: user.description ?? undefined,
                        verificationStatus: user.verificationStatus ?? undefined,
                }));

                return { doctors };
        } catch (error) {
                console.error("Failed to fetch doctors by specialty:", error);
                return { error: "Failed to fetch doctors" };
        }
}