"use client";

import { useState } from "react";
import Link from "next/link";
import { masterProfile, LeadershipRecord } from "@/lib/profileData";

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
    <div className="min-h-screen bg-ivory-surface text-ivory-text">
      {/* Hero Header */}
      <section className="bg-ivory-card border-b border-ivory-border py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-ivory-border/50 text-ivory-text mb-4">
            <span className="w-2 h-2 rounded-full bg-ivory-sage"></span>
            Verified Leadership & Engagement Portfolio
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-ivory-text mb-4">
            Leadership, Campus Engagement & Event Management
          </h1>
          <p className="text-lg text-ivory-text/80 max-w-3xl leading-relaxed">
            A comprehensive, verified record of institutional leadership, event operations, student welfare, peer education, and campus engagement across St. Columba&apos;s School and CHRIST (Deemed to be University), Delhi NCR.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs text-ivory-text/70">
            <div className="flex items-center gap-2 bg-ivory-surface px-3 py-1.5 rounded border border-ivory-border">
              <span className="font-semibold text-ivory-text">13</span> Verified Engagement Records
            </div>
            <div className="flex items-center gap-2 bg-ivory-surface px-3 py-1.5 rounded border border-ivory-border">
              <span className="font-semibold text-ivory-text">2</span> Institutions (St. Columba&apos;s & Christ Univ)
            </div>
            <div className="flex items-center gap-2 bg-ivory-surface px-3 py-1.5 rounded border border-ivory-border">
              <span className="font-semibold text-ivory-text">6</span> Professional Domains
            </div>
            <div className="flex items-center gap-2 bg-ivory-surface px-3 py-1.5 rounded border border-ivory-border text-ivory-sage font-medium">
              ✓ Formally Documented Roles Only
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Peer Educator Progression Spotlight */}
        <div className="mb-12 bg-white rounded-xl p-6 sm:p-8 border border-ivory-border shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-ivory-sage/20 text-ivory-sage flex items-center justify-center font-bold text-sm">
              ★
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-ivory-text">
                CCHS Peer Education Progression (2022 – 2028)
              </h2>
              <p className="text-xs text-ivory-text/70">
                Centre for Counselling & Health Services, CHRIST (Deemed to be University)
              </p>
            </div>
          </div>
          <p className="text-sm text-ivory-text/80 leading-relaxed mb-6">
            Documented leadership advancement from foundational student mentorship to senior peer educator leadership. Focused on student orientation, well-being advocacy, and healthy campus community building.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-ivory-surface border border-ivory-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-ivory-sage uppercase tracking-wider">Phase 1: Foundational</span>
                <span className="text-xs bg-white px-2 py-0.5 rounded border border-ivory-border font-mono">2022 – 2025</span>
              </div>
              <h3 className="font-bold text-ivory-text text-base mb-1">Peer Educator</h3>
              <p className="text-xs text-ivory-text/75 leading-relaxed">
                Completed structured CCHS training; facilitated student wellness discussions and connected peers with university counselling resources.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-ivory-surface border border-ivory-sage/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-ivory-sage/10 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-ivory-sage uppercase tracking-wider">Phase 2: Advanced Leadership</span>
                <span className="text-xs bg-white px-2 py-0.5 rounded border border-ivory-border font-mono">2026 – 2028</span>
              </div>
              <h3 className="font-bold text-ivory-text text-base mb-1">Advanced Peer Educator</h3>
              <p className="text-xs text-ivory-text/75 leading-relaxed">
                Appointed to mentor junior peer educators, coordinate university-wide wellness initiatives, and liaise with professional counselling staff.
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-ivory-surface/70 rounded text-xs text-ivory-text/60 italic border-l-2 border-ivory-sage">
            Notice: Serves as a trained student peer mentor and well-being liaison; does not practice or claim clinical mental-health therapy qualifications.
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-ivory-text/60">
              Filter by Professional Domain
            </h2>
            <span className="text-xs text-ivory-text/60">
              Showing {filteredRecords.length} of {records.length} records
            </span>
          </div>
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
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors inline-flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-ivory-text text-white shadow-sm"
                      : "bg-white text-ivory-text/80 hover:bg-ivory-card border border-ivory-border"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-ivory-border/60 text-ivory-text/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leadership Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl p-6 border border-ivory-border shadow-sm flex flex-col justify-between hover:border-ivory-sage/60 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-ivory-sage mb-1">
                      {record.category}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-ivory-text leading-snug">
                      {record.title}
                    </h3>
                  </div>
                  <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-ivory-card text-ivory-text font-mono border border-ivory-border">
                    {record.period}
                  </span>
                </div>

                <div className="text-xs text-ivory-text/70 font-medium mb-4 space-y-0.5">
                  <div>
                    <span className="text-ivory-text/50">Organization:</span> {record.organization}
                  </div>
                  <div>
                    <span className="text-ivory-text/50">Institution:</span> {record.institution}
                  </div>
                  <div>
                    <span className="text-ivory-text/50">Role Level:</span>{" "}
                    <span className="font-semibold text-ivory-text">{record.role_level}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  {record.responsibilities.map((resp, idx) => (
                    <div key={idx} className="text-xs text-ivory-text/80 leading-relaxed flex items-start gap-2">
                      <span className="text-ivory-sage text-sm leading-none mt-0.5">•</span>
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>

                {record.progression_note && (
                  <div className="mb-4 p-2.5 bg-ivory-surface rounded text-[11px] text-ivory-text/80 border-l-2 border-ivory-sage">
                    {record.progression_note}
                  </div>
                )}
              </div>

              <div>
                <div className="pt-4 border-t border-ivory-border">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-ivory-text/50 mb-2">
                    Recruiter Competency Keywords
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {record.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] bg-ivory-surface text-ivory-text/85 px-2 py-0.5 rounded border border-ivory-border/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-ivory-card rounded-2xl p-8 border border-ivory-border text-center">
          <h2 className="text-2xl font-serif font-bold text-ivory-text mb-3">
            Interested in Leadership & Organizational Capabilities?
          </h2>
          <p className="text-sm text-ivory-text/80 max-w-2xl mx-auto mb-6 leading-relaxed">
            These experiences reflect disciplined event operations, stakeholder communication, cross-functional team leadership, and student advocacy. Explore my complete resume or reach out directly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/resume"
              className="px-5 py-2.5 rounded-lg bg-ivory-text text-white text-xs font-semibold tracking-wide hover:bg-black transition-colors"
            >
              Download Printable Resume
            </Link>
            <Link
              href="/experience"
              className="px-5 py-2.5 rounded-lg bg-white text-ivory-text text-xs font-semibold tracking-wide border border-ivory-border hover:bg-ivory-surface transition-colors"
            >
              View Professional Experience
            </Link>
            <a
              href="mailto:albertkalampaadan@gmail.com"
              className="px-5 py-2.5 rounded-lg bg-ivory-sage text-white text-xs font-semibold tracking-wide hover:bg-ivory-sage/90 transition-colors"
            >
              Contact Me Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
