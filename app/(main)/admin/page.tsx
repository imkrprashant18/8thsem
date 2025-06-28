"use client";

import { TabsContent } from "@/components/ui/tabs";
import { PendingDoctors } from "./components/pending-doctor";
import { VerifiedDoctors } from "./components/verified-doctor";
import { PendingPayouts } from "./components/pending-payout";
import { useAdminStore } from "@/store/admin-store";
import { useEffect } from "react";

export default function AdminPage() {

        const pendingDoctors = useAdminStore((state) => state.pendingDoctors);
        const getPendingDoctors = useAdminStore((state) => state.getPendingDoctors);
        const doctors = useAdminStore((state) => state.doctors);
        const getVerifiedDoctors = useAdminStore((state) => state.getVerifiedDoctors);



        useEffect(() => {
                if (!pendingDoctors || pendingDoctors.length === 0) {
                        getPendingDoctors();
                }
        }, [pendingDoctors, getPendingDoctors]);
        useEffect(() => {
                if (!doctors || doctors.length === 0) {
                        getVerifiedDoctors();
                }
        }, [doctors, getVerifiedDoctors]);



        return (
                <>
                        <TabsContent value="pending" className="border-none p-0">
                                {pendingDoctors && pendingDoctors.length > 0 ? (
                                        <PendingDoctors doctors={pendingDoctors} />
                                ) : (
                                        <p className="text-muted-foreground text-sm">No pending doctors found.</p>
                                )}
                        </TabsContent>

                        <TabsContent value="doctors" className="border-none p-0">
                                <VerifiedDoctors doctors={doctors || []} />
                        </TabsContent>

                        <TabsContent value="payouts" className="border-none p-0">
                                <PendingPayouts payouts={[]} />
                        </TabsContent>
                </>
        );
}