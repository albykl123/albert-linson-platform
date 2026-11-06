import React from "react";
import { masterProfile, SkillItem } from "@/lib/profileData";
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

  const profSkills = levels?.professional_work || levels?.professional_experience || [];
  const projSkills = levels?.project_experience || [];
  const acadSkills = levels?.academic_experience || [];
  const learnSkills = levels?.currently_learning || levels?.learning_familiarity || [];

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
            Evidence-backed capabilities categorized strictly by level of application: professional employment, verified software projects, academic coursework, and active learning.
          </p>
        </div>

        {/* 1. Skill Application Tiers (4 Confirmed Tiers) */}
        <div className="space-y-12">
          {/* Tier 1: Demonstrated Through Professional Work */}
          <section className="p-8 rounded-2xl bg-corporate-pale/70 border border-corporate-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-corporate-cobalt text-white flex items-center justify-center font-bold text-sm shadow-sm">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-corporate-slate tracking-tight">
                  Demonstrated Through Professional Work
                </h2>
                <p className="text-xs text-gray-600">
                  Applied in employment and structured roles at Innova Solutions, Herbal Energies, Algo Spark Technologies, METVY LEARN, and MCD.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {profSkills.map((s: SkillItem) => (
                <div key={s.name} className="p-4 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-corporate-cobalt font-semibold mb-1">
                    <span>{s.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-corporate-pale text-[10px] text-gray-700">Employment Tested</span>
                  </div>
                  <div className="font-bold text-sm text-corporate-slate">{s.name}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    <span className="font-medium text-gray-700">Evidence: </span>{s.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tier 2: Demonstrated Through Projects */}
          <section className="p-8 rounded-2xl bg-corporate-pale/70 border border-corporate-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-corporate-slate text-white flex items-center justify-center font-bold text-sm shadow-sm">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-corporate-slate tracking-tight">
                  Demonstrated Through Working Projects
                </h2>
                <p className="text-xs text-gray-600">
                  Architected and deployed in working software builds (JARVIS, Lunova OS, ATSForge AI, CINEMATRIX, AURIVA, Platform).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {projSkills.map((s: SkillItem) => (
                <div key={s.name} className="p-4 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-corporate-cobalt font-semibold mb-1">
                    <span>{s.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-corporate-pale text-[10px] text-gray-700">Verified Build</span>
                  </div>
                  <div className="font-bold text-sm text-corporate-slate">{s.name}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    <span className="font-medium text-gray-700">Evidence: </span>{s.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tier 3: Academic Experience */}
          <section className="p-8 rounded-2xl bg-corporate-pale/70 border border-corporate-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-corporate-slate tracking-tight">
                  Academic Experience (University Coursework)
                </h2>
                <p className="text-xs text-gray-600">
                  Core computer science foundations completed during BCA and MCA curricula at CHRIST (Deemed to be University).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {acadSkills.map((s: SkillItem) => (
                <div key={s.name} className="p-4 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-indigo-700 font-semibold mb-1">
                    <span>{s.category}</span>
                    <span className="px-1.5 py-0.5 rounded bg-corporate-pale text-[10px] text-gray-700">Academic Rigor</span>
                  </div>
                  <div className="font-bold text-sm text-corporate-slate">{s.name}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    <span className="font-medium text-gray-700">Context: </span>{s.evidence}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tier 4: Currently Learning */}
          <section className="p-8 rounded-2xl bg-corporate-pale/70 border border-corporate-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-gray-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                4
              </div>
              <div>
                <h2 className="text-xl font-bold text-corporate-slate tracking-tight">
                  Currently Learning & Exploratory Lab
                </h2>
                <p className="text-xs text-gray-600">
                  Modern technologies under active investigation, course study, or experimental testing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {learnSkills.map((s: SkillItem) => (
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
            Complete Technology & Domain Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Layout className="h-4 w-4 text-corporate-cobalt" />
                <span>Frontend Development</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(masterProfile.skills.frontend_development || [
                  "HTML5", "CSS3", "JavaScript (ES6+)", "Bootstrap", "React", "Next.js", "TypeScript", "Tailwind CSS"
                ]).map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Server className="h-4 w-4 text-corporate-cobalt" />
                <span>Backend & Cloud</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(masterProfile.skills.programming_and_backend || [
                  "Python", "FastAPI", "SQL", "MySQL", "SQLite / Cloudflare D1", "Node.js", "RESTful API Design"
                ]).map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Smartphone className="h-4 w-4 text-corporate-cobalt" />
                <span>Android Development</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(masterProfile.skills.android_development || [
                  "Kotlin", "Jetpack Compose", "Android Studio", "Gradle", "Android UI Prototyping"
                ]).map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-corporate-cobalt" />
                <span>AI & Development Tools</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(masterProfile.skills.ai_and_development || [
                  "OpenRouter", "Ollama", "Hugging Face", "Google Colab", "Docker", "Machine Learning"
                ]).map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-corporate-cobalt" />
                <span>Design & Dev Tools</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(masterProfile.skills.design || [
                  "Figma", "Adobe XD", "UI/UX Design", "Responsive Web Design"
                ]).concat(masterProfile.skills.development_tools || ["Git", "GitHub", "VS Code", "Linux"]).map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs rounded-lg bg-corporate-pale text-corporate-slate font-medium border border-corporate-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-corporate-white border border-corporate-border shadow-sm">
              <h3 className="font-bold text-base text-corporate-slate mb-3 flex items-center space-x-2">
                <Users className="h-4 w-4 text-corporate-cobalt" />
                <span>Recruitment & Leadership</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {(masterProfile.skills.professional_skills || [
                  "Full-Cycle US IT Recruitment", "Talent Acquisition", "Candidate Sourcing", "Event Management", "Team Leadership", "Peer Education"
                ]).map((skill) => (
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
