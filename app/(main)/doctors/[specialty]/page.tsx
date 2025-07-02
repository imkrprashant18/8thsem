
"use client"
import { PageHeader } from '@/components/page-headers'
import React, { useEffect } from 'react'
import { DoctorCard } from '../components/doctor-card'
import { useParams } from 'next/navigation'
import { useDoctorStore } from '@/store/doctor-list'

const Page = () => {
        const params = useParams()
        const specialty = params.specialty as string | undefined
        const { doctors, error, getDoctorsBySpecialty } = useDoctorStore()
        useEffect(() => {
                if (specialty) {
                        getDoctorsBySpecialty(specialty)
                }
        }, [getDoctorsBySpecialty, specialty])
        console.log(doctors, "doctors in specialty page")
        if (!specialty) {
                return (
                        <div className="text-center py-12">
                                <h3 className="text-xl font-medium text-white mb-2">
                                        No specialty selected
                                </h3>
                                <p className="text-muted-foreground">
                                        Please select a specialty to view available doctors.
                                </p>
                        </div>
                );
        }
        if (error) {
                console.error("Error fetching doctors:", error);
        }
        return (
                <>
                        <div className="space-y-5">
                                <PageHeader
                                        title={specialty.split("%20").join(" ")}
                                        backLink="/doctors"
                                        backLabel="All Specialties"
                                />

                                {doctors && doctors.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {doctors.map((doctor) => (
                                                        <DoctorCard key={doctor.id} doctor={doctor} />
                                                ))}
                                        </div>
                                ) : (
                                        <div className="text-center py-12">
                                                <h3 className="text-xl font-medium text-white mb-2">
                                                        No doctors available
                                                </h3>
                                                <p className="text-muted-foreground">
                                                        There are currently no verified doctors in this specialty. Please
                                                        check back later or choose another specialty.
                                                </p>
                                        </div>
                                )}
                        </div>
                </>
        )
}

export default Page
