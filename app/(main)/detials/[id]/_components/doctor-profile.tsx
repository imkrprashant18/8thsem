"use client";
import React, { useState } from 'react'
import Image from 'next/image';
import type { User as Doctor } from "@prisma/client";
import { useRouter } from 'next/navigation';
import {
        User,
        Calendar,
        Clock,
        Medal,
        FileText,
        ChevronDown,
        ChevronUp,
        AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";


import { Alert, AlertDescription } from "@/components/ui/alert";
import { SlotPicker } from './slot-picker';
import { AppointmentForm } from './appointment-form';



type Slot = {
        startTime: string;
        endTime: string;
        // Add other slot properties if needed
};
interface DayWithSlots {
        date: string;
        slots: Slot[]; // Array of Slot objects
}

interface DoctorProfileProps {
        patientId: string;
        doctor: Doctor;
        availableDays: DayWithSlots[];
}

export function DoctorProfile({ doctor, availableDays, patientId }: DoctorProfileProps) {
        const [showBooking, setShowBooking] = useState(false);
        const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
        const router = useRouter();
        // Calculate total available slots
        const totalSlots = availableDays?.reduce(
                (total, day) => total + day.slots.length,
                0
        );
        const toggleBooking = () => {
                setShowBooking(!showBooking);
                if (!showBooking) {
                        // Scroll to booking section when expanding
                        setTimeout(() => {
                                document.getElementById("booking-section")?.scrollIntoView({
                                        behavior: "smooth",
                                });
                        }, 100);
                }
        };

        const handleSlotSelect = (slot: Slot) => {
                setSelectedSlot(slot);
        };

        const handleBookingComplete = () => {
                router.push("/appointments");
        };
        return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left column - Doctor Photo and Quick Info (fixed on scroll) */}
                        <div className="md:col-span-1">
                                <div className="md:sticky md:top-24">
                                        <Card className="border-amber-900/20 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                                                <CardContent className="pt-6">
                                                        <div className="flex flex-col items-center text-center">
                                                                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 bg-amber-900/20">
                                                                        {doctor.imageUrl ? (
                                                                                <Image
                                                                                        src={doctor.imageUrl}
                                                                                        alt={doctor.name ?? "Doctor profile photo"}
                                                                                        fill
                                                                                        className="object-cover"
                                                                                />
                                                                        ) : (
                                                                                <div className="w-full h-full flex items-center justify-center">
                                                                                        <User className="h-16 w-16 text-amber-400" />
                                                                                </div>
                                                                        )}
                                                                </div>

                                                                <h2 className="text-xl font-bold text-white mb-1">
                                                                        Dr. {doctor.name}
                                                                </h2>

                                                                <Badge
                                                                        variant="outline"
                                                                        className="bg-amber-900/20 border-amber-900/30 text-amber-400 mb-4"
                                                                >
                                                                        {doctor.specialty}
                                                                </Badge>

                                                                <div className="flex items-center justify-center mb-2">
                                                                        <Medal className="h-4 w-4 text-amber-400 mr-2" />
                                                                        <span className="text-muted-foreground">
                                                                                {doctor.experience} years experience
                                                                        </span>
                                                                </div>

                                                                <Button
                                                                        onClick={toggleBooking}
                                                                        className="w-full bg-amber-600 hover:bg-amber-700 mt-4"
                                                                >
                                                                        {showBooking ? (
                                                                                <>
                                                                                        Hide Booking
                                                                                        <ChevronUp className="ml-2 h-4 w-4" />
                                                                                </>
                                                                        ) : (
                                                                                <>
                                                                                        Book Appointment
                                                                                        <ChevronDown className="ml-2 h-4 w-4" />
                                                                                </>
                                                                        )}
                                                                </Button>
                                                        </div>
                                                </CardContent>
                                        </Card>
                                </div>
                        </div>

                        {/* Right column - Doctor Details and Booking Section */}
                        <div className="md:col-span-2 space-y-6">
                                <Card className="border-amber-900/20  bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                                        <CardHeader>
                                                <CardTitle className="text-xl font-bold text-white">
                                                        About Dr. {doctor.name}
                                                </CardTitle>
                                                <CardDescription>
                                                        Professional background and expertise
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                        <div className="flex items-center gap-2">
                                                                <FileText className="h-5 w-5 text-amber-400" />
                                                                <h3 className="text-white font-medium">Description</h3>
                                                        </div>
                                                        <p className="text-muted-foreground whitespace-pre-line">
                                                                {doctor.description}
                                                        </p>
                                                </div>

                                                <Separator className="bg-amber-900/20" />

                                                <div className="space-y-4">
                                                        <div className="flex items-center gap-2">
                                                                <Clock className="h-5 w-5 text-amber-400" />
                                                                <h3 className="text-white font-medium">Availability</h3>
                                                        </div>
                                                        {totalSlots > 0 ? (
                                                                <div className="flex items-center">
                                                                        <Calendar className="h-5 w-5 text-amber-400 mr-2" />
                                                                        <p className="text-muted-foreground">
                                                                                {totalSlots} time slots available for booking over the next
                                                                                4 days
                                                                        </p>
                                                                </div>
                                                        ) : (
                                                                <Alert>
                                                                        <AlertCircle className="h-4 w-4" />
                                                                        <AlertDescription>
                                                                                No available slots for the next 4 days. Please check back
                                                                                later.
                                                                        </AlertDescription>
                                                                </Alert>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>

                                {/* Booking Section - Conditionally rendered */}
                                {showBooking && (
                                        <div id="booking-section">
                                                <Card className="border-amber-900/20  bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                                                        <CardHeader>
                                                                <CardTitle className="text-xl font-bold text-white">
                                                                        Book an Appointment
                                                                </CardTitle>
                                                                <CardDescription>
                                                                        Select a time slot and provide details for your consultation
                                                                </CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="space-y-6  bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                                                                {totalSlots > 0 ? (
                                                                        <>
                                                                                {/* Slot selection step */}
                                                                                {!selectedSlot && (
                                                                                        <SlotPicker
                                                                                                days={availableDays.map(day => ({
                                                                                                        ...day,
                                                                                                        displayDate: new Date(day.date).toLocaleDateString(undefined, {
                                                                                                                weekday: 'long',
                                                                                                                month: 'short',
                                                                                                                day: 'numeric'
                                                                                                        })
                                                                                                }))}
                                                                                                onSelectSlot={handleSlotSelect}
                                                                                        />
                                                                                )}

                                                                                {/* Appointment form step */}
                                                                                {selectedSlot && (
                                                                                        <AppointmentForm
                                                                                                doctorId={doctor.id}
                                                                                                patientId={patientId} // Assuming patientId is the same as doctor.id for demo purposes
                                                                                                slot={{
                                                                                                        ...selectedSlot,
                                                                                                        formatted: `${selectedSlot.startTime} - ${selectedSlot.endTime}`
                                                                                                }}
                                                                                                onBack={() => setSelectedSlot(null)}
                                                                                                onComplete={handleBookingComplete}
                                                                                        />
                                                                                )}
                                                                        </>
                                                                ) : (
                                                                        <div className="text-center py-6   bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
                                                                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                                                                <h3 className="text-xl font-medium text-white mb-2">
                                                                                        No available slots
                                                                                </h3>
                                                                                <p className="text-muted-foreground">
                                                                                        This doctor doesn&apos;t have any available appointment
                                                                                        slots for the next 4 days. Please check back later or try
                                                                                        another doctor.
                                                                                </p>
                                                                        </div>
                                                                )}
                                                        </CardContent>
                                                </Card>
                                        </div>
                                )}
                        </div>
                </div>
        )
}

