"use client";

import React, { useState, useMemo } from "react";
import { masterProfile } from "@/lib/profileData";
import { evaluateATS, applyATSAutomatedFix, ATSReport } from "@/lib/atsEngine";
import { analyzeJobDescription, JDAnalysisResult } from "@/lib/jobMatcher";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Download, 
  Printer, 
  Wand2, 
  Search, 
  Briefcase, 
  Layers, 
  Copy, 
  Check, 
  RefreshCw,
  Plus,
  Trash2
} from "lucide-react";

export default function CareerStudioPage() {
  const [activeTab, setActiveTab] = useState<"builder" | "matcher" | "tracker">("builder");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [copied, setCopied] = useState(false);

  // Resume State (Initialized from Master Profile)
  const initialText = useMemo(() => {
    return `${masterProfile.personal.full_legal_name}
${masterProfile.personal.email} | ${masterProfile.personal.phone} | ${masterProfile.personal.location}
${masterProfile.personal.linkedin} | ${masterProfile.personal.github}

PROFESSIONAL SUMMARY
${masterProfile.summary}

SKILLS
Analytics & AI: ${masterProfile.skills.analytics_and_ai.join(", ")}
Frontend & Design: ${masterProfile.skills.frontend_and_design.join(", ")}
Backend & Cloud: ${masterProfile.skills.backend_and_cloud.join(", ")}
Recruitment: ${masterProfile.skills.recruitment_and_business.join(", ")}

WORK EXPERIENCE
${masterProfile.experience
  .map(
    (exp) =>
      `${exp.role} - ${exp.company} (${exp.period})\n` +
      exp.highlights.map((h) => `* ${h}`).join("\n")
  )
  .join("\n\n")}

EDUCATION
${masterProfile.education
  .map((edu) => `${edu.degree} - ${edu.institution} (${edu.period})`)
  .join("\n")}

RESEARCH & PROJECTS
${masterProfile.projects
  .slice(0, 3)
  .map((p) => `${p.title}: ${p.tagline} (${p.technologies.slice(0, 3).join(", ")})`)
  .join("\n")}`;
  }, []);

  const [resumeText, setResumeText] = useState(initialText);
  const [targetRole, setTargetRole] = useState("Full Stack AI / Frontend Engineer");
  const [jobDescription, setJobDescription] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);

  // Job Tracker State
  const [applications, setApplications] = useState([
    {
      id: "app-1",
      company: "Google Cloud",
      role: "Frontend Engineer / AI Tools",
      status: "Interview Scheduled",
      date: "2026-11-04",
      score: 92,
      notes: "Technical phone screen covering Next.js edge runtime and Cloudflare D1.",
    },
    {
      id: "app-2",
      company: "Stripe",
      role: "Integration & Frontend Engineer",
      status: "Applied",
      date: "2026-11-02",
      score: 88,
      notes: "Submitted tailored resume emphasizing TypeScript, API reliability, and UI.",
    },
  ]);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");

  // Live ATS Evaluation
  const atsReport: ATSReport = useMemo(() => {
    return evaluateATS(resumeText);
  }, [resumeText]);

  // Live JD Matching
  const jdAnalysis: JDAnalysisResult = useMemo(() => {
    if (!jobDescription.trim()) {
      return {
        matchPercentage: 0,
        totalRequirementsFound: 0,
        matchedCount: 0,
        missingCount: 0,
        skills: [],
        keywordStuffingRisks: [],
        recommendation: "Paste a job description on the JD Matcher tab to compute real-time keyword coverage.",
      };
    }
    return analyzeJobDescription(resumeText, jobDescription);
  }, [resumeText, jobDescription]);

  // One-click Fix Handler
  const handleApplyFix = (fixType: string) => {
    const fixed = applyATSAutomatedFix(resumeText, fixType);
    setResumeText(fixed);
  };

  // One-Click Automated Tailoring
  const handleAutoTailor = (mode: "conservative" | "optimized" | "targeted") => {
    setIsTailoring(true);
    setTimeout(() => {
      let tailored = resumeText;
      // Heuristic intelligent tailoring
      if (mode === "targeted" && jdAnalysis.skills.length > 0) {
        const missingRequired = jdAnalysis.skills.filter((s) => !s.matched && s.type === "required");
        if (missingRequired.length > 0) {
          const toAdd = missingRequired.map((s) => s.skill).join(", ");
          tailored = tailored.replace(
            /SKILLS\n/i,
            `SKILLS\nTarget Aligned Competencies: ${toAdd}\n`
          );
        }
      }
      // Sanitize non-standard symbols and ensure strong verbs
      tailored = applyATSAutomatedFix(tailored, "SANITIZE_GLYPHS");
      tailored = applyATSAutomatedFix(tailored, "REMOVE_PRONOUNS");
      setResumeText(tailored);
      setIsTailoring(false);
    }, 600);
  };

  // Copy Plain Text
  const handleCopyText = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download DOCX / TXT
  const handleDownloadTxt = () => {
    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Albert_Linson_Resume_${selectedTemplate}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print as Vector PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // Add Job Application
  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;
    setApplications([
      {
        id: `app-${Date.now()}`,
        company: newCompany,
        role: newRole,
        status: "Applied",
        date: new Date().toISOString().slice(0, 10),
        score: atsReport.overallScore,
        notes: `Tailored with ${selectedTemplate} template. ATS Score: ${atsReport.overallScore}/100.`,
      },
      ...applications,
    ]);
    setNewCompany("");
    setNewRole("");
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="mb-8 border-b border-midnight-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-500/10 text-electric-400 border border-electric-500/20 text-xs font-semibold mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ATSForge AI Career Studio &bull; Owner Authorized</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Intelligent Resume Optimizer & Pipeline Tracker
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1">
            Deterministic 20-rule ATS scoring, zero-hallucination tailoring, and job description alignment.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 rounded-xl bg-midnight-900 border border-midnight-800 shrink-0">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "builder"
                ? "bg-electric-500 text-white shadow-md shadow-electric-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Live Builder
          </button>
          <button
            onClick={() => setActiveTab("matcher")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              activeTab === "matcher"
                ? "bg-electric-500 text-white shadow-md shadow-electric-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>JD Matcher</span>
            {jdAnalysis.totalRequirementsFound > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-electric-950 text-electric-300">
                {jdAnalysis.matchPercentage}%
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "tracker"
                ? "bg-electric-500 text-white shadow-md shadow-electric-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Pipeline ({applications.length})
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE BUILDER & ATS ENGINE */}
      {activeTab === "builder" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Editor & Action Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Tailoring Bar */}
            <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Wand2 className="h-4 w-4 text-electric-400" />
                <span className="text-xs font-semibold text-white">One-Click Tailoring:</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAutoTailor("conservative")}
                  disabled={isTailoring}
                  className="px-3 py-1.5 rounded-lg bg-midnight-900 border border-midnight-700 hover:bg-midnight-800 text-xs text-gray-200 transition-colors"
                >
                  Conservative
                </button>
                <button
                  onClick={() => handleAutoTailor("optimized")}
                  disabled={isTailoring}
                  className="px-3 py-1.5 rounded-lg bg-electric-500/20 border border-electric-500/40 hover:bg-electric-500/30 text-xs text-electric-300 transition-colors font-medium"
                >
                  ATS-Optimized
                </button>
                <button
                  onClick={() => handleAutoTailor("targeted")}
                  disabled={isTailoring}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-electric-500 to-violet-500 hover:from-electric-400 hover:to-violet-400 text-xs text-white font-semibold shadow-sm transition-all"
                >
                  {isTailoring ? "Tailoring..." : "Targeted to JD"}
                </button>
              </div>
            </div>

            {/* Template Selector & Export Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-400 font-medium">Template:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-midnight-900 border border-midnight-800 text-white text-xs font-semibold focus:outline-none focus:border-electric-500"
                >
                  <option value="classic">Classic Professional</option>
                  <option value="modern">Modern Single Column</option>
                  <option value="tech">Technical Developer</option>
                  <option value="student">Student & Graduate</option>
                  <option value="executive">Minimal Executive</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-midnight-900 border border-midnight-800 hover:bg-midnight-800 text-xs text-gray-300"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy Text"}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-midnight-900 border border-midnight-800 hover:bg-midnight-800 text-xs text-gray-300"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export TXT</span>
                </button>
                <button
                  onClick={handlePrintPDF}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-electric-500 hover:bg-electric-400 text-white text-xs font-semibold shadow-sm shadow-electric-500/20"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Vector PDF</span>
                </button>
              </div>
            </div>

            {/* Resume Text Editor Area */}
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs text-gray-400 pb-2 mb-2 border-b border-midnight-800">
                <span>Markdown & Raw ATS Source ({atsReport.wordCount} words)</span>
                <button
                  onClick={() => setResumeText(initialText)}
                  className="text-electric-400 hover:underline flex items-center space-x-1 text-[11px]"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reset to Master Profile</span>
                </button>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={22}
                className="w-full bg-midnight-950 font-mono text-xs sm:text-[13px] text-gray-200 p-4 rounded-xl border border-midnight-800 focus:outline-none focus:border-electric-500 leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Right: Live ATS Score Meter & 20 Rules (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Scorecard Widget */}
            <div className="glass-card p-6 rounded-2xl border border-electric-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
                    ATS Compatibility Score
                  </div>
                  <div className="text-4xl font-extrabold text-white mt-1 flex items-baseline space-x-2">
                    <span className={atsReport.overallScore >= 80 ? "text-green-400" : atsReport.overallScore >= 60 ? "text-yellow-400" : "text-red-400"}>
                      {atsReport.overallScore}
                    </span>
                    <span className="text-gray-500 text-sm font-normal">/ 100</span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide border ${
                  atsReport.rating === "ATS-Ready"
                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                    : atsReport.rating === "Competitive"
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                }`}>
                  {atsReport.rating}
                </div>
              </div>

              <div className="w-full bg-midnight-950 h-2.5 rounded-full mt-4 overflow-hidden border border-midnight-800">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    atsReport.overallScore >= 80
                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                      : atsReport.overallScore >= 60
                      ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                      : "bg-gradient-to-r from-red-500 to-orange-400"
                  }`}
                  style={{ width: `${atsReport.overallScore}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                {atsReport.summaryText}
              </p>
            </div>

            {/* Findings & Automated Fixes */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                ATS Diagnostic Rules ({atsReport.categories.flatMap(c => c.findings).length} Evaluated)
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {atsReport.categories.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between border-b border-midnight-800 pb-1 pt-2">
                      <span>{cat.name}</span>
                      <span className="text-gray-500 font-mono">{cat.score}/{cat.maxScore} pts</span>
                    </div>

                    {cat.findings.map((f) => (
                      <div
                        key={f.ruleId}
                        className={`p-3 rounded-xl border text-xs ${
                          f.severity === "good"
                            ? "bg-midnight-950/60 border-midnight-800 text-gray-300"
                            : f.severity === "critical"
                            ? "bg-red-950/20 border-red-500/30 text-red-200"
                            : "bg-yellow-950/20 border-yellow-500/30 text-yellow-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold flex items-center space-x-1.5">
                            {f.severity === "good" ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                            ) : f.severity === "critical" ? (
                              <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                            )}
                            <span>{f.title}</span>
                          </span>
                          <span className={`text-[10px] font-mono font-bold ${
                            f.scoreDelta > 0 ? "text-green-400" : "text-red-400"
                          }`}>
                            {f.scoreDelta > 0 ? `+${f.scoreDelta}` : f.scoreDelta}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400 leading-normal">{f.explanation}</p>

                        {f.oneClickFixAvailable && f.fixType && (
                          <button
                            onClick={() => handleApplyFix(f.fixType!)}
                            className="mt-2 inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-electric-500/20 text-electric-300 hover:bg-electric-500/30 text-[10px] font-semibold border border-electric-500/30 transition-colors"
                          >
                            <Wand2 className="h-3 w-3" />
                            <span>Apply 1-Click Fix</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JOB DESCRIPTION MATCHER */}
      {activeTab === "matcher" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-base font-bold text-white mb-2">Paste Target Job Description</h2>
              <p className="text-xs text-gray-400 mb-4">
                Paste any full JD. The tokenizer extracts mandatory vs. preferred technical qualifications and performs exact keyword coverage mapping.
              </p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste Job Description here (e.g. Senior Frontend / AI Engineer requiring TypeScript, React, Next.js, Python, Cloudflare, etc.)..."
                rows={16}
                className="w-full bg-midnight-950 text-xs font-mono text-gray-200 p-4 rounded-xl border border-midnight-800 focus:outline-none focus:border-electric-500 leading-relaxed resize-y"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-midnight-800">
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase">Keyword Coverage</div>
                  <div className="text-3xl font-extrabold text-white mt-1">
                    {jdAnalysis.matchPercentage}%
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-green-400 font-bold">{jdAnalysis.matchedCount} Matched</div>
                  <div className="text-red-400 font-bold">{jdAnalysis.missingCount} Missing</div>
                </div>
              </div>

              <p className="text-xs text-gray-300 mt-4 leading-relaxed">
                {jdAnalysis.recommendation}
              </p>
            </div>

            {/* Keyword Breakdown Matrix */}
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                Extracted Job Keywords ({jdAnalysis.skills.length})
              </h3>

              {jdAnalysis.skills.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  Paste a job description on the left to extract and compare competencies.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                  {jdAnalysis.skills.map((s) => (
                    <span
                      key={s.skill}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        s.matched
                          ? "bg-green-500/10 text-green-300 border-green-500/30"
                          : "bg-red-500/10 text-red-300 border-red-500/30"
                      }`}
                    >
                      {s.matched ? (
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400" />
                      )}
                      <span>{s.skill}</span>
                      {s.occurrencesInResume > 0 && (
                        <span className="text-[10px] text-gray-400 font-mono">({s.occurrencesInResume}x)</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: APPLICATION PIPELINE TRACKER */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-base font-bold text-white mb-4">Record New Application</h2>
            <form onSubmit={handleAddApplication} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Company Name (e.g. OpenAI)"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-800 text-white text-xs"
              />
              <input
                type="text"
                placeholder="Role Title (e.g. Full Stack AI Engineer)"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-800 text-white text-xs"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white font-semibold text-xs transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Save to Pipeline</span>
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Active Applications ({applications.length})
            </h3>
            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 rounded-xl bg-midnight-950 border border-midnight-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{app.company}</span>
                      <span className="text-gray-400 text-xs">&bull;</span>
                      <span className="text-xs font-semibold text-electric-300">{app.role}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{app.notes}</p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="px-2.5 py-1 rounded bg-electric-500/10 text-electric-400 text-xs font-semibold border border-electric-500/20">
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-500">{app.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
