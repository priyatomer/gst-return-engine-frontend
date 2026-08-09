"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function AdminModal({
  open, onClose, title, children, size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const maxW = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxW} max-h-[80vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}

/* ── Reusable form primitives ── */

export function FLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block mb-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

export function FInput({
  value, onChange, onBlur, placeholder, type = "text", required,
}: {
  value: string; onChange: (v: string) => void; onBlur?: () => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (type !== "number") return;
    const el = inputRef.current;
    if (!el) return;
    const blockWheel = (e: WheelEvent) => { if (document.activeElement === el) e.preventDefault(); };
    el.addEventListener("wheel", blockWheel, { passive: false });
    return () => el.removeEventListener("wheel", blockWheel);
  }, [type]);
  return (
    <input
      ref={inputRef}
      type={type} value={value} onChange={e => onChange(e.target.value)} onBlur={onBlur}
      placeholder={placeholder} required={required}
      onWheel={type === "number" ? e => e.currentTarget.blur() : undefined}
      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
    />
  );
}

export function FSelect({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void;
  options: string[] | { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o =>
        typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  );
}

export function FTextarea({
  value, onChange, placeholder, rows = 3,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white
        focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
    />
  );
}

export function FRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

export function FField({ children, span2 }: { children: React.ReactNode; span2?: boolean }) {
  return <div className={span2 ? "col-span-2" : ""}>{children}</div>;
}

export function FSubmit({ label, onCancel }: { label: string; onCancel: () => void }) {
  return (
    <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
      <button type="button" onClick={onCancel}
        className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
        Cancel
      </button>
      <button type="submit"
        className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
        {label}
      </button>
    </div>
  );
}
