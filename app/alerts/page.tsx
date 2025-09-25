"use client";

import React, { useEffect, useState } from "react";
import { getStudentsWithAIPredictionsFrom, StudentRecord } from "../../lib/mockData";

export default function AlertsPage() {
    const [role, setRole] = useState<string | null>(null);
    const [rows, setRows] = useState<StudentRecord[]>([]);
    const [messages, setMessages] = useState<Record<string, string>>({});
    const [topEmail, setTopEmail] = useState<string>("");
    const [sendingId, setSendingId] = useState<string | null>(null);
    const [sendingAll, setSendingAll] = useState<boolean>(false);

    useEffect(() => {
        try {
            const r = typeof window !== 'undefined' ? (sessionStorage.getItem('authRole') || localStorage.getItem('authRole')) : null;
            setRole(r);
            const raw = typeof window !== 'undefined' ? localStorage.getItem('teacherStudents') : null;
            const entries: Omit<StudentRecord, 'riskLevel' | 'aiPredicted'>[] = raw ? JSON.parse(raw) : [];
            (async () => {
                const withAI = await getStudentsWithAIPredictionsFrom(entries);
                setRows(withAI);
            })();
        } catch {
            setRows([]);
        }
    }, []);

    // When topEmail changes, mirror it to all row inputs
    useEffect(() => {
        if (!rows || rows.length === 0) return;
        const next: Record<string, string> = {};
        rows.forEach(r => { next[r.id] = topEmail; });
        setMessages(next);
    }, [topEmail, rows]);

    // Initialize row inputs once rows load (use current topEmail)
    useEffect(() => {
        if (!rows || rows.length === 0) return;
        if (topEmail === "" && Object.keys(messages).length) return; // keep existing if user already typed
        const next: Record<string, string> = {};
        rows.forEach(r => { next[r.id] = topEmail; });
        setMessages(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    const sendOne = (id: string) => {
        setSendingId(id);
        setTimeout(() => {
            setSendingId(null);
        }, 800);
    };

    return (
        <div className="bg-white rounded-2xl border p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Alerts</h2>
            {(role === 'Teacher' || role === 'Admin') ? (
                <>
                    <div className="mb-3">
                        <label className="block text-sm text-slate-600 mb-1">Mentor email (applies to all rows)</label>
                        <input
                            type="email"
                            className="w-80 px-3 py-2 rounded-xl border text-sm"
                            placeholder="Enter mentor email..."
                            value={topEmail}
                            onChange={(e) => setTopEmail(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-600">
                                <th className="py-3 pr-6">Student</th>
                                <th className="py-3 pr-6">Risk</th>
                                <th className="py-3 pr-6">Mentor email</th>
                                <th className="py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(s => (
                                <tr key={s.id} className="border-t">
                                    <td className="py-3 pr-6 align-top">{s.name}</td>
                                    <td className="py-3 pr-6 align-top">
                                        <span className={`px-2 py-1 rounded-lg text-xs border ${s.riskLevel === 'High' ? 'bg-red-50 text-red-700 border-red-200' : s.riskLevel === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                            {s.riskLevel}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-6 align-top">
                                        <input
                                            type="email"
                                            className="w-64 px-2 py-1 rounded-lg border text-sm"
                                            placeholder="Enter mentor email..."
                                            value={messages[s.id] || ''}
                                            onChange={(e) => setMessages(prev => ({ ...prev, [s.id]: e.target.value }))}
                                        />
                                    </td>
                                    <td className="py-3 align-top">
                                        <button
                                            disabled={!!sendingId || !(messages[s.id] || topEmail)}
                                            onClick={async () => {
                                                setSendingId(s.id);
                                                const email = messages[s.id] || topEmail;
                                                const payload = [{ studentName: s.name, riskLevel: s.riskLevel, mentorEmail: email }];
                                                try {
                                                    const res = await fetch('https://httpbin.org/post', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(payload),
                                                    });
                                                    const data = await res.json();
                                                    console.log('POSTed payload:', payload);
                                                    console.log('Echo response:', data);
                                                } catch (e) {
                                                    console.error('Failed to POST alerts payload', e);
                                                } finally {
                                                    setTimeout(() => setSendingId(null), 500);
                                                }
                                            }}
                                            className="px-3 py-2 rounded-xl bg-slate-900 text-white disabled:opacity-60"
                                        >
                                            {sendingId === s.id ? 'Sending...' : 'Send'}
                                        </button>
                                    </td>
                                </tr>)
                            )}
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500">No students found. Add students in the Students page.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="pt-3">
                    <button
                        disabled={sendingAll || rows.length === 0 || rows.every(r => !(messages[r.id] || topEmail))}
                        onClick={async () => {
                            setSendingAll(true);
                            const payload = rows
                                .map(s => ({ studentName: s.name, riskLevel: s.riskLevel, mentorEmail: (messages[s.id] || topEmail) }))
                                .filter(item => !!item.mentorEmail);
                            try {
                                const res = await fetch('https://httpbin.org/post', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload),
                                });
                                const data = await res.json();
                                console.log('POSTed payload (all):', payload);
                                console.log('Echo response:', data);
                            } catch (e) {
                                console.error('Failed to POST alerts payload (all)', e);
                            } finally {
                                setSendingAll(false);
                            }
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white disabled:opacity-60"
                    >
                        {sendingAll ? 'Sending All...' : 'Send All'}
                    </button>
                </div>
                </>
            ) : (
                <div className="text-slate-600 text-sm">Alerts are available for Teachers and Admins.</div>
            )}
        </div>
    );
}


