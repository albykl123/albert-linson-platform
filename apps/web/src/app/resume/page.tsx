"use client";

import React from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { Printer, Download, Sparkles, MapPin, Mail, Phone, ExternalLink, Globe } from "lucide-react";

export default function ResumePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-midnight-800 print:hidden">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-electric-400">Master Profile</span>
          <h1 className="text-2xl font-bold text-white mt-1">Verified Public Resume</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-midnight-900 border border-midnight-700 hover:bg-midnight-800 text-white text-xs font-medium transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save PDF</span>
          </button>
          <Link
            href="/studio"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-electric-500 hover:bg-electric-400 text-white text-xs font-semibold shadow-md shadow-electric-500/20 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Customize in Career Studio</span>
          </Link>
        </div>
      </div>

      {/* A4 Sheet Container */}
      <div className="bg-white text-gray-900 p-8 sm:p-12 rounded-xl shadow-2xl print:p-0 print:shadow-none print:rounded-none">
        {/* Header */}
        <header className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">
            {masterProfile.personal.full_legal_name}
          </h1>
          <div className="text-sm font-semibold text-blue-700 mt-1">
            {masterProfile.personal.sub_headline}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-y-1 gap-x-4 text-xs text-gray-600">
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
            <span className="inline-flex items-center space-x-1">
              <Globe className="h-3.5 w-3.5 text-gray-400" />
              <span>{masterProfile.personal.portfolio_url}</span>
            </span>
          </div>
        </header>

        {/* Professional Summary */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">
            {masterProfile.summary}
          </p>
        </section>

        {/* Core Skills */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Core Competencies & Skills
          </h2>
          <div className="space-y-1.5 text-xs">
            <div>
              <strong className="text-gray-900">Analytics & AI: </strong>
              <span className="text-gray-700">{masterProfile.skills.analytics_and_ai.join(", ")}</span>
            </div>
            <div>
              <strong className="text-gray-900">Frontend & Design: </strong>
              <span className="text-gray-700">{masterProfile.skills.frontend_and_design.join(", ")}</span>
            </div>
            <div>
              <strong className="text-gray-900">Backend & Infrastructure: </strong>
              <span className="text-gray-700">{masterProfile.skills.backend_and_cloud.join(", ")}</span>
            </div>
            <div>
              <strong className="text-gray-900">Recruitment & Operations: </strong>
              <span className="text-gray-700">{masterProfile.skills.recruitment_and_business.join(", ")}</span>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {masterProfile.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div className="text-xs font-bold text-gray-900">
                    {exp.role} <span className="font-semibold text-blue-800">| {exp.company}</span>
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium">{exp.period}</div>
                </div>
                <div className="text-[11px] text-gray-500 italic mb-1.5">{exp.location}</div>
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-gray-700">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="leading-relaxed">{h}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {masterProfile.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <strong className="text-gray-900">{edu.degree}</strong>
                  <span className="text-gray-600"> &mdash; {edu.institution}</span>
                </div>
                <div className="text-[11px] text-gray-500">{edu.period}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Research */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
            Selected Research Contributions
          </h2>
          <div className="space-y-2 text-xs">
            {masterProfile.research.map((paper) => (
              <div key={paper.id}>
                <div className="font-bold text-gray-900">{paper.title}</div>
                <div className="text-[11px] text-gray-600">{paper.category} &bull; {paper.status}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
