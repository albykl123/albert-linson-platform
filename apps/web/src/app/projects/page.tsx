import React from "react";
import { masterProfile } from "@/lib/profileData";
import { FolderGit2, ExternalLink, Code2, Terminal, Layers, CheckCircle2 } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-12 border-b border-midnight-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-electric-400">Engineering Work</span>
        <h1 className="text-4xl font-extrabold text-white mt-2">Verified Software Systems & Projects</h1>
        <p className="text-gray-300 mt-3 text-sm max-w-2xl leading-relaxed">
          Open-source repositories, operating systems engineering, AI assistants, and enterprise digital tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {masterProfile.projects.map((proj) => (
          <div key={proj.id} className="glass-panel p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/20 rounded-md">
                  {proj.status}
                </span>
                {proj.github_url && (
                  <a
                    href={proj.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <FolderGit2 className="h-4 w-4" />
                    <span>Source</span>
                  </a>
                )}
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">{proj.title}</h3>
              <p className="text-xs font-medium text-electric-300 mt-1">{proj.tagline}</p>
              
              <p className="text-xs sm:text-sm text-gray-300 mt-4 leading-relaxed">
                {proj.description}
              </p>

              <div className="mt-5 space-y-2 border-t border-midnight-800 pt-4">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Key Architectural Milestones</div>
                {proj.highlights.map((h, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-gray-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-electric-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-midnight-800">
              <div className="flex flex-wrap gap-1.5">
                {proj.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 text-[10px] bg-midnight-800 text-gray-300 rounded font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
