import { create } from "zustand";
import type { BookAppointmentFormData, BookAppointmentResult } from "@/actions/appointments";

interface AppointmentState {
        isLoading: boolean;
        error: string | null;
        success: boolean;
        appointment: BookAppointmentResult["appointment"] | null;
        book: (formData: BookAppointmentFormData) => Promise<BookAppointmentResult>;
        reset: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
        isLoading: false,
        error: null,
        success: false,
        appointment: null,

        book: async (formData) => {
                set({ isLoading: true, error: null, success: false, appointment: null });

                try {
                        const response = await fetch("/api/book-appointment", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(formData),
                        });
                        const result = await response.json();
                        if (!result.success) {
                                throw new Error("Booking failed");
                        }
                        set({ appointment: result.appointment, success: true });
                        return result;
                } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : "Booking failed";
                        set({ error: errorMessage });
                        return {
                                success: false,
                                appointment: null,
                                error: errorMessage,
                        } as unknown as BookAppointmentResult;
                } finally {
                        set({ isLoading: false });
                }
        },

        reset: () => set({ isLoading: false, error: null, success: false, appointment: null }),
}));
