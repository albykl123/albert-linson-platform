"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Layers, 
  Terminal, 
  Menu, 
  X, 
  FileText, 
  ShieldCheck,
  Search
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/about", label: "About", icon: Briefcase },
    { href: "/experience", label: "Experience", icon: Briefcase },
    { href: "/projects", label: "Projects", icon: FolderGit2 },
    { href: "/research", label: "Research", icon: GraduationCap },
    { href: "/skills", label: "Skills", icon: Layers },
    { href: "/freestack", label: "FreeStack", icon: Search },
    { href: "/studio", label: "Career Studio", icon: Sparkles, highlight: true },
    { href: "/admin", label: "Admin", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-midnight-800 bg-midnight-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-electric-500 to-violet-500 text-white shadow-lg shadow-electric-500/20 transition-transform group-hover:scale-105">
            <span className="font-bold text-lg tracking-wider">AL</span>
          </div>
          <div>
            <div className="font-bold text-base text-white tracking-tight group-hover:text-electric-400 transition-colors">
              Albert Linson
            </div>
            <div className="text-[11px] text-gray-400 hidden sm:block tracking-wide">
              Personal Intelligence Platform
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  link.highlight
                    ? "bg-gradient-to-r from-electric-500/20 to-violet-500/20 text-electric-300 border border-electric-500/40 hover:border-electric-400 hover:shadow-sm"
                    : isActive
                    ? "bg-midnight-800 text-white border border-midnight-700"
                    : "text-gray-400 hover:text-white hover:bg-midnight-900"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${link.highlight ? "text-electric-400" : ""}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            href="/resume"
            className="ml-3 inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-electric-500 hover:bg-electric-400 text-white text-xs font-semibold shadow-md shadow-electric-500/25 transition-all"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Resume</span>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-midnight-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="lg:hidden border-b border-midnight-800 bg-midnight-900/95 px-4 pt-2 pb-4 space-y-1 backdrop-blur-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-midnight-800 text-white"
                    : "text-gray-300 hover:text-white hover:bg-midnight-800/60"
                }`}
              >
                <Icon className="h-4 w-4 text-electric-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/resume"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-electric-500 text-white font-medium text-sm"
            >
              <FileText className="h-4 w-4" />
              <span>View Verified Public Resume</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
