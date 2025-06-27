// stores/useUserRoleStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { toast } from "sonner";
import { UserRoleResponse, SetUserRoleFormData } from "@/actions/onboading"; // adjust path if needed
import { setUserRole } from "@/actions/onboading";

interface UserRoleState {
        loading: boolean;
        error: string | null;
        data: UserRoleResponse | null;
        setUserRoleAction: (formData: SetUserRoleFormData) => Promise<UserRoleResponse | void>;
        clear: () => void;
}

export const useUserRoleStore = create<UserRoleState>()(
        devtools((set) => ({
                loading: false,
                error: null,
                data: null,

                setUserRoleAction: async (formData: SetUserRoleFormData) => {
                        set({ loading: true, error: null });

                        try {
                                const response = await setUserRole(formData);
                                set({ data: response });
                                toast.success("User role updated successfully!");
                                return response;
                        } catch (err) {
                                const error = err instanceof Error ? err : new Error("Unknown error");
                                set({ error: error.message });
                                toast.error(error.message);
                        } finally {
                                set({ loading: false });
                        }
                },

                clear: () => set({ data: null, error: null, loading: false }),
        }))
);
