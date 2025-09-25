import React from "react";

interface CardStatsProps {
	label: string;
	value: string | number;
	subtext?: string;
}

export default function CardStats({ label, value, subtext }: CardStatsProps) {
	return (
		<div className="bg-white rounded-2xl border p-4 lg:p-5 shadow-sm">
			<div className="text-slate-500 text-sm">{label}</div>
			<div className="text-2xl font-semibold mt-1">{value}</div>
			{subtext ? <div className="text-xs text-slate-400 mt-2">{subtext}</div> : null}
		</div>
	);
}


