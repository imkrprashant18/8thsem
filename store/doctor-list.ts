import { create } from "zustand";
import { getDoctorsBySpecialty } from "@/actions/doctor-list"; // update path as needed

interface Doctor {
        id: string;
        clerkUserId: string;
        email: string;
        name?: string;
        imageUrl?: string;
        role: "UNASSIGNED" | "PATIENT" | "DOCTOR" | "ADMIN";
        createdAt: string;
        updatedAt: string;
        credits: number;
        specialty?: string;
        experience?: number;
        credentialUrl?: string;
        description?: string;
        verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
}

interface AdminStore {
        doctorsBySpecialty: Doctor[] | null;
        loading: boolean;
        error: string | null;
        fetchDoctorsBySpecialty: (specialty: string) => Promise<void>;
}

export const useDoctorStore = create<AdminStore>((set) => ({
        doctorsBySpecialty: null,
        loading: false,
        error: null,
        fetchDoctorsBySpecialty: async (specialty: string) => {
                set({ loading: true, error: null });
                try {
                        const res = await getDoctorsBySpecialty(specialty);
                        if (res.error) {
                                set({ error: res.error, doctorsBySpecialty: null, loading: false });
                        } else {
                                set({ doctorsBySpecialty: res.doctors || [], loading: false });
                        }
                } catch {
                        set({ error: "Something went wrong", loading: false });
                }
        },
}));
