"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Code2, ArrowRight, CheckCircle2, BarChart3, Globe, Zap, Database } from "lucide-react";

const brands = [
  {
    id: "gst",
    badge: "Business Unit 01",
    icon: <FileText size={36} />,
    name: "GST Filing Services",
    tagline: "End-to-End GST Compliance, Simplified",
    description:
      "From registration and return filing to audit support and refund claims — our GST experts handle it all with precision, speed, and zero penalties.",
    gradient: "from-sky-50 to-blue-50",
    border: "border-sky-200 hover:border-sky-400",
    iconBg: "bg-sky-100 text-sky-600",
    badgeColor: "text-sky-600 bg-sky-100",
    arrowColor: "text-sky-600",
    num: "text-sky-300",
    highlights: [
      { icon: <FileText    size={14} />, text: "GSTR-1, 2A, 3B, 9, 9C Returns" },
      { icon: <CheckCircle2 size={14} />, text: "GST Registration & Amendments"  },
      { icon: <BarChart3   size={14} />, text: "Reconciliation & Audit Reports"  },
      { icon: <Zap         size={14} />, text: "ITC Maximization"               },
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
    gradient: "from-indigo-50 to-violet-50",
    border: "border-indigo-200 hover:border-indigo-400",
    iconBg: "bg-indigo-100 text-indigo-600",
    badgeColor: "text-indigo-600 bg-indigo-100",
    arrowColor: "text-indigo-600",
    num: "text-indigo-200",
    highlights: [
      { icon: <Globe    size={14} />, text: "Custom Web & Mobile Apps"     },
      { icon: <Database size={14} />, text: "Cloud Infrastructure & DevOps" },
      { icon: <Code2    size={14} />, text: "SaaS Product Development"      },
      { icon: <Zap      size={14} />, text: "AI & Automation Solutions"     },
    ],
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.2 } } };
const fadeUp  = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Brands() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="brands" className="section-padding section-sky relative overflow-hidden">
      <div className="absolute top-20  left-10  w-72 h-72 bg-sky-200/30  rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest">
            Our Businesses
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight">
            Two Powerhouse <span className="gradient-text">Brands, One Vision</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Bhandari & Co. operates two distinct yet synergistic business units — each a leader in
            its domain, united by our commitment to excellence.
          </p>
          <div className="sky-divider mx-auto mt-5" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid lg:grid-cols-2 gap-8"
        >
          {brands.map((b) => (
            <motion.div
              key={b.id}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className={`relative rounded-2xl border ${b.border} bg-gradient-to-br ${b.gradient} p-8 transition-all duration-300 cursor-default overflow-hidden shadow-sm hover:shadow-xl`}
            >
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${b.badgeColor} mb-5 uppercase tracking-wider`}>
                {b.badge}
              </span>

              <div className="flex items-start gap-5 mb-5">
                <div className={`w-16 h-16 rounded-2xl ${b.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                  {b.icon}
                </div>
                <div>
                  <h3 className="text-slate-800 text-2xl font-black">{b.name}</h3>
                  <p className="text-slate-500 text-sm mt-1 italic">{b.tagline}</p>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">{b.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {b.highlights.map(({ icon, text }) => (
                  <div key={text} className={`flex items-center gap-2 text-slate-600 text-sm ${b.arrowColor}`}>
                    <span>{icon}</span>
                    <span className="text-slate-600">{text}</span>
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ x: 4 }}
                className={`flex items-center gap-2 text-sm font-semibold ${b.arrowColor} group`}
                onClick={() =>
                  document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explore Services
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className={`absolute bottom-4 right-6 text-8xl font-black opacity-10 ${b.num} pointer-events-none select-none`}>
                0{b.id === "gst" ? "1" : "2"}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
