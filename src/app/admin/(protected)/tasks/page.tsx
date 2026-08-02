"use client";

import { useState } from "react";
import { Search, Plus, CheckSquare, Circle, Clock } from "lucide-react";
import AdminModal, { FLabel, FInput, FSelect, FRow, FField, FSubmit } from "@/components/admin/AdminModal";

type TStatus   = "Pending" | "In Progress" | "Completed" | "Blocked";
type TPriority = "High" | "Medium" | "Low";

interface Task {
  id: number;
  title: string;
  type: string;
  client: string;
  assignee: string;
  dueDate: string;
  status: TStatus;
  priority: TPriority;
}

const TASK_TYPES = [
  "GST Filing", "Notice Reply", "Data Collection", "Tax Calculation",
  "Reconciliation", "Balance Sheet", "Onboarding", "DSC", "Tax Audit", "Other",
];

const CLIENTS_LIST = [
  "Sharma Enterprises", "Kumar Textiles", "Agarwal & Sons", "Rajasthan Traders",
  "Verma Pharma", "Yadav Transport", "Jain Textiles", "Meena Fashions", "Multiple",
];

const INITIAL_TASKS: Task[] = [
  { id: 1,  title: "File GSTR-1 — Jain Textiles Pvt Ltd",        type: "GST Filing",      client: "Jain Textiles",      assignee: "Priya", dueDate: "11 Jul 2026", status: "In Progress", priority: "High" },
  { id: 2,  title: "File GSTR-3B — Agarwal & Sons",              type: "GST Filing",      client: "Agarwal & Sons",     assignee: "Amit",  dueDate: "20 Jul 2026", status: "Pending",     priority: "High" },
  { id: 3,  title: "Reply to SCN — Sharma Enterprises",           type: "Notice Reply",    client: "Sharma Enterprises", assignee: "Amit",  dueDate: "15 Jul 2026", status: "In Progress", priority: "High" },
  { id: 4,  title: "Collect data for GSTR-9 — 5 clients",        type: "Data Collection", client: "Multiple",           assignee: "Priya", dueDate: "30 Jul 2026", status: "Pending",     priority: "Medium" },
  { id: 5,  title: "Advance tax calculation — Verma Pharma",      type: "Tax Calculation", client: "Verma Pharma",       assignee: "Neha",  dueDate: "15 Jul 2026", status: "Pending",     priority: "Medium" },
  { id: 6,  title: "GSTR-2B reconciliation — Sharma Enterprises", type: "Reconciliation",  client: "Sharma Enterprises", assignee: "Neha",  dueDate: "10 Jul 2026", status: "Blocked",     priority: "High" },
  { id: 7,  title: "Prepare balance sheet — Agarwal & Sons",      type: "Balance Sheet",   client: "Agarwal & Sons",     assignee: "Neha",  dueDate: "31 Jul 2026", status: "Pending",     priority: "Low" },
  { id: 8,  title: "File GSTR-1 — Rajasthan Traders",            type: "GST Filing",      client: "Rajasthan Traders",  assignee: "Priya", dueDate: "11 Jul 2026", status: "Pending",     priority: "High" },
  { id: 9,  title: "Bank reconciliation — Yadav Transport",       type: "Reconciliation",  client: "Yadav Transport",    assignee: "Neha",  dueDate: "15 Jul 2026", status: "In Progress", priority: "Medium" },
  { id: 10, title: "Client onboarding — Meena Fashions",          type: "Onboarding",      client: "Meena Fashions",     assignee: "Priya", dueDate: "05 Jul 2026", status: "Completed",   priority: "Low" },
  { id: 11, title: "DSC renewal — 3 clients",                     type: "DSC",             client: "Multiple",           assignee: "Amit",  dueDate: "20 Jul 2026", status: "Pending",     priority: "Medium" },
  { id: 12, title: "Tax audit — Verma Pharma",                    type: "Tax Audit",       client: "Verma Pharma",       assignee: "Neha",  dueDate: "30 Sep 2026", status: "Pending",     priority: "Low" },
];

const STATUS_CONFIG: Record<TStatus, { color: string; icon: React.ComponentType<{ size?: number }> }> = {
  "Pending":     { color: "bg-slate-100 text-slate-600",    icon: Circle },
  "In Progress": { color: "bg-blue-50 text-blue-600",       icon: Clock },
  "Completed":   { color: "bg-emerald-50 text-emerald-600", icon: CheckSquare },
  "Blocked":     { color: "bg-red-50 text-red-600",         icon: Circle },
};

const PRIORITY_COLOR: Record<TPriority, string> = {
  High:   "text-red-600 bg-red-50",
  Medium: "text-amber-600 bg-amber-50",
  Low:    "text-slate-500 bg-slate-100",
};

const EMPTY_FORM = {
  title: "", type: TASK_TYPES[0], client: CLIENTS_LIST[0],
  assignee: "Priya", dueDate: "", priority: "Medium" as TPriority, status: "Pending" as TStatus,
};

export default function TasksPage() {
  const [tasks, setTasks]         = useState<Task[]>(INITIAL_TASKS);
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState("All");
  const [assigneeF, setAssigneeF] = useState("All");
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState({ ...EMPTY_FORM });

  const f = <K extends keyof typeof EMPTY_FORM>(k: K, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueDate) return;
    setTasks(prev => [
      {
        id:       Date.now(),
        title:    form.title,
        type:     form.type,
        client:   form.client,
        assignee: form.assignee,
        dueDate:  new Date(form.dueDate).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
        status:   form.status as TStatus,
        priority: form.priority as TPriority,
      },
      ...prev,
    ]);
    setForm({ ...EMPTY_FORM });
    setShowAdd(false);
  };

  const filtered = tasks.filter(t =>
    (statusF   === "All" || t.status   === statusF)   &&
    (assigneeF === "All" || t.assignee === assigneeF) &&
    (t.title.toLowerCase().includes(search.toLowerCase()) ||
     t.client.toLowerCase().includes(search.toLowerCase()))
  );

  const pending   = tasks.filter(t => t.status === "Pending").length;
  const inProg    = tasks.filter(t => t.status === "In Progress").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const blocked   = tasks.filter(t => t.status === "Blocked").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage filing tasks, assignments, and deadlines</p>
        <button onClick={() => { setForm({ ...EMPTY_FORM }); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={15} /> Add Task
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending",     val: pending,   color: "text-slate-700 bg-white border border-slate-100" },
          { label: "In Progress", val: inProg,    color: "text-blue-700 bg-blue-50" },
          { label: "Completed",   val: completed, color: "text-emerald-700 bg-emerald-50" },
          { label: "Blocked",     val: blocked,   color: "text-red-700 bg-red-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl shadow-sm p-4 text-center ${s.color}`}>
            <div className="text-2xl font-bold">{s.val}</div>
            <div className="text-xs mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none">
          {["All","Pending","In Progress","Completed","Blocked"].map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={assigneeF} onChange={e => setAssigneeF(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none">
          {["All","Priya","Amit","Neha"].map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="flex items-center text-xs text-slate-500 ml-auto">{filtered.length} tasks</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Task","Type","Client","Assignee","Due Date","Priority","Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">No tasks found.</td></tr>
              )}
              {filtered.map(t => {
                const S    = STATUS_CONFIG[t.status];
                const Icon = S.icon;
                return (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm max-w-xs">{t.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">{t.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{t.client}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
                          flex items-center justify-center text-white text-[8px] font-bold">
                          {t.assignee[0]}
                        </div>
                        <span className="text-xs text-slate-600">{t.assignee}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-xs font-semibold ${t.status === "Blocked" ? "text-red-600" : "text-slate-600"}`}>{t.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLOR[t.priority]}`}>{t.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full w-fit whitespace-nowrap ${S.color}`}>
                        <Icon size={10} /> {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Task Modal ── */}
      <AdminModal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Task">
        <form onSubmit={handleAdd}>
          <FRow>
            <FField span2>
              <FLabel required>Task Title</FLabel>
              <FInput value={form.title} onChange={v => f("title", v)} placeholder="File GSTR-1 — Client Name" required />
            </FField>
            <FField>
              <FLabel required>Task Type</FLabel>
              <FSelect value={form.type} onChange={v => f("type", v)} options={TASK_TYPES} />
            </FField>
            <FField>
              <FLabel required>Client</FLabel>
              <FSelect value={form.client} onChange={v => f("client", v)} options={CLIENTS_LIST} />
            </FField>
            <FField>
              <FLabel>Assignee</FLabel>
              <FSelect value={form.assignee} onChange={v => f("assignee", v)} options={["Priya","Amit","Neha","Jitinder"]} />
            </FField>
            <FField>
              <FLabel required>Due Date</FLabel>
              <FInput type="date" value={form.dueDate} onChange={v => f("dueDate", v)} required />
            </FField>
            <FField>
              <FLabel>Priority</FLabel>
              <FSelect value={form.priority} onChange={v => f("priority", v)} options={["High","Medium","Low"]} />
            </FField>
            <FField>
              <FLabel>Status</FLabel>
              <FSelect value={form.status} onChange={v => f("status", v)} options={["Pending","In Progress","Completed","Blocked"]} />
            </FField>
          </FRow>
          <FSubmit label="Add Task" onCancel={() => setShowAdd(false)} />
        </form>
      </AdminModal>
    </div>
  );
}
