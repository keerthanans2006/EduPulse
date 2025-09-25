"use client";

import React, { useMemo, useState } from "react";

export interface Column<T> {
	key: keyof T | string;
	header: string;
	render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	rows: T[];
	searchKeys?: (keyof T)[];
	filters?: { label: string; options: string[]; accessor: (row: T) => string }[];
}

export default function DataTable<T>({ columns, rows, searchKeys = [], filters = [] }: DataTableProps<T>) {
	const [query, setQuery] = useState("");
	const [filterValues, setFilterValues] = useState<Record<number, string>>({});

	const filtered = useMemo(() => {
		let result = rows;
		if (query.trim().length > 0) {
			const q = query.toLowerCase();
			result = result.filter((row) =>
				searchKeys.some((k) => String((row as any)[k]).toLowerCase().includes(q))
			);
		}
		filters.forEach((f, idx) => {
			const val = filterValues[idx];
			if (val && val !== "All") {
				result = result.filter((row) => f.accessor(row) === val);
			}
		});
		return result;
	}, [rows, query, searchKeys, filters, filterValues]);

	return (
		<div className="bg-white rounded-2xl border p-4 shadow-sm">
			<div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
					<input
					type="text"
					placeholder="Search..."
						value={query}
						onChange={(e: any) => setQuery(e.target.value)}
					className="w-full md:w-64 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-slate-200"
				/>
				<div className="flex flex-wrap gap-2">
					{filters.map((f, idx) => (
						<select
							key={idx}
							value={filterValues[idx] || "All"}
							onChange={(e: any) => setFilterValues((s) => ({ ...s, [idx]: e.target.value }))}
							className="px-3 py-2 rounded-xl border bg-white"
						>
							<option>All</option>
							{f.options.map((o) => (
								<option key={o} value={o}>{o}</option>
							))}
						</select>
					))}
				</div>
			</div>
			<div className="overflow-auto">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="text-left text-slate-500">
							{columns.map((c) => (
								<th key={String(c.key)} className="px-3 py-2 font-medium">{c.header}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{filtered.map((row, idx) => (
							<tr key={idx} className="border-t">
								{columns.map((c) => (
									<td key={String(c.key)} className="px-3 py-2">
										{c.render ? c.render(row) : String((row as any)[c.key])}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}


