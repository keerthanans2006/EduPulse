"use client";

import React from "react";
import DataTable, { Column } from "../components/DataTable";
import { subjects } from "../../lib/mockData";

export default function SubjectsPage() {
	const columns: Column<(typeof subjects)[number]>[] = [
		{ key: "name", header: "Subject" },
		{ key: "createdAt", header: "Created" },
	];
	return (
		<DataTable columns={columns} rows={subjects} searchKeys={["name"]} />
	);
}


