"use client";

import { motion } from "framer-motion";
import { ArrowUp, Briefcase, MessageCircle, AtSign, Globe } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home",       href: "#home"     },
  { label: "About Us",   href: "#about"    },
  { label: "Our Brands", href: "#brands"   },
  { label: "Services",   href: "#services" },
  { label: "Contact Us", href: "#contact"  },
];

const gstServices    = ["GST Registration", "GSTR-1 / 3B Filing", "Annual Returns (GSTR-9)", "ITC Reconciliation", "GST Audit Support", "Refund Claims"];
const softwareServices = ["Web App Development", "Mobile Apps", "SaaS Platforms", "Cloud & DevOps", "AI Automation", "API Integration"];
const socials = [
  { icon: <Briefcase     size={16} />, href: "#", label: "LinkedIn"  },
  { icon: <MessageCircle size={16} />, href: "#", label: "Twitter"   },
  { icon: <AtSign        size={16} />, href: "#", label: "Instagram" },
  { icon: <Globe         size={16} />, href: "#", label: "Web"       },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-sky-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo-dark.svg"
              alt="Bhandari & Co."
              width={220}
              height={56}
              className="h-14 w-auto"
              style={{ width: "auto" }}
            />
            <p className="text-slate-400 text-sm leading-relaxed">
              India&apos;s trusted partner for GST compliance and enterprise software — empowering
              businesses to grow with confidence.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500 transition-colors"
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })}
                    className="text-slate-400 hover:text-sky-400 text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* GST */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">GST Services</h4>
            <ul className="flex flex-col gap-2.5">
              {gstServices.map((s) => (
                <li key={s} className="text-slate-400 text-sm hover:text-sky-400 cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>

          {/* Software */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Software Solutions</h4>
            <ul className="flex flex-col gap-2.5">
              {softwareServices.map((s) => (
                <li key={s} className="text-slate-400 text-sm hover:text-indigo-400 cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border border-slate-700">
          <div>
            <div className="text-white font-bold">Stay GST Compliant</div>
            <div className="text-slate-400 text-sm">Get free GST updates, deadline reminders, and tax tips.</div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="your@email.com" className="form-input sm:w-52 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400" />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <p className="text-slate-500 text-sm text-center">
            © {new Date().getFullYear()} Bhandari & Co. All rights reserved. |{" "}
            <span className="hover:text-sky-400 cursor-pointer transition-colors">Privacy Policy</span>{" "}
            |{" "}
            <span className="hover:text-sky-400 cursor-pointer transition-colors">Terms of Service</span>
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -3, scale: 1.1 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0"
            aria-label="Scroll to top"
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
