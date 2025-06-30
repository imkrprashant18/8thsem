import { getDoctorById, getAvailableTimeSlots } from "@/actions/appointments";

import { redirect } from "next/navigation";
import { DoctorProfile } from "./_components/doctor-profile";
import { checkUser } from "@/lib/checkUser";


interface DoctorProfilePageProps {
        params: { id: string; specialty: string };
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
        const user = await checkUser()
        const { id } = params;


        try {
                // Fetch doctor data and available slots in parallel
                const [doctorData, slotsData] = await Promise.all([
                        getDoctorById(id),
                        getAvailableTimeSlots(id),
                ]);

                return (
                        <DoctorProfile
                                patientId={user?.id ?? ""}
                                doctor={doctorData.doctor}
                                availableDays={slotsData.days || []}
                        />
                );
        } catch (error) {
                console.error("Error loading doctor profile:", error);
                redirect("/doctors");
        }
}