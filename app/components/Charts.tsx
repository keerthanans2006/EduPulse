"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, CartesianGrid } from "recharts";

interface PieDataItem { name: string; value: number; color?: string }

type PerfRow = { metric: string; you: number; classAvg: number };
export function PerformanceBars({ data, title = "Performance" }: { data: PerfRow[]; title?: string }) {
    return (
        <div className="bg-white rounded-2xl border p-4 shadow-sm">
            <div className="text-sm text-slate-500 mb-3">{title}</div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ left: 20, right: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="metric" />
                        <YAxis domain={[0, 100]} ticks={[0,20,40,60,80,100]} allowDecimals={false} tickFormatter={(v: any) => `${v}%`} width={52} />
                        <Tooltip
                            formatter={(v: any, name: any) => [`${v}%`, name]}
                            labelFormatter={(label: any) => label}
                        />
                        <Legend />
                        <Bar dataKey="you" fill="#2563eb" name="You" radius={[4,4,0,0]} />
                        <Bar dataKey="classAvg" fill="#94a3b8" name="Class Avg" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
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
                        <Tooltip
                            formatter={(v: any, _name: any, entry: any) => {
                                const label = entry?.payload?.name ?? entry?.name ?? '';
                                const value = entry?.value ?? v;
                                const text = label ? `${label} : ${value} students` : `${value} students`;
                                return [text, ''];
                            }}
                            labelFormatter={() => ''}
                        />
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
					<LineChart data={data} margin={{ left: 20, right: 8, bottom: 8 }}>
						<XAxis
							dataKey="date"
							interval="preserveStartEnd"
							tick={{ fontSize: 12 }}
							axisLine
							tickLine
							tickFormatter={(v: string) => {
								if (typeof v !== 'string') return v as any;
								const parts = v.split('-');
								return parts.length === 3 ? `${parts[1]}-${parts[2]}` : v;
							}}
							label={{ value: 'Date', position: 'insideBottomRight', offset: -4 }}
						/>
						<YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} allowDecimals={false} tickFormatter={(v: any) => `${v}%`} width={52} />
						<Tooltip formatter={(v: any) => [`${v}%`, "Attendance"]} labelFormatter={() => ""} />
						<Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={2} dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
    );
}
