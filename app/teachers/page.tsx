"use client";

import React from "react";
import DataTable, { Column } from "../components/DataTable";
import { teachers as seedTeachers } from "../../lib/mockData";

type Teacher = (typeof seedTeachers)[number];

export default function TeachersPage() {
	const [rows, setRows] = React.useState<Teacher[]>(seedTeachers);
	const [role, setRole] = React.useState<string | null>(null);

	const [name, setName] = React.useState("");
	const [subject, setSubject] = React.useState("");
	const [email, setEmail] = React.useState("");

	React.useEffect(() => {
		try {
			const r = typeof window !== "undefined" ? localStorage.getItem("authRole") : null;
			setRole(r);
		} catch {
			setRole(null);
		}
	}, []);

	const handleAdd = (e: any) => {
		e.preventDefault();
		if (!name.trim() || !subject.trim() || !email.trim()) return;
		const id = "t" + Math.random().toString(36).slice(2, 8);
		setRows((prev) => [...prev, { id, name: name.trim(), subject: subject.trim(), email: email.trim() } as Teacher]);
		setName("");
		setSubject("");
		setEmail("");
	};

	const handleDelete = (id: string) => {
		setRows((prev) => prev.filter((t) => t.id !== id));
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
						onChange={(e) => setName(e.target.value)}
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


