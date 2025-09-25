"use client";

import React, { useState, useEffect } from "react";
import CardStats from "../components/CardStats";
import RiskBadge from "../components/RiskBadge";
import { AttendanceLine, RiskPie } from "../components/Charts";
import { attendanceTrend, students, getStudentsWithAIPredictions, getRiskDistribution, getTotals, StudentRecord } from "../../lib/mockData";

function getRoleFromSearch(searchParams: { role?: string }) {
	return (searchParams.role as string) || "Admin";
}

export default function DashboardPage({ searchParams }: { searchParams: { role?: string } }) {
	const role = getRoleFromSearch(searchParams);
	const [aiStudents, setAiStudents] = useState<StudentRecord[]>(students);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadAIPredictions = async () => {
			try {
				const studentsWithAI = await getStudentsWithAIPredictions();
				setAiStudents(studentsWithAI);
			} catch (error) {
				console.error('Error loading AI predictions:', error);
				// Keep original students data if AI fails
			} finally {
				setLoading(false);
			}
		};

		loadAIPredictions();
	}, []);

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

	const student = aiStudents[0];
	const riskDistribution = getRiskDistribution(aiStudents);
	const totals = getTotals(aiStudents);

	return (
		<div className="space-y-6">
			<div className="mb-4 p-3 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-800">
					🤖 Dashboard statistics powered by AI risk predictions
				</p>
			</div>
			{role === "Student" ? (
				<div className="grid gap-4 md:grid-cols-2">
					<div className="bg-white rounded-2xl border p-5 shadow-sm">
						<div className="text-slate-500 text-sm">My Summary</div>
						<div className="mt-2 text-lg font-semibold">{student.name}</div>
						<div className="mt-3 grid grid-cols-2 gap-3 text-sm">
							<div>Attendance</div>
							<div className="font-medium">{student.attendancePercent}%</div>
							<div>Last Score</div>
							<div className="font-medium">{student.scorePercent}%</div>
							<div>Fee Status</div>
							<div className="font-medium">{student.feeStatus}</div>
							<div>Risk</div>
							<div><RiskBadge level={student.riskLevel || "Low"} /></div>
						</div>
					</div>
					<AttendanceLine data={attendanceTrend} />
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


