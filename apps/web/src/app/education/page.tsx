import React from "react";
import { masterProfile } from "@/lib/profileData";
import { GraduationCap, Award, Calendar, MapPin, BookOpen, CheckCircle, ShieldCheck } from "lucide-react";

export default function EducationPage() {
  return (
    <div className="bg-ivory-base text-ivory-charcoal min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-ivory-cream pb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-ivory-sage">Academic Qualifications</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-ivory-charcoal mt-2 tracking-tight">
            Education & Certifications
          </h1>
          <p className="text-gray-700 mt-3 text-base max-w-2xl leading-relaxed">
            Confirmed institutional qualifications at CHRIST (Deemed to be University) and St. Columba's School, alongside verified certifications.
          </p>
        </div>

        {/* 1. Academic Credentials Grid */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-ivory-charcoal mb-6 flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-ivory-sage" />
            <span>Academic Degrees</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {masterProfile.education.map((edu) => (
              <div
                key={edu.id}
                className="bg-ivory-cream/60 p-8 rounded-2xl border border-ivory-beige/60 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-700 mb-4">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-ivory-base border border-ivory-beige text-ivory-charcoal font-semibold">
                      <GraduationCap className="h-3.5 w-3.5 text-ivory-sage" />
                      <span>Verified Record</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gray-600">
                      <Calendar className="h-3 w-3 text-ivory-sage" />
                      <span>{edu.period}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-ivory-charcoal tracking-tight">{edu.degree}</h3>
                  <div className="text-sm font-semibold text-ivory-sage mt-1">{edu.institution}</div>

                  <div className="flex items-center space-x-1 text-xs text-gray-600 mt-2">
                    <MapPin className="h-3.5 w-3.5 text-ivory-sage" />
                    <span>{edu.location}</span>
                  </div>

                  {edu.specialization && (
                    <div className="mt-3 text-xs font-medium text-gray-700 bg-ivory-base p-2 rounded border border-ivory-beige/40">
                      <span className="font-semibold text-ivory-charcoal">Focus: </span>
                      {edu.specialization}
                    </div>
                  )}

                  <p className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-ivory-beige/40 pt-4">
                    {edu.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Verified Certifications & Activities */}
        {masterProfile.certifications && (
          <section className="pt-8 border-t border-ivory-cream">
            <h2 className="text-xl font-bold text-ivory-charcoal mb-6 flex items-center space-x-2">
              <Award className="h-5 w-5 text-ivory-sage" />
              <span>Verified Certifications & Recognitions</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {masterProfile.certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-ivory-cream/60 p-6 rounded-2xl border border-ivory-beige/60 shadow-sm flex items-start space-x-4"
                >
                  <div className="p-3 rounded-xl bg-ivory-base border border-ivory-beige text-ivory-sage shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-ivory-charcoal">{cert.name}</h3>
                    <div className="text-xs font-semibold text-ivory-sage mt-0.5">{cert.issuer}</div>
                    <p className="mt-2 text-xs text-gray-700 leading-relaxed">
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
