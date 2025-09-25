"use client";

import React, { useState } from "react";
import { students } from "../../lib/mockData";

export default function AlertsPage() {
	const [sending, setSending] = useState(false);
	const [recipient, setRecipient] = useState(students[2]?.name || "");

	function send() {
		setSending(true);
		setTimeout(() => setSending(false), 1000);
	}

	return (
		<div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4">
			<h2 className="text-lg font-semibold">Email Preview</h2>
			<div className="grid gap-3">
				<label className="text-sm text-slate-600">Recipient</label>
				<select className="px-3 py-2 rounded-xl border bg-white w-full max-w-xs" value={recipient} onChange={(e: any) => setRecipient(e.target.value)}>
					{students.map(s => <option key={s.id}>{s.name}</option>)}
				</select>
			</div>
			<div className="rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
				<p>Subject: Performance Alert</p>
				<p className="mt-2">Dear {recipient},</p>
				<p className="mt-1">Our system has detected areas needing attention. Please review your attendance and recent scores and reach out to your teacher for guidance.</p>
				<p className="mt-2">Regards,<br/>EduPulse Team</p>
			</div>
			<button disabled={sending} onClick={send} className="px-4 py-2 rounded-xl bg-slate-900 text-white disabled:opacity-60">
				{sending ? "Sending..." : "Send"}
			</button>
		</div>
	);
}


