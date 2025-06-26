import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/prisma"

export const checkUser = async () => {
        const user = await currentUser()
        if (!user) return null
        try {
                const loggedInUser = await db.user.findUnique({
                        where: {
                                clerkUserId: user.id,
                        },
                        include: {
                                transactions: {
                                        where: {
                                                type: "CREDIT_PURCHASE",
                                                // Only get transactions from current month
                                                createdAt: {
                                                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                                },
                                        },
                                        orderBy: {
                                                createdAt: "desc",
                                        },
                                        take: 1,
                                },
                        },
                });

                if (loggedInUser) {
                        return loggedInUser
                }

                const name = `${user.firstName} ${user.lastName}`
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
                return newUser
        } catch (error) {
                if (error instanceof Error) {
                        console.log(error.message);
                } else {
                        console.log(error);
                }
        }
}