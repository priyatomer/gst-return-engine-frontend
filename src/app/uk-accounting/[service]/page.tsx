import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UK_ACCOUNTING_SERVICES, getUKService } from "@/lib/ukAccountingData";

export async function generateStaticParams() {
  return UK_ACCOUNTING_SERVICES.map(s => ({ service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = getUKService(slug);
  if (!service) return {};
  return {
    title: `${service.title} | UK Accounting | Bhandari & Co.`,
    description: service.desc,
  };
}

export default async function UKServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = getUKService(slug);
  if (!service) notFound();

  return (
    <main>
      <Navbar />

      {/* Header band */}
      <section className="pt-36 pb-14 hero-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #0ea5e9 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <Link href="/uk-accounting" className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 text-sm font-semibold mb-5 transition-colors">
            <ArrowLeft size={14} /> UK Accounting
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800">{service.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-500 text-lg leading-relaxed">{service.desc}</p>
        </div>
      </section>

      <section className="section-padding section-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Highlights */}
          <div className="max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl font-black text-slate-800 mb-5">What&apos;s Included</h2>
            <ul className="space-y-3">
              {service.points.map(p => (
                <li key={p} className="flex items-start gap-3 text-slate-600">
                  <CheckCircle2 size={18} className="text-sky-500 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Sub-services */}
          {service.subServices ? (
            <>
              <div className="text-center mb-12">
                <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest">Bookkeeping Services</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-black text-slate-800">
                  Explore <span className="gradient-text">{service.title}</span>
                </h2>
                <div className="sky-divider mx-auto mt-5" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {service.subServices.map(sub => (
                  <Link
                    key={sub.slug}
                    href={`/uk-accounting/${service.slug}/${sub.slug}`}
                    className="card-hover group block bg-white rounded-2xl p-6 border border-slate-100 hover:border-sky-200 shadow-sm hover:shadow-lg transition-colors"
                  >
                    <h3 className="text-slate-800 font-bold text-base mb-2">{sub.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{sub.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-sky-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                      Learn More <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-3xl mx-auto text-center">
              <Link href="/#contact" className="btn-primary">
                Get Free Consultation <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
