"use client";

import { motion } from "framer-motion";
import { ArrowUp, Briefcase, MessageCircle, AtSign, Globe } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Brands", href: "#brands" },
  { label: "Services", href: "#services" },
  { label: "Contact Us", href: "#contact" },
];

const gstServices = [
  "GST Registration",
  "GSTR-1 / 3B Filing",
  "Annual Returns (GSTR-9)",
  "ITC Reconciliation",
  "GST Audit Support",
  "Refund Claims",
];

const softwareServices = [
  "Web App Development",
  "Mobile Apps",
  "SaaS Platforms",
  "Cloud & DevOps",
  "AI Automation",
  "API Integration",
];

const socials = [
  { icon: <Briefcase size={18} />, href: "#", label: "LinkedIn" },
  { icon: <MessageCircle size={18} />, href: "#", label: "Twitter" },
  { icon: <AtSign size={18} />, href: "#", label: "Instagram" },
  { icon: <Globe size={18} />, href: "#", label: "Facebook" },
];

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function Footer() {
  return (
    <footer className="bg-[#030712] border-t border-white/5 relative overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-xl text-[#0A0F1E]">
                B
              </div>
              <div>
                <div className="text-white font-bold">Bhandari</div>
                <div className="text-amber-400 text-xs tracking-widest uppercase">& Co.</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              India&apos;s trusted partner for GST compliance and enterprise software — empowering
              businesses to grow with confidence.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-1">
              {socials.map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-9 h-9 rounded-lg glass-light flex items-center justify-center text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() =>
                      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* GST services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              GST Services
            </h4>
            <ul className="flex flex-col gap-2.5">
              {gstServices.map((s) => (
                <li key={s} className="text-slate-400 text-sm hover:text-amber-400 cursor-pointer transition-colors">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Software services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Software Solutions
            </h4>
            <ul className="flex flex-col gap-2.5">
              {softwareServices.map((s) => (
                <li key={s} className="text-slate-400 text-sm hover:text-blue-400 cursor-pointer transition-colors">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="glass rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="text-white font-bold">Stay GST Compliant</div>
            <div className="text-slate-400 text-sm">
              Get free GST updates, deadline reminders, and tax tips.
            </div>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 w-full sm:w-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="form-input sm:w-56"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Bhandari & Co. All rights reserved. |{" "}
            <span className="hover:text-amber-400 cursor-pointer transition-colors">
              Privacy Policy
            </span>{" "}
            |{" "}
            <span className="hover:text-amber-400 cursor-pointer transition-colors">
              Terms of Service
            </span>
          </p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 hover:bg-amber-400/20 transition-all shrink-0"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
