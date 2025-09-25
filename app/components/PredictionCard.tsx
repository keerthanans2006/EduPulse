"use client";

import React, { useState } from "react";
import RiskBadge from "./RiskBadge";
import type { RiskLevel } from "../../lib/mockData";

interface PredictionCardProps {
	name: string;
	level: RiskLevel;
	reasons: string[];
}

export default function PredictionCard({ name, level, reasons }: PredictionCardProps) {
	const [open, setOpen] = useState(false);
	return (
		<div className="bg-white rounded-2xl border p-4 shadow-sm">
			<div className="flex items-center justify-between">
				<div className="font-medium">{name}</div>
				<div className="flex items-center gap-2">
					<RiskBadge level={level} />
					<button className="text-slate-600 text-sm underline" onClick={() => setOpen(v => !v)}>{open ? "Hide" : "View"} details</button>
				</div>
			</div>
			{open ? (
				<ul className="mt-3 list-disc list-inside text-sm text-slate-600">
					{reasons.map((r, i) => (
						<li key={i}>{r}</li>
					))}
				</ul>
			) : null}
		</div>
	);
}


