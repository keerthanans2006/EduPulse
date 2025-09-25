import "./globals.css";
import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export const metadata = {
	title: "EduPulse",
	description: "Student success dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-slate-50">
				<div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr]">
					<Sidebar />
					<div className="flex flex-col min-h-screen">
						<Navbar />
						<main className="p-4 md:p-6 lg:p-8 space-y-6 flex-1">{children}</main>
					</div>
				</div>
			</body>
		</html>
	);
}

