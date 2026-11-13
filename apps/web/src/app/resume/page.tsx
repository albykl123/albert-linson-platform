"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { masterProfile, SkillItem } from "@/lib/profileData";
import { OwnerAuthGate } from "@/components/OwnerAuthGate";
import { 
  Printer, 
  Download, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  ExternalLink, 
  Globe, 
  FileText, 
  CheckCircle2,
  Sparkles,
  Layout,
  Server,
  Smartphone,
  Cpu,
  Wrench,
  Users,
  Layers,
  ArrowRight,
  ShieldCheck,
  LogOut
} from "lucide-react";

export default function ResumeAndSkillsPage() {
  const [viewMode, setViewMode] = useState<"resume" | "skills" | "combined">("resume");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const v = params.get("view");
      const hash = window.location.hash;
      if (v === "skills" || hash === "#skills") {
        setViewMode("skills");
      } else if (v === "combined" || hash === "#combined") {
        setViewMode("combined");
      }
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" }).catch(() => {});
    setIsAuthenticated(false);
  };

  const handlePrint = () => {
    if (viewMode !== "resume") {
      setViewMode("resume");
      setTimeout(() => {
        window.print();
      }, 150);
    } else {
      window.print();
    }
  };

  const handleDownloadTxt = () => {
    const textContent = `
================================================================================
${masterProfile.personal.full_legal_name.toUpperCase()}
${masterProfile.personal.email} | ${masterProfile.personal.phone} (WhatsApp) | ${masterProfile.personal.location}
WhatsApp: https://wa.me/919910705796
LinkedIn: ${masterProfile.personal.linkedin} | GitHub: ${masterProfile.personal.github}
================================================================================

PROFESSIONAL SUMMARY
--------------------------------------------------------------------------------
${masterProfile.summary}

PROFESSIONAL EXPERIENCE
--------------------------------------------------------------------------------
${masterProfile.experience
  .map(
    (exp) =>
      `${exp.role.toUpperCase()} - ${exp.company} (${exp.period})\nLocation: ${exp.location} | Type: ${exp.employment_type || "Full-Time"}\n` +
      exp.highlights.map((h) => `* ${h}`).join("\n")
  )
  .join("\n\n")}

EDUCATION
--------------------------------------------------------------------------------
${masterProfile.education
  .map(
    (edu) =>
      `${edu.degree.toUpperCase()}\n${edu.institution} (${edu.period})\n${edu.details}`
  )
  .join("\n\n")}

SKILLS MATRIX (4 DOMAIN CLUSTERS)
--------------------------------------------------------------------------------
* Frontend & Design: ${masterProfile.skills.frontend_and_design.join(", ")}
* Backend & Cloud: ${masterProfile.skills.backend_and_cloud.join(", ")}
* Recruitment & Business: ${masterProfile.skills.recruitment_and_business.join(", ")}
* Analytics & AI: ${masterProfile.skills.analytics_and_ai.join(", ")}

FEATURED SOFTWARE PROJECTS
--------------------------------------------------------------------------------
${masterProfile.projects
  .slice(0, 4)
  .map(
    (proj) =>
      `${proj.title.toUpperCase()} - ${proj.tagline}\nTechnologies: ${proj.technologies.join(", ")}\n${proj.description}\n` +
      proj.highlights.map((h) => `* ${h}`).join("\n")
  )
  .join("\n\n")}

ACADEMIC RESEARCH PAPERS
--------------------------------------------------------------------------------
${masterProfile.research
  .map(
    (r, i) =>
      `[${i + 1}] ${r.title}\nRole: ${r.role} | Status: ${r.status} | Category: ${r.category}\nAbstract: ${r.abstract}`
  )
  .join("\n\n")}

LEADERSHIP, CAMPUS INVOLVEMENT & EVENT MANAGEMENT
--------------------------------------------------------------------------------
${(masterProfile.leadership || [])
  .map(
    (l) =>
      `* ${l.title} - ${l.organization} (${l.period})\n  Category: ${l.category} | Level: ${l.role_level}\n  Responsibilities: ${l.responsibilities.join("; ")}\n  Keywords: ${l.skills.join(", ")}`
  )
  .join("\n\n")}

CERTIFICATIONS & HONORS
--------------------------------------------------------------------------------
${(masterProfile.certifications || [])
  .map((c) => `* ${c.name} (${c.issuer}): ${c.description}`)
  .join("\n")}
`.trim();

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Albert_Linson_Resume_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${masterProfile.personal.full_legal_name} - ATS Resume</title>
  <style>
    @page { size: letter portrait; margin: 0.5in; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.35;
      color: #111827;
      background: #ffffff;
      margin: 0 auto;
      max-width: 8.5in;
      padding: 0.5in;
    }
    h1 {
      font-size: 19pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 2px 0;
      color: #000000;
      letter-spacing: 0.5px;
    }
    .subhead {
      font-size: 9.5pt;
      font-weight: bold;
      color: #374151;
      margin-bottom: 6px;
    }
    .contact-line {
      font-size: 9pt;
      color: #4b5563;
      margin-bottom: 12px;
      border-bottom: 2px solid #000000;
      padding-bottom: 6px;
    }
    .contact-line a {
      color: #1d4ed8;
      text-decoration: none;
    }
    h2.section-header {
      font-size: 10.5pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1.5px solid #000000;
      margin: 12px 0 5px 0;
      padding-bottom: 2px;
      color: #000000;
      letter-spacing: 0.5px;
    }
    .entry {
      margin-bottom: 9px;
      page-break-inside: avoid;
    }
    .entry-head {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      font-size: 9.5pt;
      color: #000000;
    }
    .entry-sub {
      font-size: 8.5pt;
      color: #4b5563;
      font-style: italic;
      margin-bottom: 3px;
    }
    ul {
      margin: 2px 0 5px 18px;
      padding: 0;
    }
    li {
      margin-bottom: 2px;
      font-size: 9pt;
      color: #1f2937;
      line-height: 1.3;
    }
    .summary-text {
      font-size: 9pt;
      color: #1f2937;
      text-align: justify;
      line-height: 1.38;
      margin-bottom: 8px;
    }
    .skills-category {
      font-size: 9pt;
      margin-bottom: 3px;
      color: #1f2937;
    }
    .skills-category strong {
      color: #000000;
    }
  </style>
</head>
<body>
  <h1>${masterProfile.personal.full_legal_name}</h1>
  <div class="subhead">${masterProfile.personal.sub_headline}</div>
  <div class="contact-line">
    ${masterProfile.personal.location} &bull; 
    <a href="https://wa.me/919910705796">${masterProfile.personal.phone} (WhatsApp)</a> &bull; 
    <a href="mailto:${masterProfile.personal.email}">${masterProfile.personal.email}</a> &bull; 
    <a href="${masterProfile.personal.linkedin}">LinkedIn</a> &bull; 
    <a href="${masterProfile.personal.github}">GitHub</a>
  </div>

  <h2 class="section-header">Professional Summary</h2>
  <div class="summary-text">${masterProfile.summary}</div>

  <h2 class="section-header">Professional Experience</h2>
  ${masterProfile.experience
    .map(
      (exp) => `
  <div class="entry">
    <div class="entry-head">
      <span>${exp.role} &bull; ${exp.company}</span>
      <span>${exp.period}</span>
    </div>
    <div class="entry-sub">${exp.location} | ${exp.employment_type || "Full-Time"}</div>
    <ul>
      ${exp.highlights.map((h) => `<li>${h}</li>`).join("")}
    </ul>
  </div>`
    )
    .join("")}

  <h2 class="section-header">Education Credentials</h2>
  ${masterProfile.education
    .map(
      (edu) => `
  <div class="entry">
    <div class="entry-head">
      <span>${edu.degree} &bull; ${edu.institution}</span>
      <span>${edu.period}</span>
    </div>
    <div class="entry-sub">${edu.location} &bull; ${edu.details}</div>
  </div>`
    )
    .join("")}

  <h2 class="section-header">Technical & Professional Competencies</h2>
  <div class="skills-category"><strong>Frontend & UI/UX:</strong> ${masterProfile.skills.frontend_and_design.join(", ")}</div>
  <div class="skills-category"><strong>Backend & Cloud:</strong> ${masterProfile.skills.backend_and_cloud.join(", ")}</div>
  <div class="skills-category"><strong>US IT Recruitment:</strong> ${masterProfile.skills.recruitment_and_business.join(", ")}</div>
  <div class="skills-category"><strong>Analytics & AI:</strong> ${masterProfile.skills.analytics_and_ai.join(", ")}</div>

  <h2 class="section-header">Academic Research Manuscripts</h2>
  ${masterProfile.research
    .map(
      (r, i) => `
  <div class="entry">
    <div class="entry-head">
      <span>[${i + 1}] ${r.title}</span>
      <span>Status: ${r.status}</span>
    </div>
    <div class="entry-sub">${r.role} &bull; ${r.category}</div>
    <div style="font-size: 8.5pt; color: #374151; margin-top: 2px;">${r.abstract}</div>
  </div>`
    )
    .join("")}

  ${
    masterProfile.leadership && masterProfile.leadership.length > 0
      ? `
  <h2 class="section-header">Leadership & Campus Involvement</h2>
  ${masterProfile.leadership
    .slice(0, 5)
    .map(
      (lead) => `
  <div class="entry">
    <div class="entry-head">
      <span>${lead.title} &bull; ${lead.organization}</span>
      <span>${lead.period}</span>
    </div>
    <div class="entry-sub">Category: ${lead.category} &bull; Role: ${lead.role_level}</div>
    <ul>
      ${lead.responsibilities.map((resp) => `<li>${resp}</li>`).join("")}
    </ul>
  </div>`
    )
    .join("")}
  `
      : ""
  }

  ${
    masterProfile.certifications && masterProfile.certifications.length > 0
      ? `
  <h2 class="section-header">Certifications & Honors</h2>
  <ul>
    ${masterProfile.certifications.map((c) => `<li><strong>${c.name}</strong> (${c.issuer}): ${c.description}</li>`).join("")}
  </ul>
  `
      : ""
  }
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Albert_Linson_Resume_ATS_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const levels = masterProfile.skill_levels;
  const profSkills = levels?.professional_work || levels?.professional_experience || [];
  const projSkills = levels?.project_experience || [];
  const acadSkills = levels?.academic_experience || [];
  const learnSkills = levels?.currently_learning || levels?.learning_familiarity || [];

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-swiss-light flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <div className="w-5 h-5 border-2 border-swiss-navy border-t-transparent rounded-full animate-spin" />
          <span>Verifying owner session security...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <OwnerAuthGate
        moduleName="Verified Resume & Skills Hub"
        moduleDescription="Access to master resume versions, plain-text ATS exports, and comprehensive 4-tier skill mappings is strictly reserved for the verified platform owner."
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="bg-paper-offwhite text-paper-graphite min-h-screen py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white print:min-h-0">
      <div className="max-w-4xl mx-auto print:max-w-none print:w-full">
        {/* Owner Session Indicator & Logout */}
        <div className="flex items-center justify-between px-4 py-2.5 mb-6 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Owner Authentication Active</span>
            <span className="text-amber-700">&bull; Confidential View Unlocked</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1 font-semibold text-rose-700 hover:text-rose-900 hover:underline"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Lock & Sign Out</span>
          </button>
        </div>

        {/* Action Toolbar (Hidden during print) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-paper-border print:hidden">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Unified Document & Capabilities Matrix</span>
            </div>
            <h1 className="text-2xl font-bold text-paper-graphite tracking-tight">
              Master Resume & Verified Skills
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Switcher */}
            <div className="inline-flex p-1 rounded-lg bg-paper-surface border border-paper-border shadow-sm">
              <button
                onClick={() => setViewMode("resume")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "resume"
                    ? "bg-paper-graphite text-paper-offwhite shadow-sm"
                    : "text-gray-600 hover:text-paper-graphite"
                }`}
              >
                Master Resume
              </button>
              <button
                onClick={() => setViewMode("skills")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "skills"
                    ? "bg-paper-graphite text-paper-offwhite shadow-sm"
                    : "text-gray-600 hover:text-paper-graphite"
                }`}
              >
                4-Tier Skills Library
              </button>
              <button
                onClick={() => setViewMode("combined")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "combined"
                    ? "bg-paper-graphite text-paper-offwhite shadow-sm"
                    : "text-gray-600 hover:text-paper-graphite"
                }`}
              >
                Combined View
              </button>
            </div>

            {/* Document Export Buttons */}
            <Link
              href="/matcher"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-swiss-navy text-white hover:bg-swiss-navy/90 text-xs font-semibold shadow-sm transition-all"
              title="Evaluate your open Job Description against this resume"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Match with Your JD</span>
            </Link>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-paper-surface border border-paper-border hover:bg-paper-border/50 text-paper-graphite text-xs font-semibold shadow-sm transition-all"
              title="Print Vector PDF (Clean Pure ATS Resume, zero website elements)"
            >
              <Printer className="h-4 w-4 text-paper-graphite" />
              <span>PDF / Print</span>
            </button>
            <button
              onClick={handleDownloadHtml}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 text-xs font-semibold shadow-sm transition-all"
              title="Download Clean Standalone ATS HTML Document (Opens cleanly in MS Word & Browsers)"
            >
              <FileText className="h-4 w-4" />
              <span>Download ATS (HTML)</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800 text-xs font-semibold shadow-sm transition-all"
              title="Download ATS Plain Text (100% Parsable)"
            >
              <Download className="h-4 w-4" />
              <span>Download TXT</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: MASTER RESUME SHEET */}
        {(viewMode === "resume" || viewMode === "combined") && (
          <article 
            id="pure-ats-resume" 
            className="bg-white p-8 sm:p-14 rounded-2xl border border-paper-border shadow-xl print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none font-sans mb-12 print:mb-0"
          >
            {/* Contact Header */}
            <div className="resume-contact-header border-b-2 border-paper-graphite pb-6 mb-8 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-paper-graphite uppercase">
                    {masterProfile.personal.full_legal_name}
                  </h2>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {masterProfile.personal.sub_headline}
                  </p>
                </div>
                {/* Official Handwritten Signature Endorsement */}
                <div className="relative w-44 sm:w-52 h-12 shrink-0 self-center sm:self-start opacity-95">
                  <Image
                    src="/images/albert-linson-signature.png"
                    alt="Albert Linson official handwritten signature"
                    fill
                    sizes="200px"
                    className="object-contain object-center sm:object-right"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs text-gray-600">
                <span className="inline-flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span>{masterProfile.personal.location}</span>
                </span>
                <span>&bull;</span>
                <a
                  href={`mailto:${masterProfile.personal.email}`}
                  className="inline-flex items-center space-x-1 hover:text-blue-600 transition-colors"
                  title={`Email ${masterProfile.personal.email}`}
                >
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span>{masterProfile.personal.email}</span>
                </a>
                <span>&bull;</span>
                <span className="inline-flex items-center space-x-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <span>{masterProfile.personal.phone}</span>
                </span>
                <span>&bull;</span>
                <a 
                  href="https://wa.me/919910705796?text=Hi%20Albert,%20I%20viewed%20your%20resume%20and%20would%20like%20to%20connect." 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 hover:underline font-medium"
                  title="Direct WhatsApp: +91 9910705796"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <span>&bull;</span>
                <a href={masterProfile.personal.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  LinkedIn
                </a>
                <span>&bull;</span>
                <a href={masterProfile.personal.github} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                  GitHub
                </a>
              </div>
            </div>

            {/* Professional Summary */}
            <section className="mb-8 resume-entry-block">
              <h3 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-3 resume-section-title">
                Professional Summary
              </h3>
              <p className="text-xs sm:text-sm text-gray-800 leading-relaxed text-justify">
                {masterProfile.summary}
              </p>
            </section>

            {/* Professional Experience */}
            <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-4 resume-section-title">
                Professional Experience
              </h3>
              <div className="space-y-6">
                {masterProfile.experience.map((exp) => (
                  <div key={exp.id} className="resume-entry-block">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                      <div>
                        <span className="text-sm font-bold text-paper-graphite">{exp.role}</span>
                        <span className="text-sm font-semibold text-gray-700"> &bull; {exp.company}</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">{exp.period}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 italic mb-2">
                      {exp.location} | {exp.employment_type || "Full-Time"}
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-gray-800 leading-relaxed">
                      {exp.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="mb-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-4 resume-section-title">
                Education Credentials
              </h3>
              <div className="space-y-4">
                {masterProfile.education.map((edu) => (
                  <div key={edu.id} className="resume-entry-block flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                    <div>
                      <div className="font-bold text-sm text-paper-graphite">{edu.degree}</div>
                      <div className="text-gray-700 font-medium">{edu.institution} &bull; {edu.location}</div>
                      <div className="text-gray-600 mt-0.5">{edu.details}</div>
                    </div>
                    <div className="text-gray-500 font-medium mt-1 sm:mt-0">{edu.period}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Skills Overview with Deep-Dive Link */}
            <section className="mb-8 resume-entry-block">
              <div className="flex items-center justify-between border-b border-gray-300 pb-1 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-paper-graphite resume-section-title">
                  Core Skills & Competencies
                </h3>
                <button
                  onClick={() => setViewMode("skills")}
                  className="text-[11px] text-blue-700 hover:underline print:hidden font-medium inline-flex items-center space-x-1"
                >
                  <span>View 4-Tier Evidence Library</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs text-gray-800">
                <div>
                  <span className="font-bold">Frontend & Design: </span>
                  <span>{masterProfile.skills.frontend_and_design.join(", ")}</span>
                </div>
                <div>
                  <span className="font-bold">Backend & Cloud: </span>
                  <span>{masterProfile.skills.backend_and_cloud.join(", ")}</span>
                </div>
                <div>
                  <span className="font-bold">US IT Recruitment: </span>
                  <span>{masterProfile.skills.recruitment_and_business.join(", ")}</span>
                </div>
                <div>
                  <span className="font-bold">AI & Analytics: </span>
                  <span>{masterProfile.skills.analytics_and_ai.join(", ")}</span>
                </div>
              </div>
            </section>

            {/* Academic Research (EXACTLY TWO PAPERS) */}
            <section className="mb-8">
              <div className="flex items-center justify-between border-b border-gray-300 pb-1 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-paper-graphite resume-section-title">
                  Academic Research
                </h3>
                <Link href="/projects#research" className="text-[11px] text-blue-700 hover:underline print:hidden">
                  Methodology & Papers &rarr;
                </Link>
              </div>
              <div className="space-y-4">
                {masterProfile.research.map((r, i) => (
                  <div key={r.id} className="resume-entry-block text-xs text-gray-800">
                    <div className="font-bold text-sm text-paper-graphite">
                      [{i + 1}] {r.title}
                    </div>
                    <div className="text-gray-600 font-medium italic mt-0.5">
                      {r.role} &bull; {r.category} &bull; Status: {r.status}
                    </div>
                    <p className="mt-1 text-gray-700 leading-relaxed">
                      {r.abstract}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Leadership, Campus Involvement & Event Management */}
            {masterProfile.leadership && (
              <section className="mb-8">
                <div className="flex items-center justify-between border-b border-gray-300 pb-1 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-paper-graphite resume-section-title">
                    Leadership, Campus Involvement & Event Management
                  </h3>
                  <Link href="/leadership" className="text-[11px] text-blue-700 hover:underline print:hidden">
                    View all {masterProfile.leadership?.length || 14} records &rarr;
                  </Link>
                </div>
                <div className="space-y-4">
                  {masterProfile.leadership.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="resume-entry-block text-xs text-gray-800">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                        <div>
                          <span className="font-bold text-sm text-paper-graphite">{lead.title}</span>
                          <span className="text-gray-700 font-medium"> &bull; {lead.organization} ({lead.institution})</span>
                        </div>
                        <span className="text-gray-500 font-medium text-[11px]">{lead.period}</span>
                      </div>
                      <div className="text-[11px] text-gray-600 italic mt-0.5">
                        Category: {lead.category} &bull; Role: {lead.role_level}
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-xs text-gray-700 mt-1">
                        {lead.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Recognition */}
            {masterProfile.certifications && (
              <section className="resume-entry-block">
                <h3 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-3 resume-section-title">
                  Certifications & Institutional Activities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-800">
                  {masterProfile.certifications.map((c) => (
                    <div key={c.id}>
                      <span className="font-bold">{c.name}</span> ({c.issuer})
                      <div className="text-gray-600">{c.description}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>
        )}

        {/* VIEW 2: 4-TIER EVIDENCE-BACKED SKILLS MATRIX */}
        {(viewMode === "skills" || viewMode === "combined") && (
          <div id="skills" className="space-y-12 mb-12 print:hidden">
            <div className="p-6 rounded-2xl bg-white border border-paper-border shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">Evidence-Backed Capability Matrix</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-paper-graphite mt-1 tracking-tight">
                4-Tier Structured Skills Library
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Every listed skill is categorized strictly by proof-of-application: professional employment, verified software builds, academic curricula, or exploratory engineering.
              </p>
            </div>

            {/* Tier 1: Professional Work */}
            <section className="p-8 rounded-2xl bg-white border border-paper-border shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-paper-graphite tracking-tight">
                    Demonstrated Through Professional Work
                  </h3>
                  <p className="text-xs text-gray-600">
                    Applied in commercial roles at Innova Solutions, Herbal Energy, Algospark Technologies, METVY, and MCD.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {profSkills.map((s: SkillItem) => (
                  <div key={s.name} className="p-4 rounded-xl bg-paper-offwhite border border-paper-border shadow-sm">
                    <div className="flex items-center justify-between text-[11px] text-blue-700 font-semibold mb-1">
                      <span>{s.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white text-[10px] text-gray-700 border border-paper-border">Employment</span>
                    </div>
                    <div className="font-bold text-sm text-paper-graphite">{s.name}</div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      <span className="font-medium text-gray-800">Evidence: </span>{s.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tier 2: Projects */}
            <section className="p-8 rounded-2xl bg-white border border-paper-border shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-paper-graphite tracking-tight">
                    Demonstrated Through Working Projects
                  </h3>
                  <p className="text-xs text-gray-600">
                    Architected and deployed in verified builds (JARVIS, Lunova OS, ATSForge, CINEMATRIX, AURIVA, Platform).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {projSkills.map((s: SkillItem) => (
                  <div key={s.name} className="p-4 rounded-xl bg-paper-offwhite border border-paper-border shadow-sm">
                    <div className="flex items-center justify-between text-[11px] text-blue-700 font-semibold mb-1">
                      <span>{s.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white text-[10px] text-gray-700 border border-paper-border">Verified Build</span>
                    </div>
                    <div className="font-bold text-sm text-paper-graphite">{s.name}</div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      <span className="font-medium text-gray-800">Evidence: </span>{s.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tier 3: Academic Rigor */}
            <section className="p-8 rounded-2xl bg-white border border-paper-border shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-paper-graphite tracking-tight">
                    Academic Experience (University Coursework)
                  </h3>
                  <p className="text-xs text-gray-600">
                    Core computer science foundations completed during BCA and MCA curricula at CHRIST (Deemed to be University).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {acadSkills.map((s: SkillItem) => (
                  <div key={s.name} className="p-4 rounded-xl bg-paper-offwhite border border-paper-border shadow-sm">
                    <div className="flex items-center justify-between text-[11px] text-indigo-700 font-semibold mb-1">
                      <span>{s.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white text-[10px] text-gray-700 border border-paper-border">Academic Rigor</span>
                    </div>
                    <div className="font-bold text-sm text-paper-graphite">{s.name}</div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      <span className="font-medium text-gray-800">Context: </span>{s.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tier 4: Active Learning */}
            <section className="p-8 rounded-2xl bg-white border border-paper-border shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-gray-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-bold text-paper-graphite tracking-tight">
                    Currently Learning & Exploratory Lab
                  </h3>
                  <p className="text-xs text-gray-600">
                    Modern technologies under active investigation, course study, or experimental testing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {learnSkills.map((s: SkillItem) => (
                  <div key={s.name} className="p-4 rounded-xl bg-paper-offwhite border border-paper-border shadow-sm">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold mb-1">
                      <span>{s.category}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white text-[10px] text-gray-600 border border-paper-border">Active Study</span>
                    </div>
                    <div className="font-bold text-sm text-paper-graphite">{s.name}</div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      <span className="font-medium text-gray-800">Context: </span>{s.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Domain Matrix Breakdown */}
            <section className="p-8 rounded-2xl bg-white border border-paper-border shadow-sm">
              <h3 className="text-xl font-bold text-paper-graphite tracking-tight mb-6">
                Complete Technology & Domain Matrix
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-paper-offwhite border border-paper-border">
                  <h4 className="font-bold text-sm text-paper-graphite mb-3 flex items-center space-x-2">
                    <Layout className="h-4 w-4 text-blue-700" />
                    <span>Frontend Development</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(masterProfile.skills.frontend_development || [
                      "HTML5", "CSS3", "JavaScript (ES6+)", "Bootstrap", "React", "Next.js", "TypeScript", "Tailwind CSS"
                    ]).map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 text-xs rounded-md bg-white text-gray-800 font-medium border border-paper-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-paper-offwhite border border-paper-border">
                  <h4 className="font-bold text-sm text-paper-graphite mb-3 flex items-center space-x-2">
                    <Server className="h-4 w-4 text-blue-700" />
                    <span>Backend & Cloud</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(masterProfile.skills.programming_and_backend || [
                      "Python", "FastAPI", "SQL", "MySQL", "SQLite / Cloudflare D1", "Node.js", "RESTful API Design"
                    ]).map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 text-xs rounded-md bg-white text-gray-800 font-medium border border-paper-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-paper-offwhite border border-paper-border">
                  <h4 className="font-bold text-sm text-paper-graphite mb-3 flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-blue-700" />
                    <span>Android Development</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(masterProfile.skills.android_development || [
                      "Kotlin", "Jetpack Compose", "Android Studio", "Gradle", "Android UI Prototyping"
                    ]).map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 text-xs rounded-md bg-white text-gray-800 font-medium border border-paper-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-paper-offwhite border border-paper-border">
                  <h4 className="font-bold text-sm text-paper-graphite mb-3 flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-blue-700" />
                    <span>AI & Development Tools</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(masterProfile.skills.ai_and_development || [
                      "OpenRouter", "Ollama", "Hugging Face", "Google Colab", "Docker", "Machine Learning"
                    ]).map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 text-xs rounded-md bg-white text-gray-800 font-medium border border-paper-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-paper-offwhite border border-paper-border">
                  <h4 className="font-bold text-sm text-paper-graphite mb-3 flex items-center space-x-2">
                    <Wrench className="h-4 w-4 text-blue-700" />
                    <span>Design & Dev Tools</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(masterProfile.skills.design || [
                      "Figma", "Adobe XD", "UI/UX Design", "Responsive Web Design"
                    ]).concat(masterProfile.skills.development_tools || ["Git", "GitHub", "VS Code", "Linux"]).map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 text-xs rounded-md bg-white text-gray-800 font-medium border border-paper-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-paper-offwhite border border-paper-border">
                  <h4 className="font-bold text-sm text-paper-graphite mb-3 flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-700" />
                    <span>Recruitment & Leadership</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(masterProfile.skills.professional_skills || [
                      "Full-Cycle US IT Recruitment", "Talent Acquisition", "Candidate Sourcing", "Event Management", "Team Leadership", "Peer Education"
                    ]).map((skill) => (
                      <span key={skill} className="px-2.5 py-0.5 text-xs rounded-md bg-white text-gray-800 font-medium border border-paper-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
