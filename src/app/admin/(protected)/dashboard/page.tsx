"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, CheckSquare, IndianRupee, ArrowRight, CheckCircle, FileText, Crosshair, TrendingUp, UserCheck } from "lucide-react";
import { getAuth, type AuthUser } from "@/lib/adminAuth";
import { getFeeSheets, type FeeSheet } from "@/lib/feeSheetStore";
import { MONTHS, fmtTargetVal, overallScore, findEmployeeTarget, getTargetData, type EmployeeTarget } from "@/lib/targetData";

const STATS = [
  { label: "Total Clients",       value: "142",    sub: "+8 this month",      icon: Users,         color: "bg-blue-500",    light: "bg-blue-50 text-blue-600" },
  { label: "Active Tasks",        value: "31",     sub: "8 due this week",    icon: CheckSquare,   color: "bg-violet-500",  light: "bg-violet-50 text-violet-600" },
];

const ACTIVITY = [
  { time: "10 min ago", text: "Fee sheet generated for Anita Chaudhary",             type: "success" },
  { time: "1 hr ago",   text: "Payment proof uploaded by Sharma Enterprises",        type: "info" },
  { time: "2 hrs ago",  text: "New client onboarded: Meena Fashions",                 type: "success" },
  { time: "3 hrs ago",  text: "Documents uploaded for Mohan Lal — workflow complete", type: "success" },
  { time: "5 hrs ago",  text: "New lead added: Ramesh Gupta (GST Registration)",      type: "info" },
  { time: "Yesterday",  text: "Bank reconciliation completed for Q1 FY26",            type: "success" },
];

const iconType: Record<string, string> = {
  success: "text-emerald-500 bg-emerald-50",
  info:    "text-blue-500 bg-blue-50",
  warn:    "text-amber-500 bg-amber-50",
};

const currentMonth = MONTHS[MONTHS.length - 1];

function TargetBar({ label, unit, target, achieved }: { label: string; unit: string; target: number; achieved: number }) {
  const pct = Math.min(100, Math.round((achieved / target) * 100));
  const over = achieved >= target;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className={`font-bold ${over ? "text-emerald-600" : "text-slate-700"}`}>
          {fmtTargetVal(unit, achieved)} / {fmtTargetVal(unit, target)}{over && " ✓"}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${over ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MyTargetCard({ user, targetData }: { user: AuthUser; targetData: Record<string, EmployeeTarget[]> }) {
  const emp = findEmployeeTarget(user.name, currentMonth, targetData);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Crosshair size={15} className="text-sky-500" /> My Target — {currentMonth}</h3>
        <Link href="/admin/target" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          View details <ArrowRight size={11} />
        </Link>
      </div>
      {emp ? (
        <div className="space-y-4">
          {emp.targets.map(t => (
            <TargetBar key={t.category} label={t.category} unit={t.unit} target={t.target} achieved={t.achieved} />
          ))}
          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="text-slate-500">{emp.targets.filter(t => t.achieved >= t.target).length}/{emp.targets.length} targets met</span>
            <span className="font-bold text-blue-600">{overallScore(emp.targets)}% overall</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">No target has been set for you yet.</p>
      )}
    </div>
  );
}

function MyClientsCard({ sheets }: { sheets: FeeSheet[] }) {
  const onboarded = sheets.filter(s => s.status === "Paid" || s.status === "Partial");
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2"><UserCheck size={15} className="text-emerald-500" /> My Clients</h3>
        <Link href="/admin/onboarded-clients" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          View all <ArrowRight size={11} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 rounded-xl bg-emerald-50">
          <div className="text-xl font-bold text-emerald-700">{onboarded.length}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Onboarded</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-blue-50">
          <div className="text-xl font-bold text-blue-700">{sheets.filter(s => s.status === "Pending for Approval").length}</div>
          <div className="text-[10px] text-blue-600 mt-0.5">Pending Approval</div>
        </div>
      </div>
      <div className="space-y-2">
        {onboarded.slice(0, 5).map(s => (
          <div key={s.id} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg hover:bg-slate-50">
            <span className="text-slate-700 font-medium">{s.client}</span>
            <span className="text-slate-400">{s.no}</span>
          </div>
        ))}
        {onboarded.length === 0 && <p className="text-sm text-slate-400">No onboarded clients yet.</p>}
      </div>
    </div>
  );
}

function TeamTargetSection({ targetData }: { targetData: Record<string, EmployeeTarget[]> }) {
  const employees = targetData[currentMonth] ?? [];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Crosshair size={15} className="text-sky-500" /> Team Target — {currentMonth}</h3>
        <Link href="/admin/target" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
          View all <ArrowRight size={11} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {employees.map(e => {
          const score = overallScore(e.targets);
          const scoreColor = score >= 90 ? "text-emerald-600" : score >= 70 ? "text-amber-600" : "text-red-600";
          return (
            <div key={e.name} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {e.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">{e.name}</div>
                  <div className="text-[10px] text-slate-400">{e.role}</div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${scoreColor}`}>
                  <TrendingUp size={11} /> {score}%
                </div>
              </div>
              <div className="space-y-2">
                {e.targets.slice(0, 2).map(t => (
                  <TargetBar key={t.category} label={t.category} unit={t.unit} target={t.target} achieved={t.achieved} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser]     = useState<AuthUser | null>(null);
  const [sheets, setSheets] = useState<FeeSheet[]>([]);
  const [targetData, setTargetData] = useState<Record<string, EmployeeTarget[]>>({});

  useEffect(() => {
    setUser(getAuth());
    setSheets(getFeeSheets());
    setTargetData(getTargetData());
  }, []);

  if (!user) return null;

  const isAdmin = user.role === "Super Admin";
  const pendingApproval = sheets.filter(s => s.status === "Pending for Approval").length;
  const totalRev = sheets.reduce((a, i) => a + (i.status === "Paid" || i.status === "Partial" ? i.amount : 0), 0);

  const adminStats = [
    ...STATS,
    { label: "Pending Approvals", value: String(pendingApproval), sub: "awaiting admin review", icon: FileText, color: "bg-amber-500", light: "bg-amber-50 text-amber-600" },
    { label: "Revenue Collected", value: `₹${(totalRev / 1000).toFixed(0)}K`, sub: "from paid/partial sheets", icon: IndianRupee, color: "bg-emerald-500", light: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Good morning, {user.name.split(" ")[0]} 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">Here&apos;s what&apos;s happening at Bhandari &amp; Co. today.</p>
        </div>
        <div className="hidden sm:block text-right text-xs text-slate-400">
          <div className="font-semibold text-slate-600 text-sm">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
          <div>Financial Year 2025-26</div>
        </div>
      </div>

      {isAdmin ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {adminStats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shadow`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${s.light}`}>{s.sub}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Team Target */}
          <TeamTargetSection targetData={targetData} />

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-6 h-6 rounded-full ${iconType[a.type]} flex items-center justify-center shrink-0 mt-0.5`}>
                    {a.type === "success" && <CheckCircle size={11} />}
                    {a.type === "info"    && <FileText size={11} />}
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <MyTargetCard user={user} targetData={targetData} />
          <MyClientsCard sheets={sheets} />
        </div>
      )}
    </div>
  );
}
