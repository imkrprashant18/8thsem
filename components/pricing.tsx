"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { PricingTable } from "@clerk/nextjs";

const Pricing = () => {
        return (
                <Card className="group relative bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border-0 overflow-hidden hover:scale-[1.01] transition-all duration-500 ease-out  mx-auto">
                        {/* Gradient Border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 rounded-lg p-[1px]">
                                <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/70 to-slate-900/90 rounded-lg h-full w-full"></div>
                        </div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Content */}
                        <CardContent className="relative z-10 p-6 md:p-10">
                                <PricingTable
                                        checkoutProps={{
                                                appearance: {
                                                        elements: {
                                                                drawerRoot: {
                                                                        zIndex: 2000,
                                                                },
                                                        },
                                                },
                                        }}
                                />
                        </CardContent>
                </Card>
        );
};

export default Pricing;
