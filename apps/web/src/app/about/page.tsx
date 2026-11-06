import React from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { GraduationCap, Briefcase, Award, CheckCircle, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-midnight-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-electric-400">Professional Identity</span>
        <h1 className="text-4xl font-extrabold text-white mt-2">About Albert Linson</h1>
        <p className="text-gray-300 mt-3 text-sm max-w-2xl leading-relaxed">
          {masterProfile.personal.headline} &bull; {masterProfile.personal.location}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Narrative */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Professional Biography</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {masterProfile.summary}
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mt-4">
              With a background spanning US IT recruitment, technical operations, and full-stack software development, I view technical systems through two essential lenses: technical architecture and organizational human impact. Whether designing custom OS kernels (Lunova OS), engineering multimodal desktop assistants (JARVIS), or modeling ultrasound data for cancer detection, my focus is always on rigorous, measurable results.
            </p>
          </section>

          {/* Core Philosophy */}
          <section className="glass-panel p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Core Engineering & Analytical Philosophy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-midnight-900 border border-midnight-800">
                <div className="font-semibold text-white text-sm mb-1">Data-Driven Precision</div>
                <p className="text-xs text-gray-400">
                  Every decision, from hiring pipelines to algorithm tuning, is grounded in objective telemetry and verifiable metrics.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-midnight-900 border border-midnight-800">
                <div className="font-semibold text-white text-sm mb-1">Deterministic Reliability</div>
                <p className="text-xs text-gray-400">
                  Prioritizing explainable, reproducible code paths over brittle black-box generative assumptions.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-midnight-900 border border-midnight-800">
                <div className="font-semibold text-white text-sm mb-1">Zero Hallucination</div>
                <p className="text-xs text-gray-400">
                  Strict boundaries ensuring AI systems elevate authentic human records without fabricating credentials.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-midnight-900 border border-midnight-800">
                <div className="font-semibold text-white text-sm mb-1">Human-Centric UX</div>
                <p className="text-xs text-gray-400">
                  Building accessible, intuitive interfaces that minimize cognitive load and eliminate user friction.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-electric-400" />
              <span>Academic Snapshot</span>
            </h3>
            <div className="space-y-4">
              {masterProfile.education.slice(0, 2).map((edu) => (
                <div key={edu.id} className="border-l-2 border-electric-500/40 pl-3">
                  <div className="text-xs font-bold text-white">{edu.degree}</div>
                  <div className="text-[11px] text-electric-300">{edu.institution}</div>
                  <div className="text-[10px] text-gray-400">{edu.period}</div>
                </div>
              ))}
            </div>
            <Link href="/education" className="mt-4 text-xs text-electric-400 hover:text-electric-300 inline-flex items-center space-x-1">
              <span>Full Education Credentials</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-violet-400" />
              <span>Career Snapshot</span>
            </h3>
            <div className="space-y-3">
              {masterProfile.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <span className="font-semibold text-white">{exp.role}</span>
                  <div className="text-gray-400 text-[11px]">{exp.company} &bull; {exp.period}</div>
                </div>
              ))}
            </div>
            <Link href="/experience" className="mt-4 text-xs text-violet-400 hover:text-violet-300 inline-flex items-center space-x-1">
              <span>View Verified Career Timeline</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
