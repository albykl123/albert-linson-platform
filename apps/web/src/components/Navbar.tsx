"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  ArrowUpRight
} from "lucide-react";

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
    { href: "/freestack", label: "FreeStack" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-swiss-divider bg-swiss-white/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="group flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-swiss-navy text-swiss-white shadow-sm transition-transform group-hover:scale-105">
            <span className="font-bold text-sm tracking-widest font-mono">AL</span>
          </div>
          <div>
            <div className="font-bold text-sm text-swiss-navy tracking-tight group-hover:text-swiss-blue transition-colors">
              Albert Linson
            </div>
            <div className="text-[11px] text-gray-500 hidden sm:block tracking-wide">
              Professional Intelligence Platform
            </div>
          </div>
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
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            href="/resume"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg border border-swiss-divider bg-swiss-light text-swiss-navy hover:bg-swiss-divider/50 text-xs font-semibold transition-all shadow-sm"
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
          <div className="pt-3 border-t border-swiss-divider flex items-center justify-between">
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
      )}
    </header>
  );
}
