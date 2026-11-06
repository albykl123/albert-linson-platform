import React from "react";
import { masterProfile } from "@/lib/profileData";
import { Briefcase, Calendar, MapPin, CheckCircle2, Wrench, ShieldCheck, Tag } from "lucide-react";

export default function ExperiencePage() {
  return (
    <div className="bg-ivory-base text-ivory-charcoal min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-ivory-cream pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-ivory-sage">Career Journey & Timeline</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-ivory-charcoal mt-2 tracking-tight">
            Verified Professional Experience
          </h1>
          <p className="text-gray-700 mt-3 text-base max-w-2xl leading-relaxed">
            Chronological documentation of full-time employment, technical management, business development, and software internships based strictly on authentic records.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="relative border-l-2 border-ivory-beige/60 ml-4 sm:ml-8 space-y-12">
          {masterProfile.experience.map((exp) => (
            <div key={exp.id} className="relative pl-6 sm:pl-10">
              {/* Timeline marker */}
              <div className="absolute -left-[17px] top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-ivory-cream border-2 border-ivory-sage text-ivory-charcoal shadow-sm">
                <Briefcase className="h-4 w-4" />
              </div>

              <div className="bg-ivory-cream/60 p-6 sm:p-8 rounded-2xl border border-ivory-beige/50 shadow-sm">
                {/* Title & Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-ivory-beige/40 gap-2">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-xl font-bold text-ivory-charcoal tracking-tight">{exp.role}</h3>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                        exp.employment_type === "Internship"
                          ? "bg-ivory-sage/20 text-ivory-charcoal border border-ivory-sage/30"
                          : "bg-ivory-charcoal text-ivory-base"
                      }`}>
                        {exp.employment_type || "Full-Time"}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-ivory-sage mt-1">{exp.company}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700">
                    <span className="inline-flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-ivory-sage" />
                      <span>{exp.period}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1">
                      <MapPin className="h-3.5 w-3.5 text-ivory-sage" />
                      <span>{exp.location}</span>
                    </span>
                  </div>
                </div>

                {/* Key Responsibilities */}
                {exp.responsibilities && (
                  <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Core Responsibilities</h4>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-gray-800 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-ivory-sage shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Demonstrable Outcomes / Highlights */}
                <div className="mt-5 pt-4 border-t border-ivory-beige/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Demonstrable Outcomes</h4>
                  <ul className="space-y-1.5">
                    {exp.highlights.map((h, idx) => (
                      <li key={idx} className="text-xs text-gray-700 leading-relaxed flex items-start space-x-2">
                        <span className="text-ivory-sage font-bold">&bull;</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools & Technologies */}
                {exp.tools && (
                  <div className="mt-5 pt-4 border-t border-ivory-beige/30 flex items-center flex-wrap gap-1.5">
                    <span className="text-xs font-semibold text-gray-600 mr-1 flex items-center space-x-1">
                      <Wrench className="h-3 w-3 text-ivory-sage" />
                      <span>Tools:</span>
                    </span>
                    {exp.tools.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[11px] rounded bg-ivory-base text-ivory-charcoal border border-ivory-beige/60 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
