"use client";

import { useState } from "react";
import Link from "next/link";
import { masterProfile, LeadershipRecord } from "@/lib/profileData";
import { 
  Award, 
  Calendar, 
  Building2, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap,
  Layers,
  FileText,
  Mail,
  ChevronRight,
  Star
} from "lucide-react";

const CATEGORIES = [
  "All Records",
  "Leadership & Event Management",
  "Student Welfare & Peer Education",
  "Branding, Media & Communications",
  "Cultural & Campus Engagement",
  "Disaster Management & Community Participation",
  "Sustainability & Institutional Engagement",
];

export default function LeadershipPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Records");
  const records = masterProfile.leadership || [];

  const filteredRecords =
    selectedCategory === "All Records"
      ? records
      : records.filter((r) => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* 1. Hero Header Section */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-50 text-blue-800 border border-blue-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Verified Leadership &amp; Institutional Governance
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 mb-4 leading-tight">
            Leadership, Campus Engagement &amp; Event Operations
          </h1>

          <p className="text-base sm:text-lg text-slate-700 max-w-3xl leading-relaxed font-normal">
            A comprehensive, verified record of institutional leadership, high-stakes event coordination, student welfare, peer education, and campus engagement across St. Columba&apos;s School and CHRIST (Deemed to be University), Delhi NCR.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 text-xs font-medium">
            <div className="flex items-center gap-2 bg-slate-50 text-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 shadow-xs">
              <Award className="h-4 w-4 text-blue-600" />
              <span><strong className="text-slate-950 font-bold">{records.length}</strong> Verified Records</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 text-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 shadow-xs">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span><strong className="text-slate-950 font-bold">2</strong> Premier Institutions</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 text-slate-800 px-3.5 py-2 rounded-lg border border-slate-200 shadow-xs">
              <Layers className="h-4 w-4 text-blue-600" />
              <span><strong className="text-slate-950 font-bold">6</strong> Professional Competency Domains</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 font-semibold shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Formally Documented Roles</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Peer Educator Progression Spotlight */}
        <div className="mb-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 pointer-events-none" />

          <div className="relative z-10 flex items-start sm:items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                CCHS Peer Education Leadership Progression (2022 &ndash; 2028)
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-blue-700 mt-0.5">
                Centre for Counselling &amp; Health Services (CCHS), CHRIST (Deemed to be University)
              </p>
            </div>
          </div>

          <p className="relative z-10 text-sm text-slate-700 leading-relaxed mb-6 max-w-4xl font-normal">
            Documented institutional progression from foundational student mentorship to senior peer educator leadership. Responsible for large-scale student orientation, student well-being advocacy, and serving as a trusted liaison between the student body and university mental health professionals.
          </p>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phase 1 */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                  Phase 1: Foundational Leadership
                </span>
                <span className="text-xs bg-white text-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono font-semibold">
                  2022 &ndash; 2025
                </span>
              </div>
              <h3 className="font-bold text-slate-950 text-base mb-1.5">
                Certified Peer Educator
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Completed rigorous CCHS institutional training; facilitated confidential student wellness dialogues, peer support circles, and connected students with university counselling infrastructure.
              </p>
            </div>

            {/* Phase 2 */}
            <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                  Phase 2: Senior Mentorship
                </span>
                <span className="text-xs bg-white text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-300 font-mono font-semibold">
                  2026 &ndash; 2028
                </span>
              </div>
              <h3 className="font-bold text-slate-950 text-base mb-1.5">
                Advanced Peer Educator (Appointed)
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                Appointed to mentor junior peer educators, coordinate campus-wide wellness and orientation programs, and liaise directly with senior counselling directors and university leadership.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-5 p-3.5 bg-slate-100 rounded-xl text-xs text-slate-600 font-medium border-l-4 border-blue-600 flex items-center gap-2">
            <span className="font-semibold text-slate-800">Notice:</span>
            <span>Serves strictly as a trained student peer mentor and well-being liaison; does not practice or claim clinical mental-health therapy qualifications.</span>
          </div>
        </div>

        {/* 3. Category Filter Controls */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Filter by Engagement Category
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 font-normal">
                Select a domain to filter specific leadership achievements and event operations.
              </p>
            </div>
            <span className="text-xs text-slate-700 font-semibold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
              Showing <strong className="text-blue-700">{filteredRecords.length}</strong> of {records.length} records
            </span>
          </div>

          {/* Filter Pill Buttons */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const count =
                category === "All Records"
                  ? records.length
                  : records.filter((r) => r.category === category).length;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-slate-950 text-white shadow-md border border-slate-900"
                      : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Leadership Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div>
                {/* Header: Category Badge & Period */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {record.category}
                  </span>
                  <span className="shrink-0 text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-mono font-semibold border border-slate-200">
                    {record.period}
                  </span>
                </div>

                {/* Role Title */}
                <h3 className="text-xl font-bold text-slate-950 leading-snug group-hover:text-blue-700 transition-colors">
                  {record.title}
                </h3>

                {/* Metadata Details */}
                <div className="mt-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Organization:</span>
                    <span className="font-bold text-slate-900">{record.organization}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Institution:</span>
                    <span className="font-semibold text-slate-800">{record.institution}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Role Level:</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-blue-700">
                      {record.role_level}
                    </span>
                  </div>
                </div>

                {/* Responsibilities & Achievements */}
                <div className="space-y-2.5 mb-5">
                  {record.responsibilities.map((resp, idx) => (
                    <div key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2.5 font-normal">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>

                {/* Optional Progression Note */}
                {record.progression_note && (
                  <div className="mb-4 p-3 bg-blue-50/70 rounded-xl text-xs text-blue-950 border border-blue-200/80 font-medium">
                    <span className="font-bold text-blue-900">Progression Note:</span> {record.progression_note}
                  </div>
                )}
              </div>

              {/* Recruiter Competencies Tags */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
                  Demonstrated Competencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {record.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200 font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 5. Bottom Navigation Call to Action */}
        <div className="mt-16 bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-3 tracking-tight">
            Interested in Leadership &amp; Operational Capabilities?
          </h2>
          <p className="text-sm sm:text-base text-slate-700 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            These verified records demonstrate disciplined event coordination, stakeholder negotiations, talent sourcing, cross-functional team leadership, and community advocacy.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/resume"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-950 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
            >
              <FileText className="h-4 w-4" />
              <span>View Executive Resume</span>
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Building2 className="h-4 w-4 text-blue-600" />
              <span>Professional Experience</span>
            </Link>
            <a
              href="mailto:albertkalampadan@gmail.com"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Directly</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
