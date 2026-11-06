"use client";

import React, { useState } from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { 
  GraduationCap, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpRight, 
  FolderGit2, 
  ArrowRight,
  Sparkles,
  Copy,
  Check
} from "lucide-react";

export default function ResearchPage() {
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  const handleCopyCitation = (paperId: string, format: "ieee" | "bibtex", paper: typeof masterProfile.research[0]) => {
    let citation = "";
    if (format === "ieee") {
      citation = `A. K. Linson et al., "${paper.title}," Department of Computer Science, CHRIST (Deemed to be University), Delhi NCR, 2025.`;
    } else {
      const citeKey = paperId === "research-aegis" ? "linson2025aegis" : "linson2025breastcancer";
      citation = `@article{${citeKey},\n  author    = {Albert Kalampadan Linson and Research Collaborators},\n  title     = {${paper.title}},\n  journal   = {Christ University Computer Science Technical Inquiries},\n  year      = {2025},\n  category  = {${paper.category}}\n}`;
    }

    navigator.clipboard.writeText(citation);
    setCopiedCitationId(`${paperId}-${format}`);
    setTimeout(() => setCopiedCitationId(null), 2000);
  };

  return (
    <div className="bg-corporate-white text-corporate-slate min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Unified Banner */}
        <div className="mb-6 p-4 rounded-xl bg-corporate-pale border border-corporate-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-corporate-slate">
            <Sparkles className="h-4 w-4 text-corporate-cobalt shrink-0" />
            <span>
              Academic research has been unified into the comprehensive <strong>Projects & Research</strong> portfolio.
            </span>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-corporate-cobalt text-white text-xs font-semibold hover:bg-corporate-cobalt/90 transition-all shadow-sm shrink-0"
          >
            <span>Explore All Works</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 border-b border-corporate-border pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-corporate-cobalt">Academic Inquiries</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-corporate-slate mt-2 tracking-tight">
            Academic Research (Exactly 2 Papers)
          </h1>
          <p className="text-gray-600 mt-3 text-base max-w-2xl leading-relaxed">
            Strictly limited to authentic research manuscripts in software testing reliability and multi-modal ultrasound diagnostics. Other technical initiatives belong in the software projects showcase.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/projects#projects"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-corporate-border bg-corporate-white text-corporate-slate hover:bg-corporate-pale text-xs font-semibold transition-all shadow-sm"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-corporate-cobalt" />
              <span>View All 8 Software Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* The Two Research Papers */}
        <div className="space-y-12">
          {masterProfile.research.map((paper, index) => {
            const isAegis = paper.id === "research-aegis" || paper.title.includes("AEGIS");
            return (
              <article
                key={paper.id}
                className="p-8 sm:p-10 rounded-2xl bg-corporate-pale/70 border border-corporate-border shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Meta header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 mb-4 pb-4 border-b border-corporate-border">
                    <div className="flex items-center space-x-2">
                      <span className="h-6 w-6 rounded-md bg-corporate-cobalt text-white flex items-center justify-center font-bold text-xs">
                        {index + 1}
                      </span>
                      <span className="font-bold text-corporate-cobalt text-sm">
                        {paper.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 rounded bg-corporate-white border border-corporate-border text-gray-700 font-medium text-[11px]">
                        {paper.status}
                      </span>
                      <span className="font-semibold text-corporate-slate">{paper.role}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-corporate-slate tracking-tight leading-snug">
                    {paper.title}
                  </h2>

                  {/* Abstract */}
                  <div className="mt-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Abstract</h3>
                    <div className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-corporate-white p-5 rounded-xl border border-corporate-border shadow-sm">
                      {paper.abstract}
                    </div>
                  </div>

                  {/* Mathematical Formulation & Modeling Canvas */}
                  <div className="mt-6 p-5 rounded-xl bg-slate-950 text-slate-100 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 text-xs">
                      <span className="text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
                        Mathematical Formulation & Objective Function
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">KaTeX Notation</span>
                    </div>

                    {isAegis ? (
                      <div className="font-mono text-xs sm:text-sm text-cyan-200 py-2 overflow-x-auto">
                        {"$$\\mathcal{S}^* = \\arg\\max_{T \\subseteq \\mathcal{U}} \\left[ \\sum_{t \\in T} \\text{Coverage}(t) + \\lambda \\cdot \\text{Diversity}(T) - \\mu \\cdot \\text{Redundancy}(T) \\right]$$"}
                        <p className="text-[11px] text-slate-400 mt-2 font-sans">
                          Structural test suite optimization maximizing edge path coverage in LLM automated test generation.
                        </p>
                      </div>
                    ) : (
                      <div className="font-mono text-xs sm:text-sm text-cyan-200 py-2 overflow-x-auto">
                        {"$$\\hat{y} = \\sigma\\left( \\mathbf{W}_f \\cdot \\left[ \\mathcal{F}_{\\text{B-Mode}}(\\mathbf{X}_1) \\oplus \\mathcal{F}_{\\text{ColorDoppler}}(\\mathbf{X}_2) \\right] + b \\right)$$"}
                        <p className="text-[11px] text-slate-400 mt-2 font-sans">
                          {"Multi-modal feature fusion combining B-Mode tissue morphometry with Color Doppler vascular velocities."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Objectives & Methodology */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Research Objectives</h3>
                      <div className="space-y-2">
                        {paper.objectives.map((obj, i) => (
                          <div key={i} className="flex items-start space-x-2 text-xs text-gray-700 leading-relaxed">
                            <CheckCircle2 className="h-4 w-4 text-corporate-cobalt shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Methodological Architecture</h3>
                      <div className="p-4 rounded-xl bg-corporate-white border border-corporate-border text-xs text-gray-700 leading-relaxed">
                        {paper.methodology}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manuscript Actions & 1-Click Citation Copying */}
                <div className="mt-8 pt-5 border-t border-corporate-border flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCopyCitation(paper.id, "ieee", paper)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-corporate-border bg-corporate-white hover:bg-corporate-pale text-corporate-slate text-[11px] font-semibold transition-all shadow-sm"
                    >
                      {copiedCitationId === `${paper.id}-ieee` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">IEEE Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-gray-500" />
                          <span>Copy IEEE Citation</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopyCitation(paper.id, "bibtex", paper)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-corporate-border bg-corporate-white hover:bg-corporate-pale text-corporate-slate text-[11px] font-semibold transition-all shadow-sm"
                    >
                      {copiedCitationId === `${paper.id}-bibtex` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700">BibTeX Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-gray-500" />
                          <span>Copy BibTeX</span>
                        </>
                      )}
                    </button>
                  </div>

                  {paper.paper_url && paper.paper_url !== "#" ? (
                    <a
                      href={paper.paper_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-corporate-cobalt text-white font-semibold hover:bg-corporate-cobalt/90 shadow-sm transition-all"
                    >
                      <span>Read Verified Manuscript</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-gray-500 italic text-[11px]">Academic Contribution &bull; Christ University</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
