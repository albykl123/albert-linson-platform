"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FreeStackAdminModule } from "@/components/admin/FreeStackAdminModule";
import { Lock, ShieldAlert, ArrowRight, RefreshCw } from "lucide-react";

export default function FreeStackPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Redirect public visitors to admin authentication
          router.replace("/admin?tab=freestack");
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        router.replace("/admin?tab=freestack");
      });
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-slate-600 text-sm flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          <span>Verifying administrator clearance...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600 mb-4 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Authorization Required</h1>
          <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
            The FreeStack Developer Directory and cloud tool evaluation engine are restricted exclusively to platform administration.
          </p>

          <Link
            href="/admin?tab=freestack"
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Proceed to Admin Sign-In</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <FreeStackAdminModule />
      </div>
    </div>
  );
}
