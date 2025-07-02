import { create } from 'zustand';
import type { User } from '@prisma/client';
import { getDoctorsBySpecialty } from '@/actions/doctor-list';
interface DoctorListState {
        loading: boolean;
        error: string | null;
        doctors: User[];
        getDoctorsBySpecialty: (specialty: string) => Promise<void>;
}

export const useDoctorStore = create<DoctorListState>((set) => ({
        doctors: [],
        loading: false,
        error: null,
        getDoctorsBySpecialty: async (specialty: string) => {
                set({ loading: true, error: null });

                try {
                        const res = await getDoctorsBySpecialty(specialty);
                        if (res.error) {
                                set({ error: res.error, loading: false });
                        } else {
                                set({ doctors: res.doctors || [], loading: false });
                        }
                } catch (error) {
                        console.error("Fetch failed:", error);
                        set({ error: "Something went wrong", loading: false });
                }
        },
}));
