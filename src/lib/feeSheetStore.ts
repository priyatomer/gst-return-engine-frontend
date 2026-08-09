import type { InvoiceData } from "@/components/admin/FeeSheetDrawer";

export type FeeStatus = "Paid" | "Unpaid" | "Partial" | "Pending for Approval";
export type PaymentStatus = "Pending for Approval" | "Approved";

export interface PaymentRecord {
  id: number;
  amount: number;
  fileName: string;
  dataUrl: string;
  uploadedAt: string;
  status: PaymentStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface FeeSheet {
  id: number;
  no: string;
  leadId?: number;
  leadName?: string;
  client: string;
  date: string;
  services: string[];
  amount: number;
  status: FeeStatus;
  paidDate: string;
  createdBy?: string;
  invoiceData?: InvoiceData;
  payments: PaymentRecord[];
  /** @deprecated kept only so pre-migration localStorage data can be read once */
  proofFileName?: string;
  proofDataUrl?: string;
  proofUploadedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

const KEY = "bc_fee_sheets_v1";
const fmtDate = () => new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const SEED_SHEETS: FeeSheet[] = [
  { id: 1,  no: "BC-GST-2606-091", leadId: 4,  leadName: "Anita Chaudhary",  client: "Anita Chaudhary",        date: "28 Jun 2026", services: ["GSTR-1","GSTR-3B"],          amount: 4248,  status: "Unpaid",  paidDate: "—", payments: [] },
  { id: 2,  no: "BC-GST-2606-090", leadId: 3,  leadName: "Vikram Singhania", client: "Vikram Singhania",        date: "28 Jun 2026", services: ["Company Registration"],      amount: 7080,  status: "Partial", paidDate: "—", payments: [
    { id: 1002, amount: 3540, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: "29 Jun 2026", status: "Approved", approvedBy: "Jitinder Singh", approvedAt: "29 Jun 2026" },
  ] },
  { id: 3,  no: "BC-GST-2606-089", leadId: 5,  leadName: "Mohan Lal",        client: "Mohan Lal",               date: "25 Jun 2026", services: ["MSME Registration"],          amount: 2360,  status: "Paid",    paidDate: "27 Jun 2026", payments: [
    { id: 1003, amount: 2360, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: "27 Jun 2026", status: "Approved", approvedBy: "Jitinder Singh", approvedAt: "27 Jun 2026" },
  ] },
  { id: 4,  no: "BC-GST-2606-088", client: "Sharma Enterprises",             date: "29 Jun 2026", services: ["Balance Sheet"],             amount: 5900,  status: "Unpaid",  paidDate: "—", payments: [] },
  { id: 5,  no: "BC-GST-2606-087", client: "Jain Textiles Pvt Ltd",          date: "28 Jun 2026", services: ["GSTR-1","GSTR-3B","GSTR-9"], amount: 11800, status: "Paid",    paidDate: "30 Jun 2026", payments: [
    { id: 1005, amount: 11800, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: "30 Jun 2026", status: "Approved", approvedBy: "Jitinder Singh", approvedAt: "30 Jun 2026" },
  ] },
  { id: 6,  no: "BC-GST-2606-086", client: "Verma Pharma",                   date: "27 Jun 2026", services: ["Tax Audit"],                 amount: 23600, status: "Partial", paidDate: "—", payments: [
    { id: 1006, amount: 11800, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: "28 Jun 2026", status: "Approved", approvedBy: "Jitinder Singh", approvedAt: "28 Jun 2026" },
  ] },
  { id: 7,  no: "BC-GST-2606-085", client: "Agarwal & Sons",                 date: "26 Jun 2026", services: ["GSTR-1","GSTR-3B"],          amount: 4248,  status: "Paid",    paidDate: "28 Jun 2026", payments: [
    { id: 1007, amount: 4248, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: "28 Jun 2026", status: "Approved", approvedBy: "Jitinder Singh", approvedAt: "28 Jun 2026" },
  ] },
  { id: 8,  no: "BC-GST-2606-084", client: "Krishna Auto Works",             date: "25 Jun 2026", services: ["GSTR-3B"],                   amount: 2124,  status: "Paid",    paidDate: "27 Jun 2026", payments: [
    { id: 1008, amount: 2124, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: "27 Jun 2026", status: "Approved", approvedBy: "Jitinder Singh", approvedAt: "27 Jun 2026" },
  ] },
  { id: 9,  no: "BC-GST-2606-083", client: "Yadav Transport Pvt Ltd",        date: "24 Jun 2026", services: ["GSTR-1","GSTR-3B","GSTR-9"], amount: 11800, status: "Unpaid",  paidDate: "—", payments: [] },
  { id: 10, no: "BC-GST-2606-082", client: "Delhi Crafts Exports",           date: "23 Jun 2026", services: ["GSTR-1","GSTR-3B","IGST"],   amount: 5900,  status: "Paid",    paidDate: "25 Jun 2026", payments: [
    { id: 1010, amount: 5900, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: "25 Jun 2026", status: "Approved", approvedBy: "Jitinder Singh", approvedAt: "25 Jun 2026" },
  ] },
];

export function getPaidAmount(sheet: FeeSheet): number {
  return sheet.payments.filter(p => p.status === "Approved").reduce((a, p) => a + p.amount, 0);
}

export function getPendingAmount(sheet: FeeSheet): number {
  return Math.max(0, sheet.amount - getPaidAmount(sheet));
}

function deriveStatus(sheet: FeeSheet): FeeStatus {
  if (sheet.payments.some(p => p.status === "Pending for Approval")) return "Pending for Approval";
  const paid = getPaidAmount(sheet);
  if (paid <= 0) return "Unpaid";
  if (paid >= sheet.amount) return "Paid";
  return "Partial";
}

/** One-time upgrade for records saved before per-payment tracking existed. */
function migrate(sheet: FeeSheet): FeeSheet {
  if (Array.isArray(sheet.payments)) return sheet;
  const payments: PaymentRecord[] = [];
  if (sheet.proofFileName) {
    payments.push({
      id: sheet.id,
      amount: sheet.amount,
      fileName: sheet.proofFileName,
      dataUrl: sheet.proofDataUrl ?? "",
      uploadedAt: sheet.proofUploadedAt ?? sheet.date,
      status: sheet.status === "Paid" ? "Approved" : "Pending for Approval",
      approvedBy: sheet.approvedBy,
      approvedAt: sheet.approvedAt,
    });
  } else if (sheet.status === "Paid") {
    payments.push({ id: sheet.id, amount: sheet.amount, fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: sheet.date, status: "Approved" });
  } else if (sheet.status === "Partial") {
    payments.push({ id: sheet.id, amount: Math.round(sheet.amount / 2), fileName: "payment-proof.pdf", dataUrl: "", uploadedAt: sheet.date, status: "Approved" });
  }
  return { ...sheet, payments };
}

function persist(sheets: FeeSheet[]) {
  localStorage.setItem(KEY, JSON.stringify(sheets));
}

export function getFeeSheets(): FeeSheet[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!stored) { persist(SEED_SHEETS); return SEED_SHEETS; }
    const migrated = (stored as FeeSheet[]).map(migrate);
    persist(migrated);
    return migrated;
  } catch { return []; }
}

export function addFeeSheet(sheet: FeeSheet) {
  const sheets = [sheet, ...getFeeSheets()];
  persist(sheets);
  return sheets;
}

export function addPaymentRecord(id: number, amount: number, fileName: string, dataUrl: string) {
  const sheets = getFeeSheets().map(s => {
    if (s.id !== id) return s;
    const payments = [...s.payments, {
      id: Date.now(), amount, fileName, dataUrl, uploadedAt: fmtDate(), status: "Pending for Approval" as PaymentStatus,
    }];
    const next = { ...s, payments };
    return { ...next, status: deriveStatus(next) };
  });
  persist(sheets);
  return sheets;
}

export function approvePaymentRecord(id: number, paymentId: number, approverName: string) {
  const sheets = getFeeSheets().map(s => {
    if (s.id !== id) return s;
    const payments = s.payments.map(p => p.id === paymentId
      ? { ...p, status: "Approved" as PaymentStatus, approvedBy: approverName, approvedAt: fmtDate() }
      : p);
    const next = { ...s, payments, approvedBy: approverName, approvedAt: fmtDate() };
    const status = deriveStatus(next);
    return { ...next, status, paidDate: status === "Paid" ? fmtDate() : next.paidDate };
  });
  persist(sheets);
  return sheets;
}
