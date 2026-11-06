import React from "react";
import { masterProfile } from "@/lib/profileData";
import { 
  Code2, 
  Layout, 
  Smartphone, 
  Cpu, 
  Users, 
  TrendingUp, 
  Server, 
  FileSearch, 
  Wrench,
  CheckCircle2,
  Sparkles,
  BookOpen
} from "lucide-react";

export default function SkillsPage() {
  const levels = masterProfile.skill_levels;

  return (
    <div className="bg-corporate-white text-corporate-slate min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-corporate-border pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-corporate-cobalt">Structured Skills Library</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-corporate-slate mt-2 tracking-tight">
            Technical & Professional Skills
          </h1>
          <p className="text-gray-600 mt-3 text-base max-w-2xl leading-relaxed">
            Evidence-backed skills categorized strictly by level of application: professional employment, verified software projects, and continuous learning familiarity.
          </p>
        </div>

        {/* 1. Skill Application Tiers */}
        <div className="space-y-12">
          {/* Tier 1: Professional Experience */}
          <section className="p-8 rounded-2xl bg-corporate-pale/70 border border-corporate-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-corporate-cobalt text-white flex items-center justify-center font-bold text-sm shadow-sm">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-corporate-slate tracking-tight">
                  Professional Experience (Employment-Tested)
                </h2>
                <p className="text-xs text-gray-600">
                  Skills exercised in professional roles at Innova Solutions, Herbal Energy, Algo Spark Technologies, and MCD.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {levels?.professional_experience.map((s) => (
                <div key={s.name} className="p-4 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-corporate-cobalt font-semibold mb-1">
                    <span>{s.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-corporate-pale text-[10px] text-gray-700">Verified</span>
                  </div>
                  <div className="font-bold text-sm text-corporate-slate">{s.name}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    <span className="font-medium text-gray-700">Evidence: </span>{s.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tier 2: Project Experience */}
          <section className="p-8 rounded-2xl bg-corporate-pale/70 border border-corporate-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-corporate-slate text-white flex items-center justify-center font-bold text-sm shadow-sm">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-corporate-slate tracking-tight">
                  Project Experience (Working Software Builds)
                </h2>
                <p className="text-xs text-gray-600">
                  Technologies applied in completed engineering systems (JARVIS, Lunova OS, ATSForge, Platform, CINEMATRIX).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {levels?.project_experience.map((s) => (
                <div key={s.name} className="p-4 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-corporate-cobalt font-semibold mb-1">
                    <span>{s.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-corporate-pale text-[10px] text-gray-700">Tested</span>
                  </div>
                  <div className="font-bold text-sm text-corporate-slate">{s.name}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    <span className="font-medium text-gray-700">Evidence: </span>{s.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tier 3: Learning Familiarity */}
          <section className="p-8 rounded-2xl bg-corporate-pale/70 border border-corporate-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-gray-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-corporate-slate tracking-tight">
                  Learning-Level Familiarity (Academic & Exploration)
                </h2>
                <p className="text-xs text-gray-600">
                  Technologies studied in academic coursework, lab experiments, or under active evaluation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {levels?.learning_familiarity.map((s) => (
                <div key={s.name} className="p-4 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold mb-1">
                    <span>{s.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600">Active Study</span>
                  </div>
                  <div className="font-bold text-sm text-corporate-slate">{s.name}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    <span className="font-medium text-gray-700">Context: </span>{s.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 2. Structured Domain Category Matrix */}
        <section className="mt-16 pt-12 border-t border-corporate-border">
          <h2 className="text-2xl font-bold text-corporate-slate tracking-tight mb-8">
            Complete Technology & Discipline Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Layout className="h-4 w-4 text-corporate-cobalt" />
                <span>Frontend Engineering & UI/UX</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {masterProfile.skills.frontend_and_design.map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Server className="h-4 w-4 text-corporate-cobalt" />
                <span>Backend, Cloud & Systems</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {masterProfile.skills.backend_and_cloud.map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Users className="h-4 w-4 text-corporate-cobalt" />
                <span>Recruitment & Business Operations</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {masterProfile.skills.recruitment_and_business.map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-corporate-cobalt" />
                <span>Analytics, AI & Research</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {masterProfile.skills.analytics_and_ai.map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
