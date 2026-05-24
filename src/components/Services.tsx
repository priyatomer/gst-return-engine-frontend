"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  FileText,
  RefreshCw,
  AlertCircle,
  DollarSign,
  BookOpen,
  ShieldCheck,
  Globe,
  Smartphone,
  Server,
  Bot,
  BarChart,
  Lock,
} from "lucide-react";

const tabs = ["GST Filing Services", "Software Solutions"];

const gstServices = [
  {
    icon: <FileText size={22} />,
    title: "GST Registration",
    desc: "New registrations, amendments, cancellations, and revocations handled seamlessly.",
  },
  {
    icon: <RefreshCw size={22} />,
    title: "Return Filing (GSTR)",
    desc: "GSTR-1, GSTR-3B, GSTR-9, GSTR-9C — all filings done accurately before deadlines.",
  },
  {
    icon: <BarChart size={22} />,
    title: "ITC Reconciliation",
    desc: "Maximize Input Tax Credit with thorough 2A/2B reconciliation and dispute resolution.",
  },
  {
    icon: <DollarSign size={22} />,
    title: "Refund Claims",
    desc: "Export refunds, inverted duty structure refunds handled from application to receipt.",
  },
  {
    icon: <AlertCircle size={22} />,
    title: "Notice & Audit Support",
    desc: "Expert representation for GST notices, audits, appeals, and departmental proceedings.",
  },
  {
    icon: <BookOpen size={22} />,
    title: "GST Advisory",
    desc: "Strategic tax planning, HSN/SAC classification, rate optimization for your industry.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Annual Compliance",
    desc: "GSTR-9 & GSTR-9C annual return filing with full audit trail and documentation.",
  },
  {
    icon: <RefreshCw size={22} />,
    title: "e-Way Bill Management",
    desc: "Bulk generation, modification and cancellation of e-Way Bills for seamless logistics.",
  },
];

const softwareServices = [
  {
    icon: <Globe size={22} />,
    title: "Web Application Development",
    desc: "Full-stack React/Next.js and Node.js applications with modern, scalable architecture.",
  },
  {
    icon: <Smartphone size={22} />,
    title: "Mobile App Development",
    desc: "Cross-platform iOS and Android applications using React Native and Flutter.",
  },
  {
    icon: <Server size={22} />,
    title: "Cloud & DevOps",
    desc: "AWS/GCP infrastructure, CI/CD pipelines, containerization, and 24/7 monitoring.",
  },
  {
    icon: <Bot size={22} />,
    title: "AI & Automation",
    desc: "Intelligent automation, AI chatbots, data pipelines, and ML model integration.",
  },
  {
    icon: <BarChart size={22} />,
    title: "SaaS Product Development",
    desc: "End-to-end SaaS platforms from MVP to enterprise scale with subscription management.",
  },
  {
    icon: <Lock size={22} />,
    title: "Cybersecurity Solutions",
    desc: "Security audits, penetration testing, compliance (ISO 27001, SOC2), and hardening.",
  },
  {
    icon: <FileText size={22} />,
    title: "ERP & CRM Integration",
    desc: "Custom ERP, CRM, and HRMS systems integrated with your existing business tools.",
  },
  {
    icon: <RefreshCw size={22} />,
    title: "API Development & Integration",
    desc: "RESTful & GraphQL APIs, third-party integrations, and microservices architecture.",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const services = activeTab === 0 ? gstServices : softwareServices;
  const accentColor = activeTab === 0 ? "amber" : "blue";

  return (
    <section id="services" className="section-padding bg-[#0A0F1E] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Comprehensive{" "}
            <span className="gradient-text">Services</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto">
            Explore our full suite of professional services designed to keep your business
            compliant, competitive, and future-ready.
          </p>
          <div className="gold-divider mx-auto mt-5" />
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="glass rounded-xl p-1 flex gap-1">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === i
                    ? "text-[#0A0F1E]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {activeTab === i && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500"
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Service cards */}
        <motion.div
          key={activeTab}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeScale}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`glass rounded-xl p-5 border ${
                accentColor === "amber"
                  ? "border-transparent hover:border-amber-400/30"
                  : "border-transparent hover:border-blue-400/30"
              } card-hover cursor-default`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  accentColor === "amber"
                    ? "bg-amber-400/10 text-amber-400"
                    : "bg-blue-400/10 text-blue-400"
                }`}
              >
                {s.icon}
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 mb-4">
            Need a custom solution?{" "}
            <span className="text-amber-400 font-semibold">We&apos;ve got you covered.</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-gold"
          >
            Discuss Your Requirements
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
