"use client";

import React, { useState, useRef, useCallback, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus, Trash2, Download, Eye, FileText, User,
  IndianRupee, ChevronDown, AlertCircle,
  Loader2, ArrowLeft, StickyNote,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceLine {
  id: string;
  service: string;
  otherService: string;
  description: string;
  periodFrom: string;
  periodTo: string;
  duration: number;
  rate: number;
}

interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  financialYear: string;
  turnover: string;
  gstEnabled: boolean;
  clientName: string;
  gstin: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
  services: ServiceLine[];
  discount: number;
  notes: string;
}

type Errors = Record<string, string>;

// ─── Constants ────────────────────────────────────────────────────────────────

const FIRM = {
  name: "Bhandari & Company",
  tagline: "GST Filing & Business Services",
  gstin: "08EWEPB8031A1Z2",
  address: "D-52, Saket Colony Adarsh Nagar, Opp Jain Mandir, Jawahar Nagar, Jaipur, Rajasthan - 302004",
  stateInfo: "State Name: Rajasthan, Code: 08",
  phone: "+91 77377 400224",
  email: "Bhandariandcompanygroup@gmail.com",
  state: "Rajasthan",
};

const GST_RATE = 18;

const GST_SERVICES = [
  "Digital Signature Certificate",
  "Trade Mark Registration",
  "Copyright Registration",
  "MSME Registration",
  "Import-Export Code (IEC) Registration",
  "Company Registration",
  "GST Registration",
  "Partnership Firm Registration",
  "FSSAI Registration",
  "TDS Refund",
  "ITR Filing",
  "GSTR-1 Filing",
  "GSTR-3B Filing",
  "GSTR-1 & GSTR-3B (Combined)",
  "GSTR-9 Annual Return",
  "GSTR-9C Reconciliation Statement",
  "ROC Filing",
  "GST Filing",
  "Balance Sheet (Firm / Personal)",
  "Company Balance Sheet",
  "Projected Balance Sheet",
  "Estimated Balance Sheet",
  "Tax Audit",
  "GST Audit",
  "Bank Reconciliation",
  "Notice Reply",
  "GST Amendment",
  "GST Refund Claim",
  "GST Advisory Services",

  // Whole Packages
  "GST Compliance",
  "Composition GST Compliance",
  "ITR, AUDIT & BR",
  "Cancellation (upto 2 cr)",
  "Cancellation (more than 2 cr)",
  "ITR 1 & BR",
  "ITR 2 & BR",
  "ITR 3 & BR",
  "ITR 4 & BR",
  "ITR 5 & BR",
  "ITR 6 & BR",
  "ITR 7 & BR",
  "Defective ITR & BR",

  // Regular Packages
  "TDS Compliance",
  "Annual GST Returns",
  "ANNUAL ONLY ITR",
  "Annual LLP ROC Compliance",
  "Annual PVT LTD ROC Compliance",
  "Digital Signature",
  "SECTION 8 Company (Without Challan, Travelling Allowance & Printing expenses)",
  "Annual ROC compliance OPC",

  // Incidental Services
  "PAN",
  "Trademark",
  "Registration Pvt. Ltd.",
  "Registration LLP",
  "TAN",
  "Udyog Aadhar",
  "IEC Card",
  "State Tax License",
  "Income Certificate",
  "GST Revocation (up to 2 cr)",
  "GST Revocation (more than 2 cr)",
  "Solvency Certificate",
  "Partnership Registration",
  "Additional Service Sale Purchases Recon",
  "Sales bill Generation",
  "Composition to Regular GST",
  "Regular GST to Composition GST",
  "Professional Tax Registration",
  "Invoice Clearance",
  "Notice Adjournment application",
  "Hosting Service",
  "Notice Reply (One Reply Only)",
  "CIT APPEAL ONLY",
  "Customization",

  "Other",
];

const TURNOVER_RANGES = [
  "From INR 0 To 5 Lakh",
  "From INR 5 Lakh To 10 Lakh",
  "From INR 10 Lakh To 20 Lakh",
  "From INR 20 Lakh To 40 Lakh",
  "From INR 40 Lakh To 75 Lakh",
  "From INR 75 Lakh To 1 Crore",
  "From INR 1 Crore To 2 Crore",
  "From INR 2 Crore To 5 Crore",
  "From INR 5 Crore To 10 Crore",
  "Above INR 10 Crore",
];

const FINANCIAL_YEARS = ["2023-24", "2024-25", "2025-26", "2026-27"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh",
  "Chandigarh", "Puducherry", "Andaman & Nicobar Islands",
  "Dadra & Nagar Haveli and Daman & Diu", "Lakshadweep",
];

// ─── Validators ───────────────────────────────────────────────────────────────

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_RE   = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PIN_RE   = /^\d{6}$/;

function validate(data: InvoiceData): Errors {
  const e: Errors = {};
  if (!data.invoiceNo.trim())  e.invoiceNo  = "Invoice number is required";
  if (!data.invoiceDate)       e.invoiceDate = "Invoice date is required";
  if (!data.clientName.trim()) e.clientName  = "Client name is required";
  if (data.gstin   && !GSTIN_RE.test(data.gstin))  e.gstin   = "Invalid GSTIN (e.g. 22AAAAA0000A1Z5)";
  if (data.pan     && !PAN_RE.test(data.pan))       e.pan     = "Invalid PAN (e.g. AAAAA0000A)";
  if (data.email   && !EMAIL_RE.test(data.email))   e.email   = "Invalid email address";
  if (data.phone   && !PHONE_RE.test(data.phone))   e.phone   = "10-digit mobile starting with 6–9";
  if (data.pincode && !PIN_RE.test(data.pincode))   e.pincode = "Pincode must be 6 digits";
  if (data.services.length === 0) e.services = "Add at least one service line";
  data.services.forEach((s, i) => {
    if (!s.service) e[`svc_name_${i}`] = "Select a service";
    if (s.service === "Other" && !s.otherService.trim()) e[`svc_other_${i}`] = "Please specify the service name";
    if (s.rate <= 0)     e[`svc_rate_${i}`] = "Enter a valid rate (> 0)";
    if (s.duration <= 0) e[`svc_dur_${i}`]  = "Duration must be ≥ 1";
  });
  return e;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const genId  = () => Math.random().toString(36).slice(2, 9);
const today  = () => new Date().toISOString().split("T")[0];
const autoNo = () => {
  const d = new Date();
  return `BC-GST-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 900) + 100)}`;
};

const fmtINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(n);

const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

// Handles YYYY-MM (month picker) → MM/YYYY, and YYYY-MM-DD → DD/MM/YYYY
const fmtDateShort = (d: string) => {
  if (!d) return "";
  if (/^\d{4}-\d{2}$/.test(d)) {
    const [year, month] = d.split("-");
    return `${month}/${year}`;
  }
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};

const fmtPeriod = (from: string, to: string) => {
  if (from && to) return `${fmtDateShort(from)} – ${fmtDateShort(to)}`;
  if (from)       return fmtDateShort(from);
  return "—";
};

const newLine = (): ServiceLine => ({
  id: genId(), service: "", otherService: "", description: "",
  periodFrom: "", periodTo: "", duration: 1, rate: 0,
});

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL: InvoiceData = {
  invoiceNo: "", invoiceDate: "", financialYear: "2025-26", turnover: "", gstEnabled: true,
  clientName: "", gstin: "", pan: "",
  address: "", city: "", state: "", pincode: "", email: "", phone: "",
  services: [{ id: "svc-0", service: "", otherService: "", description: "", periodFrom: "", periodTo: "", duration: 1, rate: 0 }],
  discount: 0, notes: "",
};

// ─── Primitive UI ─────────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1 text-[11px] text-red-500 font-medium">
      <AlertCircle size={10} className="shrink-0" /> {msg}
    </p>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block mb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({
  value, onChange, error, placeholder, type = "text", readOnly, className = "",
}: {
  value: string | number; onChange?: (v: string) => void;
  error?: string; placeholder?: string; type?: string;
  readOnly?: boolean; className?: string;
}) {
  const base = `w-full px-3 py-2 text-sm rounded-lg border outline-none transition-all duration-200 ${className}`;
  const cls = readOnly
    ? "border-slate-200 bg-slate-50 text-slate-500 cursor-default"
    : error
      ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100 focus:border-red-400"
      : "border-slate-200 bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400";
  return (
    <>
      <input type={type} value={value} readOnly={readOnly} placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)} className={`${base} ${cls}`} />
      <FieldError msg={error} />
    </>
  );
}

function SelectInput({
  value, onChange, options, placeholder, error, className = "",
}: {
  value: string; onChange: (v: string) => void; options: string[];
  placeholder?: string; error?: string; className?: string;
}) {
  return (
    <>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-lg border appearance-none outline-none transition-all duration-200
            ${error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400"}
            ${className}`}>
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      <FieldError msg={error} />
    </>
  );
}

function Card({ title, icon, children, delay = 0 }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-slate-50 to-sky-50/60 border-b border-slate-100">
        <span className="text-sky-500">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function AmountBadge({ value, color = "sky" }: { value: number; color?: "sky" | "green" }) {
  const cls = color === "green"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-sky-50 text-sky-700 border-sky-200";
  return <div className={`px-3 py-2 text-sm rounded-lg border font-semibold ${cls}`}>{fmtINR(value)}</div>;
}

function TaxRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-sm text-slate-600">
      <span>{label}</span>
      <span className="font-semibold">{fmtINR(value)}</span>
    </div>
  );
}

// ─── Invoice Preview ──────────────────────────────────────────────────────────

interface PreviewProps {
  data: InvoiceData;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  isInterState: boolean;
}

const InvoicePreview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ data, subtotal, cgst, sgst, igst, total, isInterState }, ref) => {
    const svcDisplayName = (s: ServiceLine) =>
      s.service === "Other" && s.otherService ? s.otherService : s.service || "—";

    return (
      <div ref={ref}
        style={{ fontFamily: "'Inter','Segoe UI',sans-serif", backgroundColor: "#fff", color: "#0f172a", minWidth: 600 }}
        className="p-8">

        {/* Header: Logo + Invoice title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <svg width="220" height="56" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pg1" x1="24" y1="11" x2="24" y2="69" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#18D8F5"/>
                <stop offset="48%"  stopColor="#4B6CF7"/>
                <stop offset="100%" stopColor="#7B2FEE"/>
              </linearGradient>
              <linearGradient id="pg2" x1="178" y1="0" x2="248" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%"   stopColor="#4B6CF7"/>
                <stop offset="100%" stopColor="#7B2FEE"/>
              </linearGradient>
            </defs>
            {/* Left vertical bar */}
            <line x1="24" y1="11" x2="24" y2="69" stroke="url(#pg1)" strokeWidth="12" strokeLinecap="round"/>
            {/* Upper D-bump */}
            <path d="M 24,11 A 21,14 0 0,1 24,39" fill="none" stroke="url(#pg1)" strokeWidth="10.5" strokeLinecap="round"/>
            {/* Lower D-bump (wider) */}
            <path d="M 24,39 A 27,15 0 0,1 24,69" fill="none" stroke="url(#pg1)" strokeWidth="11.5" strokeLinecap="round"/>
            {/* Diagonal arrow */}
            <line x1="9" y1="75" x2="63" y2="11" stroke="#4B6CF7" strokeWidth="7.5" strokeLinecap="round"/>
            <polygon fill="#4B6CF7" points="67,7 63,23 52,14"/>
            {/* Wordmark */}
            <text fontFamily="'Inter','Segoe UI',sans-serif" fontSize="22" fontWeight="700" letterSpacing="-0.3">
              <tspan x="78" y="39" fill="#1E293B">Bhandari</tspan>
              <tspan fill="url(#pg2)"> &amp; Company</tspan>
            </text>
            <text x="78" y="57" fontFamily="'Inter','Segoe UI',sans-serif" fontSize="9.5" fontWeight="500" fill="#94A3B8" letterSpacing="2">GST FILING · BUSINESS SERVICES</text>
          </svg>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>
              {data.gstEnabled ? "TAX INVOICE" : "INVOICE"}
            </div>
            {data.gstEnabled && (
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>GSTIN: {FIRM.gstin}</div>
            )}
          </div>
        </div>

        {/* Address strip */}
        <div style={{ background: "linear-gradient(135deg,#0ea5e9,#3b82f6)", borderRadius: 10, padding: "10px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", letterSpacing: "0.5px", lineHeight: 1.6 }}>
            {FIRM.address} &nbsp;|&nbsp; {FIRM.stateInfo} &nbsp;|&nbsp; {FIRM.phone} &nbsp;|&nbsp; {FIRM.email}
          </div>
        </div>

        {/* Bill To + Invoice Meta */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Bill To</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{data.clientName || "—"}</div>
            {data.address && <div style={{ fontSize: 11, color: "#475569" }}>{data.address}</div>}
            {(data.city || data.state) && (
              <div style={{ fontSize: 11, color: "#475569" }}>
                {[data.city, data.state, data.pincode].filter(Boolean).join(", ")}
              </div>
            )}
            {data.gstin && <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>GSTIN: <b>{data.gstin}</b></div>}
            {data.pan   && <div style={{ fontSize: 11, color: "#475569" }}>PAN: <b>{data.pan}</b></div>}
            {data.phone && <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>Ph: {data.phone}</div>}
            {data.email && <div style={{ fontSize: 11, color: "#475569" }}>{data.email}</div>}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>Invoice Details</div>
            {([
              ["Invoice No.",    data.invoiceNo || "—"],
              ["Invoice Date",   fmtDate(data.invoiceDate) || "—"],
              ["Financial Year", data.financialYear],
              ...(data.turnover ? [["Turnover", data.turnover]] as [string, string][] : []),
              ["Tax Type",       data.gstEnabled
                ? (isInterState ? "IGST (Inter-State)" : "CGST + SGST (Intra-State)")
                : "Non-GST"],
            ] as [string, string][]).map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#475569", marginBottom: 3 }}>
                <span style={{ color: "#64748b" }}>{k}</span>
                <span style={{ fontWeight: 600, color: "#1e293b" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "4%" }}/>
            <col style={{ width: "22%" }}/>
            <col style={{ width: "24%" }}/>
            <col style={{ width: "20%" }}/>
            <col style={{ width: "6%" }}/>
            <col style={{ width: "12%" }}/>
            <col style={{ width: "12%" }}/>
          </colgroup>
          <thead>
            <tr style={{ background: "linear-gradient(135deg,#0f172a,#1e3a5f)" }}>
              {["#", "Service", "Description", "Period", "Dur.", "Rate (₹)", "Amount (₹)"].map(h => (
                <th key={h} style={{
                  padding: h === "Period" ? "9px 6px" : "9px 10px",
                  textAlign: (h === "#" || h === "Dur.") ? "center" : h.includes("₹") ? "right" : "left",
                  fontSize: 10, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.5px",
                  textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.services.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 12 }}>
                  No services added yet
                </td>
              </tr>
            ) : data.services.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "10px", textAlign: "center", fontSize: 11, color: "#64748b" }}>{i + 1}</td>
                <td style={{ padding: "10px", fontSize: 12, fontWeight: 600, color: "#1e293b", wordBreak: "break-word" }}>{svcDisplayName(s)}</td>
                <td style={{ padding: "10px", fontSize: 11, color: "#475569", wordBreak: "break-word", overflowWrap: "break-word" }}>
                  {s.service === "Other" ? "—" : (s.description || "—")}
                </td>
                <td style={{ padding: "8px 6px", fontSize: 10, color: "#475569", whiteSpace: "nowrap" }}>{fmtPeriod(s.periodFrom, s.periodTo)}</td>
                <td style={{ padding: "10px 6px", textAlign: "center", fontSize: 12, color: "#1e293b" }}>{s.duration}</td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: 12, color: "#1e293b" }}>{fmtINR(s.rate)}</td>
                <td style={{ padding: "10px", textAlign: "right", fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{fmtINR(s.rate * s.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
          <div style={{ minWidth: 280 }}>
            {(() => {
              const rt = data.services.reduce((acc, x) => acc + x.rate * x.duration, 0);
              const da = rt * data.discount / 100;
              return ([
                { label: "Subtotal", value: rt },
                ...(data.discount > 0 ? [{ label: `Discount (${data.discount}%)`, value: -da }] : []),
                { label: "Taxable Amount", value: subtotal },
              ] as { label: string; value: number }[]);
            })().map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", fontSize: 12, color: "#475569" }}>
                <span>{label}</span>
                <span style={{ fontWeight: 600 }}>{value < 0 ? `- ${fmtINR(Math.abs(value))}` : fmtINR(value)}</span>
              </div>
            ))}
            {data.gstEnabled && (
              <>
                <div style={{ borderTop: "1px solid #e2e8f0", margin: "6px 0" }} />
                {isInterState ? (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", fontSize: 12, color: "#475569" }}>
                    <span>IGST @ {GST_RATE}%</span>
                    <span style={{ fontWeight: 600 }}>{fmtINR(igst)}</span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", fontSize: 12, color: "#475569" }}>
                      <span>CGST @ {GST_RATE / 2}%</span>
                      <span style={{ fontWeight: 600 }}>{fmtINR(cgst)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 12px", fontSize: 12, color: "#475569" }}>
                      <span>SGST @ {GST_RATE / 2}%</span>
                      <span style={{ fontWeight: 600 }}>{fmtINR(sgst)}</span>
                    </div>
                  </>
                )}
              </>
            )}
            <div style={{ background: "linear-gradient(135deg,#0ea5e9,#3b82f6)", borderRadius: 8, margin: "8px 0 0", padding: "10px 12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{fmtINR(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {data.notes && (
          <div style={{ background: "#fffbeb", borderRadius: 10, padding: "12px 16px", marginBottom: 20, border: "1px solid #fde68a" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>Notes</div>
            <div style={{ fontSize: 11, color: "#78350f", lineHeight: 1.6 }}>{data.notes}</div>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 10, color: "#94a3b8" }}>This is a computer-generated invoice.</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>For Bhandari &amp; Company</div>
        </div>
      </div>
    );
  }
);
InvoicePreview.displayName = "InvoicePreview";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FeeSheetClient() {
  const [data, setData]             = useState<InvoiceData>(INITIAL);
  const [errors, setErrors]         = useState<Errors>({});
  const [touched, setTouched]       = useState(false);
  const [generating, setGenerating] = useState(false);
  const previewRef                  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(prev => ({ ...prev, invoiceNo: autoNo(), invoiceDate: today() }));
  }, []);

  const rawTotal      = data.services.reduce((acc, x) => acc + x.rate * x.duration, 0);
  const discountAmt   = rawTotal * Math.min(100, Math.max(0, data.discount)) / 100;
  const subtotal      = Math.max(0, rawTotal - discountAmt);
  const isInterState = !!data.state && data.state !== FIRM.state;
  const cgst         = (data.gstEnabled && !isInterState) ? subtotal * 0.09 : 0;
  const sgst         = (data.gstEnabled && !isInterState) ? subtotal * 0.09 : 0;
  const igst         = (data.gstEnabled && isInterState)  ? subtotal * 0.18 : 0;
  const total        = subtotal + cgst + sgst + igst;

  const set = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData(prev => {
      const next = { ...prev, [key]: value };
      if (touched) setErrors(validate(next));
      return next;
    });
  }, [touched]);

  const setLine = useCallback((id: string, key: keyof ServiceLine, value: string | number) => {
    setData(prev => {
      const next = { ...prev, services: prev.services.map(s => s.id === id ? { ...s, [key]: value } : s) };
      if (touched) setErrors(validate(next));
      return next;
    });
  }, [touched]);

  const setPeriod = useCallback((id: string, field: "periodFrom" | "periodTo", value: string) => {
    setData(prev => {
      const services = prev.services.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: value };
        const from = field === "periodFrom" ? value : s.periodFrom;
        const to   = field === "periodTo"   ? value : s.periodTo;
        if (from && to) {
          const [fy, fm] = from.split("-").map(Number);
          const [ty, tm] = to.split("-").map(Number);
          updated.duration = Math.max(1, (ty - fy) * 12 + (tm - fm) + 1);
        }
        return updated;
      });
      const next = { ...prev, services };
      if (touched) setErrors(validate(next));
      return next;
    });
  }, [touched]);

  const addLine    = () => setData(prev => ({ ...prev, services: [...prev.services, newLine()] }));
  const removeLine = (id: string) => setData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));

  const handleDownload = async () => {
    const errs = validate(data);
    if (Object.keys(errs).length) {
      setErrors(errs); setTouched(true);
      document.getElementById("form-top")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!previewRef.current) return;
    setGenerating(true);
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
      while (left > 0) {
        y = left - pdfH; pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, y, pdfW, pdfH);
        left -= pageH;
      }
      pdf.save(`${data.invoiceNo || "fee-sheet"}.pdf`);
    } catch (err) {
      console.error("PDF error", err);
    } finally {
      setGenerating(false);
    }
  };

  const err = (key: string) => (touched && errors[key]) ? errors[key] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-white">

      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
              <ArrowLeft size={15} /> Home
            </Link>
            <div className="w-px h-5 bg-slate-200" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow">
                <FileText size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800 leading-none">GST Fee Sheet</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Invoice Generator</div>
              </div>
            </div>
          </div>
          <motion.button onClick={handleDownload} disabled={generating}
            whileHover={{ scale: generating ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg shadow-sky-200 hover:shadow-sky-300
              disabled:opacity-60 disabled:cursor-not-allowed transition-shadow">
            {generating
              ? <><Loader2 size={14} className="animate-spin" /> Generating…</>
              : <><Download size={14} /> Download PDF</>}
          </motion.button>
        </div>
      </div>

      {/* Body */}
      <div id="form-top" className="max-w-[1600px] mx-auto px-5 py-7 grid grid-cols-1 xl:grid-cols-2 gap-7">

        {/* ── LEFT: Form ── */}
        <div className="space-y-5">

          {/* Invoice Details */}
          <Card title="Invoice Details" icon={<FileText size={15} />} delay={0}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label required>Invoice No.</Label>
                <TextInput value={data.invoiceNo} onChange={v => set("invoiceNo", v)}
                  error={err("invoiceNo")} placeholder="BC-GST-2526-001" />
              </div>
              <div>
                <Label>Financial Year</Label>
                <SelectInput value={data.financialYear} onChange={v => set("financialYear", v)} options={FINANCIAL_YEARS} />
              </div>
              <div>
                <Label required>Invoice Date</Label>
                <TextInput type="date" value={data.invoiceDate} onChange={v => set("invoiceDate", v)} error={err("invoiceDate")} />
              </div>
              <div>
                <Label>Turnover</Label>
                <SelectInput value={data.turnover} onChange={v => set("turnover", v)}
                  options={TURNOVER_RANGES} placeholder="Select turnover…" />
              </div>
              <div>
                <Label>Tax Type</Label>
                <div className="flex gap-5 mt-2.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="radio" name="gstType" checked={data.gstEnabled}
                      onChange={() => set("gstEnabled", true)}
                      className="w-4 h-4 accent-sky-500" />
                    <span className="text-sm font-medium text-slate-700">GST</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="radio" name="gstType" checked={!data.gstEnabled}
                      onChange={() => set("gstEnabled", false)}
                      className="w-4 h-4 accent-sky-500" />
                    <span className="text-sm font-medium text-slate-700">Non-GST</span>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Client Info */}
          <Card title="Client Information" icon={<User size={15} />} delay={0.05}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label required>Client / Business Name</Label>
                <TextInput value={data.clientName} onChange={v => set("clientName", v)}
                  error={err("clientName")} placeholder="ABC Enterprises Pvt. Ltd." />
              </div>
              <div>
                <Label>GSTIN</Label>
                <TextInput value={data.gstin} onChange={v => set("gstin", v.toUpperCase())}
                  error={err("gstin")} placeholder="22AAAAA0000A1Z5" />
              </div>
              <div>
                <Label>PAN</Label>
                <TextInput value={data.pan} onChange={v => set("pan", v.toUpperCase())}
                  error={err("pan")} placeholder="AAAAA0000A" />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <TextInput value={data.address} onChange={v => set("address", v)} placeholder="Street, Building, Area" />
              </div>
              <div>
                <Label>City</Label>
                <TextInput value={data.city} onChange={v => set("city", v)} placeholder="City" />
              </div>
              <div>
                <Label>State</Label>
                <SelectInput value={data.state} onChange={v => set("state", v)}
                  options={INDIAN_STATES} placeholder="Select state…" />
              </div>
              <div>
                <Label>Pincode</Label>
                <TextInput value={data.pincode} onChange={v => set("pincode", v)}
                  error={err("pincode")} placeholder="302001" />
              </div>
              <div>
                <Label>Mobile</Label>
                <TextInput type="tel" value={data.phone} onChange={v => set("phone", v)}
                  error={err("phone")} placeholder="9876543210" />
              </div>
              <div className="col-span-2">
                <Label>Email</Label>
                <TextInput type="email" value={data.email} onChange={v => set("email", v)}
                  error={err("email")} placeholder="client@example.com" />
              </div>

              {data.gstEnabled && data.state && (
                <div className="col-span-2">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border
                    ${isInterState
                      ? "bg-orange-50 border-orange-200 text-orange-700"
                      : "bg-sky-50 border-sky-200 text-sky-700"}`}>
                    <span className={`w-2 h-2 rounded-full ${isInterState ? "bg-orange-400" : "bg-sky-400"}`} />
                    {isInterState
                      ? `Inter-State Supply → IGST @ ${GST_RATE}% applicable`
                      : `Intra-State Supply (${data.state}) → CGST ${GST_RATE / 2}% + SGST ${GST_RATE / 2}% applicable`}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Services */}
          <Card title="Services" icon={<IndianRupee size={15} />} delay={0.1}>
            {err("services") && <FieldError msg={err("services")} />}
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {data.services.map((svc, i) => {
                  const isOther = svc.service === "Other";
                  return (
                    <motion.div key={svc.id}
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3">

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Line #{i + 1}</span>
                        {data.services.length > 1 && (
                          <button onClick={() => removeLine(svc.id)} title="Remove"
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* Service dropdown */}
                        <div className="col-span-2">
                          <Label required>Service</Label>
                          <SelectInput value={svc.service} onChange={v => setLine(svc.id, "service", v)}
                            options={GST_SERVICES} placeholder="Select service…"
                            error={err(`svc_name_${i}`)} />
                        </div>

                        {/* Other — custom name input (mandatory) */}
                        {isOther && (
                          <div className="col-span-2">
                            <Label required>Service Name</Label>
                            <TextInput value={svc.otherService}
                              onChange={v => setLine(svc.id, "otherService", v)}
                              placeholder="Enter service name…"
                              error={err(`svc_other_${i}`)} />
                          </div>
                        )}

                        {/* Description — hidden when Other */}
                        {!isOther && (
                          <div className="col-span-2">
                            <Label>Description</Label>
                            <TextInput value={svc.description}
                              onChange={v => setLine(svc.id, "description", v)}
                              placeholder="e.g., Monthly filing for Apr 2025" />
                          </div>
                        )}

                        {/* Period From — month picker */}
                        <div>
                          <Label>Period From</Label>
                          <TextInput type="month" value={svc.periodFrom}
                            onChange={v => setPeriod(svc.id, "periodFrom", v)} />
                        </div>

                        {/* Period To — month picker */}
                        <div>
                          <Label>Period To</Label>
                          <TextInput type="month" value={svc.periodTo}
                            onChange={v => setPeriod(svc.id, "periodTo", v)} />
                        </div>

                        {/* Duration */}
                        <div>
                          <Label required>Duration (Months)</Label>
                          <TextInput type="number" value={svc.duration}
                            onChange={v => setLine(svc.id, "duration", Math.max(1, Number(v)))}
                            error={err(`svc_dur_${i}`)} placeholder="1" />
                        </div>

                        {/* Rate */}
                        <div>
                          <Label required>Rate (₹)</Label>
                          <TextInput type="number" value={svc.rate || ""}
                            onChange={v => setLine(svc.id, "rate", Math.max(0, Number(v)))}
                            error={err(`svc_rate_${i}`)} placeholder="0.00" />
                        </div>

                        {/* Amount */}
                        <div className="col-span-2">
                          <Label>Amount</Label>
                          <AmountBadge value={svc.rate * svc.duration} color="sky" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <button onClick={addLine}
                className="w-full py-3 rounded-xl border-2 border-dashed border-sky-200 text-sky-500
                  hover:border-sky-400 hover:bg-sky-50 transition-all duration-200 text-sm font-medium
                  flex items-center justify-center gap-2">
                <Plus size={15} /> Add Service Line
              </button>
            </div>

            {/* Discount + Taxable */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <Label>Discount (%)</Label>
                <TextInput type="number" value={data.discount || ""}
                  onChange={v => set("discount", Math.min(100, Math.max(0, Number(v))))} placeholder="0" />
              </div>
              <div>
                <Label>Taxable Amount</Label>
                <AmountBadge value={subtotal} color="green" />
              </div>
            </div>

            {/* Tax summary */}
            {data.gstEnabled ? (
              <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4 space-y-2">
                <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-2">
                  Tax Summary — {isInterState ? "IGST (Inter-State)" : "CGST + SGST (Intra-State)"}
                </p>
                {isInterState
                  ? <TaxRow label={`IGST @ ${GST_RATE}%`} value={igst} />
                  : <>
                      <TaxRow label={`CGST @ ${GST_RATE / 2}%`} value={cgst} />
                      <TaxRow label={`SGST @ ${GST_RATE / 2}%`} value={sgst} />
                    </>}
                <div className="flex justify-between pt-2 border-t border-sky-200">
                  <span className="text-sm font-bold text-slate-800">Total Payable</span>
                  <span className="text-sm font-bold text-sky-700">{fmtINR(total)}</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 flex justify-between">
                <span className="text-sm font-bold text-slate-700">Total Payable (Non-GST)</span>
                <span className="text-sm font-bold text-slate-800">{fmtINR(total)}</span>
              </div>
            )}
          </Card>

          {/* Notes */}
          <Card title="Notes & Remarks" icon={<StickyNote size={15} />} delay={0.15}>
            <Label>Notes (shown on invoice)</Label>
            <textarea value={data.notes} onChange={e => set("notes", e.target.value)} rows={3}
              placeholder="e.g., Thank you for your business. Please make payment via bank transfer."
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white
                focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none resize-none transition-all" />
          </Card>
        </div>

        {/* ── RIGHT: Preview ── */}
        <div className="xl:sticky xl:top-24 h-fit">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-slate-50 to-sky-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-sky-500" />
                <span className="text-sm font-semibold text-slate-700">Live Preview</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">A4 format</span>
            </div>
            <div className="bg-slate-200 p-3 max-h-[75vh] overflow-auto">
              <div className="shadow-lg rounded-sm overflow-hidden">
                <InvoicePreview ref={previewRef} data={data}
                  subtotal={subtotal} cgst={cgst} sgst={sgst} igst={igst}
                  total={total} isInterState={isInterState} />
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {touched && Object.keys(errors).length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50">
                <p className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  Fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? "s" : ""} before downloading
                </p>
                <ul className="space-y-1">
                  {Object.values(errors).slice(0, 5).map((msg, i) => (
                    <li key={i} className="text-[11px] text-red-500">• {msg}</li>
                  ))}
                  {Object.keys(errors).length > 5 && (
                    <li className="text-[11px] text-red-400">…and {Object.keys(errors).length - 5} more</li>
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
