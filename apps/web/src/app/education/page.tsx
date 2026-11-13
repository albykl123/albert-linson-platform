import React from "react";
import Link from "next/link";
import { masterProfile } from "@/lib/profileData";
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileCheck2,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function EducationPage() {
  return (
    <div className="bg-swiss-light text-swiss-navy min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-swiss-divider pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-swiss-divider bg-swiss-white text-xs font-semibold text-swiss-blue mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Academic Qualifications &bull; Verified Credentials</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-swiss-navy tracking-tight">
            Education & Academic Credentials
          </h1>
          <p className="text-gray-600 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
            Institutional computer science and applications qualifications at CHRIST (Deemed to be University) and St. Columba&apos;s School, New Delhi, verified against official institutional records.
          </p>
        </div>

        {/* 1. Academic Credentials Cards */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-swiss-navy tracking-tight flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-swiss-blue" />
              <span>Higher Education & Board Qualifications</span>
            </h2>
            <span className="text-xs text-gray-500 font-medium hidden sm:block">
              3 Verified Institutional Records
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {masterProfile.education.map((edu) => {
              const isCurrent = edu.period?.toLowerCase().includes("currently") || edu.period?.toLowerCase().includes("pursuing");
              const coursework = edu.coursework || [];

              return (
                <div
                  key={edu.id}
                  className="bg-swiss-white p-6 sm:p-8 rounded-2xl border border-swiss-divider shadow-xs hover:border-swiss-blue/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-swiss-divider mb-4">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            isCurrent
                              ? "bg-amber-50 text-amber-900 border border-amber-200"
                              : "bg-emerald-50 text-emerald-900 border border-emerald-200"
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <Clock className="h-3.5 w-3.5 text-amber-600" />
                              <span>{edu.academic_status || "Currently Pursuing • Post-Graduate"}</span>
                            </>
                          ) : (
                            <>
                              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{edu.academic_status || "Graduated • Verified Qualification"}</span>
                            </>
                          )}
                        </span>
                        {edu.graduation_year && (
                          <span className="text-xs font-medium text-gray-500 bg-swiss-light px-2.5 py-1 rounded-md border border-swiss-divider">
                            Class of {edu.graduation_year}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3.5 w-3.5 text-swiss-blue" />
                          <span>{edu.period}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-swiss-blue" />
                          <span>{edu.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Degree & Institution */}
                    <h3 className="text-xl sm:text-2xl font-bold text-swiss-navy tracking-tight">
                      {edu.degree}
                    </h3>
                    <div className="text-sm font-semibold text-swiss-blue mt-1">
                      {edu.institution}
                    </div>

                    {edu.specialization && (
                      <div className="mt-3 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                        <span className="text-slate-500">Specialization: </span>
                        {edu.specialization}
                      </div>
                    )}

                    {/* Overview Details */}
                    <p className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                      {edu.details}
                    </p>

                    {/* Relevant Coursework */}
                    {coursework.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-swiss-divider">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center space-x-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-swiss-blue" />
                          <span>Core Academic Coursework & Rigor</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {coursework.map((course, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2.5 py-1 text-xs rounded-md bg-swiss-light text-slate-800 border border-swiss-divider font-medium"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Verified Academic Performance & CGPA Section */}
                    <div className="mt-5 pt-4 border-t border-swiss-divider">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-semibold text-slate-800">Academic Grading Scale: </span>
                          <span className="text-slate-600 font-sans">
                            {edu.grading_scale || "10.0 CGPA Scale • Transcripts verified upon employer request"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit shrink-0">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Institutional Verification Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. Verified Certifications & Activities */}
        {masterProfile.certifications && (
          <section className="pt-8 border-t border-swiss-divider">
            <h2 className="text-xl sm:text-2xl font-bold text-swiss-navy mb-6 flex items-center space-x-2">
              <Award className="h-5 w-5 text-swiss-blue" />
              <span>Recognitions & Supplementary Certifications</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {masterProfile.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-swiss-white p-6 rounded-2xl border border-swiss-divider shadow-xs flex items-start space-x-4 hover:border-swiss-blue/40 transition-colors"
                >
                  <div className="p-3 rounded-xl bg-swiss-light border border-swiss-divider text-swiss-blue shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-swiss-navy">{cert.name}</h3>
                    <div className="text-xs font-semibold text-swiss-blue mt-0.5">{cert.issuer}</div>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
