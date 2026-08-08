"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Search, Plus, Download, ArrowLeft, ArrowRight, Receipt, Upload, CheckCircle2, FileCheck, Paperclip } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getWorkflowState, setLeadWorkflow } from "@/lib/workflowState";
import { getAuth } from "@/lib/adminAuth";
import { getLead } from "@/lib/leadsStore";
import {
  getFeeSheets, addFeeSheet, uploadPaymentProof, approvePayment,
  type FeeSheet, type FeeStatus,
} from "@/lib/feeSheetStore";
import FeeSheetDrawer, { type SavedFeeSheet } from "@/components/admin/FeeSheetDrawer";

const STATUS_COLOR: Record<FeeStatus, string> = {
  "Paid":                 "bg-emerald-50 text-emerald-600",
  "Unpaid":               "bg-red-50 text-red-600",
  "Partial":              "bg-amber-50 text-amber-600",
  "Pending for Approval": "bg-blue-50 text-blue-600",
};

const ACCEPTED_TYPES = [".pdf", ".jpg", ".jpeg"];

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function PaymentProofCell({ sheet, isAdmin, onUpload, onApprove }: {
  sheet: FeeSheet;
  isAdmin: boolean;
  onUpload: (id: number, fileName: string, dataUrl: string) => void;
  onApprove: (id: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFile = (file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) {
      setError("Only PDF, JPG or JPEG files are allowed");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => onUpload(sheet.id, file.name, reader.result as string);
    reader.readAsDataURL(file);
  };

  if (sheet.status === "Paid") {
    return (
      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
        <CheckCircle2 size={12} /> Approved{sheet.approvedAt ? ` · ${sheet.approvedAt}` : ""}
      </div>
    );
  }

  if (sheet.status === "Pending for Approval") {
    return (
      <div className="space-y-1">
        <a href={sheet.proofDataUrl} download={sheet.proofFileName}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-medium">
          <Paperclip size={11} /> {sheet.proofFileName}
        </a>
        {isAdmin ? (
          <button onClick={() => onApprove(sheet.id)}
            className="flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-800 font-bold px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors">
            <FileCheck size={12} /> Approve Payment
          </button>
        ) : (
          <span className="text-[10px] text-blue-500 font-semibold">Pending for Approval</span>
        )}
      </div>
    );
  }

  return (
    <div>
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg" className="hidden"
        onChange={e => { const file = e.target.files?.[0]; if (file) handleFile(file); e.target.value = ""; }} />
      <button onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors border border-dashed border-slate-300 hover:border-blue-300">
        <Upload size={12} /> Upload Proof
      </button>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function FeeSheetContent() {
  const router   = useRouter();
  const params   = useSearchParams();
  const leadId   = params.get("leadId") ? Number(params.get("leadId")) : null;
  const leadName = params.get("name") ?? "";
  const user     = getAuth();
  const isAdmin  = user?.role === "Super Admin";
  const leadRecord = leadId ? getLead(leadId) : undefined;

  const [sheets, setSheets]       = useState<FeeSheet[]>([]);
  const [search, setSearch]       = useState("");
  const [statusF, setStatusF]     = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => { setSheets(getFeeSheets()); }, []);

  // Advance workflow stage when arriving from a lead
  useEffect(() => {
    if (leadId) {
      const wf = getWorkflowState()[leadId];
      if (!wf || wf.stage < 1) setLeadWorkflow(leadId, { stage: 1 });
    }
  }, [leadId]);

  const handleSaved = (saved: SavedFeeSheet, continueToDocs?: boolean) => {
    const newSheet: FeeSheet = {
      id:       Date.now(),
      no:       saved.no,
      leadId:   saved.leadId,
      leadName: saved.leadName,
      client:   saved.client,
      date:     new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
      services: saved.services,
      amount:   saved.amount,
      status:   "Unpaid",
      paidDate: "—",
    };
    setSheets(addFeeSheet(newSheet));

    if (continueToDocs && leadId) {
      setLeadWorkflow(leadId, { stage: 2, feeSheetNo: saved.no });
      router.push(`/admin/documents?leadId=${leadId}&name=${encodeURIComponent(leadName)}&feeSheet=${saved.no}`);
    }
  };

  const handleUploadDocs = (sheet: FeeSheet) => {
    if (sheet.leadId) {
      setLeadWorkflow(sheet.leadId, { stage: 2, feeSheetNo: sheet.no });
      router.push(`/admin/documents?leadId=${sheet.leadId}&name=${encodeURIComponent(sheet.leadName ?? sheet.client)}&feeSheet=${sheet.no}`);
    }
  };

  const handleUploadProof = (id: number, fileName: string, dataUrl: string) => {
    setSheets(uploadPaymentProof(id, fileName, dataUrl));
  };

  const handleApprove = (id: number) => {
    if (!user) return;
    setSheets(approvePayment(id, user.name));
  };

  const filtered = sheets.filter(s =>
    (statusF === "All" || s.status === statusF) &&
    (s.client.toLowerCase().includes(search.toLowerCase()) ||
     s.no.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRev = sheets.reduce((a, i) => a + (i.status === "Paid" || i.status === "Partial" ? i.amount : 0), 0);
  const totalOut = sheets.reduce((a, i) => a + (i.status === "Unpaid" ? i.amount : 0), 0);
  const pendingApproval = sheets.filter(i => i.status === "Pending for Approval").length;

  return (
    <div className="space-y-5">

      {/* ── Lead workflow banner ── */}
      {leadId && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <Receipt size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">
                  Step 2 of 3 — Generate Fee Sheet for <span className="underline underline-offset-2">{leadName}</span>
                </p>
                <p className="text-xs text-blue-600 mt-0.5">Fill in the fee sheet details below, then proceed to upload documents.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/admin/leads" className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                <ArrowLeft size={12} /> Leads
              </Link>
              <button onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-1.5 text-xs bg-blue-600 text-white font-bold px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                <Plus size={13} /> Create Fee Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage fee invoices — step 2 in the Lead → Fee Sheet → Documents workflow</p>
        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={15} /> Add Fee Sheet
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Sheets",      val: sheets.length,                                  bg: "bg-white border border-slate-100" },
          { label: "Paid",              val: sheets.filter(i => i.status === "Paid").length, bg: "bg-emerald-50" },
          { label: "Pending Approval",  val: pendingApproval,                                bg: "bg-blue-50" },
          { label: "Revenue Collected", val: fmtINR(totalRev),                               bg: "bg-blue-50" },
          { label: "Outstanding",       val: fmtINR(totalOut),                               bg: "bg-red-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl shadow-sm p-4 ${s.bg}`}>
            <div className="text-lg font-bold text-slate-900">{s.val}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client or fee sheet no…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none">
          {["All","Paid","Unpaid","Partial","Pending for Approval"].map(o => <option key={o}>{o}</option>)}
        </select>
        <span className="flex items-center text-xs text-slate-500 ml-auto">{filtered.length} fee sheets</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Fee Sheet No.","Client / Lead","Date","Services","Amount","Status","Payment Proof","Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No fee sheets found.</td></tr>
              )}
              {filtered.map(inv => (
                <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-700 whitespace-nowrap">{inv.no}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800 text-xs">{inv.client}</div>
                    {inv.leadName && (
                      <Link href="/admin/leads" className="text-[10px] text-blue-500 hover:underline mt-0.5 block">
                        ← Lead: {inv.leadName}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{inv.date}</td>
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
                  <td className="px-4 py-3 min-w-[140px]">
                    <PaymentProofCell sheet={inv} isAdmin={isAdmin} onUpload={handleUploadProof} onApprove={handleApprove} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                        <Download size={13} />
                      </button>
                      {inv.leadId && (
                        <button onClick={() => handleUploadDocs(inv)}
                          className="flex items-center gap-1 text-[10px] text-violet-600 hover:text-violet-800 font-bold whitespace-nowrap px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors">
                          Docs <ArrowRight size={9} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow hint */}
      <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
        <span className="font-semibold text-slate-700">Workflow:</span>
        <Link href="/admin/leads" className="text-blue-600 hover:underline font-medium">1. Leads</Link>
        <ArrowRight size={11} />
        <span className="font-semibold text-slate-700">2. Fee Sheet</span>
        <ArrowRight size={11} />
        <Link href="/admin/documents" className="text-violet-600 hover:underline font-medium">3. Documents</Link>
      </div>

      {/* ── Fee Sheet Generator Drawer ── */}
      <FeeSheetDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaved}
        prefillClient={leadRecord?.firmName || leadName}
        prefillEmail={leadRecord?.email}
        prefillPhone={leadRecord?.contactNumber}
        prefillState={leadRecord?.state}
        prefillGstin={leadRecord?.gstNumber}
        prefillPan={leadRecord?.panNumber}
        leadId={leadId}
        leadName={leadName}
      />
    </div>
  );
}

export default function FeeSheetPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-40"><div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" /></div>}>
      <FeeSheetContent />
    </Suspense>
  );
}
