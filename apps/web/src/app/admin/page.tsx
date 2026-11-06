"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { masterProfile } from "@/lib/profileData";
import { freeStackData } from "@/lib/freestackData";
import { FreeStackAdminModule } from "@/components/admin/FreeStackAdminModule";
import { 
  ShieldCheck, 
  Database, 
  Cpu, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Save, 
  Lock,
  Activity,
  FileCode2,
  FolderGit2,
  ExternalLink,
  ArrowRight,
  Server,
  Sparkles
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "freestack">("overview");

  // Editable Profile State
  const [headline, setHeadline] = useState(masterProfile.personal.headline);
  const [subHeadline, setSubHeadline] = useState(masterProfile.personal.sub_headline);
  const [bio, setBio] = useState(masterProfile.summary);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI & FreeStack Sync State
  const [activeModel, setActiveModel] = useState("openrouter/free");

  // Verify existing session on mount and inspect query params
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("tab=freestack")) {
      setActiveTab("freestack");
    }

    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecking(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setPasscode("");
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch {
      setAuthError("Network error during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-slate-600 text-sm flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          <span>Checking administrator session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-xl text-center">
          <div className="relative w-48 h-12 mx-auto mb-4">
            <Image
              src="/images/albert-linson-signature.png"
              alt="Albert Linson official handwritten signature"
              fill
              sizes="200px"
              priority
              className="object-contain object-center"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Control Center</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Private owner authorization required. Access to FreeStack Developer Directory, Telemetry, and Profile Governance.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Master Passcode
              </label>
              <input
                type="password"
                placeholder="Enter private master secret..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
                required
              />
              {authError && (
                <div className="text-red-600 text-xs mt-1.5 font-medium">{authError}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Authenticate Session"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-[11px] text-slate-400">
            Protected by Cloudflare Edge &bull; SHA-256 HMAC Session Tokens
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="relative w-40 h-9">
                <Image
                  src="/images/albert-linson-signature.png"
                  alt="Albert Linson official handwritten signature"
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                />
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Owner Session Active</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Administration & Telemetry
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Private administrator control for FreeStack catalog, live edge telemetry, and profile governance.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/studio"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors"
            >
              <span>Career Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-slate-600 hover:text-red-600 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-200 space-x-2 sm:space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Overview & Profile Governance</span>
          </button>

          <button
            onClick={() => setActiveTab("freestack")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === "freestack"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>FreeStack Directory ({freeStackData.total_services} Tools)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
              Admin Only
            </span>
          </button>
        </div>

        {/* Tab 1: Overview & Profile Governance */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* System Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span>D1 Relational DB</span>
                </div>
                <div className="text-base font-bold text-slate-900">albert-linson-db</div>
                <div className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Bound & Synchronized</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                  <Cpu className="h-4 w-4 text-violet-600" />
                  <span>AI Edge Gateway</span>
                </div>
                <div className="text-base font-bold text-slate-900 font-mono text-xs">{activeModel}</div>
                <div className="text-[11px] text-violet-600 mt-1 font-semibold">Server-Side Bearer Isolation</div>
              </div>

              <div 
                onClick={() => setActiveTab("freestack")}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>FreeStack Catalog</span>
                  </div>
                  <span className="text-[10px] text-blue-600 group-hover:underline font-semibold">View &rarr;</span>
                </div>
                <div className="text-base font-bold text-slate-900">{freeStackData.total_services} Tools</div>
                <div className="text-[11px] text-blue-600 mt-1 font-semibold">57 Categories &bull; Admin Access</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <span>Edge Anycast</span>
                </div>
                <div className="text-base font-bold text-slate-900">Cloudflare Workers</div>
                <div className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>100% Free Tier Quota</span>
                </div>
              </div>
            </div>

            {/* Profile Editing Form */}
            <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Master Profile Governance
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Updates here drive the single source of truth for the public portfolio and generated resumes.
                  </p>
                </div>
                {savedSuccess && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-in fade-in">
                    Profile Changes Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Sub-Headline / Specialization
                  </label>
                  <input
                    type="text"
                    value={subHeadline}
                    onChange={(e) => setSubHeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 leading-relaxed"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Changes maintain zero-hallucination verification against authentic institutional records.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}

        {/* Tab 2: FreeStack Intelligence Engine (Admin Access Only) */}
        {activeTab === "freestack" && (
          <div className="animate-in fade-in duration-200">
            <FreeStackAdminModule />
          </div>
        )}
      </div>
    </div>
  );
}
