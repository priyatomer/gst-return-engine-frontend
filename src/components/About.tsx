"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Heart, Award } from "lucide-react";

const values = [
  {
    icon: <Target size={22} />,
    title: "Mission Driven",
    desc: "Empowering businesses with seamless compliance and digital transformation, one client at a time.",
  },
  {
    icon: <Eye size={22} />,
    title: "Future Focused",
    desc: "We leverage technology and innovation to stay ahead, building solutions that scale with your growth.",
  },
  {
    icon: <Heart size={22} />,
    title: "Client Centric",
    desc: "Your success is our priority. We build long-term partnerships, not just transactions.",
  },
  {
    icon: <Award size={22} />,
    title: "Excellence First",
    desc: "From GST filing accuracy to software reliability, we never compromise on quality.",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-[#0F172A] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
            Who We Are
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            A Legacy of{" "}
            <span className="gradient-text">Trust & Innovation</span>
          </h2>
          <div className="gold-divider mx-auto mt-5" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: narrative */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex flex-col gap-6"
          >
            <motion.p variants={fadeLeft} className="text-slate-300 text-lg leading-relaxed">
              <span className="text-amber-400 font-semibold">Bhandari & Co.</span> is a
              next-generation multi-business conglomerate rooted in expertise, integrity, and
              technology. With operations spanning GST compliance and enterprise software, we
              serve thousands of businesses across India.
            </motion.p>
            <motion.p variants={fadeLeft} className="text-slate-400 leading-relaxed">
              Founded on the principles of accuracy, transparency, and client empowerment, we have
              grown into a trusted partner for startups, SMEs, and large enterprises alike. Our
              cross-domain expertise allows us to deliver holistic solutions that address both
              regulatory and technological challenges.
            </motion.p>

            {/* Key highlights */}
            <motion.div variants={fadeLeft} className="grid grid-cols-2 gap-4 mt-2">
              {[
                ["Pan-India Operations", "Serving clients in 20+ states"],
                ["Expert Team", "CA, CS & Tech professionals"],
                ["Tech-First Approach", "Automation at the core"],
                ["Timely Delivery", "Zero penalty track record"],
              ].map(([title, sub]) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <div>
                    <div className="text-white font-semibold text-sm">{title}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
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
              className="btn-gold self-start mt-2"
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
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeRight}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-xl p-5 cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-4">
                  {v.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
