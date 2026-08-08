"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Phone, Mail, ArrowRight, CheckCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getWorkflowState, setLeadWorkflow, WORKFLOW_STEPS, type LeadWorkflow } from "@/lib/workflowState";
import { getLeads, addLead, PIPELINE, type Lead, type Stage } from "@/lib/leadsStore";
import { getAuth } from "@/lib/adminAuth";
import AdminModal, { FLabel, FInput, FSelect, FTextarea, FRow, FField, FSubmit } from "@/components/admin/AdminModal";

const SOURCES = ["Referral","WhatsApp","Website","Walk-in","Instagram","Facebook","Other"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh", "Puducherry",
  "Andaman & Nicobar Islands", "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep",
];

const EMPTY_FORM = {
  firmName: "", contactNumber: "", email: "", state: "Rajasthan", panNumber: "",
  zone: "", gstNumber: "", remark: "", source: "Referral", referral: "",
};

const STAGE_COLOR: Record<Stage, string> = {
  "New":           "bg-blue-50 text-blue-600",
  "Contacted":     "bg-sky-50 text-sky-600",
  "Proposal Sent": "bg-violet-50 text-violet-600",
  "Negotiation":   "bg-amber-50 text-amber-600",
  "Converted":     "bg-emerald-50 text-emerald-600",
  "Lost":          "bg-red-50 text-red-500",
};

function WorkflowStepper({ wf }: { wf: LeadWorkflow | undefined }) {
  const stage  = wf?.stage ?? 0;
  const labels = ["Lead", "Fee Sheet", "Docs"];
  return (
    <div className="flex items-center gap-0.5">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-0.5">
          {i > 0 && <div className={`w-3 h-px ${i <= stage ? "bg-emerald-400" : "bg-slate-200"}`} />}
          <div className={`flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full
            ${i < stage ? "bg-emerald-100 text-emerald-700" : i === stage ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"}`}>
            {i < stage ? <CheckCircle size={8} className="mr-0.5" /> : <Circle size={8} className="mr-0.5" />}
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [search, setSearch]     = useState("");
  const [stageF, setStageF]     = useState("All");
  const [wfState, setWfState]   = useState<Record<string, LeadWorkflow>>({});
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ ...EMPTY_FORM });

  useEffect(() => {
    setWfState(getWorkflowState());
    setLeads(getLeads());
  }, []);

  const f = <K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firmName.trim() || !form.contactNumber.trim()) return;
    const newLead: Lead = {
      id: Date.now(),
      ...form,
      stage: "New",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      createdBy: getAuth()?.name ?? "Unknown",
    };
    setLeads(addLead(newLead));
    setForm({ ...EMPTY_FORM });
    setShowAdd(false);
  };

  const filtered = leads.filter(l =>
    (stageF === "All" || l.stage === stageF) &&
    (l.firmName.toLowerCase().includes(search.toLowerCase()) ||
     l.gstNumber.toLowerCase().includes(search.toLowerCase()) ||
     l.panNumber.toLowerCase().includes(search.toLowerCase()))
  );

  const counts = (Object.fromEntries(PIPELINE.map(s => [s, leads.filter(l => l.stage === s).length])));

  const advanceWorkflow = (leadId: number, toStage: number, href: string) => {
    const updated = setLeadWorkflow(leadId, { stage: toStage });
    setWfState(prev => ({ ...prev, [leadId]: updated }));
    router.push(href);
  };

  const workflowStats = {
    total:    leads.length,
    feeSheet: Object.values(wfState).filter(w => w.stage >= 1).length,
    docs:     Object.values(wfState).filter(w => w.stage >= 2).length,
    complete: Object.values(wfState).filter(w => w.stage >= 3).length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Track leads through the Leads → Fee Sheet → Documents workflow</p>
        <button onClick={() => { setForm({ ...EMPTY_FORM }); setShowAdd(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={15} /> Add Lead
        </button>
      </div>

      {/* Workflow pipeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Workflow Pipeline</p>
        <div className="flex items-center gap-3">
          {[
            { label: "Lead Created",   count: workflowStats.total,    color: "bg-slate-600" },
            { label: "Fee Sheet Done", count: workflowStats.feeSheet, color: "bg-blue-500" },
            { label: "Docs Uploaded",  count: workflowStats.docs,     color: "bg-violet-500" },
            { label: "Complete",       count: workflowStats.complete, color: "bg-emerald-500" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              {i > 0 && <ArrowRight size={14} className="text-slate-300 shrink-0" />}
              <div className="text-center">
                <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-white text-sm font-bold mx-auto`}>
                  {s.count}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage filter chips */}
      <div className="flex flex-wrap gap-2">
        {["All", ...PIPELINE].map(s => (
          <button key={s} onClick={() => setStageF(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
              ${stageF === s ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"}`}>
            {s} {s !== "All" && `(${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads by firm name, GST or PAN…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#","Firm","Contact","State / Zone","GSTIN","Remark","Stage","Workflow Progress","Next Step"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">No leads found.</td></tr>
              )}
              {filtered.map((l, i) => {
                const wf = wfState[l.id];
                const currentStage = wf?.stage ?? 0;
                return (
                  <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{l.firmName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{l.date} · via {l.source}{l.referral ? ` (${l.referral})` : ""}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Added by <span className="font-medium text-slate-500">{l.createdBy || "Unknown"}</span></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-600"><Phone size={10}/>{l.contactNumber}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><Mail size={10}/>{l.email || "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{l.state}{l.zone ? ` · ${l.zone}` : ""}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{l.gstNumber || "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 max-w-[180px] truncate" title={l.remark || undefined}>{l.remark || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${STAGE_COLOR[l.stage]}`}>{l.stage}</span>
                    </td>
                    <td className="px-4 py-3"><WorkflowStepper wf={wf} /></td>
                    <td className="px-4 py-3">
                      {currentStage >= 3 ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold"><CheckCircle size={12}/> Complete</span>
                      ) : currentStage === 0 ? (
                        <button onClick={() => advanceWorkflow(l.id, 1, `/admin/fee-sheet?leadId=${l.id}&name=${encodeURIComponent(l.firmName)}`)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold group">
                          Generate Fee Sheet <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform"/>
                        </button>
                      ) : currentStage === 1 ? (
                        <button onClick={() => advanceWorkflow(l.id, 2, `/admin/documents?leadId=${l.id}&name=${encodeURIComponent(l.firmName)}`)}
                          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-semibold group">
                          Upload Documents <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform"/>
                        </button>
                      ) : (
                        <button onClick={() => { setLeadWorkflow(l.id, { stage: 3 }); setWfState(p => ({ ...p, [l.id]: { ...p[l.id], stage: 3 } })); }}
                          className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold">
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow legend */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-widest">Workflow Steps</p>
        <div className="flex flex-wrap gap-6 text-xs text-blue-600">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Lead Modal ── */}
      <AdminModal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Lead" size="lg">
        <form onSubmit={handleAdd}>
          <FRow>
            <FField span2>
              <FLabel required>Firm Name</FLabel>
              <FInput value={form.firmName} onChange={v => f("firmName", v)} placeholder="ABC Enterprises" required />
            </FField>
            <FField>
              <FLabel required>Contact Number</FLabel>
              <FInput type="tel" value={form.contactNumber} onChange={v => f("contactNumber", v)} placeholder="9876543210" required />
            </FField>
            <FField>
              <FLabel>Email</FLabel>
              <FInput type="email" value={form.email} onChange={v => f("email", v)} placeholder="lead@example.com" />
            </FField>
            <FField>
              <FLabel>State</FLabel>
              <FSelect value={form.state} onChange={v => f("state", v)} options={INDIAN_STATES} />
            </FField>
            <FField>
              <FLabel>PAN Number</FLabel>
              <FInput value={form.panNumber} onChange={v => f("panNumber", v.toUpperCase())} placeholder="AAAAA0000A" />
            </FField>
            <FField>
              <FLabel>Zone</FLabel>
              <FInput value={form.zone} onChange={v => f("zone", v)} placeholder="e.g. North" />
            </FField>
            <FField>
              <FLabel>GST Number</FLabel>
              <FInput value={form.gstNumber} onChange={v => f("gstNumber", v.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
            </FField>
            <FField>
              <FLabel>Source</FLabel>
              <FSelect value={form.source} onChange={v => f("source", v)} options={SOURCES} />
            </FField>
            <FField>
              <FLabel>Referral</FLabel>
              <FInput value={form.referral} onChange={v => f("referral", v)} placeholder="Referred by…" />
            </FField>
            <FField span2>
              <FLabel>Remark</FLabel>
              <FTextarea value={form.remark} onChange={v => f("remark", v)} placeholder="Any notes about this lead…" />
            </FField>
          </FRow>
          <FSubmit label="Add Lead" onCancel={() => setShowAdd(false)} />
        </form>
      </AdminModal>
    </div>
  );
}
