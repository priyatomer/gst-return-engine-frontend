"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FileText, RefreshCw, AlertCircle, DollarSign, BookOpen, ShieldCheck, Globe, Smartphone, Server, Bot, BarChart, Lock } from "lucide-react";

const tabs = ["GST Filing Services", "Software Solutions"];

const gstServices = [
  { icon: <FileText    size={22} />, title: "GST Registration",     desc: "New registrations, amendments, cancellations, and revocations handled seamlessly."          },
  { icon: <RefreshCw   size={22} />, title: "Return Filing (GSTR)", desc: "GSTR-1, GSTR-3B, GSTR-9, GSTR-9C — all filings done accurately before deadlines."           },
  { icon: <BarChart    size={22} />, title: "ITC Reconciliation",   desc: "Maximize Input Tax Credit with thorough 2A/2B reconciliation and dispute resolution."         },
  { icon: <DollarSign  size={22} />, title: "Refund Claims",        desc: "Export refunds, inverted duty structure refunds handled from application to receipt."          },
  { icon: <AlertCircle size={22} />, title: "Notice & Audit",       desc: "Expert representation for GST notices, audits, appeals, and departmental proceedings."         },
  { icon: <BookOpen    size={22} />, title: "GST Advisory",         desc: "Strategic tax planning, HSN/SAC classification, rate optimization for your industry."          },
  { icon: <ShieldCheck size={22} />, title: "Annual Compliance",    desc: "GSTR-9 & GSTR-9C annual return filing with full audit trail and documentation."                },
  { icon: <RefreshCw   size={22} />, title: "e-Way Bill & e-Invoicing", desc: "Bulk generation of e-Way Bills and e-Invoices; modification, cancellation, and compliance management."         },
];

const softwareServices = [
  { icon: <Globe       size={22} />, title: "Web App Development",  desc: "Full-stack React/Next.js and Node.js applications with modern, scalable architecture."         },
  { icon: <Smartphone  size={22} />, title: "Mobile App Dev",       desc: "Cross-platform iOS and Android applications using React Native and Flutter."                   },
  { icon: <Server      size={22} />, title: "Cloud & DevOps",       desc: "AWS/GCP infrastructure, CI/CD pipelines, containerization, and 24/7 monitoring."              },
  { icon: <Bot         size={22} />, title: "AI & Automation",      desc: "Intelligent automation, AI chatbots, data pipelines, and ML model integration."                },
  { icon: <BarChart    size={22} />, title: "SaaS Development",     desc: "End-to-end SaaS platforms from MVP to enterprise scale with subscription management."          },
  { icon: <Lock        size={22} />, title: "Cybersecurity",        desc: "Security audits, penetration testing, compliance (ISO 27001, SOC2), and hardening."            },
  { icon: <FileText    size={22} />, title: "ERP & CRM",            desc: "Custom ERP, CRM, and HRMS systems integrated with your existing business tools."               },
  { icon: <RefreshCw   size={22} />, title: "API Integration",      desc: "RESTful & GraphQL APIs, third-party integrations, and microservices architecture."              },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeScale = {
  hidden:  { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Services() {
  const [active, setActive] = useState(0);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const services  = active === 0 ? gstServices : softwareServices;
  const iconColor = active === 0 ? "text-sky-500 bg-sky-50 border-sky-200" : "text-indigo-500 bg-indigo-50 border-indigo-200";

  return (
    <section id="services" className="section-padding section-white relative overflow-hidden">
      <div className="absolute top-0 left-1/3   w-80 h-80 bg-sky-100/50    rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-slate-800">
            Comprehensive <span className="gradient-text">Services</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Explore our full suite of professional services designed to keep your business
            compliant, competitive, and future-ready.
          </p>
          <div className="sky-divider mx-auto mt-5" />
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="bg-slate-100 rounded-xl p-1 flex gap-1 shadow-inner">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActive(i)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  active === i ? "text-white" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {active === i && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 shadow-md"
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <motion.div
          key={active}
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
              className="bg-white rounded-xl p-5 border border-slate-100 hover:border-sky-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${iconColor}`}>
                {s.icon}
              </div>
              <h3 className="text-slate-800 font-bold text-sm mb-2">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 mb-4">
            Need a custom solution?{" "}
            <span className="text-sky-600 font-semibold">We&apos;ve got you covered.</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-primary"
          >
            Discuss Your Requirements
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
