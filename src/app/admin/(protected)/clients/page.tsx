"use client";

import { useState } from "react";
import { Search, Plus, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import AdminModal, { FLabel, FInput, FSelect, FRow, FField, FSubmit } from "@/components/admin/AdminModal";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Chandigarh","Puducherry","Andaman & Nicobar Islands","Dadra & Nagar Haveli and Daman & Diu","Lakshadweep",
];

const SERVICE_OPTIONS = ["GSTR-1","GSTR-3B","GSTR-9","GSTR-9C","Balance Sheet","Tax Audit","GST Audit","ITR Filing","IGST","ROC Filing"];

interface Client {
  id: number;
  name: string;
  gstin: string;
  state: string;
  city: string;
  email: string;
  phone: string;
  type: string;
  status: string;
  services: string[];
}

const INITIAL_CLIENTS: Client[] = [
  { id: 1,  name: "Rajasthan Traders Pvt Ltd",    gstin: "08AABCR1234A1Z5", state: "Rajasthan", city: "Jaipur",    email: "rajtraders@gmail.com",   phone: "9876543210", type: "Company",    status: "Active",   services: ["GSTR-1","GSTR-3B"] },
  { id: 2,  name: "Sharma Enterprises",            gstin: "08AAAES5678B2Z3", state: "Rajasthan", city: "Jodhpur",   email: "sharma.ent@gmail.com",   phone: "9988776655", type: "Firm",       status: "Active",   services: ["GSTR-1","GSTR-3B","Balance Sheet"] },
  { id: 3,  name: "Meena Fashions",                gstin: "08AAAFM2345C1Z1", state: "Rajasthan", city: "Jaipur",    email: "meena.fash@gmail.com",   phone: "8765432109", type: "Proprietor", status: "Active",   services: ["GSTR-3B"] },
  { id: 4,  name: "Agarwal & Sons",                gstin: "08AABAA9876D1Z7", state: "Rajasthan", city: "Ajmer",     email: "agarwal.sons@gmail.com", phone: "9871234560", type: "Firm",       status: "Active",   services: ["GSTR-1","GSTR-3B","Tax Audit"] },
  { id: 5,  name: "Gupta Construction Co.",        gstin: "08AABCG4321E2Z2", state: "Rajasthan", city: "Bikaner",   email: "gupta.const@gmail.com",  phone: "9765432198", type: "Firm",       status: "Inactive", services: ["GSTR-1"] },
  { id: 6,  name: "Jain Textiles Pvt Ltd",         gstin: "08AACPJ7654F1Z8", state: "Rajasthan", city: "Jaipur",    email: "jaintex@gmail.com",      phone: "9654321987", type: "Company",    status: "Active",   services: ["GSTR-1","GSTR-3B","GSTR-9"] },
  { id: 7,  name: "Krishna Auto Works",            gstin: "08AAECK2222G1Z4", state: "Rajasthan", city: "Jaipur",    email: "krishna.auto@gmail.com", phone: "9543210876", type: "Proprietor", status: "Active",   services: ["GSTR-3B"] },
  { id: 8,  name: "Modi Electronics",              gstin: "08AABCM5555H2Z6", state: "Rajasthan", city: "Udaipur",   email: "modi.elec@gmail.com",    phone: "9432109765", type: "Firm",       status: "Active",   services: ["GSTR-1","GSTR-3B"] },
  { id: 9,  name: "Verma Pharma",                  gstin: "08AABPV3333I1Z9", state: "Rajasthan", city: "Kota",      email: "verma.pharma@gmail.com", phone: "9321098654", type: "Company",    status: "Active",   services: ["GSTR-1","GSTR-3B","Tax Audit"] },
  { id: 10, name: "Singh Agro Industries",         gstin: "08AABCS8888J2Z3", state: "Rajasthan", city: "Sikar",     email: "singh.agro@gmail.com",   phone: "9210987543", type: "Company",    status: "Inactive", services: ["GSTR-9"] },
  { id: 11, name: "Mahesh General Stores",         gstin: "08AAECM1111K1Z5", state: "Rajasthan", city: "Jaipur",    email: "mahesh.gen@gmail.com",   phone: "9109876432", type: "Proprietor", status: "Active",   services: ["GSTR-3B"] },
  { id: 12, name: "Lal Sweets & Namkeen",          gstin: "08AABPL4444L2Z1", state: "Rajasthan", city: "Jaipur",    email: "lalsweets@gmail.com",    phone: "8998887776", type: "Firm",       status: "Active",   services: ["GSTR-1","GSTR-3B"] },
  { id: 13, name: "Yadav Transport Pvt Ltd",       gstin: "08AABTY6666M1Z7", state: "Rajasthan", city: "Alwar",     email: "yadav.trans@gmail.com",  phone: "8887776665", type: "Company",    status: "Active",   services: ["GSTR-1","GSTR-3B","GSTR-9"] },
  { id: 14, name: "Bansal Hardware",               gstin: "08AABCB9999N2Z2", state: "Rajasthan", city: "Bhilwara",  email: "bansal.hw@gmail.com",    phone: "8776665554", type: "Proprietor", status: "Active",   services: ["GSTR-3B"] },
  { id: 15, name: "Delhi Crafts Exports",          gstin: "07AABCD1234P1Z6", state: "Delhi",     city: "New Delhi", email: "dce@gmail.com",          phone: "9012345678", type: "Company",    status: "Active",   services: ["GSTR-1","GSTR-3B","IGST"] },
];

const EMPTY_FORM = {
  name: "", gstin: "", state: "Rajasthan", city: "", email: "", phone: "",
  type: "Proprietor", status: "Active", services: [] as string[],
};

const PAGE_SIZE = 10;

export default function ClientsPage() {
  const [clients, setClients]   = useState<Client[]>(INITIAL_CLIENTS);
  const [search, setSearch]     = useState("");
  const [statusF, setStatusF]   = useState("All");
  const [typeF, setTypeF]       = useState("All");
  const [page, setPage]         = useState(1);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ ...EMPTY_FORM });

  const f = <K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const toggleService = (svc: string) =>
    setForm(p => ({
      ...p,
      services: p.services.includes(svc) ? p.services.filter(s => s !== svc) : [...p.services, svc],
    }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newClient: Client = {
      id: Date.now(),
      ...form,
    };
    setClients(prev => [newClient, ...prev]);
    setForm({ ...EMPTY_FORM });
    setShowAdd(false);
    setPage(1);
  };

  const filtered = clients.filter(c =>
    (statusF === "All" || c.status === statusF) &&
    (typeF   === "All" || c.type   === typeF)   &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
     c.gstin.toLowerCase().includes(search.toLowerCase()) ||
     c.city.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Manage your client base and GST registrations</p>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium
            rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          <Plus size={15} /> Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, GSTIN, city…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400" />
        </div>
        {[
          { label: "Status", val: statusF, set: (v: string) => { setStatusF(v); setPage(1); }, opts: ["All","Active","Inactive"] },
          { label: "Type",   val: typeF,   set: (v: string) => { setTypeF(v); setPage(1); },   opts: ["All","Company","Firm","Proprietor"] },
        ].map(f => (
          <select key={f.label} value={f.val} onChange={e => f.set(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-100">
            {f.opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
        <div className="flex items-center text-xs text-slate-500 ml-auto">
          {filtered.length} client{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#","Client / Business","GSTIN","City","Type","Services","Status",""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">No clients found.</td></tr>
              )}
              {rows.map((c, i) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{c.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{c.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.gstin || "—"}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{c.city}{c.city && c.state ? ", " : ""}{c.state}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{c.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.services.map(s => (
                        <span key={s} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-1 rounded-full
                      ${c.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-40">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 text-xs rounded-lg ${page === p ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-40">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Client Modal ── */}
      <AdminModal open={showAdd} onClose={() => setShowAdd(false)} title="Add New Client" size="lg">
        <form onSubmit={handleAdd}>
          <FRow>
            <FField span2>
              <FLabel required>Client / Business Name</FLabel>
              <FInput value={form.name} onChange={v => f("name", v)} placeholder="ABC Enterprises Pvt. Ltd." required />
            </FField>
            <FField>
              <FLabel>GSTIN</FLabel>
              <FInput value={form.gstin} onChange={v => f("gstin", v.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
            </FField>
            <FField>
              <FLabel>Type</FLabel>
              <FSelect value={form.type} onChange={v => f("type", v)} options={["Proprietor","Firm","Company"]} />
            </FField>
            <FField>
              <FLabel required>State</FLabel>
              <FSelect value={form.state} onChange={v => f("state", v)} options={INDIAN_STATES} />
            </FField>
            <FField>
              <FLabel>City</FLabel>
              <FInput value={form.city} onChange={v => f("city", v)} placeholder="Jaipur" />
            </FField>
            <FField>
              <FLabel>Phone</FLabel>
              <FInput type="tel" value={form.phone} onChange={v => f("phone", v)} placeholder="9876543210" />
            </FField>
            <FField span2>
              <FLabel>Email</FLabel>
              <FInput type="email" value={form.email} onChange={v => f("email", v)} placeholder="client@example.com" />
            </FField>

            {/* Services */}
            <FField span2>
              <FLabel>Services</FLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {SERVICE_OPTIONS.map(svc => (
                  <label key={svc} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer text-xs font-medium transition-all
                    ${form.services.includes(svc) ? "bg-blue-50 border-blue-300 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                    <input type="checkbox" checked={form.services.includes(svc)} onChange={() => toggleService(svc)} className="hidden" />
                    {form.services.includes(svc) ? "✓ " : ""}{svc}
                  </label>
                ))}
              </div>
            </FField>

            {/* Status */}
            <FField span2>
              <FLabel>Status</FLabel>
              <div className="flex gap-4 mt-1">
                {["Active","Inactive"].map(s => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                    <input type="radio" name="client-status" checked={form.status === s} onChange={() => f("status", s)} className="accent-blue-600" />
                    {s}
                  </label>
                ))}
              </div>
            </FField>
          </FRow>

          <FSubmit label="Add Client" onCancel={() => setShowAdd(false)} />
        </form>
      </AdminModal>
    </div>
  );
}
