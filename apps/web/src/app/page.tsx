import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  FolderGit2, 
  GraduationCap, 
  Layers, 
  Search, 
  ShieldCheck, 
  Terminal, 
  Code, 
  Cpu, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import { masterProfile } from "@/lib/profileData";
import { freeStackData } from "@/lib/freestackData";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* 3D Constellation Hero Background */}
      <Hero3D />

      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-24 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-electric-500/30 bg-electric-500/10 text-electric-300 text-xs font-medium mb-8 backdrop-blur-sm shadow-sm animate-pulse">
          <Sparkles className="h-3.5 w-3.5 text-electric-400" />
          <span>Personal Intelligence Ecosystem &bull; Production v1.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
          Building <span className="bg-gradient-to-r from-electric-400 via-blue-300 to-violet-400 bg-clip-text text-transparent">Intelligent Digital</span> Experiences.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl font-normal leading-relaxed">
          I am <strong className="text-white font-semibold">{masterProfile.personal.name}</strong> — {masterProfile.personal.sub_headline}.
          Bridging technical systems, AI career intelligence, and computational research.
        </p>

        {/* CTA Button Group */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center items-center">
          <Link
            href="/studio"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-electric-500 to-blue-600 hover:from-electric-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-electric-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch Career Studio</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-midnight-700 bg-midnight-900/80 hover:bg-midnight-800 text-gray-200 hover:text-white font-medium text-sm backdrop-blur-sm transition-all"
          >
            <FolderGit2 className="h-4 w-4 text-electric-400" />
            <span>Explore Projects</span>
          </Link>

          <Link
            href="/resume"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl border border-midnight-700 bg-midnight-900/80 hover:bg-midnight-800 text-gray-200 hover:text-white font-medium text-sm backdrop-blur-sm transition-all"
          >
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span>Verified Public Resume</span>
          </Link>
        </div>

        {/* Quick Metric Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">4+</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Major Projects</div>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-electric-400">3</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Research Papers</div>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-violet-400">{freeStackData.total_services}+</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">FreeStack Services</div>
          </div>
          <div className="glass-card p-5 rounded-2xl text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-green-400">70%</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Proven Impact Metric</div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-midnight-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-electric-400">Portfolio Highlights</div>
            <h2 className="text-3xl font-bold text-white mt-2">Verified Software Systems</h2>
          </div>
          <Link href="/projects" className="mt-4 md:mt-0 text-sm text-electric-400 hover:text-electric-300 inline-flex items-center space-x-1">
            <span>View all projects</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masterProfile.projects.slice(0, 3).map((proj) => (
            <div key={proj.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-[11px] font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/20 rounded-md">
                    {proj.status}
                  </span>
                  {proj.github_url && (
                    <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white" aria-label="GitHub Repository">
                      <FolderGit2 className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{proj.title}</h3>
                <p className="text-xs font-medium text-electric-300 mt-1">{proj.tagline}</p>
                <p className="text-xs text-gray-300 mt-3 leading-relaxed">{proj.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-midnight-800">
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-[10px] bg-midnight-800 text-gray-300 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academic Research Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-midnight-900 bg-midnight-950/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-violet-400">Scientific Inquiries</div>
            <h2 className="text-3xl font-bold text-white mt-2">Academic Research Library</h2>
          </div>
          <Link href="/research" className="mt-4 md:mt-0 text-sm text-violet-400 hover:text-violet-300 inline-flex items-center space-x-1">
            <span>View full research bibliography</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {masterProfile.research.map((paper) => (
            <div key={paper.id} className="glass-panel p-8 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="font-semibold text-violet-400">{paper.category}</span>
                <span className="px-2 py-0.5 rounded bg-midnight-800 border border-midnight-700">{paper.status}</span>
              </div>
              <h3 className="text-xl font-bold text-white leading-snug">{paper.title}</h3>
              <p className="mt-4 text-xs text-gray-300 leading-relaxed line-clamp-4">{paper.abstract}</p>
              <div className="mt-6 pt-4 border-t border-midnight-800 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">{paper.role}</span>
                {paper.paper_url && paper.paper_url !== "#" ? (
                  <a
                    href={paper.paper_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-electric-400 hover:text-electric-300 font-semibold"
                  >
                    <span>Read Manuscript</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-gray-500">Peer Review Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FreeStack Intelligence Spotlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-midnight-900">
        <div className="glass-card p-8 sm:p-12 rounded-3xl relative overflow-hidden border border-electric-500/20 bg-gradient-to-br from-midnight-900 via-midnight-900/90 to-midnight-850">
          <div className="max-w-2xl">
            <span className="px-3 py-1 text-xs font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/20 rounded-full">
              FreeStack Intelligence Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Curated Free Cloud Infrastructure & Developer Tools
            </h2>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">
              Explore <strong>{freeStackData.total_services}</strong> curated developer resources across <strong>{freeStackData.total_categories}</strong> technical categories, synchronized directly from the authoritative <code>ripienaar/free-for-dev</code> repository.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/freestack"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search 1,369+ Free Services</span>
              </Link>
              <Link
                href="/studio"
                className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl border border-midnight-700 bg-midnight-800 hover:bg-midnight-700 text-gray-200 text-xs font-medium transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-electric-400" />
                <span>Open ATS Resume Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
