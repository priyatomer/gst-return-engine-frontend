"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare } from "lucide-react";

const contactInfo = [
  { icon: <Phone  size={20} />, label: "Phone",         value: "+91 7737740024",                    sub: "Mon–Sat, 10AM–7PM IST"       },
  { icon: <Mail   size={20} />, label: "Email",         value: "bhandariandcompanygroup@gmail.com",  sub: "We reply within 24 hours"    },
  { icon: <MapPin size={20} />, label: "Office",        value: "Jaipur, Rajasthan",                 sub: "Pan-India Operations"        },
  { icon: <Clock  size={20} />, label: "Working Hours", value: "Mon – Sat",                         sub: "10:00 AM – 7:00 PM IST"      },
];

const services = [
  "GST Registration", "Return Filing", "ITC Reconciliation",
  "GST Audit Support", "Software Development", "Other",
];

export default function Contact() {
  const ref       = useRef(null);
  const inView    = useInView(ref, { once: true, margin: "-80px" });
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <section id="contact" className="section-padding section-white relative overflow-hidden">
      <div className="absolute top-20  right-20 w-80 h-80 bg-sky-100/50    rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="text-sky-500 text-sm font-semibold uppercase tracking-widest">
            Get In Touch
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-black text-slate-800">
            Let&apos;s Start a <span className="gradient-text">Conversation</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Whether it&apos;s a GST query, a software project, or just a quick hello — our team
            is ready to help.
          </p>
          <div className="sky-divider mx-auto mt-5" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-5">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-500 shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">{c.label}</div>
                    <div className="text-slate-800 font-semibold text-sm">{c.value}</div>
                    <div className="text-slate-400 text-xs">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <motion.a
              whileHover={{ scale: 1.02, y: -3 }}
              href="https://wa.me/917737740024"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-4 flex items-center gap-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <MessageSquare size={20} className="text-emerald-500" />
              </div>
              <div>
                <div className="text-slate-800 font-semibold text-sm">Chat on WhatsApp</div>
                <div className="text-slate-400 text-xs">Instant response during business hours</div>
              </div>
            </motion.a>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-500">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-slate-800 text-2xl font-black">Message Received!</h3>
                  <p className="text-slate-500 max-w-sm">
                    Thank you for reaching out. One of our experts will contact you within 24 business hours.
                  </p>
                  <button onClick={() => setDone(false)} className="btn-outline text-sm mt-2">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Rajesh Kumar" className="form-input" />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Email Address *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="rajesh@company.com" className="form-input" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Phone Number</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="form-input" />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Service Required</label>
                      <select name="service" value={form.service} onChange={handleChange} className="form-input">
                        <option value="">Select a service...</option>
                        {services.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs uppercase tracking-wider mb-1.5 block">Your Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Tell us about your business needs..." className="form-input resize-none" />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary justify-center mt-2"
                  >
                    Send Message
                    <Send size={16} />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
