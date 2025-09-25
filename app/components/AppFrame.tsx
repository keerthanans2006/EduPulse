"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppFrame({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login";

    if (isAuthPage) {
        return (
            <main className="p-4 md:p-6 lg:p-8 min-h-screen flex items-center justify-center">
                {children}
            </main>
        );
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr] bg-gradient-to-br from-slate-50 via-blue-50/40 to-white bg-fixed">
            <Sidebar />
            <div className="flex flex-col min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.08),_transparent_60%)]">
                <Navbar />
                <main className="p-4 md:p-6 lg:p-8 space-y-6 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}


