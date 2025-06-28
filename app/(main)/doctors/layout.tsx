export const metadata = {
        title: "Find Doctors - MediMandu",
        description: "Browse and book appointments with top healthcare providers",
};

import { ReactNode } from "react";

interface DoctorsLayoutProps {
        children: ReactNode;
}

export default async function DoctorsLayout({ children }: DoctorsLayoutProps) {
        return (
                <div className="container mx-auto px-4 py-12 -mt-4 ">
                        <div className="max-w-6xl mx-auto">{children}</div>
                </div>
        );
}