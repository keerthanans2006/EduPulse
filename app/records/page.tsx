"use client";

import React from "react";
import DataTable, { Column } from "../components/DataTable";
import { students, teachers, getTeacherById } from "../../lib/mockData";

type Row = { student: string; subject: string; className: string; teacher: string };

const rows: Row[] = students.map((s) => ({
	student: s.name,
	subject: s.subject,
	className: s.className,
	teacher: getTeacherById(s.teacherId)?.name || "",
}));

export default function RecordsPage() {
	const columns: Column<Row>[] = [
		{ key: "student", header: "Student" },
		{ key: "className", header: "Class" },
		{ key: "subject", header: "Subject" },
		{ key: "teacher", header: "Teacher" },
	];

	return (
		<DataTable
			columns={columns}
			rows={rows}
			searchKeys={["student", "subject", "teacher", "className"]}
			filters={[
				{ label: "Class", options: Array.from(new Set(rows.map(r => r.className))), accessor: (r) => r.className },
				{ label: "Subject", options: Array.from(new Set(rows.map(r => r.subject))), accessor: (r) => r.subject },
			]}
		/>
	);
}


