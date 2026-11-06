import React from "react";
import { masterProfile } from "@/lib/profileData";
import { GraduationCap, Award, Calendar, MapPin, BookOpen } from "lucide-react";

export default function EducationPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-12 border-b border-midnight-800 pb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Academic Background</span>
        <h1 className="text-4xl font-extrabold text-white mt-2">Verified Education & Qualifications</h1>
        <p className="text-gray-300 mt-3 text-sm max-w-2xl leading-relaxed">
          Higher education and institutional qualifications at CHRIST (Deemed to be University) and St. Columba's School.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {masterProfile.education.map((edu) => (
          <div key={edu.id} className="glass-panel p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Verified Degree</span>
                </span>
                <span className="flex items-center space-x-1 text-gray-400">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span>{edu.period}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight">{edu.degree}</h3>
              <div className="text-sm font-semibold text-electric-300 mt-1">{edu.institution}</div>
              
              <div className="flex items-center space-x-1 text-xs text-gray-400 mt-2">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span>{edu.location}</span>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-midnight-800/80 pt-4">
                {edu.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
