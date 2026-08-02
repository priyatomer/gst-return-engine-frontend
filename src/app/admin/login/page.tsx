"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doLogin, getAuth } from "@/lib/adminAuth";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (getAuth()) router.replace("/admin/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const user = doLogin(email, password);
    setLoading(false);
    if (!user) { setError("Invalid email or password."); return; }
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <svg width="44" height="44" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lg1" x1="24" y1="11" x2="24" y2="69" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#18D8F5"/>
                    <stop offset="48%" stopColor="#4B6CF7"/>
                    <stop offset="100%" stopColor="#7B2FEE"/>
                  </linearGradient>
                </defs>
                <line x1="24" y1="11" x2="24" y2="69" stroke="url(#lg1)" strokeWidth="12" strokeLinecap="round"/>
                <path d="M 24,11 A 21,14 0 0,1 24,39" fill="none" stroke="url(#lg1)" strokeWidth="10.5" strokeLinecap="round"/>
                <path d="M 24,39 A 27,15 0 0,1 24,69" fill="none" stroke="url(#lg1)" strokeWidth="11.5" strokeLinecap="round"/>
                <line x1="9" y1="75" x2="63" y2="11" stroke="#4B6CF7" strokeWidth="7.5" strokeLinecap="round"/>
                <polygon fill="#4B6CF7" points="67,7 63,23 52,14"/>
              </svg>
              <div>
                <div className="text-lg font-bold text-slate-900 leading-none">Bhandari &amp; Co.</div>
                <div className="text-xs text-slate-400 mt-0.5 tracking-wide">GST FILING · BUSINESS SERVICES</div>
              </div>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
              <p className="text-sm text-slate-500 mt-1">Sign in to access the management system</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <AlertCircle size={15} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@bhandariandco.com"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50
                    focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl border border-slate-200 bg-slate-50
                      focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl
                  bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold
                  shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all
                  disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                ) : <LogIn size={15} />}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
              <p className="font-semibold text-slate-600 mb-1.5">Demo Credentials</p>
              <p>Email: <span className="font-mono text-slate-700">admin@bhandariandco.com</span></p>
              <p>Password: <span className="font-mono text-slate-700">Admin@123</span></p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-5">
          © {new Date().getFullYear()} Bhandari &amp; Company · All rights reserved
        </p>
      </div>
    </div>
  );
}
