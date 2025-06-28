import { create } from "zustand";
import { getPendingDoctors, SetUserRoleFormData } from "@/actions/admin"; // adjust path if needed

type Doctor = {
        id: string;
        name: string;
        email: string;
        specialty: string;
        experience: number;
        credentialUrl: string;
        description: string;
        createdAt: string | Date;
};
export interface User {
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
        verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED"; // Adjust based on your enum
}

export type PayoutStatus = "PROCESSING" | "PROCESSED" | "REJECTED"; // Add other statuses as needed

export interface Payout {
        id: string;
        doctorId: string;
        doctor: User;
        amount: number;
        credits: number;
        platformFee: number;
        netAmount: number;
        paypalEmail: string;
        status: "PROCESSING" | "COMPLETED" | "FAILED"; // Adjust based on your enum
        createdAt: string;
        updatedAt: string;
        processedAt?: string;
        processedBy?: string;
}
interface AdminStoreState {
        loading: boolean;
        error: string | null;
        doctors: Doctor[];
        payouts: Payout[];
        pendingDoctors: Doctor[]; // Optional, if you want to keep track of pending doctors separately

        getPendingDoctors: () => Promise<void>;
        getVerifiedDoctors: () => Promise<void>;
        updateDoctorStatus: (formData: SetUserRoleFormData) => Promise<void>;
        updateDoctorActiveStatus: (formData: SetUserRoleFormData) => Promise<void>;
        approvePayout: (formData: SetUserRoleFormData) => Promise<void>;
}

export const useAdminStore = create<AdminStoreState>((set) => ({
        loading: false,
        error: null,
        doctors: [],
        payouts: [],
        pendingDoctors: [],


        getPendingDoctors: async () => {
                set({ loading: true, error: null });
                try {
                        const res = await import("@/actions/admin").then((m) => m.getPendingDoctors());
                        if (!res || !res.doctors || res.doctors.length === 0) {
                                throw new Error("No pending doctors found");
                        }
                        set({
                                pendingDoctors: (res.doctors ?? []).map((doc) => ({
                                        id: doc.id,
                                        name: doc.name ?? "",
                                        email: doc.email,
                                        specialty: doc.specialty ?? "",
                                        experience: doc.experience ?? 0,
                                        credentialUrl: doc.credentialUrl ?? "",
                                        description: doc.description ?? "",
                                        createdAt: doc.createdAt,
                                }))
                        });
                } catch (error) {
                        console.error("Error approving payout:", error);
                        if (error instanceof Error) {
                                set({ error: error.message || "Failed to approve payout" });
                        } else {
                                set({ error: "Failed to approve payout" });
                        }
                } finally {
                        set({ loading: false });
                }
        },

        getVerifiedDoctors: async () => {
                set({ loading: true, error: null });
                try {
                        const res = await import("@/actions/admin").then((m) => m.getVerifiedDoctors());
                        if (!res || !res.doctors || res.doctors.length === 0) {
                                throw new Error("No pending doctors found");
                        }
                        set({
                                doctors: (res.doctors ?? []).map((doc) => ({
                                        id: doc.id,
                                        name: doc.name ?? "",
                                        email: doc.email,
                                        specialty: doc.specialty ?? "",
                                        experience: doc.experience ?? 0,
                                        credentialUrl: doc.credentialUrl ?? "",
                                        description: doc.description ?? "",
                                        createdAt: doc.createdAt,
                                }))
                        });
                        await getPendingDoctors()
                } catch (error) {
                        console.error("Error approving payout:", error);
                        if (error instanceof Error) {
                                set({ error: error.message || "Failed to approve payout" });
                        } else {
                                set({ error: "Failed to approve payout" });
                        }
                } finally {
                        set({ loading: false });
                }
        },

        updateDoctorStatus: async (formData: SetUserRoleFormData) => {
                set({ loading: true, error: null });
                try {
                        await import("@/actions/admin").then((m) => m.updateDoctorStatus(formData));
                } catch (error) {
                        console.error("Error approving payout:", error);
                        if (error instanceof Error) {
                                set({ error: error.message || "Failed to approve payout" });
                        } else {
                                set({ error: "Failed to approve payout" });
                        }
                } finally {
                        set({ loading: false });
                }
        },

        updateDoctorActiveStatus: async (formData: SetUserRoleFormData) => {
                set({ loading: true, error: null });
                try {
                        await import("@/actions/admin").then((m) => m.updateDoctorActiveStatus(formData));
                } catch (error) {
                        console.error("Error approving payout:", error);
                        if (error instanceof Error) {
                                set({ error: error.message || "Failed to approve payout" });
                        } else {
                                set({ error: "Failed to approve payout" });
                        }
                } finally {
                        set({ loading: false });
                }
        },
        approvePayout: async (formData: SetUserRoleFormData) => {
                set({ loading: true, error: null });
                try {
                        await import("@/actions/admin").then((m) => m.approvePayout(formData));
                } catch (error) {
                        console.error("Error approving payout:", error);
                        if (error instanceof Error) {
                                set({ error: error.message || "Failed to approve payout" });
                        } else {
                                set({ error: "Failed to approve payout" });
                        }
                } finally {
                        set({ loading: false });
                }
        },
}));
