"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { ProjectDemosModal } from "@/components/ProjectDemosModal";
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
  FileText,
  Copy,
  Check,
  Zap,
  Play
} from "lucide-react";

export default function ProjectsAndResearchPage() {
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "research">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoTarget, setDemoTarget] = useState<"jarvis" | "auriva" | "cinematrix">("jarvis");
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

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

  const handleOpenDemo = (target: "jarvis" | "auriva" | "cinematrix") => {
    setDemoTarget(target);
    setIsDemoModalOpen(true);
  };

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
      {/* Interactive Project Demos Modal */}
      {isDemoModalOpen && (
        <ProjectDemosModal
          initialDemo={demoTarget}
          onClose={() => setIsDemoModalOpen(false)}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 border-b border-corporate-border pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-corporate-border bg-corporate-pale text-corporate-cobalt text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Unified Engineering & Academic Inquiries</span>
            </div>

            {/* Live Interactive Demos Launcher Pill */}
            <button
              onClick={() => handleOpenDemo("jarvis")}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 text-cyan-400 hover:bg-slate-800 text-xs font-bold border border-cyan-500/40 shadow-sm transition-all hover:scale-105"
            >
              <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span>Launch Interactive Sandboxes (JARVIS, AURIVA, CINEMATRIX)</span>
            </button>
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
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Interactive Demos</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">3 Live</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Sandbox Environments</div>
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
                  Software Engineering Systems ({filteredProjects.length})
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">8 Verified Architectures</span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 rounded-xl bg-corporate-pale border border-corporate-border">
                No software engineering projects found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProjects.map((project) => {
                  const isDemoable = ["project-jarvis", "project-auriva", "project-cinematrix"].includes(project.id);
                  const demoMap: Record<string, "jarvis" | "auriva" | "cinematrix"> = {
                    "project-jarvis": "jarvis",
                    "project-auriva": "auriva",
                    "project-cinematrix": "cinematrix"
                  };

                  return (
                    <div
                      key={project.id}
                      className="p-6 rounded-2xl bg-corporate-white border border-corporate-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Header & Badges */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-corporate-cobalt px-2.5 py-0.5 rounded bg-corporate-pale border border-corporate-border">
                            {project.status || "Production System"}
                          </span>
                          <div className="flex items-center space-x-2">
                            {isDemoable && (
                              <button
                                onClick={() => handleOpenDemo(demoMap[project.id])}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 text-[10px] font-bold transition-all shadow-sm"
                                title="Launch Interactive Sandbox"
                              >
                                <Play className="h-2.5 w-2.5 fill-current" />
                                <span>Try Demo</span>
                              </button>
                            )}
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 text-gray-400 hover:text-corporate-slate transition-colors"
                                title="View GitHub Repository"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-corporate-slate mt-2 tracking-tight">
                          {project.title}
                        </h3>
                        <p className="text-xs font-semibold text-corporate-cobalt mt-0.5">
                          {project.tagline}
                        </p>

                        <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Highlights */}
                        <div className="mt-4 space-y-1.5">
                          {project.highlights.map((h, i) => (
                            <div key={i} className="flex items-start space-x-2 text-xs text-gray-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-corporate-cobalt shrink-0 mt-0.5" />
                              <span className="leading-snug">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack Tags */}
                      <div className="mt-6 pt-4 border-t border-corporate-border flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 text-[11px] bg-corporate-pale text-corporate-slate rounded-md border border-corporate-border font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: ACADEMIC RESEARCH (EXACTLY 2 PAPERS + INTERACTIVE EXPLORER) */}
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
                {filteredResearch.map((paper, index) => {
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
                                Where $T$ represents the synthesized test suite, maximizing structural edge coverage while penalizing redundant AST path traversal in automated LLM QA generation.
                              </p>
                            </div>
                          ) : (
                            <div className="font-mono text-xs sm:text-sm text-cyan-200 py-2 overflow-x-auto">
                              {"$$\\hat{y} = \\sigma\\left( \\mathbf{W}_f \\cdot \\left[ \\mathcal{F}_{\\text{B-Mode}}(\\mathbf{X}_1) \\oplus \\mathcal{F}_{\\text{ColorDoppler}}(\\mathbf{X}_2) \\right] + b \\right)$$"}
                              <p className="text-[11px] text-slate-400 mt-2 font-sans">
                                {"Multi-modal deep feature fusion concatenating structural morphological embeddings F_B-Mode with vascular hemodynamic velocity vectors F_ColorDoppler for robust non-invasive diagnostic classification."}
                              </p>
                            </div>
                          )}
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
            )}
          </section>
        )}
      </div>
    </div>
  );
}
