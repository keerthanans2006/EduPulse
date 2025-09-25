"use client";

import React from "react";

interface TeacherRec { id: string; name: string; subject: string; email: string }

export default function TeacherProfilePage() {
  const [loaded, setLoaded] = React.useState(false);
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [subject, setSubject] = React.useState<string>("");

  React.useEffect(() => {
    try {
      const authUser = typeof window !== 'undefined' ? (sessionStorage.getItem('authUser') || localStorage.getItem('authUser')) : null;
      const teacherId = typeof window !== 'undefined' ? (sessionStorage.getItem('authTeacherId') || localStorage.getItem('authTeacherId')) : null;

      // Defaults
      let tName = (authUser || "Teacher User").toString();
      let tEmail = "";
      let tSubject = "";

      // Try to hydrate from Admin-managed teachers list
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('adminTeachers') : null;
        const list: TeacherRec[] = raw ? JSON.parse(raw) : [];
        const found = teacherId ? list.find(t => t.id === teacherId) : list.find(t => t.name === tName);
        if (found) {
          tName = found.name || tName;
          tEmail = found.email || tEmail;
          tSubject = found.subject || tSubject;
        }
      } catch {}

      setName(tName);
      setEmail(tEmail);
      setSubject(tSubject);
    } finally {
      setLoaded(true);
    }
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-2"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="text-slate-500 text-sm mb-3">Teacher Profile</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Name</label>
            <input value={name} readOnly disabled className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-slate-700" placeholder="Teacher name" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input value={email} readOnly disabled className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-slate-700" placeholder="teacher@email.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Subject</label>
            <input value={subject} readOnly disabled className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-slate-700" placeholder="Subject" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="text-slate-500 text-sm mb-2">Tip</div>
        <p className="text-sm text-slate-700">Your profile is read-only. Ask Admin to update your details in the Teachers page.</p>
      </div>
    </div>
  );
}
