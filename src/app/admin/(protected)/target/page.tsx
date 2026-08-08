"use client";

import { useEffect, useState } from "react";
import { Crosshair, TrendingUp, Edit3, Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  MONTHS, fmtTargetVal, overallScore, getTargetData, setEmployeeTarget,
  type TargetItem, type EmployeeTarget,
} from "@/lib/targetData";
import AdminModal, { FLabel, FInput, FSelect, FRow, FField, FSubmit } from "@/components/admin/AdminModal";

const ROLES = ["Staff", "Accountant"];

const EMPTY_FORM = {
  name: "", role: "Staff", revenue: 0, secondary: 0, leadConversions: 0,
};

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "??";

function TargetBar({ t }: { t: TargetItem }) {
  const pct = Math.min(100, Math.round((t.achieved / t.target) * 100));
  const over = t.achieved >= t.target;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{t.category}</span>
        <span className={`font-bold ${over ? "text-emerald-600" : "text-slate-700"}`}>
          {fmtTargetVal(t.unit, t.achieved)} / {fmtTargetVal(t.unit, t.target)}
          {over && " ✓"}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${over ? "bg-emerald-500" : t.color}`}
          style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>{pct}% achieved</span>
        {!over && <span>{fmtTargetVal(t.unit, t.target - t.achieved)} remaining</span>}
        {over  && <span className="text-emerald-500">Target exceeded!</span>}
      </div>
    </div>
  );
}

export default function TargetPage() {
  const [monthIdx, setMonthIdx] = useState(3); // Start on Jul 2026
  const [editing, setEditing]   = useState<string | null>(null);
  const [targetData, setTargetData] = useState<Record<string, EmployeeTarget[]>>({});
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ ...EMPTY_FORM });

  useEffect(() => { setTargetData(getTargetData()); }, []);

  const month     = MONTHS[monthIdx];
  const employees = targetData[month] ?? [];
  const isCurrent = monthIdx === MONTHS.length - 1;

  const f = <K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const prefillFromExisting = (name: string) => {
    const existing = employees.find(e => e.name.toLowerCase() === name.trim().toLowerCase());
    if (!existing) return;
    const byCat = Object.fromEntries(existing.targets.map(t => [t.category, t.target]));
    setForm(p => ({
      ...p,
      role: existing.role,
      revenue: byCat["Revenue"] ?? p.revenue,
      secondary: byCat["New Onboarded Clients"] ?? byCat["Audits Completed"] ?? p.secondary,
      leadConversions: byCat["Lead Conversions"] ?? p.leadConversions,
    }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const existing = employees.find(x => x.name.toLowerCase() === form.name.trim().toLowerCase());
    const achievedFor = (category: string) => existing?.targets.find(t => t.category === category)?.achieved ?? 0;

    const secondaryCategory = form.role === "Accountant" ? "Audits Completed" : "New Onboarded Clients";

    const entry: EmployeeTarget = {
      name: form.name.trim(),
      avatar: existing?.avatar ?? initials(form.name),
      role: form.role,
      targets: [
        { category: "Revenue",         unit: "₹", target: Math.max(0, form.revenue),        achieved: achievedFor("Revenue"),        color: "bg-blue-500" },
        { category: secondaryCategory, unit: "",  target: Math.max(0, form.secondary),       achieved: achievedFor(secondaryCategory), color: "bg-emerald-500" },
        { category: "Lead Conversions",unit: "",  target: Math.max(0, form.leadConversions), achieved: achievedFor("Lead Conversions"), color: "bg-amber-500" },
      ],
    };

    setTargetData(setEmployeeTarget(month, entry));
    setForm({ ...EMPTY_FORM });
    setShowAdd(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Monthly performance targets and achievement tracking for staff</p>
        <button onClick={() => { setForm({ ...EMPTY_FORM }); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Crosshair size={15} /> Set New Target
        </button>
      </div>

      {/* Month navigator */}
      <div className="flex items-center gap-3">
        <button onClick={() => setMonthIdx(i => Math.max(0, i - 1))} disabled={monthIdx === 0}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors">
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-base font-bold text-slate-800">{month}</span>
          {isCurrent && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Current Month</span>}
        </div>
        <button onClick={() => setMonthIdx(i => Math.min(MONTHS.length - 1, i + 1))} disabled={monthIdx === MONTHS.length - 1}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors">
          <ChevronRight size={16} className="text-slate-600" />
        </button>
      </div>

      {employees.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-sm text-slate-400">
          No targets set for {month} yet. Click &ldquo;Set New Target&rdquo; to add one.
        </div>
      )}

      {employees.length > 0 && (
        <>
          {/* Team summary row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {employees.map(e => {
              const score = overallScore(e.targets);
              const scoreColor = score >= 90 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-red-600";
              return (
                <div key={e.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
                    flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {e.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{e.name}</div>
                    <div className="text-xs text-slate-500">{e.role}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${scoreColor}`}>{score}%</div>
                    <div className="text-[10px] text-slate-400">overall</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Employee target cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {employees.map(e => {
              const score = overallScore(e.targets);
              const isEditing = editing === e.name;
              return (
                <div key={e.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-sky-50/60 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-blue-600
                        flex items-center justify-center text-white text-xs font-bold">
                        {e.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">{e.name}</div>
                        <div className="text-[10px] text-slate-500">{e.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full
                        ${score >= 90 ? "bg-emerald-50 text-emerald-700" :
                          score >= 70 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                        <TrendingUp size={11} /> {score}%
                      </div>
                      <button onClick={() => {
                        if (!isEditing) {
                          setForm({
                            name: e.name, role: e.role,
                            revenue: e.targets.find(t => t.category === "Revenue")?.target ?? 0,
                            secondary: e.targets.find(t => t.category === "New Onboarded Clients" || t.category === "Audits Completed")?.target ?? 0,
                            leadConversions: e.targets.find(t => t.category === "Lead Conversions")?.target ?? 0,
                          });
                          setShowAdd(true);
                        }
                        setEditing(isEditing ? null : e.name);
                      }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Targets */}
                  <div className="p-5 space-y-4">
                    {e.targets.map(t => (
                      <TargetBar key={t.category} t={t} />
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-between text-xs">
                    <span className="text-slate-500">{e.targets.filter(t => t.achieved >= t.target).length}/{e.targets.length} targets met</span>
                    {isCurrent && (
                      <span className="text-blue-600 font-semibold">Month in progress</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Historical comparison table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-slate-50 to-sky-50/60 border-b border-slate-100">
          <Crosshair size={14} className="text-sky-500" />
          <h3 className="text-sm font-semibold text-slate-700">Performance History — Overall Score (%)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                {MONTHS.map(m => (
                  <th key={m} className={`px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider ${m === month ? "text-blue-600" : "text-slate-500"}`}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(targetData[MONTHS[MONTHS.length - 1]] ?? []).map(e => (
                <tr key={e.name} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                        {e.avatar}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{e.name}</span>
                    </div>
                  </td>
                  {MONTHS.map(m => {
                    const emp = (targetData[m] ?? []).find(x => x.name === e.name);
                    const score = emp ? overallScore(emp.targets) : 0;
                    return (
                      <td key={m} className={`px-4 py-3 text-center ${m === month ? "bg-blue-50/50" : ""}`}>
                        <span className={`text-sm font-bold ${score >= 90 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-red-600"}`}>
                          {emp ? `${score}%` : "—"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {(targetData[MONTHS[MONTHS.length - 1]] ?? []).length === 0 && (
                <tr><td colSpan={MONTHS.length + 1} className="px-4 py-8 text-center text-sm text-slate-400">No performance history yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Set Target Modal ── */}
      <AdminModal open={showAdd} onClose={() => { setShowAdd(false); setEditing(null); }} title={`Set Target — ${month}`}>
        <form onSubmit={handleAdd}>
          <FRow>
            <FField span2>
              <FLabel required>Employee Name</FLabel>
              <FInput value={form.name} onChange={v => f("name", v)}
                onBlur={() => prefillFromExisting(form.name)}
                placeholder="Existing or new employee name" required />
            </FField>
            <FField>
              <FLabel>Role</FLabel>
              <FSelect value={form.role} onChange={v => f("role", v)} options={ROLES} />
            </FField>
            <FField>
              <FLabel>Revenue Target (₹)</FLabel>
              <FInput type="number" value={String(form.revenue)} onChange={v => f("revenue", Number(v))} placeholder="80000" />
            </FField>
            <FField>
              <FLabel>{form.role === "Accountant" ? "Audits Completed Target" : "New Onboarded Clients Target"}</FLabel>
              <FInput type="number" value={String(form.secondary)} onChange={v => f("secondary", Number(v))} placeholder="5" />
            </FField>
            <FField>
              <FLabel>Lead Conversions Target</FLabel>
              <FInput type="number" value={String(form.leadConversions)} onChange={v => f("leadConversions", Number(v))} placeholder="8" />
            </FField>
          </FRow>
          <FSubmit label="Save Target" onCancel={() => { setShowAdd(false); setEditing(null); }} />
        </form>
      </AdminModal>
    </div>
  );
}
