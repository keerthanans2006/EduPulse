"use client";

import React, { useState, useEffect } from "react";
import DataTable, { Column } from "../components/DataTable";
import RiskBadge from "../components/RiskBadge";
import { students as mockStudents, getStudentsWithAIPredictions, getStudentsWithAIPredictionsFrom, StudentRecord } from "../../lib/mockData";

export default function StudentsPage() {
	const [aiStudents, setAiStudents] = useState<StudentRecord[]>(mockStudents);
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState<string | null>(null);

	// Local storage key for teacher-managed students
	const LS_KEY = "teacherStudents";

	// Form state (Teacher only)
	const [name, setName] = useState("");
	const [attendancePercent, setAttendancePercent] = useState<number>(0);
	const [scorePercent, setScorePercent] = useState<number>(0);
	const [feeStatus, setFeeStatus] = useState<"Paid" | "Due">("Paid");

	// Helper to sanitize and clamp percentage inputs to 0-100
	const sanitizePercent = (raw: string) => {
		const onlyDigits = raw.replace(/[^0-9]/g, "");
		const n = Number(onlyDigits);
		if (isNaN(n)) return 0;
		return Math.max(0, Math.min(100, n));
	};

	useEffect(() => {
		const storedRole = typeof window !== 'undefined'
			? (sessionStorage.getItem('authRole') || localStorage.getItem('authRole'))
			: null;
		setRole(storedRole);

		const loadAIPredictions = async () => {
			try {
				if (storedRole === "Teacher" || storedRole === "Admin") {
					// Load teacher-managed students from localStorage
					const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
					const entries: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = raw ? JSON.parse(raw) : [];
					const withAI = await getStudentsWithAIPredictionsFrom(entries);
					setAiStudents(withAI);
				} else {
					// Default: use mock data with predictions
					const studentsWithAI = await getStudentsWithAIPredictions();
					setAiStudents(studentsWithAI);
				}
			} catch (error) {
				console.error('Error loading AI predictions:', error);
				// Keep original students data if AI fails
			} finally {
				setLoading(false);
			}
		};

		loadAIPredictions();
	}, []);

	const persistTeacherEntries = (entries: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[]) => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(LS_KEY, JSON.stringify(entries));
	};

	// Simple credential store for student logins
	const AUTH_KEY = "studentAuth";
	interface StudentAuth { id: string; username: string; password: string }
	const loadStudentAuth = (): StudentAuth[] => {
		if (typeof window === 'undefined') return [];
		try { return JSON.parse(localStorage.getItem(AUTH_KEY) || '[]'); } catch { return []; }
	};
	const persistStudentAuth = (list: StudentAuth[]) => {
		if (typeof window === 'undefined') return;
		localStorage.setItem(AUTH_KEY, JSON.stringify(list));
	};

	const handleAddTeacherStudent = async (e: any) => {
		e.preventDefault();
		if (!name.trim()) return;
		const id = "stu-" + Math.random().toString(36).slice(2, 8);
		const base: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'> = {
			id,
			name: name.trim(),
			className: "-",
			subject: "-",
			teacherId: "t-local",
			attendancePercent: Math.max(0, Math.min(100, Number(attendancePercent) || 0)),
			scorePercent: Math.max(0, Math.min(100, Number(scorePercent) || 0)),
			feeStatus,
		};
		const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
		const current: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = raw ? JSON.parse(raw) : [];
		const next = [...current, base];
		persistTeacherEntries(next);

		// Create student credentials: username = name, password = name
		const authList = loadStudentAuth();
		authList.push({ id, username: name.trim(), password: name.trim() });
		persistStudentAuth(authList);
		// Update AI predictions list
		const withAI = await getStudentsWithAIPredictionsFrom(next);
		setAiStudents(withAI);
		// reset form
		setName("");
		setAttendancePercent(0);
		setScorePercent(0);
		setFeeStatus("Paid");
	};

	const handleDeleteTeacherStudent = async (id: string) => {
		const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
		const current: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = raw ? JSON.parse(raw) : [];
		const next = current.filter(s => s.id !== id);
		persistTeacherEntries(next);
		// Remove auth entry
		const authList = loadStudentAuth().filter(a => a.id !== id);
		persistStudentAuth(authList);
		const withAI = await getStudentsWithAIPredictionsFrom(next);
		setAiStudents(withAI);
	};

	const columns: Column<StudentRecord>[] = [
		{ key: "name", header: "Name" },
		{ key: "attendancePercent", header: "Attendance %" },
		{ key: "scorePercent", header: "Score %" },
		{ key: "feeStatus", header: "Fee Status" },
		{
			key: "riskLevel",
			header: "Risk",
			render: (row) => (
				<div className="flex items-center gap-2">
					<RiskBadge level={row.riskLevel || "Low"} />
				</div>
			)
		},
	];

	const teacherColumns: Column<StudentRecord>[] = [
		...columns,
		{
			key: "actions",
			header: "Actions",
			render: (row) => (
				<button
					onClick={() => handleDeleteTeacherStudent((row as any).id)}
					className="px-2 py-1 rounded-lg text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
				>
					Delete
				</button>
			),
		},
	];

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-2"></div>
					<p className="text-slate-600">Loading AI predictions...</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			{(role === "Teacher" || role === "Admin") && (
				<form onSubmit={handleAddTeacherStudent} className="mb-4 bg-white rounded-2xl border p-4 shadow-sm grid gap-3 md:grid-cols-5">
					<div>
						<label className="block text-sm text-slate-600 mb-1">Student Name</label>
						<input
							value={name}
							onChange={(e) => {
								const v = e.target.value;
								const capped = v.length ? v.charAt(0).toUpperCase() + v.slice(1) : v;
								setName(capped);
							}}
							placeholder="e.g., Riya Verma"
							className="w-full px-3 py-2 rounded-xl border"
						/>
					</div>
					<div>
						<label className="block text-sm text-slate-600 mb-1">Attendance %</label>
						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							value={attendancePercent}
							onChange={(e:any) => setAttendancePercent(sanitizePercent(e.target.value))}
							placeholder="e.g., 85"
							className="w-full px-3 py-2 rounded-xl border"
						/>
					</div>
					<div>
						<label className="block text-sm text-slate-600 mb-1">Total Marks %</label>
						<input
							type="text"
							inputMode="numeric"
							pattern="[0-9]*"
							value={scorePercent}
							onChange={(e:any) => setScorePercent(sanitizePercent(e.target.value))}
							placeholder="e.g., 76"
							className="w-full px-3 py-2 rounded-xl border"
						/>
					</div>
					<div>
						<label className="block text-sm text-slate-600 mb-1">Fee Payment</label>
						<select value={feeStatus} onChange={(e:any) => setFeeStatus(e.target.value)} className="w-full px-3 py-2 rounded-xl border bg-white">
							<option value="Paid">Paid</option>
							<option value="Due">Due</option>
						</select>
					</div>
					<div className="flex items-end">
						<button type="submit" className="w-full px-4 py-2 rounded-xl bg-slate-900 text-white">Add</button>
					</div>
				</form>
			)}
			<DataTable
				columns={(role === "Teacher" || role === "Admin") ? teacherColumns : columns}
				rows={aiStudents}
				searchKeys={["name"]}
			/>
		</div>
	);
}


