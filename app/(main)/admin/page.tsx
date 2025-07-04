import { TabsContent } from "@/components/ui/tabs";
import { PendingDoctors } from "./components/pending-doctor";
import { VerifiedDoctors } from "./components/verified-doctor";
import { PendingPayouts } from "./components/pending-payout";
import {
        getPendingDoctors,
        getVerifiedDoctors,
        getPendingPayouts,
} from "@/actions/admin";

export default async function AdminPage() {
        // Fetch all data in parallel
        const [pendingDoctorsData, verifiedDoctorsData, pendingPayoutsData] =
                await Promise.all([
                        getPendingDoctors(),
                        getVerifiedDoctors(),
                        getPendingPayouts(),
                ]);

        return (
                <>
                        <TabsContent value="pending" className="border-none p-0">
                                <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
                        </TabsContent>

                        <TabsContent value="doctors" className="border-none p-0">
                                <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
                        </TabsContent>

                        <TabsContent value="payouts" className="border-none p-0">
                                <PendingPayouts payouts={pendingPayoutsData.payouts || []} />
                        </TabsContent>
                </>
        );
}