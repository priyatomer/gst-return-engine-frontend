"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Search, MoreVertical, Shield, UserCog, Power, Trash2 } from "lucide-react";
import AdminModal, { FLabel, FInput, FSelect, FRow, FField, FSubmit } from "@/components/admin/AdminModal";

interface AppUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  avatar: string;
  tasks: number;
}

const INITIAL_USERS: AppUser[] = [
  { id: 1, name: "Jitinder Singh", email: "admin@bhandariandco.com",  role: "Super Admin", status: "Active",   lastLogin: "Today, 09:15 AM",     avatar: "JS", tasks: 12 },
  { id: 2, name: "Priya Sharma",   email: "staff@bhandariandco.com",  role: "Staff",       status: "Active",   lastLogin: "Today, 08:45 AM",     avatar: "PS", tasks: 8 },
  { id: 3, name: "Amit Kumar",     email: "amit.k@bhandariandco.com", role: "Staff",       status: "Active",   lastLogin: "Yesterday, 06:30 PM", avatar: "AK", tasks: 15 },
  { id: 4, name: "Neha Gupta",     email: "neha.g@bhandariandco.com", role: "Accountant",  status: "Active",   lastLogin: "Today, 10:00 AM",     avatar: "NG", tasks: 6 },
  { id: 5, name: "Rahul Verma",    email: "rahul.v@bhandariandco.com",role: "Staff",       status: "Inactive", lastLogin: "15 Jun 2026",         avatar: "RV", tasks: 0 },
];

const ROLE_COLOR: Record<string, string> = {
  "Super Admin": "bg-violet-50 text-violet-700",
  "Staff":       "bg-blue-50 text-blue-700",
  "Accountant":  "bg-emerald-50 text-emerald-700",
};

const EMPTY_FORM = { name: "", email: "", role: "Staff", status: "Active" };

const initials = (name: string) =>
  name.trim().split(" ").slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");

export default function UsersPage() {
  const [users, setUsers]     = useState<AppUser[]>(INITIAL_USERS);
  const [search, setSearch]   = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({ ...EMPTY_FORM });
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuFor(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const f = <K extends keyof typeof EMPTY_FORM>(k: K, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setUsers(prev => [
      {
        id:        Date.now(),
        name:      form.name,
        email:     form.email,
        role:      form.role,
        status:    form.status,
        lastLogin: "Just now",
        avatar:    initials(form.name),
        tasks:     0,
      },
      ...prev,
    ]);
    setForm({ ...EMPTY_FORM });
    setShowAdd(false);
  };

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
    setMenuFor(null);
  };

  const deleteUser = (u: AppUser) => {
    if (window.confirm(`Delete ${u.name}? This cannot be undone.`)) {
      setUsers(prev => prev.filter(x => x.id !== u.id));
    }
    setMenuFor(null);
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage staff accounts and access permissions</p>
        <button onClick={() => { setForm({ ...EMPTY_FORM }); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={15} /> Add User
        </button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", val: users.length,                                      icon: UserCog, color: "text-blue-500 bg-blue-50" },
          { label: "Active",      val: users.filter(u => u.status === "Active").length,   icon: Shield,  color: "text-emerald-500 bg-emerald-50" },
          { label: "Super Admin", val: users.filter(u => u.role === "Super Admin").length,icon: Shield,  color: "text-violet-500 bg-violet-50" },
          { label: "Inactive",    val: users.filter(u => u.status === "Inactive").length, icon: Shield,  color: "text-slate-400 bg-slate-100" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <div className="text-xl font-bold text-slate-900">{s.val}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["User","Email","Role","Active Tasks","Status","Last Login",""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No users found.</td></tr>
            )}
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
                      flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {u.avatar}
                    </div>
                    <span className="font-semibold text-slate-800">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${ROLE_COLOR[u.role] ?? "bg-slate-100 text-slate-600"}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{u.tasks}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full
                    ${u.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{u.lastLogin}</td>
                <td className="px-4 py-3 relative">
                  <button onClick={() => setMenuFor(menuFor === u.id ? null : u.id)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                    <MoreVertical size={14} />
                  </button>
                  {menuFor === u.id && (
                    <div ref={menuRef}
                      className="absolute right-4 top-10 z-10 w-44 bg-white rounded-xl border border-slate-100 shadow-lg py-1">
                      <button onClick={() => toggleStatus(u.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 text-left">
                        <Power size={13} /> {u.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => deleteUser(u)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left">
                        <Trash2 size={13} /> Delete User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add User Modal ── */}
      <AdminModal open={showAdd} onClose={() => setShowAdd(false)} title="Add New User" size="sm">
        <form onSubmit={handleAdd}>
          <FRow>
            <FField span2>
              <FLabel required>Full Name</FLabel>
              <FInput value={form.name} onChange={v => f("name", v)} placeholder="Ravi Sharma" required />
            </FField>
            <FField span2>
              <FLabel required>Email Address</FLabel>
              <FInput type="email" value={form.email} onChange={v => f("email", v)} placeholder="ravi@bhandariandco.com" required />
            </FField>
            <FField>
              <FLabel>Role</FLabel>
              <FSelect value={form.role} onChange={v => f("role", v)} options={["Super Admin","Staff","Accountant","Viewer"]} />
            </FField>
            <FField>
              <FLabel>Status</FLabel>
              <FSelect value={form.status} onChange={v => f("status", v)} options={["Active","Inactive"]} />
            </FField>
          </FRow>
          <p className="text-xs text-slate-400 mt-3">A temporary password will be sent to their email.</p>
          <FSubmit label="Add User" onCancel={() => setShowAdd(false)} />
        </form>
      </AdminModal>
    </div>
  );
}
