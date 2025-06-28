"use client";

import { PageHeader } from "@/components/page-headers";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { DoctorCard } from "../components/doctor-card";
import { useDoctorStore } from "@/store/doctor-list";

const SpecialityPage = () => {
        const params = useParams();
        const specialtyParam = params.specialty ?? "";
        const specialty = Array.isArray(specialtyParam) ? specialtyParam[0] : specialtyParam;

        const {
                doctorsBySpecialty: doctors,
                fetchDoctorsBySpecialty,
                loading,
                error,
        } = useDoctorStore();

        useEffect(() => {
                if (
                        specialty &&
                        specialty !== "undefined" &&
                        (doctors === null || doctors.length === 0)
                ) {
                        fetchDoctorsBySpecialty(specialty);
                }
        }, [specialty, fetchDoctorsBySpecialty, doctors]);

        return (
                <div className="space-y-5">
                        <PageHeader
                                title={decodeURIComponent(specialty)}
                                backLink="/doctors"
                                backLabel="All Specialties"
                        />

                        {loading && <p className="text-muted-foreground text-center">Loading doctors...</p>}
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {!loading && doctors && doctors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {doctors.map((doctor) => (
                                                <DoctorCard key={doctor.id} doctor={doctor} />
                                        ))}
                                </div>
                        ) : !loading && (
                                <div className="text-center py-12">
                                        <h3 className="text-xl font-medium text-white mb-2">No doctors available</h3>
                                        <p className="text-muted-foreground">
                                                There are currently no verified doctors in this specialty. Please check back later or choose another specialty.
                                        </p>
                                </div>
                        )}
                </div>
        );
};

export default SpecialityPage;
