import React from "react";
import { masterProfile } from "@/lib/profileData";
import { Cpu, Layout, Server, Users, CheckCircle2 } from "lucide-react";

export default function SkillsPage() {
  const skillCategories = [
    {
      name: "Analytics, AI & Research",
      icon: Cpu,
      color: "text-electric-400",
      skills: masterProfile.skills.analytics_and_ai,
      description: "Computational modeling, machine learning, medical imaging analysis, and data synthesis.",
    },
    {
      name: "Frontend Engineering & UI/UX",
      icon: Layout,
      color: "text-violet-400",
      skills: masterProfile.skills.frontend_and_design,
      description: "Next.js, React, TypeScript, responsive Tailwind interfaces, and Figma design systems.",
    },
    {
      name: "Backend, Cloud & Systems",
      icon: Server,
      color: "text-blue-400",
      skills: masterProfile.skills.backend_and_cloud,
      description: "FastAPI REST microservices, Cloudflare D1/Workers, PowerShell, and CI/CD pipelines.",
    },
    {
      name: "Recruitment & Business Operations",
      icon: Users,
      color: "text-green-400",
      skills: masterProfile.skills.recruitment_and_business,
      description: "Full-cycle US IT recruitment, candidate screening, ATS optimization, and B2B growth.",
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12 border-b border-midnight-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-electric-400">Technical Competencies</span>
        <h1 className="text-4xl font-extrabold text-white mt-2">Skills & Technical Matrix</h1>
        <p className="text-gray-300 mt-3 text-sm max-w-2xl leading-relaxed">
          Categorized technical capabilities across software development, data science, infrastructure, and recruitment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.name} className="glass-panel p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-midnight-900 border border-midnight-800">
                    <Icon className={`h-5 w-5 ${cat.color}`} />
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{cat.name}</h2>
                </div>
                <p className="text-xs text-gray-400 mb-6">{cat.description}</p>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-midnight-900 border border-midnight-800 text-xs text-gray-200 hover:border-electric-500/40 transition-colors"
                    >
                      <CheckCircle2 className="h-3 w-3 text-electric-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
