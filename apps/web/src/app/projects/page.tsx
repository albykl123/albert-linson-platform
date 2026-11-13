"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { ProjectDemosModal } from "@/components/ProjectDemosModal";
import { ProjectThumbnail } from "@/components/ProjectThumbnail";
import githubReposData from "@/data/github_repos.json";
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
  Play, 
  Github, 
  GitFork, 
  Star, 
  GitBranch,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Target
} from "lucide-react";

export default function ProjectsAndResearchPage() {
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "github" | "research">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [demoTarget, setDemoTarget] = useState<"jarvis" | "auriva" | "cinematrix">("jarvis");
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const toggleProjectExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  // Sync tab with URL hash or query if present on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      const hash = window.location.hash;
      if (tabParam === "research" || hash === "#research") {
        setActiveTab("research");
      } else if (tabParam === "github" || hash === "#github") {
        setActiveTab("github");
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

  // Filter GitHub repositories directly from authenticated @albykl123 account
  const verifiedGithubRepos = (githubReposData as any[]).filter(
    (r) => r.name !== "albykl1231" && r.name !== "pandas.pd"
  );
  const filteredGithubRepos = verifiedGithubRepos.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q))
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

  const totalCount = masterProfile.projects.length + verifiedGithubRepos.length + masterProfile.research.length;

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
          <div className="inline-flex p-1 rounded-xl bg-corporate-pale border border-corporate-border shadow-sm flex-wrap gap-1">
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
              onClick={() => setActiveTab("github")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === "github"
                  ? "bg-corporate-white text-corporate-cobalt shadow-sm border border-corporate-border"
                  : "text-gray-600 hover:text-corporate-slate"
              }`}
            >
              <Github className="h-3.5 w-3.5" />
              <span>Connected GitHub ({verifiedGithubRepos.length})</span>
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
                  const isExpanded = expandedProjectId === project.id;

                  return (
                    <article
                      key={project.id}
                      className="p-6 rounded-2xl bg-corporate-white border border-corporate-border shadow-xs flex flex-col justify-between hover:shadow-md hover:border-corporate-cobalt/40 transition-all duration-200"
                    >
                      <div>
                        {/* 16:9 Visual Thumbnail / Architecture Blueprint */}
                        <div className="mb-4">
                          <ProjectThumbnail
                            projectId={project.id}
                            title={project.title}
                            category={project.category}
                            imageUrl={project.thumbnail}
                            technologies={project.technologies}
                          />
                        </div>

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
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-corporate-border bg-corporate-white hover:bg-corporate-pale text-corporate-slate text-[11px] font-semibold transition-all shadow-2xs"
                                title="View GitHub Repository"
                              >
                                <Github className="h-3 w-3 text-slate-700" />
                                <span>Code</span>
                                <ArrowUpRight className="h-2.5 w-2.5 text-gray-400" />
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

                        {/* Key Highlights */}
                        <div className="mt-4 space-y-1.5">
                          {project.highlights.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex items-start space-x-2 text-xs text-gray-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-corporate-cobalt shrink-0 mt-0.5" />
                              <span className="leading-snug">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack & Expand Trigger */}
                      <div className="mt-6 pt-4 border-t border-corporate-border space-y-4">
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-[10px] bg-corporate-pale text-corporate-slate rounded-md border border-corporate-border font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Read More Accordion Toggle */}
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[11px] text-gray-500 font-medium">
                            {isExpanded ? "Showing architecture & outcomes" : "Deep-dive technical architecture"}
                          </span>
                          <button
                            onClick={() => toggleProjectExpand(project.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`project-detail-${project.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-corporate-border bg-corporate-white hover:bg-corporate-pale text-corporate-slate text-xs font-semibold transition-colors"
                          >
                            <span>{isExpanded ? "Collapse" : "Read More"}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-corporate-cobalt" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-corporate-cobalt" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Technical Deep-Dive Panel */}
                      {isExpanded && (
                        <div
                          id={`project-detail-${project.id}`}
                          role="region"
                          aria-label={`Technical deep dive for ${project.title}`}
                          className="mt-4 pt-4 border-t border-corporate-border/80 bg-corporate-pale/50 -mx-6 -mb-6 p-6 rounded-b-2xl space-y-4 animate-in fade-in duration-200"
                        >
                          {project.architecture && (
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-corporate-slate mb-1 flex items-center space-x-1.5">
                                <Cpu className="h-3.5 w-3.5 text-corporate-cobalt" />
                                <span>System Architecture</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                                {project.architecture}
                              </p>
                            </div>
                          )}

                          {project.my_contribution && (
                            <div>
                              <div className="text-[11px] font-bold uppercase tracking-wider text-corporate-slate mb-1 flex items-center space-x-1.5">
                                <Target className="h-3.5 w-3.5 text-indigo-600" />
                                <span>My Personal Contribution</span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed font-sans">
                                {project.my_contribution}
                              </p>
                            </div>
                          )}

                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-corporate-slate mb-1.5 flex items-center space-x-1.5">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              <span>Verified Engineering Outcomes</span>
                            </div>
                            <ul className="space-y-1">
                              {project.highlights.map((h, hIdx) => (
                                <li key={hIdx} className="text-xs text-gray-600 flex items-start space-x-1.5">
                                  <span className="text-corporate-cobalt font-bold">&bull;</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* SECTION: CONNECTED GITHUB REPOSITORIES (@albykl123) */}
        {(activeTab === "all" || activeTab === "github") && (
          <section id="github" className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-3 border-b border-corporate-border gap-2">
              <div className="flex items-center space-x-2">
                <Github className="h-5 w-5 text-corporate-cobalt" />
                <h2 className="text-xl sm:text-2xl font-bold text-corporate-slate tracking-tight">
                  Connected GitHub Repositories ({filteredGithubRepos.length})
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Connected: @albykl123</span>
                </span>
                <a
                  href="https://github.com/albykl123"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-corporate-border hover:bg-corporate-pale text-xs font-semibold text-corporate-slate transition-colors"
                >
                  <span>View Profile</span>
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                </a>
              </div>
            </div>

            {filteredGithubRepos.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500 rounded-xl bg-corporate-pale border border-corporate-border">
                No GitHub repositories found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGithubRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-5 rounded-2xl bg-corporate-white border border-corporate-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center space-x-1.5">
                          <FolderGit2 className="h-4 w-4 text-corporate-cobalt" />
                          <span className="text-xs font-bold text-corporate-slate group-hover:text-corporate-cobalt transition-colors truncate max-w-[170px]">
                            {repo.name}
                          </span>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          repo.private
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}>
                          {repo.private ? "Private Platform" : "Public Repo"}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-2 leading-relaxed min-h-[40px] line-clamp-3">
                        {repo.description || "Active engineering repository hosted on GitHub."}
                      </p>

                      <div className="mt-4 flex items-center space-x-3 text-[11px] text-gray-500">
                        {repo.language && (
                          <div className="flex items-center space-x-1 font-medium text-corporate-slate">
                            <span className="h-2 w-2 rounded-full bg-corporate-cobalt" />
                            <span>{repo.language}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          <span>{repo.stars || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <GitFork className="h-3 w-3 text-gray-400" />
                          <span>{repo.forks || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-corporate-border flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono">
                        {repo.default_branch || "main"}
                      </span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-corporate-cobalt hover:text-blue-700 transition-colors"
                      >
                        <span>Open Repo</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: ACADEMIC RESEARCH & INTERACTIVE EXPLORER */}
        {(activeTab === "all" || activeTab === "research") && (
          <section id="research" className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-corporate-border">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-corporate-cobalt" />
                <h2 className="text-xl sm:text-2xl font-bold text-corporate-slate tracking-tight">
                  Academic Research Manuscripts ({filteredResearch.length})
                </h2>
              </div>
              <span className="text-xs text-gray-500 font-medium">Verified Scientific Inquiries</span>
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
