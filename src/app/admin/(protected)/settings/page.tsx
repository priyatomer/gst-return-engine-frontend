"use client";

import { useState } from "react";
import { Save, Building2, Bell, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  const [firm, setFirm] = useState({
    name:      "Bhandari & Company",
    gstin:     "08EWEPB8031A1Z2",
    pan:       "EWEPB8031A",
    address:   "D-52, Saket Colony Adarsh Nagar, Opp Jain Mandir, Jawahar Nagar, Jaipur",
    city:      "Jaipur",
    state:     "Rajasthan",
    pincode:   "302004",
    phone:     "+91 77377 400224",
    email:     "Bhandariandcompanygroup@gmail.com",
    tagline:   "GST Filing & Business Services",
  });

  const [notif, setNotif] = useState({
    returnDue:    true,
    noticeDue:    true,
    paymentRecvd: true,
    newLead:      false,
    dailySummary: false,
  });

  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-slate-50 to-sky-50/60 border-b border-slate-100">
        <span className="text-sky-500">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const Field = ({ label, value, onChange, type = "text", readOnly }: { label: string; value: string; onChange?: (v: string) => void; type?: string; readOnly?: boolean }) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full px-3 py-2 text-sm rounded-xl border transition-all outline-none
          ${readOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-default" :
            "border-slate-200 bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400"}`} />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-5">
      {/* Firm Info */}
      <Section title="Firm Information" icon={<Building2 size={15} />}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Field label="Firm Name" value={firm.name} onChange={v => setFirm(p => ({ ...p, name: v }))} />
          </div>
          <Field label="GSTIN" value={firm.gstin} onChange={v => setFirm(p => ({ ...p, gstin: v.toUpperCase() }))} />
          <Field label="PAN" value={firm.pan} readOnly />
          <div className="col-span-2">
            <Field label="Address" value={firm.address} onChange={v => setFirm(p => ({ ...p, address: v }))} />
          </div>
          <Field label="City" value={firm.city} onChange={v => setFirm(p => ({ ...p, city: v }))} />
          <Field label="State" value={firm.state} readOnly />
          <Field label="Pincode" value={firm.pincode} onChange={v => setFirm(p => ({ ...p, pincode: v }))} />
          <Field label="Phone" value={firm.phone} onChange={v => setFirm(p => ({ ...p, phone: v }))} />
          <div className="col-span-2">
            <Field label="Email" type="email" value={firm.email} onChange={v => setFirm(p => ({ ...p, email: v }))} />
          </div>
          <div className="col-span-2">
            <Field label="Tagline (shown on invoices)" value={firm.tagline} onChange={v => setFirm(p => ({ ...p, tagline: v }))} />
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notification Preferences" icon={<Bell size={15} />}>
        <div className="space-y-3">
          {[
            { key: "returnDue",    label: "Return due date reminders",    desc: "Get alerts 3 days before due date" },
            { key: "noticeDue",    label: "Notice reply deadline alerts",  desc: "Urgent alerts for notice deadlines" },
            { key: "paymentRecvd", label: "Payment received notifications", desc: "When a client pays an invoice" },
            { key: "newLead",      label: "New lead notifications",        desc: "When a new lead is added" },
            { key: "dailySummary", label: "Daily summary email",           desc: "Morning briefing of pending tasks" },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-slate-800">{n.label}</div>
                <div className="text-xs text-slate-500">{n.desc}</div>
              </div>
              <button onClick={() => setNotif(p => ({ ...p, [n.key]: !p[n.key as keyof typeof p] }))}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0
                  ${notif[n.key as keyof typeof notif] ? "bg-blue-500" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                  ${notif[n.key as keyof typeof notif] ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section title="Security" icon={<Shield size={15} />}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Current Password</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">New Password</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-sky-100 focus:border-sky-400 outline-none" />
          </div>
          <div className="col-span-2 flex">
            <button className="px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </Section>

      {/* Theme */}
      <Section title="Appearance" icon={<Palette size={15} />}>
        <p className="text-sm text-slate-500 mb-3">Choose the admin panel color theme</p>
        <div className="flex gap-3">
          {[
            { name: "Blue (Default)", from: "from-sky-500", to: "to-blue-600" },
            { name: "Indigo",         from: "from-indigo-500", to: "to-violet-600" },
            { name: "Emerald",        from: "from-emerald-500", to: "to-teal-600" },
          ].map(t => (
            <div key={t.name} className="flex flex-col items-center gap-1.5 cursor-pointer">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.from} ${t.to} shadow-sm`} />
              <span className="text-[10px] text-slate-500">{t.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white
            transition-all shadow-lg ${saved ? "bg-emerald-500 shadow-emerald-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}>
          <Save size={14} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
