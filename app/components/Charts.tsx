"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface PieDataItem { name: string; value: number; color?: string }
interface LineDataItem { date: string; attendance: number }

export function RiskPie({ data }: { data: PieDataItem[] }) {
	return (
		<div className="bg-white rounded-2xl border p-4 shadow-sm">
			<div className="text-sm text-slate-500 mb-3">Risk Distribution</div>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" nameKey="name">
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color || ["#34d399", "#f59e0b", "#ef4444"][index % 3]} />
							))}
						</Pie>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export function AttendanceLine({ data }: { data: LineDataItem[] }) {
	return (
		<div className="bg-white rounded-2xl border p-4 shadow-sm">
			<div className="text-sm text-slate-500 mb-3">Attendance Trend</div>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data} margin={{ left: 8, right: 8, bottom: 8 }}>
						<XAxis dataKey="date" hide />
						<YAxis domain={[0, 100]} tickFormatter={(v: any) => `${v}%`} width={30} />
						<Tooltip formatter={(v: any) => [`${v}%`, "Attendance"]} labelFormatter={() => ""} />
						<Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={2} dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}


