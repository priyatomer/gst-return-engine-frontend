"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Upload, FileText, File, FolderOpen, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getWorkflowState, setLeadWorkflow } from "@/lib/workflowState";

const ALL_DOCS = [
  { id: 1,  name: "GSTR-1 Jun 2026 — Jain Textiles.pdf",         client: "Jain Textiles",         leadId: undefined, type: "PDF",   size: "284 KB", category: "GST Return",    uploadedBy: "Priya", date: "09 Jun 2026" },
  { id: 2,  name: "GSTR-3B Jun 2026 — Jain Textiles.pdf",        client: "Jain Textiles",         leadId: undefined, type: "PDF",   size: "142 KB", category: "GST Return",    uploadedBy: "Priya", date: "18 Jun 2026" },
  { id: 3,  name: "SCN Reply — Sharma Enterprises.pdf",           client: "Sharma Enterprises",    leadId: undefined, type: "PDF",   size: "518 KB", category: "Notice",        uploadedBy: "Amit",  date: "30 Jun 2026" },
  { id: 4,  name: "Balance Sheet FY25-26 — Agarwal & Sons.xlsx",  client: "Agarwal & Sons",        leadId: undefined, type: "XLSX",  size: "1.2 MB", category: "Balance Sheet", uploadedBy: "Neha",  date: "28 Jun 2026" },
  { id: 5,  name: "MSME Certificate — Mohan Lal.pdf",             client: "Mohan Lal",             leadId: 5,         type: "PDF",   size: "128 KB", category: "Registration",  uploadedBy: "Priya", date: "26 Jun 2026" },
  { id: 6,  name: "Aadhaar & PAN — Mohan Lal.pdf",               client: "Mohan Lal",             leadId: 5,         type: "PDF",   size: "204 KB", category: "KYC",           uploadedBy: "Priya", date: "26 Jun 2026" },
  { id: 7,  name: "Bank Statement — Mohan Lal.pdf",               client: "Mohan Lal",             leadId: 5,         type: "PDF",   size: "360 KB", category: "Bank Recon",    uploadedBy: "Priya", date: "26 Jun 2026" },
  { id: 8,  name: "Company Docs — Vikram Singhania.pdf",          client: "Vikram Singhania",      leadId: 3,         type: "PDF",   size: "680 KB", category: "Registration",  uploadedBy: "Amit",  date: "29 Jun 2026" },
  { id: 9,  name: "Tax Audit Report FY25-26 — Verma Pharma.pdf",  client: "Verma Pharma",          leadId: undefined, type: "PDF",   size: "3.4 MB", category: "Audit",         uploadedBy: "Neha",  date: "15 Jun 2026" },
  { id: 10, name: "Bank Statement May 2026 — Yadav Transport.pdf",client: "Yadav Transport",       leadId: undefined, type: "PDF",   size: "768 KB", category: "Bank Recon",    uploadedBy: "Neha",  date: "12 Jun 2026" },
  { id: 11, name: "DSC Documents — Deepa Singh.pdf",              client: "Deepa Singh",           leadId: 10,        type: "PDF",   size: "255 KB", category: "KYC",           uploadedBy: "Amit",  date: "16 Jun 2026" },
  { id: 12, name: "Invoice BC-GST-2606-089.pdf",                  client: "Rajasthan Traders",     leadId: undefined, type: "PDF",   size: "88 KB",  category: "Invoice",       uploadedBy: "Priya", date: "30 Jun 2026" },
];

const LEAD_NAMES: Record<number, string> = {
  3:  "Vikram Singhania",
  4:  "Anita Chaudhary",
  5:  "Mohan Lal",
  10: "Deepa Singh",
};

const CATEGORIES = ["All","GST Return","Notice","Balance Sheet","KYC","Registration","Audit","Bank Recon","Invoice"];

const fileIcon = (type: string) => {
  if (type === "XLSX") return <File size={14} className="text-emerald-500" />;
  return <FileText size={14} className="text-blue-500" />;
};

function DocumentsContent() {
  const params      = useSearchParams();
  const leadId      = params.get("leadId") ? Number(params.get("leadId")) : null;
  const leadName    = params.get("name") ?? "";
  const feeSheetNo  = params.get("feeSheet") ?? "";

  const [search, setSearch] = useState("");
  const [catF, setCatF]     = useState("All");
  const [docs, setDocs]     = useState(ALL_DOCS);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    if (leadId) {
      const wf = getWorkflowState()[leadId];
      if (wf && wf.stage < 2) setLeadWorkflow(leadId, { stage: 2 });
    }
  }, [leadId]);

  const filtered = docs.filter(d =>
    (catF === "All" || d.category === catF) &&
    (!leadId || d.leadId === leadId) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) ||
     d.client.toLowerCase().includes(search.toLowerCase()))
  );

  const handleMarkComplete = () => {
    if (leadId) {
      setLeadWorkflow(leadId, { stage: 3, docsCount: filtered.length });
      setMarked(true);
    }
  };

  const handleSimulateUpload = () => {
    if (!leadId) return;
    const newDoc = {
      id: docs.length + 1,
      name: `Document for ${leadName} — ${new Date().toLocaleDateString("en-IN")}.pdf`,
      client: leadName,
      leadId,
      type: "PDF",
      size: `${Math.floor(Math.random() * 900 + 100)} KB`,
      category: "KYC",
      uploadedBy: "You",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setDocs(prev => [newDoc, ...prev]);
    setLeadWorkflow(leadId, { docsCount: (getWorkflowState()[leadId]?.docsCount ?? 0) + 1 });
  };

  return (
    <div className="space-y-5">
      {/* Lead context banner */}
      {leadId && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-violet-800">
                Workflow: Documents step for <span className="underline">{leadName}</span>
              </p>
              {feeSheetNo && (
                <p className="text-xs text-violet-600 mt-0.5">Fee Sheet: <span className="font-mono font-semibold">{feeSheetNo}</span></p>
              )}
              <p className="text-xs text-violet-600 mt-1">Upload all required documents below, then mark the workflow as complete.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/admin/fee-sheet?leadId=${leadId}&name=${encodeURIComponent(leadName)}`}
                className="flex items-center gap-1 text-xs text-violet-700 hover:text-violet-900 font-semibold">
                <ArrowLeft size={12} /> Fee Sheet
              </Link>
              {!marked ? (
                <button onClick={handleMarkComplete}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                  <CheckCircle size={12} /> Mark Complete
                </button>
              ) : (
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                  <CheckCircle size={12} /> Workflow Complete!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {leadId ? `Showing documents for: ${leadName}` : "Store and manage client documents — step 3 in the workflow"}
        </p>
        <button onClick={leadId ? handleSimulateUpload : undefined}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Upload size={15} /> Upload Document
        </button>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCatF(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all
              ${catF === c ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"}`}>
            {c}
          </button>
        ))}
        {leadId && (
          <Link href="/admin/documents"
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-violet-600 border border-violet-200 bg-violet-50 hover:bg-violet-100 transition-colors ml-auto">
            View All Documents
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents or clients…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
        <span className="flex items-center text-xs text-slate-500">{filtered.length} files</span>
      </div>

      {/* Document grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <Upload size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No documents yet</p>
          {leadId && (
            <p className="text-xs text-slate-400 mt-1">Click &quot;Upload Document&quot; to add documents for {leadName}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(d => (
            <div key={d.id}
              className={`bg-white rounded-2xl border shadow-sm p-4 hover:shadow-md transition-all cursor-pointer group
                ${d.leadId === leadId && leadId ? "border-violet-200 bg-violet-50/30" : "border-slate-100 hover:border-blue-100"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                  ${d.leadId === leadId && leadId ? "bg-violet-100 border border-violet-200" : "bg-slate-50 border border-slate-100 group-hover:border-blue-200"}`}>
                  {fileIcon(d.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate leading-snug">{d.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <FolderOpen size={9} />
                    <span className="truncate">{d.client}</span>
                  </div>
                  {d.leadId && (
                    <div className="text-[10px] text-violet-500 mt-0.5">
                      Lead: {LEAD_NAMES[d.leadId] ?? `#${d.leadId}`}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{d.category}</span>
                <div className="text-[10px] text-slate-400">{d.size} · {d.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workflow footer */}
      <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
        <span className="font-semibold text-slate-700">Workflow:</span>
        <Link href="/admin/leads" className="text-blue-600 hover:underline font-medium">1. Leads</Link>
        <ArrowRight size={11} />
        <Link href="/admin/fee-sheet" className="text-blue-600 hover:underline font-medium">2. Fee Sheet</Link>
        <ArrowRight size={11} />
        <span className="font-semibold text-slate-700">3. Documents</span>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-40"><div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" /></div>}>
      <DocumentsContent />
    </Suspense>
  );
}
