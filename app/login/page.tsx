"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [role, setRole] = useState("Admin");
	const router = useRouter();

	return (
		<div className="flex items-center justify-center h-[80vh]">
			<div className="w-full max-w-sm bg-white rounded-2xl border p-6 shadow-sm space-y-4">
				<h1 className="text-xl font-semibold text-center">Sign in</h1>
				<label className="block text-sm text-slate-600">Select Role</label>
				<select value={role} onChange={(e: any) => setRole(e.target.value)} className="w-full px-3 py-2 rounded-xl border bg-white">
					<option>Student</option>
					<option>Teacher</option>
					<option>Admin</option>
				</select>
				<button type="button" onClick={() => router.push("/dashboard?role=" + encodeURIComponent(role))} className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white">Continue</button>
			</div>
		</div>
	);
}


