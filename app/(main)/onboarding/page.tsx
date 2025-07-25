"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
        Card,
        CardContent,
        CardDescription,
        CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Stethoscope, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
} from "@/components/ui/select";

import { doctorFormSchema } from "@/lib/schema";
import { SPECIALTIES } from "@/lib/specialities";
import { useEffect } from "react";
import { useUserRoleStore } from "@/store/set-user-role";

// Define the DoctorFormData interface for form typing
interface DoctorFormData {
        specialty: string;
        experience: number;
        credentialUrl: string;
        description: string;
}


export default function OnboardingPage() {
        const { loading, data, setUserRoleAction: submitUserRole } = useUserRoleStore()
        const [step, setStep] = useState<"choose-role" | "doctor-form">("choose-role");
        const router = useRouter();

        // Custom hook for user role server action

        // React Hook Form setup with Zod validation
        const {
                register,
                handleSubmit,
                formState: { errors },
                setValue,
                watch,
        } = useForm<DoctorFormData>({
                resolver: zodResolver(doctorFormSchema),
                defaultValues: {
                        specialty: "",
                        experience: 0,
                        credentialUrl: "",
                        description: "",
                },
        });

        // Watch specialty value for controlled select component
        const specialtyValue = watch("specialty");

        // Handle patient role selection
        const handlePatientSelection = async () => {
                if (loading) return;
                await submitUserRole({ role: "PATIENT" });
        };

        useEffect(() => {
                if (data && data?.success) {
                        router.push(data.redirect);
                        useUserRoleStore.setState({ data: null })
                }
        }, [data, router]);

        // Added missing onDoctorSubmit function
        const onDoctorSubmit = async (data: DoctorFormData) => {
                if (loading) return;
                await submitUserRole({
                        role: "DOCTOR",
                        specialty: data.specialty,
                        experience: data.experience,
                        credentialUrl: data.credentialUrl,
                        description: data.description,
                });
        };
        // Role selection screen
        if (step === "choose-role") {
                return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card
                                        className="border-amber-900/20 hover:border-amber-700/40 border cursor-pointer transition-all bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
                                        onClick={() => !loading && handlePatientSelection()}
                                >
                                        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                                                <div className="p-4 bg-amber-900/20 rounded-full mb-4">
                                                        <User className="h-8 w-8 text-amber-400" />
                                                </div>
                                                <CardTitle className="text-xl font-semibold text-white mb-2">
                                                        Join as a Patient
                                                </CardTitle>
                                                <CardDescription className="mb-4">
                                                        Book appointments, consult with doctors, and manage your
                                                        healthcare journey
                                                </CardDescription>
                                                <Button
                                                        className="w-full mt-2 bg-amber-600 hover:bg-amber-700"
                                                        disabled={!!loading}
                                                >
                                                        {loading ? (
                                                                <>
                                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                        Processing...
                                                                </>
                                                        ) : (
                                                                "Continue as Patient"
                                                        )}
                                                </Button>
                                        </CardContent>
                                </Card>

                                <Card
                                        className="border-amber-900/20 hover:border-amber-700/40 border  cursor-pointer transition-all bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
                                        onClick={() => !loading && setStep("doctor-form")}
                                >
                                        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                                                <div className="p-4 bg-amber-900/20 rounded-full mb-4">
                                                        <Stethoscope className="h-8 w-8 text-amber-400" />
                                                </div>
                                                <CardTitle className="text-xl font-semibold text-white mb-2">
                                                        Join as a Doctor
                                                </CardTitle>
                                                <CardDescription className="mb-4">
                                                        Create your professional profile, set your availability, and
                                                        provide consultations
                                                </CardDescription>
                                                <Button
                                                        className="w-full mt-2 bg-amber-600 hover:bg-amber-700"
                                                        disabled={!!loading}
                                                >
                                                        Continue as Doctor
                                                </Button>
                                        </CardContent>
                                </Card>
                        </div>
                );
        }

        // Doctor registration form
        if (step === "doctor-form") {
                return (
                        <Card className=" bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 border-[1px] border-amber-200" >

                                <CardContent className="pt-6">
                                        <div className="mb-6">
                                                <CardTitle className="text-2xl font-bold text-white mb-2">
                                                        Complete Your Doctor Profile
                                                </CardTitle>
                                                <CardDescription>
                                                        Please provide your professional details for verification
                                                </CardDescription>
                                        </div>

                                        <form onSubmit={handleSubmit(onDoctorSubmit)} className="space-y-6">
                                                <div className="space-y-2 w-full" >
                                                        <Label htmlFor="specialty">Medical Specialty</Label>
                                                        <Select
                                                                value={specialtyValue}
                                                                onValueChange={(value) => setValue("specialty", value)}
                                                        >
                                                                <SelectTrigger id="specialty" className="w-full">
                                                                        <SelectValue placeholder="Select your specialty" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                                                                        {SPECIALTIES.map((spec) => (
                                                                                <SelectItem
                                                                                        key={spec.name}
                                                                                        value={spec.name}
                                                                                        className="flex items-center gap-2 "
                                                                                >
                                                                                        <span className="text-amber-400 hover:bg-amber-400">{spec.icon && <spec.icon />}</span>
                                                                                        {spec.name}
                                                                                </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                        </Select>
                                                        {errors.specialty && (
                                                                <p className="text-sm font-medium text-red-500 mt-1">
                                                                        {errors.specialty.message}
                                                                </p>
                                                        )}
                                                </div>

                                                <div className="space-y-2">
                                                        <Label htmlFor="experience">Years of Experience</Label>
                                                        <Input
                                                                id="experience"
                                                                type="number"
                                                                placeholder="e.g. 5"
                                                                {...register("experience", { valueAsNumber: true })}
                                                        />
                                                        {errors.experience && (
                                                                <p className="text-sm font-medium text-red-500 mt-1">
                                                                        {errors.experience.message}
                                                                </p>
                                                        )}
                                                </div>

                                                <div className="space-y-2">
                                                        <Label htmlFor="credentialUrl">Link to Credential Document</Label>
                                                        <Input
                                                                id="credentialUrl"
                                                                type="url"
                                                                placeholder="https://example.com/my-medical-degree.pdf"
                                                                {...register("credentialUrl")}
                                                        />
                                                        {errors.credentialUrl && (
                                                                <p className="text-sm font-medium text-red-500 mt-1">
                                                                        {errors.credentialUrl.message}
                                                                </p>
                                                        )}
                                                        <p className="text-sm text-muted-foreground">
                                                                Please provide a link to your medical degree or certification
                                                        </p>
                                                </div>

                                                <div className="space-y-2">
                                                        <Label htmlFor="description">Description of Your Services</Label>
                                                        <Textarea
                                                                id="description"
                                                                placeholder="Describe your expertise, services, and approach to patient care..."
                                                                rows={4}
                                                                {...register("description")}
                                                        />
                                                        {errors.description && (
                                                                <p className="text-sm font-medium text-red-500 mt-1">
                                                                        {errors.description.message}
                                                                </p>
                                                        )}
                                                </div>

                                                <div className="pt-2 flex items-center justify-between">
                                                        <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => setStep("choose-role")}
                                                                className="border-amber-900/30"
                                                                disabled={!!loading}
                                                        >
                                                                Back
                                                        </Button>
                                                        <Button
                                                                type="submit"
                                                                className="bg-amber-600 hover:bg-amber-700"
                                                                disabled={!!loading}
                                                        >
                                                                {loading ? (
                                                                        <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Submitting...
                                                                        </>
                                                                ) : (
                                                                        "Submit for Verification"
                                                                )}
                                                        </Button>
                                                </div>
                                        </form>
                                </CardContent>
                        </Card>
                );
        }
}