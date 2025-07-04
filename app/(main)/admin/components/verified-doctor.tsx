"use client";

import { useState, useEffect } from "react";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Ban, Loader2, User, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { updateDoctorActiveStatus } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { User as Doctor } from "@prisma/client";
type Action = "SUSPEND" | "REINSTATE";
export function VerifiedDoctors({ doctors }: { doctors: Doctor[] }) {
        const [searchTerm, setSearchTerm] = useState("");
        const [targetDoctor, setTargetDoctor] = useState<Doctor | null>(null);
        const [actionType, setActionType] = useState<"SUSPEND" | "REINSTATE" | null>(null);

        const {
                loading,
                data,
                fn: submitStatusUpdate,
        } = useFetch(updateDoctorActiveStatus);

        const filteredDoctors = doctors.filter((doctor) => {
                const query = searchTerm.toLowerCase();
                return (
                        doctor.name?.toLowerCase().includes(query) ||
                        doctor.email.toLowerCase().includes(query) ||
                        doctor.specialty?.toLowerCase().includes(query) ||
                        doctor.experience?.toString().includes(query)
                );
        });

        const handleStatusChange = async (doctor: Doctor, action: Action) => {
                const confirmed = window.confirm(
                        `Are you sure you want to ${action === "SUSPEND" ? "suspend" : "reinstate"} ${doctor.name || 'this doctor'
                        }?`
                );
                if (!confirmed || loading) return;

                const data = {
                        doctorId: doctor.id,
                        suspend: action === "SUSPEND" ? "true" : "false"
                };
                setTargetDoctor(doctor);
                setActionType(action);
                await submitStatusUpdate(data);
        };

        useEffect(() => {
                if (data?.success && targetDoctor && actionType) {
                        const actionVerb = actionType === "SUSPEND" ? "Suspended" : "Reinstated";
                        toast.success(`${actionVerb} ${targetDoctor.name || 'doctor'} successfully!`);
                        setTargetDoctor(null);
                        setActionType(null);
                }
        }, [data, targetDoctor, actionType]);

        return (
                <div>
                        <Card className="bg-muted/20 border-amber-900/20">
                                <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                        <CardTitle className="text-xl font-bold text-white">
                                                                Manage Doctors
                                                        </CardTitle>
                                                        <CardDescription>
                                                                View and manage all verified doctors
                                                        </CardDescription>
                                                </div>
                                                <div className="relative w-full md:w-64">
                                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                                placeholder="Search doctors..."
                                                                className="pl-8 bg-background border-amber-900/20"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                </div>
                                        </div>
                                </CardHeader>

                                <CardContent>
                                        {filteredDoctors.length === 0 ? (
                                                <div className="text-center py-8 text-muted-foreground">
                                                        {searchTerm
                                                                ? "No doctors match your search criteria."
                                                                : "No verified doctors available."}
                                                </div>
                                        ) : (
                                                <div className="space-y-4">
                                                        {filteredDoctors.map((doctor) => {
                                                                const isSuspended = doctor.verificationStatus === "REJECTED";
                                                                return (
                                                                        <Card
                                                                                key={doctor.id}
                                                                                className="bg-background border-amber-900/20 hover:border-amber-700/30 transition-all"
                                                                        >
                                                                                <CardContent className="p-4">
                                                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                                                                <div className="flex items-center gap-3">
                                                                                                        <div className="bg-muted/20 rounded-full p-2">
                                                                                                                <User className="h-5 w-5 text-amber-400" />
                                                                                                        </div>
                                                                                                        <div>
                                                                                                                <h3 className="font-medium text-white">
                                                                                                                        {doctor.name || 'Unknown Doctor'}
                                                                                                                </h3>
                                                                                                                <p className="text-sm text-muted-foreground">
                                                                                                                        {doctor.specialty || 'No specialty'} • {doctor.experience || 0} years
                                                                                                                        experience
                                                                                                                </p>
                                                                                                                <p className="text-sm text-muted-foreground mt-1">
                                                                                                                        {doctor.email}
                                                                                                                </p>
                                                                                                        </div>
                                                                                                </div>
                                                                                                <div className="flex items-center gap-2 self-end md:self-auto">
                                                                                                        {isSuspended ? (
                                                                                                                <>
                                                                                                                        <Badge
                                                                                                                                variant="outline"
                                                                                                                                className="bg-red-900/20 border-red-900/30 text-red-400"
                                                                                                                        >
                                                                                                                                Suspended
                                                                                                                        </Badge>
                                                                                                                        <Button
                                                                                                                                variant="outline"
                                                                                                                                size="sm"
                                                                                                                                onClick={() =>
                                                                                                                                        handleStatusChange(doctor, "REINSTATE")
                                                                                                                                }
                                                                                                                                disabled={loading}
                                                                                                                                className="border-amber-900/30 hover:bg-muted/80"
                                                                                                                        >
                                                                                                                                {loading && targetDoctor?.id === doctor.id ? (
                                                                                                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                                                                                ) : (
                                                                                                                                        <Check className="h-4 w-4 mr-1" />
                                                                                                                                )}
                                                                                                                                Reinstate
                                                                                                                        </Button>
                                                                                                                </>
                                                                                                        ) : (
                                                                                                                <>
                                                                                                                        <Badge
                                                                                                                                variant="outline"
                                                                                                                                className="bg-amber-900/20 border-amber-900/30 text-amber-400"
                                                                                                                        >
                                                                                                                                Active
                                                                                                                        </Badge>
                                                                                                                        <Button
                                                                                                                                variant="outline"
                                                                                                                                size="sm"
                                                                                                                                onClick={() => handleStatusChange(doctor, "SUSPEND")}
                                                                                                                                disabled={loading}
                                                                                                                                className="border-red-900/30 hover:bg-red-900/10 text-red-400"
                                                                                                                        >
                                                                                                                                {loading && targetDoctor?.id === doctor.id ? (
                                                                                                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                                                                                ) : (
                                                                                                                                        <Ban className="h-4 w-4 mr-1" />
                                                                                                                                )}
                                                                                                                                Suspend
                                                                                                                        </Button>
                                                                                                                </>
                                                                                                        )}
                                                                                                </div>
                                                                                        </div>
                                                                                </CardContent>
                                                                        </Card>
                                                                );
                                                        })}
                                                </div>
                                        )}
                                </CardContent>
                        </Card>
                </div>
        );
}