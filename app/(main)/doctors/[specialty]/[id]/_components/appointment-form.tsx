"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Loader2, Clock, ArrowLeft, Calendar, CreditCard } from "lucide-react";
import { bookAppointment } from "@/actions/appointments";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

type AppointmentFormProps = {
        doctorId: string;
        patientId: string; // Assuming you will pass this from context or props
        slot: {
                startTime: string;
                endTime: string;
                formatted: string;
        };
        onBack: () => void;
        onComplete: () => void;
};

export function AppointmentForm({ doctorId, slot, onBack, onComplete, patientId }: AppointmentFormProps) {
        const [description, setDescription] = useState("");

        // Use the useFetch hook to handle loading, data, and error states
        const { loading, data, fn: submitBooking } = useFetch(bookAppointment);

        // Handle form submission
        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                // TODO: Replace this with the actual patient ID from your auth/user context
                // Create form data as a plain object
                const formData = {
                        patientId,
                        doctorId,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        description,
                };

                // Submit booking using the function from useFetch
                await submitBooking(formData);
        };

        // Handle response after booking attempt
        useEffect(() => {
                if (data) {
                        if (data.success) {
                                toast.success("Appointment booked successfully!");
                                onComplete();
                        }
                }
        }, [data, onComplete]);

        return (
                <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-muted/20 p-4 rounded-lg border border-amber-900/20 space-y-3">
                                <div className="flex items-center">
                                        <Calendar className="h-5 w-5 text-amber-400 mr-2" />
                                        <span className="text-white font-medium">
                                                {format(new Date(slot.startTime), "EEEE, MMMM d, yyyy")}
                                        </span>
                                </div>
                                <div className="flex items-center">
                                        <Clock className="h-5 w-5 text-amber-400 mr-2" />
                                        <span className="text-white">{slot.formatted}</span>
                                </div>
                                <div className="flex items-center">
                                        <CreditCard className="h-5 w-5 text-amber-400 mr-2" />
                                        <span className="text-muted-foreground">
                                                Cost: <span className="text-white font-medium">2 credits</span>
                                        </span>
                                </div>
                        </div>

                        <div className="space-y-2">
                                <Label htmlFor="description">
                                        Describe your medical concern (optional)
                                </Label>
                                <Textarea
                                        id="description"
                                        placeholder="Please provide any details about your medical concern or what you'd like to discuss in the appointment..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-background border-amber-900/20 h-32"
                                />
                                <p className="text-sm text-muted-foreground">
                                        This information will be shared with the doctor before your
                                        appointment.
                                </p>
                        </div>

                        <div className="flex justify-between pt-2">
                                <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onBack}
                                        disabled={loading}
                                        className="border-amber-900/30"
                                >
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Change Time Slot
                                </Button>
                                <Button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-amber-600 hover:bg-amber-700"
                                >
                                        {loading ? (
                                                <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Booking...
                                                </>
                                        ) : (
                                                "Confirm Booking"
                                        )}
                                </Button>
                        </div>
                </form>
        );
}