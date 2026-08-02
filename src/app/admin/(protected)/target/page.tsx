"use client";

import { useState } from "react";
import { Crosshair, TrendingUp, Edit3, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS, TARGET_DATA, fmtTargetVal, overallScore, type TargetItem } from "@/lib/targetData";

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

  const month    = MONTHS[monthIdx];
  const employees = TARGET_DATA[month] ?? TARGET_DATA["Jun 2026"];
  const isCurrent = monthIdx === MONTHS.length - 1;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Monthly performance targets and achievement tracking for staff</p>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
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

      {/* Team summary row */}
      <div className="grid grid-cols-3 gap-4">
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
                  <button onClick={() => setEditing(isEditing ? null : e.name)}
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
              {(TARGET_DATA[MONTHS[0]] ?? []).map(e => (
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
                    const emp = (TARGET_DATA[m] ?? []).find(x => x.name === e.name);
                    const score = emp ? overallScore(emp.targets) : 0;
                    return (
                      <td key={m} className={`px-4 py-3 text-center ${m === month ? "bg-blue-50/50" : ""}`}>
                        <span className={`text-sm font-bold ${score >= 90 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-red-600"}`}>
                          {score}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
