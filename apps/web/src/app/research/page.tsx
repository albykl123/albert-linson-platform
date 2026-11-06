import React from "react";
import { masterProfile } from "@/lib/profileData";
import { GraduationCap, BookOpen, ExternalLink, FileText, CheckCircle2, ArrowUpRight } from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="bg-corporate-white text-corporate-slate min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-corporate-border pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-corporate-cobalt">Academic Inquiries</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-corporate-slate mt-2 tracking-tight">
            Academic Research (Exactly 2 Papers)
          </h1>
          <p className="text-gray-600 mt-3 text-base max-w-2xl leading-relaxed">
            Strictly limited to authentic research manuscripts in software testing reliability and multi-modal ultrasound diagnostics. Other technical initiatives belong in the software projects showcase.
          </p>
        </div>

        {/* The Two Research Papers */}
        <div className="space-y-12">
          {masterProfile.research.map((paper, index) => (
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

              {/* Manuscript Actions */}
              <div className="mt-8 pt-5 border-t border-corporate-border flex flex-wrap items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Albert Kalampadan Linson &bull; Academic Contribution</span>
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
                  <span className="text-gray-500 italic">Peer Review / Internal Manuscript Completed</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
