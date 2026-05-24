"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, ShieldCheck, Users, TrendingUp, HeadphonesIcon, Sparkles } from "lucide-react";

const features = [
  { icon: <Clock            size={26} />, title: "On-Time Delivery",   desc: "We never miss a filing deadline. Your compliance is our calendar — zero late fees, guaranteed.",                          color: "sky"    },
  { icon: <ShieldCheck      size={26} />, title: "Zero-Error Accuracy",desc: "Multi-layer review process with 99.8% accuracy. Every return double-checked before submission.",                           color: "blue"   },
  { icon: <Users            size={26} />, title: "Expert Team",        desc: "CA, CS, and tech professionals with 8+ years of domain experience at your service.",                                        color: "indigo" },
  { icon: <TrendingUp       size={26} />, title: "Growth Oriented",    desc: "Beyond compliance — we advise on tax optimization strategies that directly boost your bottom line.",                         color: "violet" },
  { icon: <HeadphonesIcon   size={26} />, title: "Dedicated Support",  desc: "Your assigned relationship manager is always just a call or message away — not a ticket queue.",                            color: "cyan"   },
  { icon: <Sparkles         size={26} />, title: "Tech-Powered",       desc: "Proprietary automation tools reduce manual errors and cut your compliance time by 70%.",                                    color: "teal"   },
];

const colorMap: Record<string, string> = {
  sky:    "text-sky-500    bg-sky-50    border-sky-200",
  blue:   "text-blue-500   bg-blue-50   border-blue-200",
  indigo: "text-indigo-500 bg-indigo-50 border-indigo-200",
  violet: "text-violet-500 bg-violet-50 border-violet-200",
  cyan:   "text-cyan-600   bg-cyan-50   border-cyan-200",
  teal:   "text-teal-600   bg-teal-50   border-teal-200",
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function WhyUs() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding section-sky relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest">
            Why Bhandari & Co.
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-slate-800">
            The Advantage You <span className="gradient-text">Deserve</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            We don&apos;t just file returns — we build lasting partnerships, offer strategic
            guidance, and deliver technology-powered results.
          </p>
          <div className="sky-divider mx-auto mt-5" />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-sky-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${colorMap[f.color]}`}>
                {f.icon}
              </div>
              <h3 className="text-slate-800 font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonial strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-14 bg-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-sky-100"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} className="w-5 h-5 text-sky-400 fill-sky-400" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="text-slate-600 text-sm italic max-w-lg">
              &quot;Bhandari & Co. has been filing our GST returns for 3 years. Zero penalties,
              maximum ITC recovery, and a team that actually answers calls. Highly recommended.&quot;
            </p>
            <span className="text-sky-600 font-semibold text-sm">
              — Rajesh Mehta, Director, Mehta Textiles Pvt. Ltd.
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-primary shrink-0"
          >
            Join Our Clients
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
