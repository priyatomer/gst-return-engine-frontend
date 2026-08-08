export const PIPELINE = ["New", "Contacted", "Proposal Sent", "Negotiation", "Converted", "Lost"] as const;
export type Stage = typeof PIPELINE[number];

export interface Lead {
  id: number;
  firmName: string;
  contactNumber: string;
  email: string;
  state: string;
  panNumber: string;
  zone: string;
  gstNumber: string;
  remark: string;
  source: string;
  referral: string;
  stage: Stage;
  date: string;
  createdBy: string;
}

const KEY = "bc_leads_v1";

const SEED_LEADS: Lead[] = [
  { id: 1,  firmName: "Ramesh Gupta Traders",     contactNumber: "9876501234", email: "ramesh.g@gmail.com",  state: "Rajasthan", panNumber: "ABCPG1234R", zone: "North",   gstNumber: "",                  remark: "Interested in GST registration",     source: "Referral",  referral: "Suresh Sharma",  stage: "New",           date: "02 Jul 2026", createdBy: "Jitinder Singh" },
  { id: 2,  firmName: "Sunita Jain & Co.",         contactNumber: "9765432101", email: "sunita.j@gmail.com",   state: "Rajasthan", panNumber: "ABCPJ2345S", zone: "North",   gstNumber: "",                  remark: "Needs ITR filing for FY25-26",       source: "WhatsApp",  referral: "",                stage: "Contacted",     date: "01 Jul 2026", createdBy: "Priya Sharma" },
  { id: 3,  firmName: "Vikram Singhania Pvt Ltd",  contactNumber: "9654323012", email: "vikram.s@gmail.com",   state: "Rajasthan", panNumber: "ABCPV3456T", zone: "West",    gstNumber: "08AABCV1234A1Z5",   remark: "Company registration follow-up",     source: "Website",   referral: "",                stage: "Proposal Sent", date: "30 Jun 2026", createdBy: "Priya Sharma" },
  { id: 4,  firmName: "Anita Chaudhary Textiles",  contactNumber: "9543214023", email: "anita.c@gmail.com",    state: "Rajasthan", panNumber: "ABCPA4567U", zone: "North",   gstNumber: "08AABCA5678B1Z4",   remark: "Monthly GSTR filing",                source: "Referral",  referral: "Mohan Lal",       stage: "Negotiation",   date: "28 Jun 2026", createdBy: "Jitinder Singh" },
  { id: 5,  firmName: "Mohan Lal Enterprises",     contactNumber: "9432105034", email: "mohan.l@gmail.com",    state: "Rajasthan", panNumber: "ABCPM5678V", zone: "East",    gstNumber: "08AABCM6789C1Z3",   remark: "Converted client",                   source: "Walk-in",   referral: "",                stage: "Converted",     date: "25 Jun 2026", createdBy: "Jitinder Singh" },
  { id: 6,  firmName: "Priya Agarwal Fashions",    contactNumber: "9321096045", email: "priya.a@gmail.com",    state: "Rajasthan", panNumber: "ABCPP6789W", zone: "South",   gstNumber: "",                  remark: "",                                    source: "WhatsApp",  referral: "",                stage: "Contacted",     date: "24 Jun 2026", createdBy: "Priya Sharma" },
  { id: 7,  firmName: "Suresh Sharma & Sons",      contactNumber: "9210987056", email: "suresh.sh@gmail.com",  state: "Rajasthan", panNumber: "ABCPS7890X", zone: "North",   gstNumber: "",                  remark: "Tax audit enquiry",                  source: "Website",   referral: "",                stage: "Proposal Sent", date: "22 Jun 2026", createdBy: "Priya Sharma" },
  { id: 8,  firmName: "Kavita Yadav Associates",   contactNumber: "9109878067", email: "kavita.y@gmail.com",   state: "Rajasthan", panNumber: "ABCPK8901Y", zone: "Central", gstNumber: "",                  remark: "",                                    source: "Referral",  referral: "Deepa Singh",     stage: "New",           date: "20 Jun 2026", createdBy: "Jitinder Singh" },
  { id: 9,  firmName: "Ashok Meena Exports",       contactNumber: "8998769078", email: "ashok.m@gmail.com",    state: "Rajasthan", panNumber: "ABCPA9012Z", zone: "West",    gstNumber: "",                  remark: "Not interested currently",           source: "Instagram", referral: "",                stage: "Lost",          date: "18 Jun 2026", createdBy: "Priya Sharma" },
  { id: 10, firmName: "Deepa Singh Trademarks",    contactNumber: "8887660089", email: "deepa.s@gmail.com",    state: "Rajasthan", panNumber: "ABCPD0123A", zone: "South",   gstNumber: "",                  remark: "Trademark registration lead",        source: "Referral",  referral: "",                stage: "Negotiation",   date: "15 Jun 2026", createdBy: "Jitinder Singh" },
];

function persist(leads: Lead[]) {
  localStorage.setItem(KEY, JSON.stringify(leads));
}

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!stored) { persist(SEED_LEADS); return SEED_LEADS; }
    return stored;
  } catch { return []; }
}

export function getLead(id: number): Lead | undefined {
  return getLeads().find(l => l.id === id);
}

export function addLead(lead: Lead) {
  const leads = [lead, ...getLeads()];
  persist(leads);
  return leads;
}

export function updateLead(id: number, patch: Partial<Lead>) {
  const leads = getLeads().map(l => l.id === id ? { ...l, ...patch } : l);
  persist(leads);
  return leads;
}
