"use client";

import React from "react";
import { usePathname } from "next/navigation";

const titleMap: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/students": "Students",
	"/records": "Records",
	"/predictions": "Predictions",
	"/teachers": "Teachers",
	"/subjects": "Subjects",
	"/alerts": "Alerts",
};

export default function Navbar() {
	const pathname = usePathname();
	const title = Object.entries(titleMap).find(([key]) => pathname?.startsWith(key))?.[1] ?? "EduPulse";
	return (
		<header className="h-16 bg-white border-b flex items-center justify-between px-4">
			<h1 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h1>
			{/* Removed profile placeholder */}
			<div />
		</header>
	);
}


