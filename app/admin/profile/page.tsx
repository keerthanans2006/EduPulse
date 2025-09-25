"use client";

import React from "react";

export default function AdminProfilePage() {
  const [loaded, setLoaded] = React.useState(false);
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");

  React.useEffect(() => {
    try {
      const authUser = typeof window !== 'undefined' ? (sessionStorage.getItem('authUser') || localStorage.getItem('authUser')) : null;
      // Basic placeholders; you can wire these to Supabase later
      setName((authUser || "Admin User").toString());
      setEmail("");
      setPhone("");
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
        <div className="text-slate-500 text-sm mb-3">Admin Profile</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Name</label>
            <input value={name} readOnly disabled className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-slate-700" placeholder="Admin name" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Email</label>
            <input value={email} readOnly disabled className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-slate-700" placeholder="admin@email.com" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">Phone</label>
            <input value={phone} readOnly disabled className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-slate-700" placeholder="+91 XXXXX XXXXX" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="text-slate-500 text-sm mb-2">Tip</div>
        <p className="text-sm text-slate-700">As Admin, you can add or remove teachers in the Teachers page.</p>
      </div>
    </div>
  );
}
