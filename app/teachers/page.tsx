"use client";

import React from "react";
import DataTable, { Column } from "../components/DataTable";
import { teachers } from "../../lib/mockData";

export default function TeachersPage() {
	const columns: Column<(typeof teachers)[number]>[] = [
		{ key: "name", header: "Teacher" },
		{ key: "subject", header: "Subject" },
		{ key: "email", header: "Email" },
	];
	return (
		<DataTable columns={columns} rows={teachers} searchKeys={["name", "subject", "email"]} />
	);
}


