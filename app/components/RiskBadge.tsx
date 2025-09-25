import React from "react";
import type { RiskLevel } from "../../lib/mockData";

export default function RiskBadge({ level }: { level: RiskLevel }) {
	const styles: Record<RiskLevel, string> = {
		Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
		Medium: "bg-amber-50 text-amber-700 border-amber-200",
		High: "bg-rose-50 text-rose-700 border-rose-200",
	};
	return (
		<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[level]}`}>{level} Risk</span>
	);
}


