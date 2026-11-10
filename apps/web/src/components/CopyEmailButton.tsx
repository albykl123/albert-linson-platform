"use client";

import React, { useState } from "react";
import { Mail, Copy, Check, ExternalLink } from "lucide-react";
import { masterProfile } from "@/lib/profileData";

interface CopyEmailButtonProps {
  variant?: "primary" | "secondary" | "pill" | "minimal";
  className?: string;
  showIcon?: boolean;
  labelPrefix?: string;
}

export function CopyEmailButton({
  variant = "primary",
  className = "",
  showIcon = true,
  labelPrefix = "Email: "
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const email = masterProfile.personal.email || "hello@albert.does.software";

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn("Clipboard copy failed:", err);
    }
  };

  if (variant === "minimal") {
    return (
      <div className={`inline-flex items-center space-x-1.5 ${className}`}>
        <a
          href={`mailto:${email}`}
          className="text-swiss-blue font-semibold hover:underline"
          title={`Email ${email}`}
        >
          {email}
        </a>
        <button
          onClick={handleCopy}
          aria-label="Copy professional email address"
          title={copied ? "Copied to clipboard!" : "Copy email address"}
          className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div className={`inline-flex items-center rounded-full bg-slate-900/5 dark:bg-white/10 px-3 py-1 text-xs border border-slate-200 dark:border-white/10 ${className}`}>
        {showIcon && <Mail className="h-3.5 w-3.5 text-blue-600 mr-1.5" />}
        <a
          href={`mailto:${email}`}
          className="font-medium text-slate-800 dark:text-slate-100 hover:text-blue-600 transition-colors"
        >
          {email}
        </a>
        <button
          onClick={handleCopy}
          aria-label="Copy professional email address"
          title={copied ? "Copied!" : "Copy email"}
          className="ml-2 pl-2 border-l border-slate-300 dark:border-white/20 text-slate-500 hover:text-blue-600 transition-colors"
        >
          {copied ? (
            <span className="flex items-center text-emerald-600 font-semibold text-[11px]">
              <Check className="h-3 w-3 mr-0.5" /> Copied!
            </span>
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
    );
  }

  // Primary / Secondary action button
  return (
    <div className={`relative inline-flex items-stretch rounded-lg shadow-sm ${className}`}>
      <a
        href={`mailto:${email}`}
        className={`inline-flex items-center space-x-2 px-5 py-3 rounded-l-lg text-sm font-semibold transition-all ${
          variant === "primary"
            ? "bg-swiss-navy text-swiss-white hover:bg-swiss-navy/90"
            : "border border-swiss-divider bg-swiss-white hover:bg-swiss-light text-swiss-navy"
        }`}
        title={`Compose email to ${email}`}
      >
        {showIcon && <Mail className="h-4 w-4" />}
        <span>{labelPrefix}{email}</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy professional email address to clipboard"
        title={copied ? "Copied to clipboard!" : "Copy email address"}
        className={`inline-flex items-center px-3.5 rounded-r-lg border-l transition-all ${
          variant === "primary"
            ? "bg-swiss-navy/90 hover:bg-swiss-navy text-swiss-white border-white/20"
            : "border-swiss-divider bg-swiss-white hover:bg-swiss-light text-slate-600 border-l"
        }`}
      >
        {copied ? (
          <span className="flex items-center text-emerald-400 font-semibold text-xs">
            <Check className="h-4 w-4" />
          </span>
        ) : (
          <Copy className="h-4 w-4 text-gray-300 hover:text-white" />
        )}
      </button>

      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-700 text-white text-[11px] font-bold shadow-md animate-fade-in pointer-events-none">
          Email copied!
        </span>
      )}
    </div>
  );
}
