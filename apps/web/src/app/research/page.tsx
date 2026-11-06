import React from "react";
import { masterProfile } from "@/lib/profileData";
import { GraduationCap, BookOpen, ExternalLink, FileText, CheckCircle2 } from "lucide-react";

export default function ResearchPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12 border-b border-midnight-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Scholarly Work</span>
        <h1 className="text-4xl font-extrabold text-white mt-2">Academic Research Library</h1>
        <p className="text-gray-300 mt-3 text-sm max-w-2xl leading-relaxed">
          Peer-reviewed inquiries, computational healthcare methodologies, and foundation model testing frameworks.
        </p>
      </div>

      <div className="space-y-10">
        {masterProfile.research.map((paper) => (
          <article key={paper.id} className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 mb-4 pb-4 border-b border-midnight-800/80">
              <span className="font-semibold text-violet-400 text-sm flex items-center space-x-1.5">
                <GraduationCap className="h-4 w-4" />
                <span>{paper.category}</span>
              </span>
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-0.5 rounded bg-midnight-900 border border-midnight-700 text-gray-300">
                  {paper.status}
                </span>
                <span className="text-gray-400 font-medium">{paper.role}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
              {paper.title}
            </h2>

            <div className="mt-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Abstract</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-midnight-950/60 p-5 rounded-xl border border-midnight-800">
                {paper.abstract}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Research Objectives</h3>
                <div className="space-y-2">
                  {paper.objectives.map((obj, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-gray-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Methodological Architecture</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {paper.methodology}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-midnight-800 flex items-center justify-between">
              <span className="text-xs text-gray-500">Author: Albert Kalampadan Linson et al.</span>
              {paper.paper_url && paper.paper_url !== "#" ? (
                <a
                  href={paper.paper_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Access Manuscript</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-xs text-gray-500 italic">Preprint in submission</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
