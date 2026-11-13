"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ShieldCheck, Key, ArrowRight, ArrowLeft, Mail, MessageCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

interface OwnerAuthGateProps {
  moduleName: string;
  moduleDescription: string;
  onAuthenticated: () => void;
}

export function OwnerAuthGate({ moduleName, moduleDescription, onAuthenticated }: OwnerAuthGateProps) {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.authenticated) {
        onAuthenticated();
      } else {
        setErrorMsg(data.error || "Authentication failed. Invalid owner master password.");
      }
    } catch {
      setErrorMsg("Network error verifying master password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-swiss-light">
      <div className="w-full max-w-lg bg-swiss-white border border-swiss-divider rounded-2xl p-8 sm:p-10 shadow-lg">
        {/* Header Badge */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit mb-6">
          <Lock className="h-3.5 w-3.5 text-amber-600" />
          <span>Private Career Asset &bull; Owner Only</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-swiss-navy tracking-tight">
          {moduleName}
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          {moduleDescription}
        </p>

        {/* Notice Card */}
        <div className="mt-6 p-4 rounded-xl bg-swiss-light border border-swiss-divider text-xs text-gray-600 space-y-2">
          <div className="font-semibold text-swiss-navy flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Strict Privacy & Recruiter Discretion Protocol</span>
          </div>
          <p className="leading-relaxed">
            Per platform governance and faculty review guidelines, comprehensive resume exports, the exhaustive 4-tier skill matrix, and the JD Matcher require authenticated owner authorization.
          </p>
        </div>

        {/* Owner Unlock Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="owner-passcode" className="block text-xs font-bold uppercase tracking-wider text-swiss-navy mb-1.5">
              Owner Master Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="owner-passcode"
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter owner secret to unlock..."
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-swiss-divider bg-swiss-white text-sm text-swiss-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-swiss-blue focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-start space-x-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl" role="alert">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !passcode.trim()}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 px-5 rounded-xl bg-swiss-navy hover:bg-black text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Verifying authorization...</span>
            ) : (
              <>
                <span>Unlock {moduleName}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Recruiter Outreach Alternative */}
        <div className="mt-8 pt-6 border-t border-swiss-divider">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Visiting as a Recruiter or Hiring Partner?
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            If you represent a technology firm, staffing agency, or academic institution and need a formal copy of Albert&apos;s verified CV, please connect directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              href="https://wa.me/919910705796?text=Hi%20Albert,%20I%20am%20a%20recruiter%20and%20would%20like%20to%20request%20your%20verified%20resume."
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Request via WhatsApp</span>
            </a>
            <a
              href="mailto:hello@albert.does.software?subject=Resume%20Request%20-%20Recruiter%20Outreach"
              className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-swiss-divider bg-swiss-white hover:bg-swiss-light text-swiss-navy text-xs font-semibold transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-swiss-blue" />
              <span>Request via Email</span>
            </a>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-swiss-navy transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Return to Public Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
