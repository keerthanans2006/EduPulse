import React from "react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex items-center justify-center h-[60vh]">
			<div className="text-center space-y-4">
				<h1 className="text-2xl font-semibold">Welcome to EduPulse</h1>
				<p className="text-slate-600">Go to the dashboard to explore the demo.</p>
				<Link href="/login" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl">Get started</Link>
			</div>
		</div>
	);
}


