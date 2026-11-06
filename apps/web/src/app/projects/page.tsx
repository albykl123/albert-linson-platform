import React from "react";
import { masterProfile } from "@/lib/profileData";
import { FolderGit2, ExternalLink, Code2, Terminal, Layers, CheckCircle2, ArrowUpRight, Cpu, Wrench } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="bg-corporate-white text-corporate-slate min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-corporate-border pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-corporate-cobalt">Software Systems Showcase</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-corporate-slate mt-2 tracking-tight">
            Verified Software Projects
          </h1>
          <p className="text-gray-600 mt-3 text-base max-w-2xl leading-relaxed">
            Authentic software architectures, open-source repositories, operating systems engineering, desktop intelligence assistants, and web platforms.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {masterProfile.projects.map((proj) => (
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
      </div>
    </div>
  );
}
