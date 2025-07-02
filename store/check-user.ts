// stores/useAuthStore.ts
import { create } from "zustand";
import { User } from "@prisma/client";


interface AuthStore {
        user: User | null;
        loading: boolean;
        error: string | null;
        checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
        user: null,
        loading: false,
        error: null,
        checkUser: async () => {
                set({ loading: true, error: null });
                try {
                        const res = await fetch("/api/check-user");
                        if (res.ok) {
                                const user = await res.json();
                                set({ user, loading: false });
                        } else {
                                set({ user: null, loading: false });
                        }
                } catch (err) {
                        console.error("Check user error:", err);
                        set({ error: "Something went wrong", loading: false });
                }
        },
}));
