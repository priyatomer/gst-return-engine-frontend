import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, BarChart3, Receipt, Users, FileCheck2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UK_ACCOUNTING_SERVICES } from "@/lib/ukAccountingData";

export const metadata = {
  title: "UK Accounting Services | Bhandari & Co.",
  description:
    "Daily bookkeeping, financial reporting, VAT returns, payroll, and personal tax return services for UK-based businesses.",
};

const ICONS: Record<string, ReactNode> = {
  "daily-bookkeeping":    <BookOpen size={22} />,
  "financial-reporting":  <BarChart3 size={22} />,
  "vat-returns":          <Receipt size={22} />,
  "payroll-services":     <Users size={22} />,
  "personal-tax-returns": <FileCheck2 size={22} />,
};

export default function UKAccountingPage() {
  return (
    <main>
      <Navbar />

      {/* Header band */}
      <section className="pt-36 pb-16 hero-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #0ea5e9 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-300 bg-sky-50 text-sky-600 text-sm font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            For UK-Based Businesses
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-black text-slate-800">
            UK <span className="gradient-text">Accounting</span> Services
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed">
            From daily bookkeeping to VAT, payroll, and self-assessment — accurate, HMRC-compliant
            accounting support for your UK business.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="section-padding section-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-800">
              Our UK Accounting <span className="gradient-text">Services</span>
            </h2>
            <div className="sky-divider mx-auto mt-5" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {UK_ACCOUNTING_SERVICES.map(s => (
              <Link
                key={s.slug}
                href={`/uk-accounting/${s.slug}`}
                className="card-hover group block bg-white rounded-2xl p-6 border border-slate-100 hover:border-sky-200 shadow-sm hover:shadow-lg transition-colors"
              >
                <div className="w-11 h-11 rounded-xl border flex items-center justify-center mb-4 text-sky-500 bg-sky-50 border-sky-200">
                  {ICONS[s.slug]}
                </div>
                <h3 className="text-slate-800 font-bold text-base mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sky-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                  {s.subServices ? "View Services" : "Learn More"} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding" style={{ background: "linear-gradient(135deg,#0ea5e9,#2563eb)" }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ready to simplify your UK accounting?
          </h2>
          <p className="text-sky-100 mb-8">
            Talk to our team about which service fits your business.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-white text-sky-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Get Free Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
