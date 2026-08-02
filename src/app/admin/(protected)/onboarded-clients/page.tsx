"use client";

import { useEffect, useState } from "react";
import { Search, UserCheck } from "lucide-react";
import Link from "next/link";
import { getFeeSheets, type FeeSheet } from "@/lib/feeSheetStore";

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const STATUS_COLOR: Record<string, string> = {
  "Paid":    "bg-emerald-50 text-emerald-600",
  "Partial": "bg-amber-50 text-amber-600",
};

export default function OnboardedClientsPage() {
  const [sheets, setSheets] = useState<FeeSheet[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => { setSheets(getFeeSheets()); }, []);

  const onboarded = sheets.filter(s => s.status === "Paid" || s.status === "Partial");
  const filtered = onboarded.filter(s =>
    s.client.toLowerCase().includes(search.toLowerCase()) ||
    s.no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Clients onboarded after payment approval — Paid or Partial fee sheets only</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Onboarded Clients", val: onboarded.length,                                        bg: "bg-white border border-slate-100" },
          { label: "Fully Paid",        val: onboarded.filter(s => s.status === "Paid").length,        bg: "bg-emerald-50" },
          { label: "Partially Paid",    val: onboarded.filter(s => s.status === "Partial").length,     bg: "bg-amber-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl shadow-sm p-4 ${s.bg}`}>
            <div className="text-lg font-bold text-slate-900">{s.val}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search onboarded clients…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Client","Fee Sheet No.","Services","Amount","Payment Status","Approved On"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <UserCheck size={22} className="text-slate-300" />
                      No onboarded clients yet — clients appear here once their fee sheet payment is approved.
                      <Link href="/admin/fee-sheet" className="text-blue-600 hover:underline font-medium">Go to Fee Sheet →</Link>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map(inv => (
                <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800 text-xs">{inv.client}</td>
                  <td className="px-4 py-3 font-mono text-xs text-blue-700 whitespace-nowrap">{inv.no}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {inv.services.map(s => (
                        <span key={s} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800 whitespace-nowrap">{fmtINR(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${STATUS_COLOR[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{inv.approvedAt ?? inv.paidDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
