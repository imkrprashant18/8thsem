"use client";
import { redirect, useParams } from "next/navigation";
import { DoctorProfile } from "./_components/doctor-profile";
import { useAuthStore } from "@/store/check-user";
import { useEffect } from "react";
import { useDoctorByIdStore } from "@/store/get-doctor-by-id";
import { useDoctorAvailabilityStore } from "@/store/get-time-slot";
import { PageHeader } from "@/components/page-headers";





export default function DoctorProfilePage() {
        const params = useParams()
        const id = params.id as string;
        const { user, checkUser } = useAuthStore()
        const { doctor, getDoctorById } = useDoctorByIdStore()
        const { availableDays, getAvailableTimeSlots } = useDoctorAvailabilityStore()
        useEffect(() => {
                if (!doctor) {
                        // Fetch doctor data if not already available
                        getDoctorById(id);
                }
        }, [id, doctor, getDoctorById]);
        useEffect(() => {
                if (doctor) {
                        // Fetch available time slots for the doctor
                        getAvailableTimeSlots(doctor.id);
                }
        }, [doctor, getAvailableTimeSlots]);

        useEffect(() => {
                // Check user authentication status on component mount
                checkUser();
        }, [checkUser]);
        try {
                // Fetch doctor data and available slots in parallel


                return (
                        <>
                                <div className="container mx-auto">
                                        <PageHeader
                                                title={doctor?.name ?? ""}
                                                backLink={`/doctors/${doctor?.specialty ?? ""}`}
                                                backLabel="Back to Doctors"

                                        />

                                        {doctor && (
                                                <DoctorProfile
                                                        patientId={user?.id ?? ""}
                                                        doctor={doctor}
                                                        availableDays={availableDays}
                                                />
                                        )}
                                </div>
                        </>
                );
        } catch (error) {
                console.error("Error loading doctor profile:", error);
                redirect("/doctors");
        }
}