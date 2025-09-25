import "./globals.css";
import React from "react";
import AppFrame from "./components/AppFrame";

export const metadata = {
	title: "EduPulse",
	description: "Student success dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-slate-50">
                <AppFrame>{children}</AppFrame>
            </body>
        </html>
    );
}

