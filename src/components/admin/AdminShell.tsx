"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser, clearAuth } from "@/lib/adminAuth";
import {
  LayoutDashboard, Users, Target, UserCheck,
  Receipt, CheckSquare, FolderOpen, UserCog, Settings,
  LogOut, Menu, ChevronRight, Crosshair,
} from "lucide-react";

const NAV = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    section: "CRM",
    items: [
      { label: "Clients",           href: "/admin/clients",           icon: Users },
      { label: "Onboarded Clients", href: "/admin/onboarded-clients", icon: UserCheck },
      { label: "Leads",             href: "/admin/leads",             icon: Target },
    ],
  },
  {
    section: "Finance",
    items: [
      { label: "Fee Sheet", href: "/admin/fee-sheet", icon: Receipt },
    ],
  },
  {
    section: "Operations",
    items: [
      { label: "Tasks",     href: "/admin/tasks",     icon: CheckSquare },
      { label: "Documents", href: "/admin/documents", icon: FolderOpen },
    ],
  },
  {
    section: "Administration",
    items: [
      { label: "Target",   href: "/admin/target",   icon: Crosshair },
      { label: "Users",    href: "/admin/users",    icon: UserCog },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function SidebarContent({ pathname, onNav, user, onLogout }: {
  pathname: string;
  onNav?: () => void;
  user: AuthUser;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700/50">
        <Link href="/admin/dashboard" onClick={onNav} className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sl1" x1="24" y1="11" x2="24" y2="69" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#18D8F5"/>
                <stop offset="48%" stopColor="#4B6CF7"/>
                <stop offset="100%" stopColor="#7B2FEE"/>
              </linearGradient>
            </defs>
            <line x1="24" y1="11" x2="24" y2="69" stroke="url(#sl1)" strokeWidth="12" strokeLinecap="round"/>
            <path d="M 24,11 A 21,14 0 0,1 24,39" fill="none" stroke="url(#sl1)" strokeWidth="10.5" strokeLinecap="round"/>
            <path d="M 24,39 A 27,15 0 0,1 24,69" fill="none" stroke="url(#sl1)" strokeWidth="11.5" strokeLinecap="round"/>
            <line x1="9" y1="75" x2="63" y2="11" stroke="#4B6CF7" strokeWidth="7.5" strokeLinecap="round"/>
            <polygon fill="#4B6CF7" points="67,7 63,23 52,14"/>
          </svg>
          <div>
            <div className="text-sm font-bold text-white leading-none">Bhandari &amp; Co.</div>
            <div className="text-[9px] text-slate-400 mt-0.5 tracking-widest uppercase">Admin Portal</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map(group => (
          <div key={group.section}>
            <p className="px-2 mb-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} onClick={onNav}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                      ${active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                        : "text-slate-400 hover:text-white hover:bg-slate-700/60"}`}>
                    <Icon size={15} className="shrink-0" />
                    {item.label}
                    {active && <ChevronRight size={12} className="ml-auto opacity-70" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
            flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
          </div>
          <button onClick={onLogout} title="Logout"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ children, user }: { children: React.ReactNode; user: AuthUser }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => { clearAuth(); router.push("/admin/login"); };
  const pageTitle = NAV.flatMap(g => g.items).find(i => pathname.startsWith(i.href))?.label ?? "Admin";

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 shrink-0">
        <SidebarContent pathname={pathname} user={user} onLogout={logout} />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative z-10 flex flex-col w-64 bg-slate-900">
            <SidebarContent pathname={pathname} onNav={() => setOpen(false)} user={user} onLogout={logout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 px-5 py-3.5 bg-white border-b border-slate-200 shadow-sm shrink-0">
          <button onClick={() => setOpen(true)}
            className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">{pageTitle}</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Bhandari &amp; Co. · GST Management System</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
                flex items-center justify-center text-white text-[10px] font-bold">
                {user.avatar}
              </div>
              <span className="font-medium">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
