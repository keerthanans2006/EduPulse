"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, LineChart, GraduationCap, BookOpen, Bell } from "lucide-react";

const navItems = [
	{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/profile", label: "Profile", icon: Users },
	{ href: "/admin/profile", label: "Profile", icon: Users },
	{ href: "/students", label: "Students", icon: Users },
	{ href: "/records", label: "Records", icon: FileText },
	{ href: "/predictions", label: "Predictions", icon: LineChart },
	{ href: "/teachers", label: "Teachers", icon: GraduationCap },
	{ href: "/subjects", label: "Subjects", icon: BookOpen },
	{ href: "/alerts", label: "Alerts", icon: Bell },
];

export default function Sidebar() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [role, setRole] = useState<string | null>(null);

	React.useEffect(() => {
		try {
			let storedRole: string | null = null;
			if (typeof window !== 'undefined') {
				storedRole = sessionStorage.getItem('authRole') || localStorage.getItem('authRole');
			}
			setRole(storedRole);
		} catch {
			setRole(null);
		}
	}, []);

	const filteredNavItems = navItems.filter(item => {
		if (role === "Student") {
			return item.href === "/dashboard" || item.href === "/profile";
		}
		// Hide student-only Profile for non-student roles
		if (item.href === "/profile") {
			return role === "Student";
		}
		// Show Admin-only profile path
		if (item.href === "/admin/profile") {
			return role === "Admin";
		}
		// Hide specific items for Teacher role
		if (role === "Teacher") {
			if (item.href === "/records") return false; // remove Records for Teacher
			if (item.href === "/subjects") return false; // remove Subjects for Teacher
			if (item.href === "/teachers") return false; // remove Teachers for Teacher
		}
		// Hide specific items for Admin role
		if (role === "Admin") {
			if (item.href === "/records") return false; // remove Records for Admin
			if (item.href === "/subjects") return false; // remove Subjects for Admin
		}
		return true;
	});

	return (
		<aside className={`fixed md:static z-40 h-full bg-white border-r w-64 md:w-64 transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
			<div className="flex items-center justify-between h-16 px-4 border-b">
				<div>
					<div className="text-xl font-semibold tracking-tight">EduPulse</div>
					{role && (
						<div className="text-xs text-slate-500 -mt-1">{role}</div>
					)}
				</div>
				<button className="md:hidden p-2 rounded-lg border" onClick={() => setOpen(false)}>✕</button>
			</div>
			<nav className="p-3 space-y-1">
				{filteredNavItems.map(item => {
					const Icon = item.icon;
					const active = pathname?.startsWith(item.href);
					return (
						<Link key={item.href} href={item.href as any} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-slate-50 ${active ? "bg-slate-100 text-slate-900" : "text-slate-600"}`}>
							<Icon className="w-4 h-4" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
			<button className="fixed bottom-4 left-4 md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white shadow-lg" onClick={() => setOpen(v => !v)}>
				<span>{open ? "Close" : "Menu"}</span>
			</button>
		</aside>
	);
}


