import type { InvoiceData } from "@/components/admin/FeeSheetDrawer";

export type FeeStatus = "Paid" | "Unpaid" | "Partial" | "Pending for Approval";

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
  proofFileName?: string;
  proofDataUrl?: string;
  proofUploadedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

const KEY = "bc_fee_sheets_v1";

const SEED_SHEETS: FeeSheet[] = [
  { id: 1,  no: "BC-GST-2606-091", leadId: 4,  leadName: "Anita Chaudhary",  client: "Anita Chaudhary",        date: "28 Jun 2026", services: ["GSTR-1","GSTR-3B"],          amount: 4248,  status: "Unpaid",  paidDate: "—" },
  { id: 2,  no: "BC-GST-2606-090", leadId: 3,  leadName: "Vikram Singhania", client: "Vikram Singhania",        date: "28 Jun 2026", services: ["Company Registration"],      amount: 7080,  status: "Partial", paidDate: "—" },
  { id: 3,  no: "BC-GST-2606-089", leadId: 5,  leadName: "Mohan Lal",        client: "Mohan Lal",               date: "25 Jun 2026", services: ["MSME Registration"],          amount: 2360,  status: "Paid",    paidDate: "27 Jun 2026" },
  { id: 4,  no: "BC-GST-2606-088", client: "Sharma Enterprises",             date: "29 Jun 2026", services: ["Balance Sheet"],             amount: 5900,  status: "Unpaid",  paidDate: "—" },
  { id: 5,  no: "BC-GST-2606-087", client: "Jain Textiles Pvt Ltd",          date: "28 Jun 2026", services: ["GSTR-1","GSTR-3B","GSTR-9"], amount: 11800, status: "Paid",    paidDate: "30 Jun 2026" },
  { id: 6,  no: "BC-GST-2606-086", client: "Verma Pharma",                   date: "27 Jun 2026", services: ["Tax Audit"],                 amount: 23600, status: "Partial", paidDate: "—" },
  { id: 7,  no: "BC-GST-2606-085", client: "Agarwal & Sons",                 date: "26 Jun 2026", services: ["GSTR-1","GSTR-3B"],          amount: 4248,  status: "Paid",    paidDate: "28 Jun 2026" },
  { id: 8,  no: "BC-GST-2606-084", client: "Krishna Auto Works",             date: "25 Jun 2026", services: ["GSTR-3B"],                   amount: 2124,  status: "Paid",    paidDate: "27 Jun 2026" },
  { id: 9,  no: "BC-GST-2606-083", client: "Yadav Transport Pvt Ltd",        date: "24 Jun 2026", services: ["GSTR-1","GSTR-3B","GSTR-9"], amount: 11800, status: "Unpaid",  paidDate: "—" },
  { id: 10, no: "BC-GST-2606-082", client: "Delhi Crafts Exports",           date: "23 Jun 2026", services: ["GSTR-1","GSTR-3B","IGST"],   amount: 5900,  status: "Paid",    paidDate: "25 Jun 2026" },
];

function persist(sheets: FeeSheet[]) {
  localStorage.setItem(KEY, JSON.stringify(sheets));
}

export function getFeeSheets(): FeeSheet[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!stored) { persist(SEED_SHEETS); return SEED_SHEETS; }
    return stored;
  } catch { return []; }
}

export function addFeeSheet(sheet: FeeSheet) {
  const sheets = [sheet, ...getFeeSheets()];
  persist(sheets);
  return sheets;
}

export function uploadPaymentProof(id: number, fileName: string, dataUrl: string) {
  const sheets = getFeeSheets().map(s => s.id === id
    ? { ...s, status: "Pending for Approval" as FeeStatus, proofFileName: fileName, proofDataUrl: dataUrl,
        proofUploadedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }
    : s);
  persist(sheets);
  return sheets;
}

export function approvePayment(id: number, approverName: string) {
  const sheets = getFeeSheets().map(s => s.id === id
    ? { ...s, status: "Paid" as FeeStatus, approvedBy: approverName,
        approvedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        paidDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }
    : s);
  persist(sheets);
  return sheets;
}
