"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Search, Plus, Download, ArrowLeft, ArrowRight, Receipt, Upload, CheckCircle2, Paperclip } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getWorkflowState, setLeadWorkflow } from "@/lib/workflowState";
import { getAuth } from "@/lib/adminAuth";
import { getLead } from "@/lib/leadsStore";
import {
  getFeeSheets, addFeeSheet, addPaymentRecord, approvePaymentRecord, getPaidAmount, getPendingAmount,
  type FeeSheet, type FeeStatus,
} from "@/lib/feeSheetStore";
import FeeSheetDrawer, {
  InvoicePreview, FIRM, type SavedFeeSheet, type InvoiceData,
} from "@/components/admin/FeeSheetDrawer";
import AdminModal, { FLabel, FInput, FSubmit } from "@/components/admin/AdminModal";

const STATUS_COLOR: Record<FeeStatus, string> = {
  "Paid":                 "bg-emerald-50 text-emerald-600",
  "Unpaid":               "bg-red-50 text-red-600",
  "Partial":              "bg-amber-50 text-amber-600",
  "Pending for Approval": "bg-blue-50 text-blue-600",
};

const ACCEPTED_TYPES = [".pdf", ".jpg", ".jpeg"];

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function computeTotals(data: InvoiceData) {
  const rawTotal    = data.services.reduce((a, x) => a + x.rate * x.duration, 0);
  const discountAmt = rawTotal * Math.min(100, Math.max(0, data.discount)) / 100;
  const subtotal    = Math.max(0, rawTotal - discountAmt);
  const isInterState = !!data.state && data.state !== FIRM.state;
  const cgst  = data.gstEnabled && !isInterState ? subtotal * 0.09 : 0;
  const sgst  = data.gstEnabled && !isInterState ? subtotal * 0.09 : 0;
  const igst  = data.gstEnabled && isInterState  ? subtotal * 0.18 : 0;
  const total = subtotal + cgst + sgst + igst;
  return { subtotal, cgst, sgst, igst, total, isInterState };
}

function PaymentProofCell({ sheet, isAdmin, onOpenUpload, onApprove }: {
  sheet: FeeSheet;
  isAdmin: boolean;
  onOpenUpload: (sheet: FeeSheet) => void;
  onApprove: (sheetId: number, paymentId: number) => void;
}) {
  const paid    = getPaidAmount(sheet);
  const pending = getPendingAmount(sheet);

  return (
    <div className="space-y-1.5 min-w-[170px]">
      <div className="flex items-center gap-2 text-[10px] font-semibold">
        <span className="text-emerald-600">Paid {fmtINR(paid)}</span>
        {pending > 0 && <span className="text-red-500">Due {fmtINR(pending)}</span>}
      </div>

      {sheet.payments.length > 0 && (
        <div className="space-y-1">
          {sheet.payments.map(p => (
            <div key={p.id} className="flex items-center justify-between gap-1.5 text-[10px] bg-slate-50 rounded-lg px-1.5 py-1">
              <div className="flex items-center gap-1 min-w-0">
                {p.dataUrl ? (
                  <a href={p.dataUrl} download={p.fileName} target="_blank" rel="noreferrer"
                    title="View / download payment proof" className="text-blue-600 hover:text-blue-800 shrink-0">
                    <Paperclip size={10} />
                  </a>
                ) : <Paperclip size={10} className="text-slate-300 shrink-0" />}
                <span className="text-slate-700 font-semibold whitespace-nowrap">{fmtINR(p.amount)}</span>
                <span className="text-slate-400 truncate">{p.uploadedAt}</span>
              </div>
              {p.status === "Approved" ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5 shrink-0"><CheckCircle2 size={10} /></span>
              ) : isAdmin ? (
                <button onClick={() => onApprove(sheet.id, p.id)}
                  className="text-blue-600 hover:text-blue-800 font-bold shrink-0">Approve</button>
              ) : (
                <span className="text-blue-500 font-semibold shrink-0">Pending</span>
              )}
            </div>
          ))}
        </div>
      )}

      {pending > 0 && (
        <button onClick={() => onOpenUpload(sheet)}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-blue-600 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors border border-dashed border-slate-300 hover:border-blue-300">
          <Upload size={12} /> Payment Photo
        </button>
      )}
    </div>
  );
}

function PaymentUploadModal({ sheet, onClose, onSubmit }: {
  sheet: FeeSheet | null;
  onClose: () => void;
  onSubmit: (sheetId: number, amount: number, fileName: string, dataUrl: string) => void;
}) {
  const [file, setFile]       = useState<File | null>(null);
  const [amount, setAmount]   = useState("");
  const [error, setError]     = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (sheet) { setFile(null); setAmount(String(getPendingAmount(sheet))); setError(""); setSaving(false); }
  }, [sheet]);

  if (!sheet) return null;
  const pending = getPendingAmount(sheet);

  const handleFile = (f: File) => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(ext)) { setError("Only PDF, JPG or JPEG files are allowed"); return; }
    setError("");
    setFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!file)              { setError("Please attach a payment photo or PDF"); return; }
    if (!amt || amt <= 0)   { setError("Enter a valid amount"); return; }
    if (amt > pending + 0.5) { setError(`Amount can't exceed the pending balance of ${fmtINR(pending)}`); return; }
    setSaving(true);
    const reader = new FileReader();
    reader.onload = () => { onSubmit(sheet.id, amt, file.name, reader.result as string); onClose(); };
    reader.readAsDataURL(file);
  };

  return (
    <AdminModal open onClose={onClose} title={`Record Payment — ${sheet.no}`} size="sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 py-2">
            <div className="text-sm font-bold text-slate-800">{fmtINR(sheet.amount)}</div>
            <div className="text-[10px] text-slate-400">Total</div>
          </div>
          <div className="rounded-lg bg-emerald-50 py-2">
            <div className="text-sm font-bold text-emerald-700">{fmtINR(getPaidAmount(sheet))}</div>
            <div className="text-[10px] text-emerald-500">Paid</div>
          </div>
          <div className="rounded-lg bg-red-50 py-2">
            <div className="text-sm font-bold text-red-600">{fmtINR(pending)}</div>
            <div className="text-[10px] text-red-400">Pending</div>
          </div>
        </div>

        <FLabel required>Payment Photo / PDF</FLabel>
        <input type="file" accept=".pdf,.jpg,.jpeg"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
            file:bg-blue-50 file:text-blue-600 file:text-xs file:font-semibold hover:file:bg-blue-100 mb-3" />
        {file && <p className="text-[11px] text-slate-500 mb-3 -mt-2">Selected: {file.name}</p>}

        <FLabel required>How much amount do you want to update?</FLabel>
        <FInput type="number" value={amount} onChange={setAmount} placeholder={String(pending)} />
        <p className="text-[10px] text-slate-400 mt-1">Pending balance: {fmtINR(pending)}</p>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

        <FSubmit label={saving ? "Saving…" : "Save Payment"} onCancel={onClose} />
      </form>
    </AdminModal>
  );
}

function FeeSheetContent() {
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
  const [downloadSheet, setDownloadSheet] = useState<FeeSheet | null>(null);
  const [downloading, setDownloading]     = useState(false);
  const [uploadSheet, setUploadSheet]     = useState<FeeSheet | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setSheets(getFeeSheets()); }, []);

  // Advance workflow stage when arriving from a lead
  useEffect(() => {
    if (leadId) {
      const wf = getWorkflowState()[leadId];
      if (!wf || wf.stage < 1) setLeadWorkflow(leadId, { stage: 1 });
    }
  }, [leadId]);

  const handleSaved = (saved: SavedFeeSheet, markComplete?: boolean) => {
    const newSheet: FeeSheet = {
      id:          Date.now(),
      no:          saved.no,
      leadId:      saved.leadId,
      leadName:    saved.leadName,
      client:      saved.client,
      date:        new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }),
      services:    saved.services,
      amount:      saved.amount,
      status:      "Unpaid",
      paidDate:    "—",
      createdBy:   user?.name ?? "Unknown",
      invoiceData: saved.invoiceData,
      payments:    [],
    };
    setSheets(addFeeSheet(newSheet));

    if (markComplete && leadId) {
      setLeadWorkflow(leadId, { stage: 2, feeSheetNo: saved.no });
    }
  };

  const handleRecordPayment = (sheetId: number, amount: number, fileName: string, dataUrl: string) => {
    setSheets(addPaymentRecord(sheetId, amount, fileName, dataUrl));
  };

  const handleApprovePayment = (sheetId: number, paymentId: number) => {
    if (!user) return;
    setSheets(approvePaymentRecord(sheetId, paymentId, user.name));
  };

  const handleDownloadRow = async (sheet: FeeSheet) => {
    if (!sheet.invoiceData || downloading) return;
    setDownloadSheet(sheet);
    setDownloading(true);
    await new Promise(r => setTimeout(r, 50));
    if (!previewRef.current) { setDownloading(false); setDownloadSheet(null); return; }
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { default: jsPDF } = await import("jspdf");
      const canvas  = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf     = new jsPDF("p", "mm", "a4");
      const pdfW    = pdf.internal.pageSize.getWidth();
      const pdfH    = (canvas.height * pdfW) / canvas.width;
      const pageH   = pdf.internal.pageSize.getHeight();
      let left = pdfH, y = 0;
      pdf.addImage(imgData, "PNG", 0, y, pdfW, pdfH);
      left -= pageH;
      while (left > 0) { y = left - pdfH; pdf.addPage(); pdf.addImage(imgData, "PNG", 0, y, pdfW, pdfH); left -= pageH; }
      pdf.save(`${sheet.no || "fee-sheet"}.pdf`);
    } catch (e) { console.error(e); }
    finally { setDownloading(false); setDownloadSheet(null); }
  };

  const filtered = sheets.filter(s =>
    (statusF === "All" || s.status === statusF) &&
    (s.client.toLowerCase().includes(search.toLowerCase()) ||
     s.no.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRev = sheets.reduce((a, i) => a + getPaidAmount(i), 0);
  const totalOut = sheets.reduce((a, i) => a + getPendingAmount(i), 0);
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
                  Step 2 of 2 — Generate Fee Sheet for <span className="underline underline-offset-2">{leadName}</span>
                </p>
                <p className="text-xs text-blue-600 mt-0.5">Fill in the fee sheet details below, then save to mark this lead complete.</p>
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
        <p className="text-sm text-slate-500">Manage fee invoices — step 2 in the Lead → Fee Sheet workflow</p>
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
                    <PaymentProofCell sheet={inv} isAdmin={isAdmin} onOpenUpload={setUploadSheet} onApprove={handleApprovePayment} />
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDownloadRow(inv)}
                      disabled={!inv.invoiceData || (downloading && downloadSheet?.id === inv.id)}
                      title={inv.invoiceData ? "Download PDF" : "PDF not available for this record"}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent">
                      <Download size={13} />
                    </button>
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
      </div>

      {/* Hidden off-screen preview used to render PDFs for the Download action */}
      {downloadSheet?.invoiceData && (
        <div className="fixed -left-[9999px] top-0" style={{ width: 800 }}>
          <InvoicePreview ref={previewRef} data={downloadSheet.invoiceData} {...computeTotals(downloadSheet.invoiceData)} />
        </div>
      )}

      {/* ── Record Payment Modal ── */}
      <PaymentUploadModal sheet={uploadSheet} onClose={() => setUploadSheet(null)} onSubmit={handleRecordPayment} />

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
