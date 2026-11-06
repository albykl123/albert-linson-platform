"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  ArrowRight, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Mail, 
  Phone, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { masterProfile } from "@/lib/profileData";
import { JDAnalysisResult } from "@/lib/jobMatcher";

const SAMPLE_JDS = [
  {
    title: "US IT Technical Recruiter",
    company: "Enterprise Staffing Co",
    text: `Job Title: Senior US IT Technical Recruiter
Location: Remote / Hybrid (EST Hours)
Responsibilities:
- Manage end-to-end technical recruitment lifecycle for US enterprise clients across cloud, DevOps, and full-stack requisitions.
- Utilize ATS platforms (Bullhorn, JobDiva), LinkedIn Recruiter, and boolean search for aggressive candidate sourcing and talent acquisition.
- Conduct in-depth technical competency screening, wage negotiation, and onboarding coordination.
- Collaborate with account managers and client stakeholders on high-priority requisition mapping.
Requirements:
- Bachelor's or Master's degree in Computer Science, IT, or related field.
- 1-3+ years of documented US IT staffing experience.
- Strong understanding of technical stacks (Python, Java, React, Cloud, DevOps).
- Exceptional stakeholder communication and cross-functional coordination.`
  },
  {
    title: "Full-Stack Engineer (React + Python)",
    company: "Cloud & AI Labs",
    text: `Job Title: Full-Stack Software Engineer
Tech Stack: React, Next.js, TypeScript, Python, FastAPI, Tailwind CSS, SQLite, Cloudflare Workers, Git.
Requirements:
- Proven experience engineering responsive frontend applications in React, Next.js 14, and TypeScript.
- Strong backend experience with Python and FastAPI building REST APIs and microservices.
- Experience with edge deployments, serverless functions, or Cloudflare Workers.
- Hands-on database design with SQL, SQLite, or relational stores.
- Familiarity with CI/CD automation, GitHub Actions, and Linux runtimes.
- Master's or Bachelor's in Computer Science or Computer Applications.`
  },
  {
    title: "Frontend UI/UX Developer",
    company: "Digital Innovation Agency",
    text: `Job Title: Frontend UI/UX Developer
Responsibilities:
- Build accessible, high-performance web applications using React, HTML5, CSS3, Tailwind CSS, and Next.js.
- Translate Figma prototypes and design systems into pixel-perfect responsive user interfaces.
- Optimize client-side web vitals and mobile responsiveness.
- Collaborate with civic and municipal stakeholders on citizen dashboard accessibility.
Requirements:
- Bachelor's or Master's in Computer Applications or Design.
- Expertise in Figma, responsive CSS grid, flexbox, and cross-browser testing.`
  }
];

export default function RecruiterMatcherPage() {
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<JDAnalysisResult | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLoadSample = (sample: typeof SAMPLE_JDS[0]) => {
    setJdText(sample.text);
    setAnalysisResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf" || file.name.endsWith(".docx")) {
      // Basic notice for binary files while reading text
      setUploadError("For best accuracy with PDF/DOCX, please copy and paste the plain text directly into the box below.");
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setJdText(content);
        setAnalysisResult(null);
      }
    };
    reader.onerror = () => {
      setUploadError("Unable to read file. Please paste job description text directly.");
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setUploadError(null);

    try {
      const res = await fetch("/api/ats/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText })
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data: JDAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setUploadError(err.message || "Failed to analyze job description");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.tailoredSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="bg-swiss-white text-swiss-navy min-h-screen pb-24">
      {/* 1. Header Banner */}
      <section className="pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-swiss-divider">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
              <span>Recruiter Intelligence Engine &bull; Zero Hallucination Matcher</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-swiss-navy">
              Recruiter Job Compatibility Matcher
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
              Paste your company&apos;s open Job Description to evaluate candidate alignment against Albert Linson&apos;s verified professional background in US IT Recruitment, Full-Stack Software Engineering, and Academic Research.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/resume"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border border-swiss-divider bg-swiss-light hover:bg-swiss-divider/40 text-xs font-semibold transition-all"
            >
              <FileText className="h-4 w-4 text-swiss-blue" />
              <span>Full Master Resume</span>
            </Link>
            <a
              href={`mailto:${masterProfile.personal.email}?subject=Interview%20Inquiry%20from%20JD%20Matcher`}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-swiss-navy text-white hover:bg-swiss-navy/90 text-xs font-semibold shadow-sm transition-all"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>Schedule Call</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Interactive Input Panel */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: JD Input & Sample Loaders */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-swiss-white border border-swiss-divider shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="jdInput" className="text-sm font-bold uppercase tracking-wider text-swiss-navy">
                  Target Job Description Text
                </label>
                <span className="text-xs text-gray-500 font-mono">
                  {jdText.length} characters
                </span>
              </div>

              {/* Sample Presets */}
              <div className="mb-4">
                <div className="text-xs font-medium text-gray-500 mb-2">Or load a pre-configured requisition sample:</div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_JDS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLoadSample(sample)}
                      className="px-3 py-1.5 rounded-lg border border-swiss-divider bg-swiss-light hover:border-swiss-blue/40 text-xs text-swiss-navy font-medium transition-all"
                    >
                      &bull; {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <textarea
                id="jdInput"
                rows={9}
                value={jdText}
                onChange={(e) => {
                  setJdText(e.target.value);
                  setAnalysisResult(null);
                }}
                placeholder="Paste job description text here (e.g., responsibilities, qualifications, required skills, tools)..."
                className="w-full p-4 rounded-xl border border-swiss-divider focus:border-swiss-blue focus:ring-1 focus:ring-swiss-blue text-xs leading-relaxed text-swiss-navy placeholder-gray-400 font-sans outline-none transition-all resize-y"
              />

              {/* Upload Dropzone */}
              <div className="mt-4 pt-4 border-t border-swiss-divider flex flex-col sm:flex-row items-center justify-between gap-4">
                <label className="cursor-pointer inline-flex items-center space-x-2 text-xs font-semibold text-swiss-blue hover:text-swiss-navy transition-colors">
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload JD (.txt / document)</span>
                  <input
                    type="file"
                    accept=".txt,.json,.docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !jdText.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-swiss-blue text-white hover:bg-swiss-blue/90 disabled:opacity-50 text-xs font-bold shadow-md transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Analyzing Compatibility...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Compute Match & Gap Analysis</span>
                    </>
                  )}
                </button>
              </div>

              {uploadError && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Quick Factuality Disclaimer */}
            <div className="p-4 rounded-xl bg-swiss-light border border-swiss-divider flex items-start space-x-3 text-xs text-gray-600">
              <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-swiss-navy font-semibold">100% Evidence-Grounded Scoring:</strong> This engine evaluates job requirements exclusively against Albert Linson&apos;s verified employment at Innova Solutions, Herbal Energy, Algospark, MCD, his Christ University MCA/BCA degrees, and 8 verified software systems. Zero hallucinated skills or fake credentials.
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Match Results */}
          <div className="lg:col-span-5">
            {!analysisResult && !isAnalyzing && (
              <div className="p-8 rounded-2xl bg-swiss-light border-2 border-dashed border-swiss-divider text-center flex flex-col items-center justify-center min-h-[380px]">
                <div className="h-14 w-14 rounded-full bg-swiss-white border border-swiss-divider flex items-center justify-center text-gray-400 mb-4 shadow-sm">
                  <Sparkles className="h-7 w-7 text-swiss-blue" />
                </div>
                <h3 className="font-bold text-base text-swiss-navy">Awaiting Requisition Input</h3>
                <p className="mt-2 text-xs text-gray-500 max-w-sm leading-relaxed">
                  Paste a job description or choose one of the sample presets to run an instant, multi-factor compatibility evaluation.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="p-8 rounded-2xl bg-swiss-white border border-swiss-divider shadow-sm text-center flex flex-col items-center justify-center min-h-[380px]">
                <RefreshCw className="h-8 w-8 text-swiss-blue animate-spin mb-4" />
                <h3 className="font-bold text-base text-swiss-navy">Running ATS Matrix Audit</h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                  Mapping job requirements across Core Engineering, US IT Recruiting, Academic Foundations, and Project Evidence...
                </p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Score Summary Card */}
                <div className="p-6 rounded-2xl bg-swiss-white border border-swiss-divider shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-swiss-divider">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Overall Alignment</span>
                      <h3 className="text-base font-bold text-swiss-navy mt-0.5">{analysisResult.recommendation}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-4xl font-extrabold tracking-tight ${
                        analysisResult.matchPercentage >= 75 ? "text-emerald-600" :
                        analysisResult.matchPercentage >= 50 ? "text-blue-600" : "text-amber-600"
                      }`}>
                        {analysisResult.matchPercentage}%
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                        {analysisResult.matchedCount} of {analysisResult.totalRequirementsFound} requisites
                      </span>
                    </div>
                  </div>

                  {/* 4 Categorical Breakdown Bars */}
                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-swiss-navy mb-1">
                        <span>Core Engineering Stack</span>
                        <span>{analysisResult.scores.coreEngineering}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                          style={{ width: `${analysisResult.scores.coreEngineering}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-swiss-navy mb-1">
                        <span>US IT Recruitment & Talent Acquisition</span>
                        <span>{analysisResult.scores.recruitmentAndTalent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                          style={{ width: `${analysisResult.scores.recruitmentAndTalent}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-swiss-navy mb-1">
                        <span>Education & Academic Foundations</span>
                        <span>{analysisResult.scores.educationAndResearch}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                          style={{ width: `${analysisResult.scores.educationAndResearch}%` }} 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-swiss-navy mb-1">
                        <span>Leadership & Cross-Functional Coordination</span>
                        <span>{analysisResult.scores.leadershipAndCoordination}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-cyan-600 rounded-full transition-all duration-500" 
                          style={{ width: `${analysisResult.scores.leadershipAndCoordination}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tailored Professional Narrative */}
                <div className="p-6 rounded-2xl bg-swiss-white border border-swiss-divider shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider text-swiss-blue font-bold">Tailored Recruiter Executive Summary</span>
                    <button
                      onClick={handleCopySummary}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-swiss-light hover:bg-swiss-divider text-gray-700 text-[11px] font-medium transition-all"
                    >
                      {copiedSummary ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedSummary ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed bg-swiss-light p-3.5 rounded-xl border border-swiss-divider">
                    {analysisResult.tailoredSummary}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Deep Evidence & Gap Breakdown (Appears when analysis exists) */}
      {analysisResult && (
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-swiss-divider">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Column A: Matched Requirements & Evidence */}
            <div className="p-6 rounded-2xl bg-swiss-white border border-swiss-divider shadow-sm">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Matched Requirements ({analysisResult.matchedSkills.length})</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {analysisResult.matchedSkills.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 capitalize">{m.skill}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-200/50 text-emerald-800">
                        {m.category}
                      </span>
                    </div>
                    {m.evidence && (
                      <p className="mt-1.5 text-[11px] text-emerald-800/80 leading-normal">
                        &bull; {m.evidence}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Column B: Honest Gap Disclosures */}
            <div className="p-6 rounded-2xl bg-swiss-white border border-swiss-divider shadow-sm">
              <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>Honest Gap Analysis ({analysisResult.missingSkills.length})</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {analysisResult.missingSkills.length === 0 ? (
                  <p className="text-xs text-gray-500 italic p-4 text-center">
                    All detected core requirements are covered in Albert&apos;s verified portfolio!
                  </p>
                ) : (
                  analysisResult.missingSkills.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 capitalize">{m.skill}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-200/50 text-amber-800">
                          {m.type}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] text-amber-800/80 leading-normal">
                        Not explicitly certified as primary production stack; transferable engineering foundations apply.
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Column C: Matching Software Projects */}
            <div className="p-6 rounded-2xl bg-swiss-white border border-swiss-divider shadow-sm">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm mb-4">
                <FolderGit2 className="h-4 w-4" />
                <span>Relevant Project Demonstrations ({analysisResult.matchingProjects.length})</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {analysisResult.matchingProjects.length === 0 ? (
                  <div className="text-xs text-gray-500 p-4 text-center">
                    See general projects showcase on the <Link href="/projects" className="text-swiss-blue underline">Projects Page</Link>.
                  </div>
                ) : (
                  analysisResult.matchingProjects.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-blue-950">{p.title}</h4>
                        <Link href="/projects" className="text-blue-600 hover:text-blue-800 text-[10px] inline-flex items-center space-x-0.5">
                          <span>Inspect</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                      <p className="mt-1 text-[11px] text-blue-900/80 leading-normal">
                        {p.relevanceReason}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.matchedTechnologies.map((t, tidx) => (
                          <span key={tidx} className="px-1.5 py-0.5 rounded bg-blue-200/50 text-blue-900 font-mono text-[9px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 4. Action Banner */}
          <div className="mt-12 p-8 rounded-3xl bg-swiss-navy text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Next Step</span>
              <h3 className="text-2xl font-bold mt-1">Ready to Interview Albert Linson?</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl">
                Albert is available for technical recruitment and full-stack software development engagements. You can schedule an introductory discussion directly or inspect his complete verified master resume.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/resume"
                className="px-5 py-2.5 rounded-xl bg-white text-swiss-navy hover:bg-slate-100 text-xs font-bold transition-all shadow-md"
              >
                Inspect Master Resume
              </Link>
              <a
                href={`mailto:${masterProfile.personal.email}?subject=Interview%20Invitation`}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md"
              >
                Schedule Direct Call
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
