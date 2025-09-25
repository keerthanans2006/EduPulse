"use client";

import React, { useState, useEffect } from "react";
import PredictionCard from "../components/PredictionCard";
import { RiskPie } from "../components/Charts";
import RiskBadge from "../components/RiskBadge";
import { students, getStudentsWithAIPredictions, getRiskDistribution, StudentRecord } from "../../lib/mockData";

export default function PredictionsPage() {
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

	const riskDistribution = getRiskDistribution(aiStudents);

	return (
		<div>
			<div className="mb-4 p-3 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-800">
					🤖 Risk predictions powered by AI based on attendance, scores, and fee status
				</p>
			</div>
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
		</div>
	);
}


