"use client";

import React, { useState, useEffect } from "react";
import DataTable, { Column } from "../components/DataTable";
import RiskBadge from "../components/RiskBadge";
import { students, getStudentsWithAIPredictions, StudentRecord } from "../../lib/mockData";

export default function StudentsPage() {
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

	const columns: Column<StudentRecord>[] = [
		{ key: "name", header: "Name" },
		{ key: "className", header: "Class" },
		{ key: "subject", header: "Subject" },
		{ key: "attendancePercent", header: "Attendance %" },
		{ key: "scorePercent", header: "Score %" },
		{ key: "feeStatus", header: "Fee Status" },
		{ 
			key: "riskLevel", 
			header: "Risk", 
			render: (row) => (
				<div className="flex items-center gap-2">
					<RiskBadge level={row.riskLevel} />
					{row.aiPredicted && (
						<span className="text-xs text-blue-600" title="AI Predicted">🤖</span>
					)}
				</div>
			)
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
			<div className="mb-4 p-3 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-800">
					🤖 Risk levels are now predicted using AI based on attendance, scores, and fee status
				</p>
			</div>
			<DataTable
				columns={columns}
				rows={aiStudents}
				searchKeys={["name", "className", "subject"]}
				filters={[
					{ label: "Class", options: Array.from(new Set(aiStudents.map(s => s.className))), accessor: (r) => r.className },
					{ label: "Subject", options: Array.from(new Set(aiStudents.map(s => s.subject))), accessor: (r) => r.subject },
				]}
			/>
		</div>
	);
}


