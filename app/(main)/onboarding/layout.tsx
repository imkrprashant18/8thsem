import { getCurrentUser } from "@/actions/onboading";
import { redirect } from "next/navigation";

export const metadata = {
        title: "Onboarding - Medimandu",
        description: "Complete your profile to get started with MediMeet",
};

import { ReactNode } from "react";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
        // Get complete user profile
        const user = await getCurrentUser();
        // Redirect users who have already completed onboarding
        if (user) {
                if (user.role === "PATIENT") {
                        redirect("/doctors");
                } else if (user.role === "DOCTOR") {
                        // Check verification status for doctors
                        if (user.verificationStatus === "VERIFIED") {
                                redirect("/doctor");
                        } else {
                                redirect("/doctor/verification");
                        }
                } else if (user.role === "ADMIN") {
                        redirect("/admin");
                }
        }

        return (
                <div className="container mx-auto px-4 py-12 -mt-4 h-auto">
                        <div className="max-w-3xl mx-auto">
                                <div className="text-center mb-10">
                                        <h1 className="text-3xl font-bold text-white mb-2">
                                                Welcome to MediMandu
                                        </h1>
                                        <p className="text-muted-foreground text-lg">
                                                Tell us how you want to use the platform
                                        </p>
                                </div>

                                {children}
                        </div>
                </div>
        );
}