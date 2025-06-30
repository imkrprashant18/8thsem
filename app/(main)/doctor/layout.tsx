import { Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/page-headers";

export const metadata = {
        title: "Doctor Dashboard - Medimandu",
        description: "Manage your appointments and availability",
};

import { ReactNode } from "react";

export default async function DoctorDashboardLayout({ children }: { children: ReactNode }) {
        return (
                <div className="container mx-auto px-4 py-8">
                        <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" />

                        {children}
                </div>
        );
}