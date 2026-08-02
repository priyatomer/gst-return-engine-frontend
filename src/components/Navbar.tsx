"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home",       href: "#home" },
  { label: "About Us",   href: "#about" },
  { label: "Our Brands", href: "#brands" },
  { label: "Services",   href: "#services" },
  { label: "Contact",    href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeSection, setActive]    = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.4 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const goto = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md shadow-sky-100 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => goto("#home")}
          >
            <Image
              src="/logo.svg"
              alt="Bhandari & Co."
              width={220}
              height={56}
              priority
              className="h-14 w-auto"
              style={{ width: "auto" }}
            />
          </motion.div>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => {
              const id       = href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <li key={label}>
                  <button
                    onClick={() => goto(href)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-600 hover:text-sky-500"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/fee-sheet">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
              >
                <FileText size={14} /> Fee Sheet
              </motion.span>
            </Link>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goto("#contact")}
              className="btn-primary text-sm"
            >
              Get Free Consultation
            </motion.button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[68px] left-0 right-0 z-40 bg-white/95 backdrop-blur-xl shadow-xl border-b border-sky-100"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
              {navLinks.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => goto(href)}
                  className="text-left py-3 px-4 text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all text-base font-medium"
                >
                  {label}
                </button>
              ))}
              <Link href="/fee-sheet" className="flex items-center gap-2 py-3 px-4 text-sky-600 hover:bg-sky-50 rounded-lg transition-all text-base font-medium border border-sky-100">
                <FileText size={16} /> Fee Sheet
              </Link>
              <button
                onClick={() => goto("#contact")}
                className="btn-primary text-sm mt-2 justify-center"
              >
                Get Free Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
