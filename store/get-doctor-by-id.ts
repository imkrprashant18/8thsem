import { create } from "zustand";
import { User } from "@prisma/client";
import { getDoctorById } from "@/actions/appointments";

interface DoctorStoreState {
        doctor: User | null;
        loading: boolean;
        error: string | null;
        getDoctorById: (doctorId: string) => Promise<void>;
}

export const useDoctorByIdStore = create<DoctorStoreState>((set) => ({
        doctor: null,
        loading: false,
        error: null,
        getDoctorById: async (doctorId: string) => {
                set({ loading: true, error: null });

                try {
                        const res = await getDoctorById(doctorId);
                        if (res) {
                                set({ doctor: res.doctor, loading: false, error: null });
                        } else {
                                set({ doctor: null, loading: false, error: null });
                        }
                } catch (err) {
                        console.error("Error fetching doctor:", err);
                        set({ error: "Something went wrong", loading: false });
                }
        },
}));
