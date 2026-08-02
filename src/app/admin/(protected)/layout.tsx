"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, AuthUser } from "@/lib/adminAuth";
import AdminShell from "@/components/admin/AdminShell";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser]     = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getAuth();
    if (!u) { router.replace("/admin/login"); return; }
    setUser(u);
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <svg className="animate-spin w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }

  return <AdminShell user={user}>{children}</AdminShell>;
}
