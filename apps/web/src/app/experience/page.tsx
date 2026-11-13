"use client";

import React, { useState } from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Wrench, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Layers, 
  Target, 
  FileText, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function ExperiencePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-swiss-light text-swiss-navy min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-swiss-divider pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-swiss-divider bg-swiss-white text-xs font-semibold text-swiss-blue mb-3">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Chronological Work History &bull; Verified Records</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-swiss-navy tracking-tight">
            Professional Experience
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-3xl leading-relaxed">
            Documented career history spanning US IT technical recruitment, IT systems infrastructure, enterprise B2B development, and civic digital experience engineering. Built strictly on verified employment records.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-8">
          {masterProfile.experience.map((exp) => {
            const isExpanded = expandedId === exp.id;
            const summary = exp.summary_50_words || exp.responsibilities?.[0] || "";
            const tools = exp.tools_and_platforms || exp.tools || [];
            const skills = exp.skills_applied || [];
            const responsibilities = exp.key_responsibilities || exp.responsibilities || exp.highlights;
            const contributions = exp.work_contributions || [];
            const kpis = exp.kpis || [];

            return (
              <article
                key={exp.id}
                className="bg-swiss-white border border-swiss-divider rounded-2xl shadow-xs hover:border-swiss-blue/40 transition-all duration-200 overflow-hidden"
              >
                {/* Default Card Header */}
                <div className="p-6 sm:p-8">
                  {/* Designation & Organization */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-swiss-divider">
                    <div>
                      <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-swiss-navy tracking-tight">
                          {exp.role}
                        </h2>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase ${
                            exp.employment_type === "Internship"
                              ? "bg-amber-50 text-amber-900 border border-amber-200"
                              : "bg-swiss-navy text-white"
                          }`}
                        >
                          {exp.employment_type || "Full-Time"}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-swiss-blue mt-1">
                        {exp.company}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 shrink-0">
                      <span className="inline-flex items-center space-x-1.5 bg-swiss-light px-2.5 py-1 rounded-md border border-swiss-divider">
                        <Calendar className="h-3.5 w-3.5 text-swiss-blue" />
                        <span>{exp.period}</span>
                      </span>
                      <span className="inline-flex items-center space-x-1.5 bg-swiss-light px-2.5 py-1 rounded-md border border-swiss-divider">
                        <MapPin className="h-3.5 w-3.5 text-swiss-blue" />
                        <span>{exp.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* 50-Word Professional Summary */}
                  {summary && (
                    <div className="mt-5 p-4 rounded-xl bg-swiss-light border border-swiss-divider/70">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-swiss-blue" />
                        <span>Role Overview &bull; Executive Summary</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                        {summary}
                      </p>
                    </div>
                  )}

                  {/* Concise Responsibility Highlights (3-5 bullets) */}
                  <div className="mt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-swiss-navy mb-3">
                      Core Responsibilities & Deliverables
                    </h3>
                    <ul className="space-y-2">
                      {responsibilities.slice(0, 4).map((resp, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tools & Platforms (Segregated) */}
                  {tools.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-swiss-divider">
                      <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        <Wrench className="h-3.5 w-3.5 text-swiss-blue" />
                        <span>Tools & Platforms</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-medium"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Applied (Segregated) */}
                  {skills.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-swiss-divider">
                      <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        <Award className="h-3.5 w-3.5 text-swiss-blue" />
                        <span>Skills Applied</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 text-xs rounded-md bg-sky-50 text-sky-900 border border-sky-200 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expand / Collapse Control */}
                  <div className="mt-6 pt-4 border-t border-swiss-divider flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {isExpanded ? "Showing comprehensive audit details" : "Read in-depth contributions, KPIs & methodology"}
                    </span>
                    <button
                      onClick={() => toggleExpand(exp.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`accordion-body-${exp.id}`}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-swiss-light hover:bg-swiss-divider/60 text-swiss-navy text-xs font-semibold transition-colors border border-swiss-divider"
                    >
                      <span>{isExpanded ? "Show Less" : "Read More & Role Audit"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-swiss-blue" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-swiss-blue" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Accessible Expandable Read More Section */}
                {isExpanded && (
                  <div
                    id={`accordion-body-${exp.id}`}
                    role="region"
                    aria-label={`Expanded details for ${exp.role} at ${exp.company}`}
                    className="bg-swiss-light/50 border-t border-swiss-divider p-6 sm:p-8 space-y-6 animate-in fade-in duration-200"
                  >
                    {/* 1. In-Depth Role Overview */}
                    {exp.role_overview && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-swiss-navy mb-1.5 flex items-center space-x-1.5">
                          <Layers className="h-3.5 w-3.5 text-swiss-blue" />
                          <span>In-Depth Role Overview</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          {exp.role_overview}
                        </p>
                      </div>
                    )}

                    {/* 2. Key Responsibilities (Full List) */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-swiss-navy mb-2 flex items-center space-x-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Key Responsibilities & Operational Scope</span>
                      </h4>
                      <ul className="space-y-2">
                        {responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                            <span className="text-swiss-blue font-bold mt-0.5">&bull;</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 3. Personal Work Contributions */}
                    {contributions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-swiss-navy mb-2 flex items-center space-x-1.5">
                          <Target className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Specific Personal Contributions</span>
                        </h4>
                        <ul className="space-y-2">
                          {contributions.map((c, idx) => (
                            <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                              <span className="text-indigo-600 font-bold mt-0.5">&bull;</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 4. KPI & Business Impact Framework */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-swiss-navy mb-3 flex items-center space-x-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>KPI & Verified Business Impact Framework</span>
                      </h4>

                      {kpis.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {kpis.map((kpi, kIdx) => (
                            <div
                              key={kIdx}
                              className="p-4 rounded-xl bg-swiss-white border border-swiss-divider text-xs space-y-2 shadow-2xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-swiss-navy">{kpi.kpi_name}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                  {kpi.status}
                                </span>
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                {kpi.business_outcome}
                              </p>
                              <div className="pt-2 border-t border-swiss-divider/60 text-[11px] text-gray-500 space-y-1">
                                <div><strong className="text-swiss-navy">Formula:</strong> {kpi.calculation_formula}</div>
                                <div><strong className="text-swiss-navy">Evidence Source:</strong> {kpi.evidence_source}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          Quantitative performance metrics are governed by our Anti-Fabrication Policy and require verified source audit records prior to publication.
                        </p>
                      )}
                    </div>

                    {/* 5. Additional Context */}
                    {exp.additional_context && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-600">
                        <span className="font-semibold text-slate-800">Organizational Context: </span>
                        {exp.additional_context}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Link to Dedicated Leadership Portfolio */}
        <div className="mt-16 p-8 rounded-2xl bg-swiss-white border border-swiss-divider shadow-xs text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-swiss-navy">
            Explore Campus Leadership & Event Headship
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-xl mx-auto leading-relaxed">
            In addition to full-time employment and technical roles, Albert maintains 14 verified leadership credentials covering university clubs, CCHS peer education, and major festival management.
          </p>
          <div className="mt-6">
            <Link
              href="/leadership"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-swiss-navy hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>Explore 14 Verified Leadership Roles &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
