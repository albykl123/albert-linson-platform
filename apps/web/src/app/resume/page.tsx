"use client";

import React from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { Printer, Download, MapPin, Mail, Phone, ExternalLink, Globe, FileText, CheckCircle2 } from "lucide-react";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textContent = `
================================================================================
${masterProfile.personal.full_legal_name.toUpperCase()}
${masterProfile.personal.email} | ${masterProfile.personal.phone} | ${masterProfile.personal.location}
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

SKILLS MATRIX
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

ACADEMIC RESEARCH PAPERS (EXACTLY 2 MANUSCRIPTS)
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

  return (
    <div className="bg-paper-offwhite text-paper-graphite min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Toolbar (Hidden during print) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-paper-border print:hidden">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-paper-beige">Paper & Typography Experience</span>
            <h1 className="text-2xl font-bold text-paper-graphite mt-1 tracking-tight">Verified Professional Resume</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-paper-surface border border-paper-border hover:bg-paper-border/50 text-paper-graphite text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="h-4 w-4 text-paper-graphite" />
              <span>Print / Vector PDF</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-paper-graphite text-paper-offwhite hover:bg-paper-graphite/90 text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download ATS TXT</span>
            </button>
          </div>
        </div>

        {/* The Paper Sheet Container */}
        <div className="bg-white p-8 sm:p-14 rounded-2xl border border-paper-border shadow-xl print:p-0 print:border-none print:shadow-none font-sans">
          {/* Header */}
          <header className="border-b-2 border-paper-graphite pb-6 mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-paper-graphite uppercase">
              {masterProfile.personal.full_legal_name}
            </h1>
            <p className="text-sm font-semibold text-gray-700 mt-1">
              {masterProfile.personal.sub_headline}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-y-1 gap-x-4 text-xs text-gray-600">
              <span className="inline-flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{masterProfile.personal.location}</span>
              </span>
              <span>&bull;</span>
              <span className="inline-flex items-center space-x-1">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{masterProfile.personal.email}</span>
              </span>
              <span>&bull;</span>
              <span className="inline-flex items-center space-x-1">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                <span>{masterProfile.personal.phone}</span>
              </span>
              <span>&bull;</span>
              <a href={masterProfile.personal.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                LinkedIn
              </a>
              <span>&bull;</span>
              <a href={masterProfile.personal.github} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                GitHub
              </a>
            </div>
          </header>

          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-3">
              Professional Summary
            </h2>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed text-justify">
              {masterProfile.summary}
            </p>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-4">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {masterProfile.experience.map((exp) => (
                <div key={exp.id}>
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-4">
              Education
            </h2>
            <div className="space-y-4">
              {masterProfile.education.map((edu) => (
                <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
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

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-3">
              Technical & Professional Skills
            </h2>
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-3">
              Academic Research (Exactly 2 Papers)
            </h2>
            <div className="space-y-4">
              {masterProfile.research.map((r, i) => (
                <div key={r.id} className="text-xs text-gray-800">
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
                <h2 className="text-xs font-bold uppercase tracking-widest text-paper-graphite">
                  Leadership, Campus Involvement & Event Management
                </h2>
                <Link href="/leadership" className="text-[11px] text-blue-700 hover:underline print:hidden">
                  View all 13 records &rarr;
                </Link>
              </div>
              <div className="space-y-4">
                {masterProfile.leadership.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="text-xs text-gray-800">
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
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-paper-graphite border-b border-gray-300 pb-1 mb-3">
                Certifications & Institutional Activities
              </h2>
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
        </div>
      </div>
    </div>
  );
}
