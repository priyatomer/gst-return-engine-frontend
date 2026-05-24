"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, TrendingUp, Shield, Cpu } from "lucide-react";

const floatingBadges = [
  { icon: <CheckCircle2 size={16} />, text: "GST Compliant", x: "5%", y: "30%", delay: 0 },
  { icon: <TrendingUp size={16} />, text: "99% Accuracy", x: "80%", y: "20%", delay: 0.5 },
  { icon: <Shield size={16} />, text: "Secure & Trusted", x: "85%", y: "65%", delay: 1 },
  { icon: <Cpu size={16} />, text: "AI Powered", x: "3%", y: "70%", delay: 0.8 },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating badges */}
      {floatingBadges.map((badge, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + badge.delay, duration: 0.5 }}
          className="hidden lg:flex absolute glass-light items-center gap-2 px-3 py-2 rounded-full text-xs font-medium text-amber-300 float-anim"
          style={{
            left: badge.x,
            top: badge.y,
            animationDelay: `${badge.delay}s`,
          }}
        >
          <span className="text-amber-400">{badge.icon}</span>
          {badge.text}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Tag */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              India&apos;s Trusted Multi-Business Partner
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight"
          >
            Simplify GST.{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">Accelerate Growth.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-slate-400 text-lg sm:text-xl leading-relaxed"
          >
            From hassle-free GST filing to powerful software solutions — Bhandari & Co.
            delivers end-to-end business services that drive compliance and innovation.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-gold text-base px-8 py-4 shadow-lg shadow-amber-500/20"
            >
              Start Your GST Filing
              <ArrowRight size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.querySelector("#brands")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-outline text-base px-8 py-4"
            >
              <Play size={16} fill="currentColor" />
              Explore Our Services
            </motion.button>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-8 mt-6 pt-6 border-t border-white/10 w-full"
          >
            {[
              { value: "10,000+", label: "Returns Filed" },
              { value: "99.8%", label: "Accuracy Rate" },
              { value: "500+", label: "Happy Clients" },
              { value: "8+", label: "Years Experience" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-amber-400 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
