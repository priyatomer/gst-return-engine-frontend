"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2, TrendingUp, Shield, Cpu } from "lucide-react";

const floatingBadges = [
  { icon: <CheckCircle2 size={15} />, text: "GST Compliant",    x: "4%",  y: "28%", delay: 0   },
  { icon: <TrendingUp   size={15} />, text: "99% Accuracy",     x: "78%", y: "18%", delay: 0.5 },
  { icon: <Shield       size={15} />, text: "Secure & Trusted", x: "82%", y: "62%", delay: 1   },
  { icon: <Cpu          size={15} />, text: "AI Powered",       x: "2%",  y: "68%", delay: 0.8 },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Soft glow orbs */}
      <div className="absolute top-1/4  left-1/4  w-96 h-96 bg-sky-300/30  rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2  left-1/2  -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Floating badges */}
      {floatingBadges.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + b.delay, duration: 0.5 }}
          className="hidden lg:flex absolute glass items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold text-sky-700 shadow-md float-anim"
          style={{ left: b.x, top: b.y, animationDelay: `${b.delay}s` }}
        >
          <span className="text-sky-500">{b.icon}</span>
          {b.text}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Tag */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-300 bg-sky-50 text-sky-600 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              India&apos;s Trusted Multi-Business Partner
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight text-slate-800"
          >
            Simplify GST.{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">Accelerate Growth.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-slate-500 text-lg sm:text-xl leading-relaxed"
          >
            From hassle-free GST filing to powerful software solutions — Bhandari & Co.
            delivers end-to-end business services that drive compliance and innovation.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary text-base px-8 py-4"
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
              <Play size={15} fill="currentColor" />
              Explore Our Services
            </motion.button>
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-sky-400 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-sky-400 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
}
