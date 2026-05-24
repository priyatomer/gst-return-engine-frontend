"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { FileText, Users, Trophy, Building2 } from "lucide-react";

const stats = [
  { icon: <FileText size={28} />, value: 10000, suffix: "+", label: "GST Returns Filed", color: "text-amber-400" },
  { icon: <Users size={28} />, value: 500, suffix: "+", label: "Satisfied Clients", color: "text-blue-400" },
  { icon: <Trophy size={28} />, value: 99, suffix: ".8%", label: "Accuracy Rate", color: "text-emerald-400" },
  { icon: <Building2 size={28} />, value: 8, suffix: "+", label: "Years of Excellence", color: "text-purple-400" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [inView, value, count]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 relative overflow-hidden bg-[#0A0F1E]">
      {/* Top/bottom border lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4 ${s.color} group-hover:border-amber-400/30 transition-all duration-300`}
              >
                {s.icon}
              </motion.div>
              <div className={`text-3xl sm:text-4xl font-black ${s.color} mb-1`}>
                {inView && <Counter value={s.value} suffix={s.suffix} />}
              </div>
              <div className="text-slate-400 text-sm font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
