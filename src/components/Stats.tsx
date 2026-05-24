"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { FileText, Users, Trophy, Building2 } from "lucide-react";

const stats = [
  { icon: <FileText  size={28} />, value: 5000, suffix: "+",   label: "GST Returns Filed",  color: "text-sky-500",    bg: "bg-sky-50    border-sky-200"   },
  { icon: <Users     size={28} />, value: 206,  suffix: "+",   label: "Happy Clients",      color: "text-blue-500",   bg: "bg-blue-50   border-blue-200"  },
  { icon: <Trophy    size={28} />, value: 99,   suffix: ".8%", label: "Accuracy Rate",      color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200"},
  { icon: <Building2 size={28} />, value: 5,    suffix: "+",   label: "Years of Excellence",color: "text-violet-500", bg: "bg-violet-50 border-violet-200"},
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true });
  const count   = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) animate(count, value, { duration: 2, ease: "easeOut" });
  }, [inView, value, count]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-20 section-sky relative overflow-hidden">
      <div className="absolute inset-x-0 top-0    h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-300 to-transparent" />

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
                className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 ${s.color} ${s.bg} shadow-sm transition-all duration-300`}
              >
                {s.icon}
              </motion.div>
              <div className={`text-3xl sm:text-4xl font-black mb-1 ${s.color}`}>
                {inView && <Counter value={s.value} suffix={s.suffix} />}
              </div>
              <div className="text-slate-500 text-sm font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
