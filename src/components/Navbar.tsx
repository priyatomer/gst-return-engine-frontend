"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Home",          href: "#home",          type: "anchor" as const },
  { label: "About Us",      href: "#about",         type: "anchor" as const },
  { label: "Our Brands",    href: "#brands",        type: "anchor" as const },
  { label: "Services",      href: "#services",      type: "anchor" as const },
  { label: "UK Accounting", href: "/uk-accounting", type: "route"  as const },
  { label: "Contact",       href: "#contact",       type: "anchor" as const },
];

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeSection, setActive]    = useState("home");
  const pathname = usePathname();
  const router   = useRouter();
  const isHome   = pathname === "/";

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

  // Anchor links only exist on the homepage — scroll there directly when
  // already home, otherwise navigate home first and let the hash take over.
  const goto = (href: string) => {
    setMobileOpen(false);
    if (isHome) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${href}`);
    }
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
            {navLinks.map(({ label, href, type }) => {
              const isActive = type === "route"
                ? pathname.startsWith(href)
                : isHome && activeSection === href.replace("#", "");
              const linkClass = `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive ? "text-sky-600" : "text-slate-600 hover:text-sky-500"
              }`;
              const indicator = isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                />
              );
              return (
                <li key={label}>
                  {type === "route" ? (
                    <Link href={href} className={linkClass}>
                      {label}
                      {indicator}
                    </Link>
                  ) : (
                    <button onClick={() => goto(href)} className={linkClass}>
                      {label}
                      {indicator}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
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
              {navLinks.map(({ label, href, type }) => {
                const mobileClass = "text-left py-3 px-4 text-slate-700 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all text-base font-medium";
                return type === "route" ? (
                  <Link key={label} href={href} onClick={() => setMobileOpen(false)} className={mobileClass}>
                    {label}
                  </Link>
                ) : (
                  <button key={label} onClick={() => goto(href)} className={mobileClass}>
                    {label}
                  </button>
                );
              })}
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
