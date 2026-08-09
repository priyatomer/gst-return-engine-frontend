import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UK_ACCOUNTING_SERVICES, getUKService, getUKSubService } from "@/lib/ukAccountingData";

export async function generateStaticParams() {
  return UK_ACCOUNTING_SERVICES.flatMap(s =>
    (s.subServices ?? []).map(sub => ({ service: s.slug, sub: sub.slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ service: string; sub: string }> }) {
  const { service, sub } = await params;
  const subService = getUKSubService(service, sub);
  if (!subService) return {};
  return {
    title: `${subService.title} | UK Accounting | Bhandari & Co.`,
    description: subService.desc,
  };
}

export default async function UKSubServicePage({ params }: { params: Promise<{ service: string; sub: string }> }) {
  const { service: serviceSlug, sub: subSlug } = await params;
  const service    = getUKService(serviceSlug);
  const subService = getUKSubService(serviceSlug, subSlug);
  if (!service || !subService) notFound();

  return (
    <main>
      <Navbar />

      {/* Header band */}
      <section className="pt-36 pb-16 hero-gradient relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #0ea5e9 1px, transparent 1px)", backgroundSize: "36px 36px" }}
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm font-semibold mb-5">
            <Link href="/uk-accounting" className="text-sky-600 hover:text-sky-700 transition-colors">UK Accounting</Link>
            <span className="text-slate-300">/</span>
            <Link href={`/uk-accounting/${service.slug}`} className="text-sky-600 hover:text-sky-700 transition-colors">{service.title}</Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800">{subService.title}</h1>
          <p className="mt-3 max-w-2xl text-slate-500 text-lg leading-relaxed">{subService.desc}</p>
        </div>
      </section>

      <section className="section-padding section-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-base leading-relaxed mb-8">
            Part of our {service.title} service — handled accurately and on schedule as part of your
            ongoing bookkeeping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact" className="btn-primary">
              Get Free Consultation <ArrowRight size={16} />
            </Link>
            <Link href={`/uk-accounting/${service.slug}`} className="btn-outline">
              <ArrowLeft size={16} /> Back to {service.title}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
