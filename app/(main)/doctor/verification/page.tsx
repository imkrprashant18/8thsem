import { ClipboardCheck, AlertCircle, XCircle } from "lucide-react";
import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/actions/onboading";
import { redirect } from "next/navigation";

export default async function VerificationPage() {
        // Get complete user profile
        const user = await getCurrentUser();

        // If already verified, redirect to dashboard
        if (user?.verificationStatus === "VERIFIED") {
                redirect("/doctor");
        }

        const isRejected = user?.verificationStatus === "REJECTED";

        return (
                <div className="container mx-auto px-4 py-12 -mt-4 ">
                        <div className="max-w-2xl mx-auto">
                                <Card className=" border-amber-200/50 shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-sm">
                                        <CardHeader className="text-center">
                                                <div
                                                        className={`mx-auto p-4 ${isRejected ? "bg-red-900/20" : "bg-amber-900/20"
                                                                } rounded-full mb-4 w-fit`}
                                                >
                                                        {isRejected ? (
                                                                <XCircle className="h-8 w-8 text-red-400" />
                                                        ) : (
                                                                <ClipboardCheck className="h-8 w-8 text-amber-400" />
                                                        )}
                                                </div>
                                                <CardTitle className="text-2xl font-bold text-white">
                                                        {isRejected
                                                                ? "Verification Declined"
                                                                : "Verification in Progress"}
                                                </CardTitle>
                                                <CardDescription className="text-lg">
                                                        {isRejected
                                                                ? "Unfortunately, your application needs revision"
                                                                : "Thank you for submitting your information"}
                                                </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-center">
                                                {isRejected ? (
                                                        <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4 mb-6 flex items-start">
                                                                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                                                                <div className="text-muted-foreground text-left">
                                                                        <p className="mb-2">
                                                                                Our administrative team has reviewed your application and
                                                                                found that it doesn&apos;t meet our current requirements.
                                                                                Common reasons for rejection include:
                                                                        </p>
                                                                        <ul className="list-disc pl-5 space-y-1 mb-3">
                                                                                <li>Insufficient or unclear credential documentation</li>
                                                                                <li>Professional experience requirements not met</li>
                                                                                <li>Incomplete or vague service description</li>
                                                                        </ul>
                                                                        <p>
                                                                                You can update your application with more information and
                                                                                resubmit for review.
                                                                        </p>
                                                                </div>
                                                        </div>
                                                ) : (
                                                        <div className="bg-amber-900/10 border border-amber-900/20 rounded-lg p-4 mb-6 flex items-start">
                                                                <AlertCircle className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                                                                <p className="text-muted-foreground text-left">
                                                                        Your profile is currently under review by our administrative team.
                                                                        The verification process usually takes 1–2 business days.
                                                                        You will receive an email notification as soon as your account has been successfully verified.
                                                                </p>
                                                        </div>
                                                )}

                                                <p className="text-muted-foreground mb-6">
                                                        {isRejected
                                                                ? "Your doctor profile was rejected. Please update the required details and resubmit it for verification."
                                                                : "While your profile is under review, feel free to explore the platform or contact our support team if you have any questions."}

                                                </p>

                                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                        {isRejected ? (
                                                                <>
                                                                        <Button
                                                                                asChild
                                                                                variant="outline"
                                                                                className="border-amber-900/30"
                                                                        >
                                                                                <Link href="/">Return to Home</Link>
                                                                        </Button>
                                                                        <Button
                                                                                asChild
                                                                                className="bg-amber-600 hover:bg-amber-700"
                                                                        >
                                                                                <Link href="/doctor/update-profile">Update Profile</Link>
                                                                        </Button>
                                                                </>
                                                        ) : (
                                                                <>
                                                                        <Button
                                                                                asChild
                                                                                variant="outline"
                                                                                className="border-amber-900/30"
                                                                        >
                                                                                <Link href="/">Return to Home</Link>
                                                                        </Button>
                                                                        <Button
                                                                                asChild
                                                                                className="bg-amber-600 hover:bg-amber-700"
                                                                        >
                                                                                <Link href="/contact-support">Contact Support</Link>
                                                                        </Button>
                                                                </>
                                                        )}
                                                </div>
                                        </CardContent>
                                </Card>
                        </div>
                </div>
        );
}