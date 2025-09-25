"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [role, setRole] = useState("Teacher");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	function handleContinue() {
		// Non-teacher roles: keep existing behavior
		localStorage.setItem("authRole", role);
		router.push("/dashboard?role=" + encodeURIComponent(role));
	}

	function handleTeacherLogin(e: any) {
		e.preventDefault();
		setError("");
		try {
			const raw = typeof window !== 'undefined' ? localStorage.getItem('teacherAuth') : null;
			const list: { id: string; username: string; password: string }[] = raw ? JSON.parse(raw) : [];
			const found = list.find(a => a.username === username.trim() && a.password === password);
			if (!found) {
				setError("Incorrect password or username");
				return;
			}
			sessionStorage.setItem("authRole", "Teacher");
			sessionStorage.setItem("authUser", found.username);
			sessionStorage.setItem("authTeacherId", found.id);
			router.push("/dashboard?role=Teacher");
		} catch {
			setError("Login unavailable. Please contact admin.");
		}
	}

	function handleAdminLogin(e: any) {
		e.preventDefault();
		setError("");
		const validUser = username.trim().toLowerCase() === "admin";
		const validPass = password === "admin";
		if (!validUser || !validPass) {
			setError("Incorrect password or username");
			return;
		}
		sessionStorage.setItem("authRole", "Admin");
		sessionStorage.setItem("authUser", "admin");
		router.push("/dashboard?role=Admin");
	}

	function handleStudentLogin(e: any) {
		e.preventDefault();
		setError("");
		try {
			const raw = typeof window !== 'undefined' ? localStorage.getItem('studentAuth') : null;
			const list: { id: string; username: string; password: string }[] = raw ? JSON.parse(raw) : [];
			const found = list.find(a => a.username === username.trim() && a.password === password);
			if (!found) {
				setError("Incorrect password or username");
				return;
			}
			sessionStorage.setItem("authRole", "Student");
			sessionStorage.setItem("authUser", found.username);
			sessionStorage.setItem("authStudentId", found.id);
			router.push("/dashboard?role=Student");
		} catch {
			setError("Login unavailable. Please contact your teacher.");
		}
	}

	return (
		<div className="flex items-center justify-center h-[80vh]">
			<div className="w-full max-w-sm bg-white rounded-2xl border p-6 shadow-sm space-y-4">
				<h1 className="text-xl font-semibold text-center">Sign in</h1>
				<label className="block text-sm text-slate-600">Select Role</label>
				<select value={role} onChange={(e: any) => setRole(e.target.value)} className="w-full px-3 py-2 rounded-xl border bg-white">
					<option>Teacher</option>
					<option>Student</option>
					<option>Admin</option>
				</select>

				{role === "Teacher" ? (
					<form className="space-y-3" onSubmit={handleTeacherLogin}>
						<div>
							<label className="block text-sm text-slate-600 mb-1">Username</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="teacher"
								className="w-full px-3 py-2 rounded-xl border"
							/>
						</div>
						<div>
							<label className="block text-sm text-slate-600 mb-1">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="admin1"
								className="w-full px-3 py-2 rounded-xl border"
							/>
						</div>
						{error && (
							<div className="text-sm text-red-600">{error}</div>
						)}
						<button type="submit" className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white">Login</button>
						<p className="text-xs text-slate-500 text-center">Tip: Your username and password are the exact name the Admin entered</p>
					</form>
				) : role === "Admin" ? (
					<form className="space-y-3" onSubmit={handleAdminLogin}>
						<div>
							<label className="block text-sm text-slate-600 mb-1">Username</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="admin"
								className="w-full px-3 py-2 rounded-xl border"
							/>
						</div>
						<div>
							<label className="block text-sm text-slate-600 mb-1">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="admin"
								className="w-full px-3 py-2 rounded-xl border"
							/>
						</div>
						{error && (
							<div className="text-sm text-red-600">{error}</div>
						)}
						<button type="submit" className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white">Login</button>
						<p className="text-xs text-slate-500 text-center">Sample creds - Username: admin, Password: admin</p>
					</form>
				) : (
					<form className="space-y-3" onSubmit={handleStudentLogin}>
						<div>
							<label className="block text-sm text-slate-600 mb-1">Username</label>
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="student name"
								className="w-full px-3 py-2 rounded-xl border"
							/>
						</div>
						<div>
							<label className="block text-sm text-slate-600 mb-1">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="student name"
								className="w-full px-3 py-2 rounded-xl border"
							/>
						</div>
						{error && (
							<div className="text-sm text-red-600">{error}</div>
						)}
						<button type="submit" className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white">Login</button>
						<p className="text-xs text-slate-500 text-center">Tip: Your username and password are the exact name your teacher entered</p>
					</form>
				)}
			</div>
		</div>
	);
}


