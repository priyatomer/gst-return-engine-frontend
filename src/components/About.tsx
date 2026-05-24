"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Heart, Award } from "lucide-react";

const values = [
  { icon: <Target size={22} />, title: "Mission Driven",  desc: "Empowering businesses with seamless compliance and digital transformation, one client at a time.", color: "sky"    },
  { icon: <Eye    size={22} />, title: "Future Focused",  desc: "We leverage technology and innovation to stay ahead, building solutions that scale with your growth.", color: "blue"   },
  { icon: <Heart  size={22} />, title: "Client Centric",  desc: "Your success is our priority. We build long-term partnerships, not just transactions.", color: "indigo" },
  { icon: <Award  size={22} />, title: "Excellence First",desc: "From GST filing accuracy to software reliability, we never compromise on quality.", color: "violet" },
];

const colorMap: Record<string, string> = {
  sky:    "text-sky-500    bg-sky-50    border-sky-200",
  blue:   "text-blue-500   bg-blue-50   border-blue-200",
  indigo: "text-indigo-500 bg-indigo-50 border-indigo-200",
  violet: "text-violet-500 bg-violet-50 border-violet-200",
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const fadeLeft = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};
const fadeRight = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function About() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding section-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/60   rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest">
            Who We Are
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 leading-tight">
            A Legacy of <span className="gradient-text">Trust & Innovation</span>
          </h2>
          <div className="sky-divider mx-auto mt-5" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            <motion.p variants={fadeLeft} className="text-slate-600 text-lg leading-relaxed">
              <span className="text-sky-600 font-semibold">Bhandari & Co.</span> is a
              next-generation multi-business conglomerate rooted in expertise, integrity, and
              technology. With operations spanning GST compliance and enterprise software.
            </motion.p>
            <motion.p variants={fadeLeft} className="text-slate-500 leading-relaxed">
              Founded on principles of accuracy, transparency, and client empowerment, we have
              grown into a trusted partner for startups, SMEs, and large enterprises alike.
            </motion.p>

            <motion.div variants={fadeLeft} className="grid grid-cols-2 gap-4 mt-2">
              {[
                ["Pan-India Operations", "Serving clients in 10+ states"],
                ["Expert Team",          "CA, CS & Tech professionals"],
                ["Tech-First Approach",  "Automation at the core"],
                ["Timely Delivery",      "Zero penalty track record"],
              ].map(([title, sub]) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                  <div>
                    <div className="text-slate-700 font-semibold text-sm">{title}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.button
              variants={fadeLeft}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary self-start mt-2"
            >
              Talk to Our Experts
            </motion.button>
          </motion.div>

          {/* Right: value cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeRight}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-sky-100 transition-all duration-300 cursor-default"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorMap[v.color]}`}>
                  {v.icon}
                </div>
                <h3 className="text-slate-800 font-bold mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
