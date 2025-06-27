"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export interface SetUserRoleFormData {
        role: "PATIENT" | "DOCTOR";
        specialty?: string;
        experience?: number;
        credentialUrl?: string;
        description?: string;
}
export interface UserRoleResponse {
        success: boolean;
        redirect: string;
}

interface User {
        id: string;
        clerkUserId: string;
        // Add other user fields if needed
}

export async function setUserRole(formData: SetUserRoleFormData): Promise<UserRoleResponse> {
        const { userId }: { userId: string | null } = await auth();
        if (!userId) {
                throw new Error("unauthorized");
        }

        const user: User | null = await db.user.findUnique({
                where: {
                        clerkUserId: userId
                }
        });
        if (!user) throw new Error("user not found");

        const role: string | undefined = formData.role

        if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
                throw new Error("Invalid role selection");
        }

        try {
                // For patient role - simple update
                if (role === "PATIENT") {
                        await db.user.update({
                                where: {
                                        clerkUserId: userId,
                                },
                                data: {
                                        role: "PATIENT",
                                },
                        });

                        revalidatePath("/");
                        return { success: true, redirect: "/doctors" };
                }

                // For doctor role - need additional information
                if (role === "DOCTOR") {
                        const { specialty, experience, credentialUrl, description } = formData;


                        // Validate inputs
                        if (!specialty || !experience || !credentialUrl || !description) {
                                throw new Error("All fields are required");
                        }

                        await db.user.update({
                                where: {
                                        clerkUserId: userId,
                                },
                                data: {
                                        role: "DOCTOR",
                                        specialty,
                                        experience,
                                        credentialUrl,
                                        description,
                                        verificationStatus: "PENDING",
                                },
                        });

                        revalidatePath("/");
                        return { success: true, redirect: "/doctor/verification" };
                }

                // Fallback in case no role matched (should not happen)
                throw new Error("Invalid role selection");
        } catch (error) {
                console.error("Failed to set user role:", error);
                if (error instanceof Error) {
                        throw new Error(`Failed to update user profile: ${error.message}`);
                } else {
                        throw new Error("Failed to update user profile: Unknown error");
                }
        }
}




/**
 * Gets the current user's complete profile information
 */
export async function getCurrentUser() {
        const { userId } = await auth();

        if (!userId) {
                return null;
        }

        try {
                const user = await db.user.findUnique({
                        where: {
                                clerkUserId: userId,
                        },
                });

                return user;
        } catch (error) {
                console.error("Failed to get user information:", error);
                return null;
        }
}