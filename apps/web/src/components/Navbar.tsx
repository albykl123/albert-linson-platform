"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Layers, 
  Menu, 
  X, 
  FileText, 
  Lock,
  Unlock,
  Search,
  ArrowUpRight,
  Sparkles,
  Bot
} from "lucide-react";
import { openAlbertChat } from "./AvatarChatbot";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOwnerAuth, setIsOwnerAuth] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if the current user has an active authenticated admin session
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsOwnerAuth(true);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/experience", label: "Experience" },
    { href: "/leadership", label: "Leadership" },
    { href: "/education", label: "Education" },
    { href: "/projects", label: "Projects & Research", activeRoutes: ["/projects", "/research"] },
    { href: "/resume", label: "Resume & Skills", activeRoutes: ["/resume", "/skills"] },
    { href: "/matcher", label: "JD Matcher" },
  ];

  return (
    <header id="site-global-navbar" className="sticky top-0 z-50 w-full border-b border-swiss-divider bg-swiss-white/95 backdrop-blur-md transition-colors print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Official Handwritten Signature Logo */}
        <Link href="/" className="group flex flex-col justify-center py-0.5">
          <div className="relative w-[150px] sm:w-[170px] md:w-[185px] h-[34px] sm:h-[38px] transition-transform duration-200 group-hover:scale-[1.02]">
            <Image
              src="/images/albert-linson-signature.png"
              alt="Albert Linson handwritten signature logo"
              fill
              sizes="(max-width: 640px) 150px, (max-width: 768px) 170px, 185px"
              priority
              className="object-contain object-left filter contrast-[1.05]"
            />
          </div>
          <span className="text-[10px] text-gray-500 hidden sm:block tracking-wide font-sans pl-0.5 -mt-0.5">
            Professional Intelligence Platform
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.activeRoutes && link.activeRoutes.includes(pathname));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-swiss-light text-swiss-navy font-semibold border border-swiss-divider"
                    : "text-gray-600 hover:text-swiss-navy hover:bg-swiss-light/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA & Discrete Owner Access */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={() => openAlbertChat()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-slate-950 text-cyan-300 hover:bg-slate-900 text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all hover:scale-[1.02] cursor-pointer"
            title="Converse with Albert's AI Digital Twin"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>AI Twin</span>
          </button>

          <Link
            href="/matcher"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-swiss-navy text-white hover:bg-swiss-navy/90 text-xs font-semibold shadow-sm transition-all"
            title="Recruiter JD Matcher"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>JD Matcher</span>
          </Link>

          <Link
            href="/resume"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-swiss-divider bg-swiss-light text-swiss-navy hover:bg-swiss-divider/50 text-xs font-semibold transition-all shadow-sm"
          >
            <FileText className="h-3.5 w-3.5 text-swiss-blue" />
            <span>Resume</span>
          </Link>

          {isOwnerAuth ? (
            <Link
              href="/studio"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-swiss-blue text-white text-xs font-semibold shadow-sm hover:bg-swiss-blue/90 transition-all"
              title="Authenticated Owner Studio"
            >
              <Unlock className="h-3 w-3" />
              <span>Studio</span>
            </Link>
          ) : (
            <Link
              href="/admin"
              className="p-2 text-gray-400 hover:text-swiss-navy transition-colors rounded-lg hover:bg-swiss-light"
              title="Owner Sign-In"
              aria-label="Owner Sign-In"
            >
              <Lock className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center space-x-2">
          {isOwnerAuth && (
            <Link
              href="/studio"
              className="p-1.5 rounded-md bg-swiss-blue text-white text-[11px] font-semibold"
            >
              Studio
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-swiss-navy hover:bg-swiss-light transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="sm:hidden border-b border-swiss-divider bg-swiss-white px-4 py-4 space-y-1 shadow-lg animate-in fade-in duration-150">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.activeRoutes && link.activeRoutes.includes(pathname));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-swiss-light text-swiss-navy font-semibold"
                    : "text-gray-700 hover:bg-swiss-light/60 hover:text-swiss-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-swiss-divider space-y-2">
            <button
              onClick={() => {
                setIsOpen(false);
                openAlbertChat();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg border border-cyan-500/40 bg-slate-950 text-cyan-300 text-xs font-semibold shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Talk to Albert AI Digital Twin</span>
            </button>
            <div className="flex items-center justify-between pt-1">
              <Link
                href="/resume"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-swiss-blue"
              >
                Download Resume
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-500 hover:text-swiss-navy flex items-center space-x-1"
              >
                <Lock className="h-3 w-3" />
                <span>Owner Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
