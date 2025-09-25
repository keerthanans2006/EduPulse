"use client";

import React, { useState, useEffect } from "react";
import CardStats from "../components/CardStats";
import RiskBadge from "../components/RiskBadge";
import { AttendanceLine, RiskPie, PerformanceBars } from "../components/Charts";
import { attendanceTrend, students, getStudentsWithAIPredictions, getStudentsWithAIPredictionsFrom, getRiskDistribution, getTotals, StudentRecord } from "../../lib/mockData";
function getRoleFromSearch(searchParams: { role?: string }) {
	return (searchParams.role as string) || "Admin";
}

export default function DashboardPage({ searchParams }: { searchParams: { role?: string } }) {
    const initialRole = typeof window !== 'undefined'
        ? (sessionStorage.getItem('authRole') || localStorage.getItem('authRole')) || getRoleFromSearch(searchParams)
        : getRoleFromSearch(searchParams);
	const [role, setRole] = useState<string>(initialRole);
	const [roleLoaded, setRoleLoaded] = useState<boolean>(false);
	const [aiStudents, setAiStudents] = useState<StudentRecord[]>(students);
	const [loading, setLoading] = useState(true);

	// On mount, prefer role from localStorage so navigation without ?role keeps the correct view
	useEffect(() => {
		try {
			const storedRole = typeof window !== 'undefined' ? sessionStorage.getItem('authRole') || localStorage.getItem('authRole') : null;
			if (storedRole) setRole(storedRole);
		} catch {}
		setRoleLoaded(true);
	}, []);

	useEffect(() => {
		const loadAIPredictions = async () => {
			try {
				// If role is Teacher, use teacher-managed students from localStorage
				if (role === "Teacher") {
					const raw = typeof window !== 'undefined' ? localStorage.getItem('teacherStudents') : null;
					const teacherEntries: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = raw ? JSON.parse(raw) : [];
					const withAI = await getStudentsWithAIPredictionsFrom(teacherEntries);
					setAiStudents(withAI);
				} else if (role === "Student") {
					// Load only the logged-in student's entry
					const raw = typeof window !== 'undefined' ? localStorage.getItem('teacherStudents') : null;
					const entries: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = raw ? JSON.parse(raw) : [];
					const authId = typeof window !== 'undefined'
						? (sessionStorage.getItem('authStudentId') || localStorage.getItem('authStudentId'))
						: null;
					const mine = authId ? entries.filter(e => e.id === authId) : [];
					const withAI = await getStudentsWithAIPredictionsFrom(mine);
					setAiStudents(withAI);
				} else {
					const studentsWithAI = await getStudentsWithAIPredictions();
					setAiStudents(studentsWithAI);
				}
			} catch (error) {
				console.error('Error loading AI predictions:', error);
			} finally {
				setLoading(false);
			}
		};
		loadAIPredictions();
	}, [role]);

	if (!roleLoaded || loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-2"></div>
					<p className="text-slate-600">Loading AI predictions...</p>
				</div>
			</div>
		);
	}

	const student = aiStudents[0];

	// Compute class averages from all teacher-entered entries (for Student view)
	let classAvgAttendance = 0;
	let classAvgMarks = 0;
	if (typeof window !== 'undefined') {
		try {
			const rawAll = localStorage.getItem('teacherStudents');
			const all: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = rawAll ? JSON.parse(rawAll) : [];
			if (all.length > 0) {
				classAvgAttendance = Math.round(all.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / all.length);
				classAvgMarks = Math.round(all.reduce((acc, s) => acc + (s.scorePercent || 0), 0) / all.length);
			}
		} catch {}
	}

	// Weighted performance (marks:attendance = 8:2)
	const yourPerf = student ? Math.round((student.scorePercent * 0.8) + (student.attendancePercent * 0.2)) : 0;
	const classPerf = Math.round((classAvgMarks * 0.8) + (classAvgAttendance * 0.2));
	const riskDistribution = getRiskDistribution(aiStudents);
	const totals = getTotals(aiStudents);

	return (
		<div className="space-y-6">
			{role === "Student" && student && student.attendancePercent < 60 && (
				<div className="mb-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
					Warning: Low attendance
				</div>
			)}
			{role === "Student" ? (
				<div className="space-y-4">
					<div className="bg-white rounded-2xl border p-5 shadow-sm">
						<div className="text-slate-500 text-sm">My Performance</div>
						<div className="mt-2 text-lg font-semibold">{student.name}</div>
						<div className="mt-3 grid grid-cols-2 gap-4 text-sm">
							<div className="p-3 rounded-xl bg-slate-50">
								<div className="text-slate-500">Marks</div>
								<div className="text-xl font-semibold">{student.scorePercent}%</div>
							</div>
							<div className="p-3 rounded-xl bg-slate-50">
								<div className="text-slate-500">Attendance</div>
								<div className="text-xl font-semibold">{student.attendancePercent}%</div>
							</div>
						</div>
						<div className="mt-4 grid gap-4">
							<PerformanceBars
								data={[
									{ metric: 'Marks', you: student.scorePercent, classAvg: classAvgMarks },
									{ metric: 'Attendance', you: student.attendancePercent, classAvg: classAvgAttendance },
								]}
								title="Performance vs Class Average"
							/>
						</div>
					</div>

					<div className="bg-white rounded-2xl border p-5 shadow-sm">
						<div className="text-slate-500 text-sm mb-2">Suggestions</div>
						<ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
							{student.attendancePercent < 75 && (
								<li>Improve attendance: aim for at least 75% to stay on track</li>
							)}
							{student.scorePercent < 60 && (
								<li>Improve academics: focus on core topics to raise overall marks</li>
							)}
							{student.attendancePercent >= 75 && student.scorePercent >= 60 && (
								<li>Great work! Keep maintaining your performance</li>
							)}
						</ul>
					</div>
				</div>
			) : (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<CardStats label="Total Students" value={totals.totalStudents} />
						<CardStats label="At-Risk Students" value={totals.atRiskStudents} />
						<CardStats label="Avg Attendance" value={`${totals.avgAttendance}%`} />
						<CardStats label="Avg Scores" value={`${totals.avgScores}%`} />
					</div>
					<div className="grid gap-4 lg:grid-cols-2">
						<RiskPie data={riskDistribution} />
						<AttendanceLine data={attendanceTrend} />
					</div>
				</>
			)}
		</div>
	);
}


