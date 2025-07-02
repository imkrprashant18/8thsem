// app/api/check-user/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
        const user = await currentUser();

        if (!user) {
                return NextResponse.json(null, { status: 401 });
        }
        try {
                const loggedInUser = await db.user.findUnique({
                        where: { clerkUserId: user.id },
                        include: {
                                transactions: {
                                        where: {
                                                type: "CREDIT_PURCHASE",
                                                createdAt: {
                                                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                                },
                                        },
                                        orderBy: { createdAt: "desc" },
                                        take: 1,
                                },
                        },
                });

                if (loggedInUser) {
                        return NextResponse.json(loggedInUser);
                }

                const name = `${user.firstName} ${user.lastName}`;
                const newUser = await db.user.create({
                        data: {
                                clerkUserId: user.id,
                                name,
                                imageUrl: user.imageUrl,
                                email: user.emailAddresses[0].emailAddress,
                                transactions: {
                                        create: {
                                                type: "CREDIT_PURCHASE",
                                                packageId: "free_user",
                                                amount: 2,
                                        },
                                },
                        },
                });

                return NextResponse.json(newUser);
        } catch (error) {
                const message =
                        error instanceof Error ? error.message : "Unknown error occurred";
                return NextResponse.json({ error: message }, { status: 500 });
        }
}
