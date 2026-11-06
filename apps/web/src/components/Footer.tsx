import React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, ExternalLink, Shield } from "lucide-react";
import { masterProfile } from "@/lib/profileData";

export function Footer() {
  return (
    <footer className="border-t border-midnight-800 bg-midnight-950 text-gray-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Positioning */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white">Albert Linson</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/20 rounded-full">
                Personal Intelligence Platform
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-md">
              {masterProfile.personal.headline} — {masterProfile.personal.sub_headline}.
              Built with Next.js, Cloudflare, OpenRouter, and ATSForge AI.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={masterProfile.personal.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-midnight-900 hover:text-white hover:bg-midnight-800 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={masterProfile.personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-midnight-900 hover:text-white hover:bg-midnight-800 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${masterProfile.personal.email}`}
                className="p-2 rounded-lg bg-midnight-900 hover:text-white hover:bg-midnight-800 transition-colors"
                aria-label="Send Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Ecosystem</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About & Bio</Link></li>
              <li><Link href="/experience" className="hover:text-white transition-colors">Career Timeline</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Featured Projects</Link></li>
              <li><Link href="/research" className="hover:text-white transition-colors">Research Library</Link></li>
              <li><Link href="/freestack" className="hover:text-white transition-colors">FreeStack Catalog</Link></li>
            </ul>
          </div>

          {/* Platform & Governance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">Intelligence Studio</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/studio" className="flex items-center space-x-1 text-electric-400 hover:text-electric-300">
                  <span>ATSForge Studio</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li><Link href="/resume" className="hover:text-white transition-colors">Public Resume</Link></li>
              <li>
                <Link href="/admin" className="flex items-center space-x-1 hover:text-white transition-colors">
                  <Shield className="h-3 w-3 text-gray-500" />
                  <span>Admin Control Center</span>
                </Link>
              </li>
              <li className="text-gray-500 text-[11px] pt-1">Cloudflare Edge & D1 Protected</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-midnight-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} Albert Kalampadan Linson. All rights reserved.
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span className="text-gray-500">Zero Hallucination Guaranteed</span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-gray-500">FreeStack Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
