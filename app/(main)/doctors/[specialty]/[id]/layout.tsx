import { getDoctorById } from "@/actions/appointments";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-headers";
import { ReactNode } from "react";

// Define the Params type for clarity

interface DoctorProfileLayoutProps {
        children?: ReactNode;
        params: {
                id: string;
                specialty: string;
        };
}; // Use Promise<Params> to match Next.js expectations

// Generate metadata for the page
export async function generateMetadata({
        params,
}: {
        params: { id: string; specialty: string };
}) {
        const { id } = params;
        const { doctor } = await getDoctorById(id);

        return {
                title: `Dr. ${doctor.name} - Medimandu`,
                description: `Book an appointment with Dr. ${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience.`,
        };
}
// Default layout component
export default async function DoctorProfileLayout({ children, params }: DoctorProfileLayoutProps) {
        const { id } = params; // Await the params Promise
        const { doctor } = await getDoctorById(id);

        if (!doctor) redirect("/doctors");

        return (
                <div className="container mx-auto">
                        <PageHeader
                                // icon={<Stethoscope />} // Uncomment if Stethoscope component is available
                                title={`Dr. ${doctor.name}`}
                                backLink={`/doctors/${doctor.specialty}`}
                                backLabel={`Back to ${doctor.specialty}`}
                        />
                        {children}
                </div>
        );
}