import React from "react";
import { masterProfile } from "@/lib/profileData";
import { Briefcase, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export default function ExperiencePage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12 border-b border-midnight-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-electric-400">Career History</span>
        <h1 className="text-4xl font-extrabold text-white mt-2">Verified Professional Experience</h1>
        <p className="text-gray-300 mt-3 text-sm max-w-2xl leading-relaxed">
          Chronological timeline of enterprise roles, recruitment management, technical operations, and frontend engineering.
        </p>
      </div>

      <div className="relative border-l-2 border-midnight-800 ml-4 sm:ml-8 space-y-12">
        {masterProfile.experience.map((exp, index) => (
          <div key={exp.id} className="relative pl-6 sm:pl-10">
            {/* Timeline bullet icon */}
            <div className="absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-midnight-900 border-2 border-electric-500 text-electric-400 shadow-md shadow-electric-500/20">
              <Briefcase className="h-4 w-4" />
            </div>

            <div className="glass-panel p-6 sm:p-8 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-midnight-800/80 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{exp.role}</h3>
                  <div className="text-sm font-semibold text-electric-400 mt-0.5">{exp.company}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="inline-flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                    <span>{exp.period}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-500" />
                    <span>{exp.location}</span>
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {exp.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-electric-400/80 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
