"use client";

import React, { useState, useEffect } from "react";
import PredictionCard from "../components/PredictionCard";
import { RiskPie } from "../components/Charts";
import RiskBadge from "../components/RiskBadge";
import { getStudentsWithAIPredictionsFrom, getRiskDistribution, StudentRecord } from "../../lib/mockData";

export default function PredictionsPage() {
	const [aiStudents, setAiStudents] = useState<StudentRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [role, setRole] = useState<string | null>(null);

	useEffect(() => {
		const loadAIPredictions = async () => {
			try {
				const storedRole = typeof window !== 'undefined' ? localStorage.getItem('authRole') : null;
				setRole(storedRole);
				const raw = typeof window !== 'undefined' ? localStorage.getItem('teacherStudents') : null;
				const entries: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = raw ? JSON.parse(raw) : [];
				if (entries.length > 0) {
					const withAI = await getStudentsWithAIPredictionsFrom(entries);
					setAiStudents(withAI);
				} else {
					setAiStudents([]);
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

	const riskDistribution = getRiskDistribution(aiStudents);

	return (
		<div>
			{aiStudents.length === 0 ? (
				<div className="bg-white rounded-2xl border p-6 text-center text-slate-600">No teacher-entered students found. Add students in the Students page to see predictions here.</div>
			) : (
				<div className="grid gap-4 lg:grid-cols-2">
					<div className="space-y-3">
						{aiStudents.map((s) => (
							<div key={s.id}>
								<PredictionCard
									name={s.name}
									level={s.riskLevel || "Low"}
									reasons={[
										`${s.attendancePercent}% attendance`,
										`${s.scorePercent}% score`,
										`Fee status: ${s.feeStatus}`,
									]}
								/>
							</div>
						))}
					</div>
					<RiskPie data={riskDistribution} />
				</div>
			)}
		</div>
	);
}


