"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { 
  FolderGit2, 
  ExternalLink, 
  Code2, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  Cpu, 
  Wrench,
  BookOpen,
  GraduationCap,
  Search,
  Filter,
  Sparkles,
  FileText
} from "lucide-react";

export default function ProjectsAndResearchPage() {
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "research">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync tab with URL hash or query if present on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const hash = window.location.hash;
      if (tabParam === "research" || hash === "#research") {
        setActiveTab("research");
      } else if (tabParam === "projects" || hash === "#projects") {
        setActiveTab("projects");
      }
    }
  }, []);

  // Filter projects
  const filteredProjects = masterProfile.projects.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q))
    );
  });

  // Filter research
  const filteredResearch = masterProfile.research.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.abstract.toLowerCase().includes(q) ||
      r.objectives.some((o) => o.toLowerCase().includes(q))
    );
  });

  const totalCount = masterProfile.projects.length + masterProfile.research.length;

  return (
    <div className="bg-corporate-white text-corporate-slate min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b border-corporate-border pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-corporate-border bg-corporate-pale text-corporate-cobalt text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Unified Engineering & Academic Inquiries</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-corporate-slate tracking-tight">
            Projects & Academic Research
          </h1>
          <p className="text-gray-600 mt-3 text-base max-w-3xl leading-relaxed">
            A comprehensive portfolio presenting verified software engineering builds, desktop intelligence systems, operating systems research, and peer-reviewed academic manuscripts.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-corporate-pale/70 border border-corporate-border">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Works</div>
              <div className="text-2xl font-bold text-corporate-slate mt-1">{totalCount}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Verified Outputs</div>
            </div>
            <div className="p-4 rounded-xl bg-corporate-pale/70 border border-corporate-border">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Software Systems</div>
              <div className="text-2xl font-bold text-corporate-cobalt mt-1">{masterProfile.projects.length}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Production Builds</div>
            </div>
            <div className="p-4 rounded-xl bg-corporate-pale/70 border border-corporate-border">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Academic Research</div>
              <div className="text-2xl font-bold text-corporate-cobalt mt-1">{masterProfile.research.length}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Dedicated Manuscripts</div>
            </div>
            <div className="p-4 rounded-xl bg-corporate-pale/70 border border-corporate-border">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Open Source</div>
              <div className="text-2xl font-bold text-corporate-slate mt-1">{masterProfile.projects.filter(p => p.github_url).length}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Public Repositories</div>
            </div>
          </div>
        </div>

        {/* Controls Bar: Tabs & Search */}
        <div className="mb-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="inline-flex p-1 rounded-xl bg-corporate-pale border border-corporate-border shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-corporate-white text-corporate-cobalt shadow-sm border border-corporate-border"
                  : "text-gray-600 hover:text-corporate-slate"
              }`}
            >
              All Works ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === "projects"
                  ? "bg-corporate-white text-corporate-cobalt shadow-sm border border-corporate-border"
                  : "text-gray-600 hover:text-corporate-slate"
              }`}
            >
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Software Systems ({masterProfile.projects.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("research")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === "research"
                  ? "bg-corporate-white text-corporate-cobalt shadow-sm border border-corporate-border"
                  : "text-gray-600 hover:text-corporate-slate"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Academic Research ({masterProfile.research.length})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keyword, technology, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-corporate-border bg-corporate-white text-xs text-corporate-slate placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-corporate-cobalt/30 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* SECTION 1: SOFTWARE PROJECTS */}
        {(activeTab === "all" || activeTab === "projects") && (
          <section id="projects" className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-corporate-border">
              <div className="flex items-center space-x-2">
                <FolderGit2 className="h-5 w-5 text-corporate-cobalt" />
                <h2 className="text-xl sm:text-2xl font-bold text-corporate-slate tracking-tight">
                  Software Engineering Projects ({filteredProjects.length})
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Authentic Architectures & Repositories</span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 rounded-xl bg-corporate-pale border border-corporate-border">
                No software projects found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-8 rounded-2xl bg-corporate-pale/60 border border-corporate-border shadow-sm flex flex-col justify-between hover:border-corporate-cobalt/40 transition-all"
                  >
                    <div>
                      {/* Header & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-corporate-white text-corporate-cobalt border border-corporate-border">
                          {proj.status}
                        </span>
                        {proj.github_url && (
                          <a
                            href={proj.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-xs font-semibold text-corporate-cobalt hover:text-corporate-slate transition-colors"
                          >
                            <FolderGit2 className="h-4 w-4" />
                            <span>GitHub</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-corporate-slate tracking-tight">{proj.title}</h3>
                      <p className="text-xs font-semibold text-corporate-cobalt mt-1">{proj.tagline}</p>

                      <p className="text-xs sm:text-sm text-gray-700 mt-4 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Architecture & Contribution */}
                      {proj.architecture && (
                        <div className="mt-4 p-3.5 rounded-xl bg-corporate-white border border-corporate-border text-xs text-gray-700 leading-relaxed">
                          <div className="font-bold text-corporate-slate mb-0.5 flex items-center space-x-1">
                            <Cpu className="h-3.5 w-3.5 text-corporate-cobalt" />
                            <span>Architecture & Design</span>
                          </div>
                          {proj.architecture}
                        </div>
                      )}

                      {proj.my_contribution && (
                        <div className="mt-2.5 p-3.5 rounded-xl bg-corporate-white border border-corporate-border text-xs text-gray-700 leading-relaxed">
                          <div className="font-bold text-corporate-slate mb-0.5 flex items-center space-x-1">
                            <Wrench className="h-3.5 w-3.5 text-corporate-cobalt" />
                            <span>My Actual Contribution</span>
                          </div>
                          {proj.my_contribution}
                        </div>
                      )}

                      {/* Demonstrable Features / Highlights */}
                      <div className="mt-4 space-y-1.5 pt-3 border-t border-corporate-border/80">
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Demonstrable Features
                        </div>
                        {proj.highlights.map((h, i) => (
                          <div key={i} className="flex items-start space-x-2 text-xs text-gray-700 leading-relaxed">
                            <CheckCircle2 className="h-3.5 w-3.5 text-corporate-cobalt shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technologies */}
                    <div className="mt-6 pt-4 border-t border-corporate-border/80 flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-[11px] bg-corporate-white text-gray-800 rounded-md border border-corporate-border font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: ACADEMIC RESEARCH */}
        {(activeTab === "all" || activeTab === "research") && (
          <section id="research" className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-corporate-border">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-corporate-cobalt" />
                <h2 className="text-xl sm:text-2xl font-bold text-corporate-slate tracking-tight">
                  Academic Research Manuscripts ({filteredResearch.length})
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Strictly 2 Verified Scientific Inquiries</span>
            </div>

            {filteredResearch.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 rounded-xl bg-corporate-pale border border-corporate-border">
                No academic research found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="space-y-10">
                {filteredResearch.map((paper, index) => (
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
                      <h3 className="text-2xl sm:text-3xl font-bold text-corporate-slate tracking-tight leading-snug">
                        {paper.title}
                      </h3>

                      {/* Abstract */}
                      <div className="mt-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Abstract</h4>
                        <div className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-corporate-white p-5 rounded-xl border border-corporate-border shadow-sm">
                          {paper.abstract}
                        </div>
                      </div>

                      {/* Objectives & Methodology */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Research Objectives</h4>
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
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Methodological Architecture</h4>
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
            )}
          </section>
        )}
      </div>
    </div>
  );
}
