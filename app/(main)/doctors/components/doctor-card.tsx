import { User, Star, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { User as Doctor } from "@prisma/client";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
        return (
                <Card className="border-amber-900/20 hover:border-amber-700/40 transition-all bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600">
                        <CardContent>
                                <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                                                {doctor.imageUrl ? (
                                                        <Image
                                                                height={48}
                                                                width={48}
                                                                src={doctor.imageUrl}
                                                                alt={doctor.name ?? "Doctor profile image"}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                ) : (
                                                        <User className="h-6 w-6 text-amber-400" />
                                                )}
                                        </div>

                                        <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                        <h3 className="font-medium text-white text-lg">{doctor.name}</h3>
                                                        <Badge
                                                                variant="outline"
                                                                className="bg-amber-900/20 border-amber-900/30 text-amber-400 self-start"
                                                        >
                                                                <Star className="h-3 w-3 mr-1" />
                                                                Verified
                                                        </Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-1">
                                                        {doctor.specialty} • {doctor.experience} years experience
                                                </p>

                                                <div className="mt-4 line-clamp-2 text-sm text-muted-foreground mb-4">
                                                        {doctor.description}
                                                </div>

                                                <Button
                                                        asChild
                                                        className="w-full bg-amber-500 hover:bg-amber-600 mt-2"
                                                >
                                                        <Link href={`/doctors/${doctor.specialty}/${doctor.id}`}>
                                                                <Calendar className="h-4 w-4 mr-2" />
                                                                View Profile & Book
                                                        </Link>
                                                </Button>
                                        </div>
                                </div>
                        </CardContent>
                </Card>
        );
}