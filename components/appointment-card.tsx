"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
        Calendar,
        Clock,
        User,
        Stethoscope,
        X,
        Edit,
        Loader2,
        CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
} from "@/components/ui/dialog";
import {
        cancelAppointment,
        addAppointmentNotes,
        markAppointmentCompleted,
} from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Appointment } from "@prisma/client"



type AppointmentCardProps = {
        appointment: Appointment
        appointmentId?: string | undefined; // Optional, used for refetching
        userRole: "DOCTOR" | "PATIENT";
        refetchAppointments?: () => void;
};

export function AppointmentCard({
        appointment,
        userRole,
        refetchAppointments,
}: AppointmentCardProps) {
        const [open, setOpen] = useState(false);
        const [action, setAction] = useState<null | "cancel" | "notes" | "video" | "complete">(null); // 'cancel', 'notes', 'video', or 'complete'
        const [notes, setNotes] = useState(appointment.notes || "");
        const router = useRouter();

        // UseFetch hooks for server actions
        const {
                loading: cancelLoading,
                fn: submitCancel,
                data: cancelData,
        } = useFetch(cancelAppointment);
        const {
                loading: notesLoading,
                fn: submitNotes,
                data: notesData,
        } = useFetch(addAppointmentNotes);
        const {
                loading: completeLoading,
                fn: submitMarkCompleted,
                data: completeData,
        } = useFetch(markAppointmentCompleted);

        // Format date and time
        const formatDateTime = (dateInput: string | Date) => {
                try {
                        return format(
                                typeof dateInput === "string" ? new Date(dateInput) : dateInput,
                                "MMMM d, yyyy 'at' h:mm a"
                        );
                } catch {
                        return "Invalid date";
                }
        };

        // Format time only
        const formatTime = (dateInput: string | Date) => {
                try {
                        return format(
                                typeof dateInput === "string" ? new Date(dateInput) : dateInput,
                                "h:mm a"
                        );
                } catch {
                        return "Invalid time";
                }
        };

        // Check if appointment can be marked as completed
        const canMarkCompleted = () => {
                if (userRole !== "DOCTOR" || appointment.status !== "SCHEDULED") {
                        return false;
                }
                const now = new Date();
                const appointmentEndTime = new Date(appointment.endTime);
                return now >= appointmentEndTime;
        };

        // Handle cancel appointment
        const handleCancelAppointment = async () => {
                if (cancelLoading) return;

                if (
                        window.confirm(
                                "Are you sure you want to cancel this appointment? This action cannot be undone."
                        )
                ) {
                        const formData = new FormData();
                        formData.append("appointmentId", appointment.id);
                        await submitCancel(formData);
                }
        };

        // Handle mark as completed
        const handleMarkCompleted = async () => {
                if (completeLoading) return;

                // Check if appointment end time has passed
                const now = new Date();
                const appointmentEndTime = new Date(appointment.endTime);

                if (now < appointmentEndTime) {
                        alert(
                                "Cannot mark appointment as completed before the scheduled end time."
                        );
                        return;
                }

                if (
                        window.confirm(
                                "Are you sure you want to mark this appointment as completed? This action cannot be undone."
                        )
                ) {
                        const formData = new FormData();
                        formData.append("appointmentId", appointment.id);
                        await submitMarkCompleted(formData);
                }
        };

        // Handle save notes (doctor only)
        const handleSaveNotes = async () => {
                if (notesLoading || userRole !== "DOCTOR") return;

                const formData = new FormData();
                formData.append("appointmentId", appointment.id);
                formData.append("notes", notes);
                await submitNotes(formData);
        };


        // Handle successful operations
        useEffect(() => {
                if (cancelData?.success) {
                        toast.success("Appointment cancelled successfully");
                        setOpen(false);
                        if (refetchAppointments) {
                                refetchAppointments();
                        } else {
                                router.refresh();
                        }
                }
        }, [cancelData, refetchAppointments, router]);

        useEffect(() => {
                if (completeData?.success) {
                        toast.success("Appointment marked as completed");
                        setOpen(false);
                        if (refetchAppointments) {
                                refetchAppointments();
                        } else {
                                router.refresh();
                        }
                }
        }, [completeData, refetchAppointments, router]);

        useEffect(() => {
                if (notesData?.success) {
                        toast.success("Notes saved successfully");
                        setAction(null);
                        if (refetchAppointments) {
                                refetchAppointments();
                        } else {
                                router.refresh();
                        }
                }
        }, [notesData, refetchAppointments, router]);




        // Define types for possible patient/doctor objects
        type PatientInfo = { name: string; email?: string };
        type DoctorInfo = { name: string; specialty?: string };

        // Determine other party information based on user role
        // Fallback to IDs if full user objects are not present
        const otherParty: PatientInfo | DoctorInfo =
                userRole === "DOCTOR"
                        ? (appointment as { patient?: PatientInfo; patientId: string }).patient || { name: appointment.patientId }
                        : (appointment as { doctor?: DoctorInfo; doctorId: string }).doctor || { name: appointment.doctorId };

        const otherPartyLabel = userRole === "DOCTOR" ? "Patient" : "Doctor";
        const otherPartyIcon = userRole === "DOCTOR" ? <User /> : <Stethoscope />;

        return (
                <>
                        <Card className="border-amber-900/20 hover:border-amber-700/30 transition-all bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                                <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                        <div className="bg-muted/20 rounded-full p-2 mt-1">
                                                                {otherPartyIcon}
                                                        </div>
                                                        <div>
                                                                <h3 className="font-medium text-white">
                                                                        {userRole === "DOCTOR"
                                                                                ? otherParty.name
                                                                                : `Dr. ${otherParty.name}`}
                                                                </h3>
                                                                {userRole === "DOCTOR" && (
                                                                        <p className="text-sm text-muted-foreground">
                                                                                {"email" in otherParty ? otherParty.email : ""}
                                                                        </p>
                                                                )}
                                                                {userRole === "PATIENT" && (
                                                                        <p className="text-sm text-muted-foreground">
                                                                                {"specialty" in otherParty ? otherParty.specialty : ""}
                                                                        </p>
                                                                )}
                                                                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                                                        <Calendar className="h-4 w-4 mr-1" />
                                                                        <span>{formatDateTime(appointment.startTime)}</span>
                                                                </div>
                                                                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                                                        <Clock className="h-4 w-4 mr-1" />
                                                                        <span>
                                                                                {formatTime(appointment.startTime)} -{" "}
                                                                                {formatTime(appointment.endTime)}
                                                                        </span>
                                                                </div>
                                                        </div>
                                                </div>
                                                <div className="flex flex-col gap-2 self-end md:self-start">
                                                        <Badge
                                                                variant="outline"
                                                                className={
                                                                        appointment.status === "COMPLETED"
                                                                                ? "bg-amber-900/20 border-amber-900/30 text-amber-400"
                                                                                : appointment.status === "CANCELLED"
                                                                                        ? "bg-red-900/20 border-red-900/30 text-red-400"
                                                                                        : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                                                                }
                                                        >
                                                                {appointment.status}
                                                        </Badge>
                                                        <div className="flex gap-2 mt-2 flex-wrap">
                                                                {canMarkCompleted() && (
                                                                        <Button
                                                                                size="sm"
                                                                                onClick={handleMarkCompleted}
                                                                                disabled={completeLoading}
                                                                                className="bg-amber-600 hover:bg-amber-700"
                                                                        >
                                                                                {completeLoading ? (
                                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                                ) : (
                                                                                        <>
                                                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                                                Complete
                                                                                        </>
                                                                                )}
                                                                        </Button>
                                                                )}
                                                                <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="border-amber-900/30"
                                                                        onClick={() => setOpen(true)}
                                                                >
                                                                        View Details
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>
                                </CardContent>
                        </Card>

                        {/* Appointment Details Dialog */}
                        <Dialog open={open} onOpenChange={setOpen}>
                                <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                                <DialogTitle className="text-xl font-bold text-white">
                                                        Appointment Details
                                                </DialogTitle>
                                                <DialogDescription>
                                                        {appointment.status === "SCHEDULED"
                                                                ? "Manage your upcoming appointment"
                                                                : "View appointment information"}
                                                </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4 py-4">
                                                {/* Other Party Information */}
                                                <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">
                                                                {otherPartyLabel}
                                                        </h4>
                                                        <div className="flex items-center">
                                                                <div className="h-5 w-5 text-amber-400 mr-2">
                                                                        {otherPartyIcon}
                                                                </div>
                                                                <div>
                                                                        <p className="text-white font-medium">
                                                                                {userRole === "DOCTOR"
                                                                                        ? otherParty.name
                                                                                        : `Dr. ${otherParty.name}`}
                                                                        </p>
                                                                        {userRole === "DOCTOR" && "email" in otherParty && (
                                                                                <p className="text-muted-foreground text-sm">
                                                                                        {otherParty.email}
                                                                                </p>
                                                                        )}
                                                                        {userRole === "PATIENT" && "specialty" in otherParty && (
                                                                                <p className="text-muted-foreground text-sm">
                                                                                        {otherParty.specialty}
                                                                                </p>
                                                                        )}
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Appointment Time */}
                                                <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">
                                                                Scheduled Time
                                                        </h4>
                                                        <div className="flex flex-col gap-1">
                                                                <div className="flex items-center">
                                                                        <Calendar className="h-5 w-5 text-amber-400 mr-2" />
                                                                        <p className="text-white">
                                                                                {formatDateTime(appointment.startTime)}
                                                                        </p>
                                                                </div>
                                                                <div className="flex items-center">
                                                                        <Clock className="h-5 w-5 text-amber-400 mr-2" />
                                                                        <p className="text-white">
                                                                                {formatTime(appointment.startTime)} -{" "}
                                                                                {formatTime(appointment.endTime)}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                </div>

                                                {/* Status */}
                                                <div className="space-y-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">
                                                                Status
                                                        </h4>
                                                        <Badge
                                                                variant="outline"
                                                                className={
                                                                        appointment.status === "COMPLETED"
                                                                                ? "bg-amber-900/20 border-amber-900/30 text-amber-400"
                                                                                : appointment.status === "CANCELLED"
                                                                                        ? "bg-red-900/20 border-red-900/30 text-red-400"
                                                                                        : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                                                                }
                                                        >
                                                                {appointment.status}
                                                        </Badge>
                                                </div>

                                                {/* Patient Description */}
                                                {appointment.patientDescription && (
                                                        <div className="space-y-2">
                                                                <h4 className="text-sm font-medium text-muted-foreground">
                                                                        {userRole === "DOCTOR"
                                                                                ? "Patient Description"
                                                                                : "Your Description"}
                                                                </h4>
                                                                <div className="p-3 rounded-md bg-muted/20 border border-amber-900/20">
                                                                        <p className="text-white whitespace-pre-line">
                                                                                {appointment.patientDescription}
                                                                        </p>
                                                                </div>
                                                        </div>
                                                )}



                                                {/* Doctor Notes (Doctor can view/edit, Patient can only view) */}
                                                <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                                <h4 className="text-sm font-medium text-muted-foreground">
                                                                        Doctor Notes
                                                                </h4>
                                                                {userRole === "DOCTOR" &&
                                                                        action !== "notes" &&
                                                                        appointment.status !== "CANCELLED" && (
                                                                                <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => setAction("notes")}
                                                                                        className="h-7 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
                                                                                >
                                                                                        <Edit className="h-3.5 w-3.5 mr-1" />
                                                                                        {appointment.notes ? "Edit" : "Add"}
                                                                                </Button>
                                                                        )}
                                                        </div>

                                                        {userRole === "DOCTOR" && action === "notes" ? (
                                                                <div className="space-y-3">
                                                                        <Textarea
                                                                                value={notes}
                                                                                onChange={(e) => setNotes(e.target.value)}
                                                                                placeholder="Enter your clinical notes here..."
                                                                                className="bg-background border-amber-900/20 min-h-[100px]"
                                                                        />
                                                                        <div className="flex justify-end space-x-2">
                                                                                <Button
                                                                                        type="button"
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        onClick={() => {
                                                                                                setAction(null);
                                                                                                setNotes(appointment.notes || "");
                                                                                        }}
                                                                                        disabled={notesLoading}
                                                                                        className="border-amber-900/30"
                                                                                >
                                                                                        Cancel
                                                                                </Button>
                                                                                <Button
                                                                                        size="sm"
                                                                                        onClick={handleSaveNotes}
                                                                                        disabled={notesLoading}
                                                                                        className="bg-amber-600 hover:bg-amber-700"
                                                                                >
                                                                                        {notesLoading ? (
                                                                                                <>
                                                                                                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                                                                                                        Saving...
                                                                                                </>
                                                                                        ) : (
                                                                                                "Save Notes"
                                                                                        )}
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        ) : (
                                                                <div className="p-3 rounded-md bg-muted/20 border border-amber-900/20 min-h-[80px]">
                                                                        {appointment.notes ? (
                                                                                <p className="text-white whitespace-pre-line">
                                                                                        {appointment.notes}
                                                                                </p>
                                                                        ) : (
                                                                                <p className="text-muted-foreground italic">
                                                                                        No notes added yet
                                                                                </p>
                                                                        )}
                                                                </div>
                                                        )}
                                                </div>
                                        </div>

                                        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                                                <div className="flex gap-2">
                                                        {/* Mark as Complete Button - Only for doctors */}
                                                        {canMarkCompleted() && (
                                                                <Button
                                                                        onClick={handleMarkCompleted}
                                                                        disabled={completeLoading}
                                                                        className="bg-amber-600 hover:bg-amber-700"
                                                                >
                                                                        {completeLoading ? (
                                                                                <>
                                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                        Completing...
                                                                                </>
                                                                        ) : (
                                                                                <>
                                                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                                                        Mark Complete
                                                                                </>
                                                                        )}
                                                                </Button>
                                                        )}

                                                        {/* Cancel Button - For scheduled appointments */}
                                                        {appointment.status === "SCHEDULED" && (
                                                                <Button
                                                                        variant="outline"
                                                                        onClick={handleCancelAppointment}
                                                                        disabled={cancelLoading}
                                                                        className="border-red-900/30 text-red-400 hover:bg-red-900/10 mt-3 sm:mt-0"
                                                                >
                                                                        {cancelLoading ? (
                                                                                <>
                                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                        Cancelling...
                                                                                </>
                                                                        ) : (
                                                                                <>
                                                                                        <X className="h-4 w-4 mr-1" />
                                                                                        Cancel Appointment
                                                                                </>
                                                                        )}
                                                                </Button>
                                                        )}
                                                </div>

                                                <Button
                                                        onClick={() => setOpen(false)}
                                                        className="bg-amber-600 hover:bg-amber-700"
                                                >
                                                        Close
                                                </Button>
                                        </DialogFooter>
                                </DialogContent>
                        </Dialog>
                </>
        );
}