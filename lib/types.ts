export interface Doctor {
        id: string;
        clerkUserId: string;
        email: string;
        name?: string | null;
        imageUrl?: string | null;
        role: "UNASSIGNED" | "PATIENT" | "DOCTOR" | "ADMIN";
        createdAt: string;
        updatedAt: string;
        credits: number;
        specialty?: string | null;
        experience?: number | null;
        credentialUrl?: string | null;
        description?: string | null;
        verificationStatus?: "PENDING" | "VERIFIED" | "REJECTED";
}