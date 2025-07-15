import { getPatientAppointments } from "@/actions/patient";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/onboading";
import { PageHeader } from "@/components/page-headers";
import { AppointmentCard } from "@/components/appointment-card";

export default async function PatientAppointmentsPage() {
        const user = await getCurrentUser();
        if (!user || user.role !== "PATIENT") {
                redirect("/onboarding");
        }
        const { appointments = [], error } = await getPatientAppointments();
        return (
                <div className="container mx-auto px-4 py-8 ">
                        <PageHeader
                                icon={<Calendar />}
                                title="My Appointments"
                                backLink="/doctors"
                                backLabel="Find Doctors"
                        />

                        <Card className="border-amber-900/20  bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 ">
                                <CardHeader>
                                        <CardTitle className="text-xl font-bold text-white flex items-center">
                                                <Calendar className="h-5 w-5 mr-2 text-amber-400" />
                                                Your Scheduled Appointments
                                        </CardTitle>
                                </CardHeader>
                                <CardContent className="">
                                        {error ? (
                                                <div className="text-center py-8">
                                                        <p className="text-red-400">Error: {error}</p>
                                                </div>
                                        ) : appointments.length > 0 ? (
                                                <div className="space-y-4">
                                                        {appointments.map((appointment) => (
                                                                <AppointmentCard
                                                                        key={appointment.id}
                                                                        appointmentId={appointment.id}
                                                                        appointment={appointment}
                                                                        userRole="PATIENT"
                                                                />
                                                        ))}
                                                </div>
                                        ) : (
                                                <div className="text-center py-8">
                                                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                                        <h3 className="text-xl font-medium text-white mb-2">
                                                                No appointments scheduled
                                                        </h3>
                                                        <p className="text-muted-foreground">
                                                                You don&apos;t have any appointments scheduled yet. Browse our
                                                                doctors and book your first consultation.
                                                        </p>
                                                </div>
                                        )}
                                </CardContent>
                        </Card>
                </div>
        );
}