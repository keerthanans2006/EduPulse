"use client";

import React from "react";
import DataTable, { Column } from "../components/DataTable";
import { teachers as seedTeachers } from "../../lib/mockData";

type Teacher = (typeof seedTeachers)[number];

export default function TeachersPage() {
	const [rows, setRows] = React.useState<Teacher[]>([]);
	const [role, setRole] = React.useState<string | null>(null);

	const [name, setName] = React.useState("");
	const [subject, setSubject] = React.useState("");
	const [email, setEmail] = React.useState("");

	// Persistence keys
	const LS_TEACHERS = "adminTeachers";
	const AUTH_KEY = "teacherAuth";
	type TeacherAuth = { id: string; username: string; password: string };

	const loadTeacherAuth = (): TeacherAuth[] => {
		if (typeof window === "undefined") return [];
		try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "[]"); } catch { return []; }
	};
	const persistTeacherAuth = (list: TeacherAuth[]) => {
		if (typeof window === "undefined") return;
		localStorage.setItem(AUTH_KEY, JSON.stringify(list));
	};

	const persistTeachers = (list: Teacher[]) => {
		if (typeof window === "undefined") return;
		localStorage.setItem(LS_TEACHERS, JSON.stringify(list));
	};

	React.useEffect(() => {
		try {
			const r = typeof window !== "undefined" ? (sessionStorage.getItem("authRole") || localStorage.getItem("authRole")) : null;
			setRole(r);
			// Load persisted teachers managed by Admin; if none, start empty
			const raw = typeof window !== "undefined" ? localStorage.getItem(LS_TEACHERS) : null;
			const stored: Teacher[] = raw ? JSON.parse(raw) : [];
			setRows(stored);
		} catch {
			setRole(null);
		}
	}, []);

	const handleAdd = (e: any) => {
		e.preventDefault();
		if (!name.trim() || !subject.trim() || !email.trim()) return;
		const id = "t" + Math.random().toString(36).slice(2, 8);
		setRows((prev) => {
			const next = [...prev, { id, name: name.trim(), subject: subject.trim(), email: email.trim() } as Teacher];
			persistTeachers(next);
			// Create teacher credentials: username/password = teacher name
			const auth = loadTeacherAuth();
			auth.push({ id, username: name.trim(), password: name.trim() });
			persistTeacherAuth(auth);
			return next;
		});
		setName("");
		setSubject("");
		setEmail("");
	};

	const handleDelete = (id: string) => {
		setRows((prev) => {
			const next = prev.filter((t) => (t as any).id !== id);
			persistTeachers(next);
			// Remove corresponding auth
			const auth = loadTeacherAuth().filter((a) => a.id !== id);
			persistTeacherAuth(auth);
			return next as Teacher[];
		});
	};

	const baseColumns: Column<Teacher>[] = [
		{ key: "name", header: "Teacher" },
		{ key: "subject", header: "Subject" },
		{ key: "email", header: "Email" },
	];

	const columns: Column<Teacher>[] = role === "Admin"
		? [
			...baseColumns,
			{
				key: "actions",
				header: "Actions",
				render: (row) => (
					<button
						onClick={() => handleDelete((row as any).id)}
						className="px-2 py-1 rounded-lg text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
					>
						Delete
					</button>
				),
			},
		]
		: baseColumns;

	return (
		<div className="space-y-4">
			{role === "Admin" && (
				<form onSubmit={handleAdd} className="bg-white rounded-2xl border p-4 shadow-sm grid gap-3 md:grid-cols-4">
					<input
						value={name}
						onChange={(e) => {
							const v = e.target.value;
							const capped = v.length ? v.charAt(0).toUpperCase() + v.slice(1) : v;
							setName(capped);
						}}
						placeholder="Name"
						className="px-3 py-2 rounded-xl border"
					/>
					<input
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						placeholder="Subject"
						className="px-3 py-2 rounded-xl border"
					/>
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						type="email"
						className="px-3 py-2 rounded-xl border"
					/>
					<button type="submit" className="px-4 py-2 rounded-xl bg-slate-900 text-white">
						Add Teacher
					</button>
				</form>
			)}

			<DataTable columns={columns} rows={rows} searchKeys={["name", "subject", "email"]} />
		</div>
	);
}


