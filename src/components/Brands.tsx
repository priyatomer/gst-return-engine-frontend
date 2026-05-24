"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  Code2,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Globe,
  Zap,
  Database,
} from "lucide-react";

const brands = [
  {
    id: "gst",
    badge: "Business Unit 01",
    icon: <FileText size={36} />,
    name: "GST Filing Services",
    tagline: "End-to-End GST Compliance, Simplified",
    description:
      "From registration and return filing to audit support and refund claims — our GST experts handle it all with precision, speed, and zero penalties.",
    color: "amber",
    gradient: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20 hover:border-amber-400/50",
    iconBg: "bg-amber-400/10 text-amber-400",
    tagColor: "text-amber-400 bg-amber-400/10",
    highlights: [
      { icon: <FileText size={14} />, text: "GSTR-1, 2A, 3B, 9, 9C Returns" },
      { icon: <CheckCircle2 size={14} />, text: "GST Registration & Amendments" },
      { icon: <BarChart3 size={14} />, text: "Reconciliation & Audit Reports" },
      { icon: <Zap size={14} />, text: "ITC Maximization" },
    ],
  },
  {
    id: "software",
    badge: "Business Unit 02",
    icon: <Code2 size={36} />,
    name: "Software Company",
    tagline: "Building Tomorrow's Digital Infrastructure",
    description:
      "We craft enterprise-grade web apps, automation tools, and SaaS platforms. From concept to deployment, our engineers build scalable, future-ready technology.",
    color: "blue",
    gradient: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/20 hover:border-blue-400/50",
    iconBg: "bg-blue-400/10 text-blue-400",
    tagColor: "text-blue-400 bg-blue-400/10",
    highlights: [
      { icon: <Globe size={14} />, text: "Custom Web & Mobile Apps" },
      { icon: <Database size={14} />, text: "Cloud Infrastructure & DevOps" },
      { icon: <Code2 size={14} />, text: "SaaS Product Development" },
      { icon: <Zap size={14} />, text: "AI & Automation Solutions" },
    ],
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Brands() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="brands" className="section-padding bg-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            Our Businesses
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            Two Powerhouse{" "}
            <span className="gradient-text">Brands, One Vision</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Bhandari & Co. operates two distinct yet synergistic business units — each a leader in
            its domain, united by our commitment to excellence.
          </p>
          <div className="gold-divider mx-auto mt-5" />
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-8"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className={`relative rounded-2xl border ${brand.border} bg-gradient-to-br ${brand.gradient} glass p-8 transition-all duration-300 cursor-default overflow-hidden`}
            >
              {/* Badge */}
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${brand.tagColor} mb-5 uppercase tracking-wider`}
              >
                {brand.badge}
              </span>

              {/* Icon + Name */}
              <div className="flex items-start gap-5 mb-5">
                <div
                  className={`w-16 h-16 rounded-2xl ${brand.iconBg} flex items-center justify-center shrink-0`}
                >
                  {brand.icon}
                </div>
                <div>
                  <h3 className="text-white text-2xl font-black">{brand.name}</h3>
                  <p className="text-slate-400 text-sm mt-1 italic">{brand.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{brand.description}</p>

              {/* Highlights */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {brand.highlights.map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span
                      className={`${brand.id === "gst" ? "text-amber-400" : "text-blue-400"}`}
                    >
                      {icon}
                    </span>
                    {text}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ x: 4 }}
                className={`flex items-center gap-2 text-sm font-semibold ${
                  brand.id === "gst" ? "text-amber-400" : "text-blue-400"
                } group`}
                onClick={() =>
                  document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Services
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Decorative number */}
              <div
                className={`absolute bottom-4 right-6 text-8xl font-black opacity-5 ${
                  brand.id === "gst" ? "text-amber-400" : "text-blue-400"
                } pointer-events-none select-none`}
              >
                0{brand.id === "gst" ? "1" : "2"}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
