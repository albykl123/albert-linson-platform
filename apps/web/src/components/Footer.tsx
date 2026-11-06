import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Mail, Lock, ExternalLink, ShieldCheck, MessageCircle, Phone } from "lucide-react";
import { masterProfile } from "@/lib/profileData";

export function Footer() {
  return (
    <footer id="site-global-footer" className="border-t border-swiss-divider bg-swiss-light text-gray-600 text-sm print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="relative w-44 h-10">
                <Image
                  src="/images/albert-linson-signature.png"
                  alt="Albert Linson handwritten signature logo"
                  fill
                  sizes="180px"
                  className="object-contain object-left"
                />
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-swiss-blue/10 text-swiss-blue border border-swiss-blue/20 rounded-full">
                Professional Profile
              </span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed max-w-md">
              {masterProfile.personal.headline} &bull; {masterProfile.personal.sub_headline}.
              Pursuing MCA at Christ University (Delhi NCR). Experienced across US IT recruitment, IT operations, and frontend engineering.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <a
                href="https://wa.me/919910705796?text=Hi%20Albert,%20I%20came%20across%20your%20portfolio%20and%20would%20like%20to%20connect."
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-emerald-50 border border-emerald-500/40 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm"
                aria-label="WhatsApp (+91 9910705796)"
                title="Chat on WhatsApp: +91 9910705796"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={masterProfile.personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-swiss-white border border-swiss-divider text-gray-700 hover:text-swiss-navy hover:border-swiss-blue/40 transition-colors shadow-sm"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={masterProfile.personal.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-swiss-white border border-swiss-divider text-gray-700 hover:text-swiss-navy hover:border-swiss-blue/40 transition-colors shadow-sm"
                aria-label="GitHub Profile"
                title="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${masterProfile.personal.email}`}
                className="p-2 rounded-lg bg-swiss-white border border-swiss-divider text-gray-700 hover:text-swiss-navy hover:border-swiss-blue/40 transition-colors shadow-sm"
                aria-label="Send Email"
                title="Email: albertkalampadan@gmail.com"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="tel:+919910705796"
                className="p-2 rounded-lg bg-swiss-white border border-swiss-divider text-gray-700 hover:text-swiss-navy hover:border-swiss-blue/40 transition-colors shadow-sm"
                aria-label="Call Direct"
                title="Call: +91 9910705796"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
            <div className="text-[11px] text-gray-500 pt-1">
              Reach Out: <a href="https://wa.me/919910705796" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold hover:underline">+91 9910705796 (WhatsApp)</a> &bull; <a href={`mailto:${masterProfile.personal.email}`} className="text-swiss-blue font-semibold hover:underline">{masterProfile.personal.email}</a>
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-swiss-navy mb-3">Portfolio</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-swiss-navy transition-colors">About Me</Link></li>
              <li><Link href="/experience" className="hover:text-swiss-navy transition-colors">Professional Experience</Link></li>
              <li><Link href="/leadership" className="hover:text-swiss-navy transition-colors">Leadership & Engagement</Link></li>
              <li><Link href="/education" className="hover:text-swiss-navy transition-colors">Education & Credentials</Link></li>
              <li><Link href="/projects" className="hover:text-swiss-navy transition-colors font-medium">Projects & Research</Link></li>
              <li><Link href="/resume" className="hover:text-swiss-navy transition-colors font-medium">Resume & Skills</Link></li>
            </ul>
          </div>

          {/* Resources & Document Access */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-swiss-navy mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/resume" className="hover:text-swiss-navy transition-colors font-medium">Download Resume (PDF/TXT)</Link></li>
              <li>
                <Link href="/admin" className="inline-flex items-center space-x-1 text-gray-500 hover:text-swiss-navy transition-colors">
                  <Lock className="h-3 w-3" />
                  <span>Owner Sign-In</span>
                </Link>
              </li>
              <li className="text-gray-400 text-[11px] pt-1">
                Zero-Cost Edge Infrastructure &bull; Cloudflare D1
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-swiss-divider flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} {masterProfile.personal.full_legal_name}. Verified Professional Platform.
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-4">
            <span>Verified Information Only</span>
            <span>&bull;</span>
            <span>No Metric Hallucination</span>
            <span>&bull;</span>
            <span>Cloudflare Workers Edge</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
