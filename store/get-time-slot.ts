
import { getAvailableTimeSlots } from "@/actions/appointments";
import { create } from "zustand";

export interface Slot {
        startTime: string;
        endTime: string;
        formatted: string;
        day: string;
}

export interface DaySlots {
        date: string;
        displayDate: string;
        slots: Slot[];
}

interface DoctorAvailabilityState {
        loading: boolean;
        error: string | null;
        availableDays: DaySlots[];
        getAvailableTimeSlots: (doctorId: string) => Promise<void>;
}

export const useDoctorAvailabilityStore = create<DoctorAvailabilityState>((set) => ({
        loading: false,
        error: null,
        availableDays: [],
        getAvailableTimeSlots: async (doctorId: string) => {
                set({ loading: true, error: null });

                try {
                        const res = await getAvailableTimeSlots(doctorId);
                        if (res) {
                                set({ availableDays: res.days, loading: false, error: null });
                        } else {
                                set({ availableDays: [], loading: false, error: "No slots available" });
                        }
                } catch (err) {
                        console.error("Zustand fetch error:", err);
                        set({ error: "Something went wrong", loading: false });
                }
        },
}));
