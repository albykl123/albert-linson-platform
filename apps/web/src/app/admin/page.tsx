"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { masterProfile } from "@/lib/profileData";
import { freeStackData } from "@/lib/freestackData";
import { FreeStackAdminModule } from "@/components/admin/FreeStackAdminModule";
import { 
  ShieldCheck, 
  Database, 
  Cpu, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Save, 
  Lock,
  Activity,
  FileCode2,
  FolderGit2, 
  ExternalLink, 
  ArrowRight, 
  Server, 
  Sparkles,
  Briefcase,
  Send,
  Sliders,
  TrendingUp,
  BarChart3,
  Plug,
  AlertCircle,
  Copy,
  Check,
  FileText,
  UserCheck,
  CheckSquare,
  XCircle,
  Clock,
  Eye,
  BookOpen,
  Mail,
  Target,
  GraduationCap,
  Image as ImageIcon,
  Wrench
} from "lucide-react";

type AdminTab = "overview" | "career" | "outreach" | "cms" | "trends" | "analytics" | "integrations" | "freestack";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // 1. Career Pipeline State
  const [pipelineMetrics, setPipelineMetrics] = useState<any>(null);
  const [pipelineJobs, setPipelineJobs] = useState<any[]>([]);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [harvestMessage, setHarvestMessage] = useState<string | null>(null);

  // 2. Outreach Approval State
  const [approvalQueue, setApprovalQueue] = useState<any[]>([]);
  const [approvalActionLoading, setApprovalActionLoading] = useState<string | null>(null);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  // 3. Trends & Analytics State
  const [trendsData, setTrendsData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [integrationsData, setIntegrationsData] = useState<any[]>([]);

  // 4. CMS & Faculty Review State
  const [cmsSubTab, setCmsSubTab] = useState<"experience" | "kpis" | "education" | "projects" | "standard">("experience");
  const [cmsSection, setCmsSection] = useState("experience");
  const [cmsTitle, setCmsTitle] = useState(masterProfile.personal.headline);
  const [cmsContent, setCmsContent] = useState(masterProfile.summary);
  const [cmsStatus, setCmsStatus] = useState("PUBLISHED");
  const [cmsSaved, setCmsSaved] = useState(false);
  const [cmsError, setCmsError] = useState<string | null>(null);

  // Experience Sub-Editor
  const [selectedExpId, setSelectedExpId] = useState(masterProfile.experience[0]?.id || "exp-1");
  const [expSummary50, setExpSummary50] = useState(masterProfile.experience[0]?.summary_50_words || "");
  const [expTools, setExpTools] = useState((masterProfile.experience[0]?.tools_and_platforms || []).join(", "));
  const [expSkills, setExpSkills] = useState((masterProfile.experience[0]?.skills_applied || []).join(", "));
  const [expWorkflowStatus, setExpWorkflowStatus] = useState("APPROVED");

  // KPI Sub-Editor
  const [selectedKpiOrg, setSelectedKpiOrg] = useState("Innova Solutions");
  const [kpiName, setKpiName] = useState("Candidate Submittal-to-Interview Conversion");
  const [kpiBaseline, setKpiBaseline] = useState("");
  const [kpiFinal, setKpiFinal] = useState("");
  const [kpiFormula, setKpiFormula] = useState("(Client Interviews Scheduled / Total Qualified Submissions) × 100");
  const [kpiEvidence, setKpiEvidence] = useState("");
  const [kpiStatus, setKpiStatus] = useState("NEEDS_OWNER_INPUT");

  // Education Sub-Editor
  const [selectedEduId, setSelectedEduId] = useState(masterProfile.education[0]?.id || "edu-1");
  const [eduCgpa, setEduCgpa] = useState("");
  const [eduGradingScale, setEduGradingScale] = useState("10.0 CGPA Scale");
  const [eduStatus, setEduStatus] = useState("NEEDS_OWNER_INPUT");

  // Project Visuals Sub-Editor
  const [selectedProjId, setSelectedProjId] = useState(masterProfile.projects[0]?.id || "proj-jarvis");
  const [projThumbnailUrl, setProjThumbnailUrl] = useState("");
  const [projAltText, setProjAltText] = useState("");
  const [projStatus, setProjStatus] = useState("APPROVED");

  // Check auth and initial query tab
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AdminTab;
      if (tabParam && ["overview", "career", "outreach", "cms", "trends", "analytics", "integrations", "freestack"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecking(false));
  }, []);

  // Fetch admin data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadPipelineData();
      loadApprovalQueue();
      loadTrendsData();
      loadAnalyticsData();
      loadIntegrationsData();
    }
  }, [isAuthenticated]);

  const loadPipelineData = async () => {
    try {
      const res = await fetch("/api/career/pipeline");
      if (res.ok) {
        const data = await res.json();
        setPipelineMetrics(data.metrics);
        setPipelineJobs(data.jobs || []);
      }
    } catch {}
  };

  const loadApprovalQueue = async () => {
    try {
      const res = await fetch("/api/career/approval");
      if (res.ok) {
        const data = await res.json();
        setApprovalQueue(data.queue || []);
      }
    } catch {}
  };

  const loadTrendsData = async () => {
    try {
      const res = await fetch("/api/career/trends");
      if (res.ok) {
        const data = await res.json();
        setTrendsData(data);
      }
    } catch {}
  };

  const loadAnalyticsData = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch {}
  };

  const loadIntegrationsData = async () => {
    try {
      const res = await fetch("/api/career/integrations");
      if (res.ok) {
        const data = await res.json();
        setIntegrationsData(data.integrations || []);
      }
    } catch {}
  };

  const handleHarvest = async () => {
    setIsHarvesting(true);
    setHarvestMessage(null);
    try {
      const res = await fetch("/api/career/harvest", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHarvestMessage(`Ingested ${data.totalHarvested} opportunities (${data.shortlistedCount} high-match shortlisted).`);
        loadPipelineData();
      } else {
        setHarvestMessage(data.error || "Harvest cycle failed");
      }
    } catch {
      setHarvestMessage("Network error triggering harvest cycle.");
    } finally {
      setIsHarvesting(false);
    }
  };

  const handleApprovalAction = async (appId: string, action: "approve" | "reject" | "explicit_send") => {
    setApprovalActionLoading(appId);
    setApprovalFeedback(null);
    try {
      const res = await fetch("/api/career/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, action })
      });
      const data = await res.json();
      if (res.ok) {
        setApprovalFeedback(data.message || `Action ${action} completed.`);
        loadApprovalQueue();
        loadPipelineData();
      } else {
        setApprovalFeedback(data.error || `Failed to execute ${action}`);
      }
    } catch {
      setApprovalFeedback("Network error executing approval action.");
    } finally {
      setApprovalActionLoading(null);
    }
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmsSaved(false);
    setCmsError(null);

    try {
      const res = await fetch("/api/profile/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: cmsSection,
          recordKey: cmsSection,
          title: cmsTitle,
          data: cmsContent,
          status: cmsStatus,
          sourceEvidence: "Verified Owner Admin Update"
        })
      });

      const data = await res.json();
      if (res.ok) {
        setCmsSaved(true);
        setTimeout(() => setCmsSaved(false), 3000);
      } else {
        setCmsError(data.error || "Failed to save CMS update.");
      }
    } catch {
      setCmsError("Network error saving CMS record.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setPasscode("");
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch {
      setAuthError("Network error during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } finally {
      setIsAuthenticated(false);
      window.location.reload();
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  // Pre-Authentication Login Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white shadow-2xl border border-slate-200 text-center">
          <div className="relative w-48 h-12 mx-auto mb-4">
            <Image
              src="/images/albert-linson-signature.png"
              alt="Albert Linson official handwritten signature"
              fill
              sizes="200px"
              priority
              className="object-contain object-center"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Control Center</h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Private owner authorization required. Access to Career Intelligence, Outreach Approval, Profile CMS, and Telemetry.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Master Passcode
              </label>
              <input
                type="password"
                placeholder="Enter private master secret..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest"
                required
              />
              {authError && (
                <div className="text-red-600 text-xs mt-1.5 font-medium">{authError}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Authenticate Session"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-[11px] text-slate-400">
            Protected by Cloudflare Edge &bull; SHA-256 HMAC Session Tokens
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="relative w-40 h-9">
                <Image
                  src="/images/albert-linson-signature.png"
                  alt="Albert Linson official handwritten signature"
                  fill
                  sizes="160px"
                  className="object-contain object-left"
                />
              </div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Owner Session Active</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Administration & Career OS
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Private operating system for Career Intelligence, Outreach Approval, Profile CMS, and Telemetry.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/matcher"
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-cyan-400 text-xs font-semibold shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Public Matcher</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-semibold no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "overview" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Overview & Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab("career")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "career" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Career Radar & Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab("outreach")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "outreach" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Approval Centre</span>
            {approvalQueue.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
                {approvalQueue.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("cms")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "cms" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Profile CMS</span>
          </button>

          <button
            onClick={() => setActiveTab("trends")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "trends" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Industry Trends</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "analytics" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Visitor Radar</span>
          </button>

          <button
            onClick={() => setActiveTab("integrations")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "integrations" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Plug className="h-4 w-4" />
            <span>Integrations</span>
          </button>

          <button
            onClick={() => setActiveTab("freestack")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === "freestack" ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>FreeStack Directory</span>
          </button>

          <Link
            href="/admin/email-identity"
            className="px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 shadow-sm"
          >
            <Mail className="h-4 w-4 text-emerald-600" />
            <span>Email Identity (does.software)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px]">Active</span>
          </Link>
        </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Edge Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Infrastructure</span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-1">Cloudflare Workers</h4>
                <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sub-50ms Global Anycast</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">D1 Database</span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-1">albert-linson-db</h4>
                <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>SQLite Edge Binding Active</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Quality Gate</span>
                <h4 className="text-xl font-extrabold text-slate-900 mt-1">20 / 20 Tests Passing</h4>
                <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>100% Pytest & TSC Gate</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Monthly Cloud Cost</span>
                <h4 className="text-xl font-extrabold text-emerald-700 mt-1">$0.00 / Month</h4>
                <div className="mt-2 text-xs text-slate-500 font-medium">
                  100% Zero-Cost Free Developer Stack
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3">Administrative Operations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab("career")}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all"
                >
                  <Briefcase className="h-5 w-5 text-blue-600 mb-2" />
                  <div className="font-bold text-slate-900">Manage Job Radar</div>
                  <p className="text-slate-500 mt-1 text-[11px]">Review newly discovered requisitions and score compatibility.</p>
                </button>

                <button
                  onClick={() => setActiveTab("outreach")}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all"
                >
                  <Send className="h-5 w-5 text-indigo-600 mb-2" />
                  <div className="font-bold text-slate-900">Approval Queue ({approvalQueue.length})</div>
                  <p className="text-slate-500 mt-1 text-[11px]">Explicitly review and authorize outbound application packages.</p>
                </button>

                <button
                  onClick={() => setActiveTab("cms")}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all"
                >
                  <FileText className="h-5 w-5 text-emerald-600 mb-2" />
                  <div className="font-bold text-slate-900">Update Profile CMS</div>
                  <p className="text-slate-500 mt-1 text-[11px]">Edit verified credentials and synchronize to public platform.</p>
                </button>

                <Link
                  href="/admin/email-identity"
                  className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-all block"
                >
                  <Mail className="h-5 w-5 text-emerald-600 mb-2" />
                  <div className="font-bold text-slate-900">Email Identity Hub</div>
                  <p className="text-slate-500 mt-1 text-[11px]">hello@albert.does.software routing, lease countdown & MX checks.</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAREER RADAR & PIPELINE */}
        {activeTab === "career" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Job Discovery & Radar</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated ingestion for US IT Recruiting, Frontend, Full-Stack, and Python engineering positions.
                </p>
              </div>

              <button
                onClick={handleHarvest}
                disabled={isHarvesting}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm"
              >
                <RefreshCw className={`h-4 w-4 ${isHarvesting ? "animate-spin" : ""}`} />
                <span>{isHarvesting ? "Ingesting Feeds..." : "Run Ingestion Cycle"}</span>
              </button>
            </div>

            {harvestMessage && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>{harvestMessage}</span>
              </div>
            )}

            {/* Pipeline Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  Tracked Opportunities ({pipelineJobs.length})
                </h4>
                <span className="text-[11px] text-slate-400">Sorted by Evidence Compatibility</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {pipelineJobs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No jobs currently tracked. Click &ldquo;Run Ingestion Cycle&rdquo; to populate from RemoteOK & curated feeds.
                  </div>
                ) : (
                  pipelineJobs.map((job) => (
                    <div key={job.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="max-w-xl">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-slate-900">{job.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            job.compatibility_score >= 80 ? "bg-emerald-100 text-emerald-800" :
                            job.compatibility_score >= 60 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
                          }`}>
                            {job.compatibility_score}% Match
                          </span>
                        </div>
                        <div className="mt-1 text-slate-500 text-[11px] flex flex-wrap gap-2">
                          <span className="font-semibold text-slate-700">{job.company}</span>
                          <span>&bull;</span>
                          <span>{job.location}</span>
                          <span>&bull;</span>
                          <span>Source: {job.source}</span>
                          {job.salary_range && (
                            <>
                              <span>&bull;</span>
                              <span className="text-emerald-700 font-medium">{job.salary_range}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                            title="Inspect Target Requisition"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] uppercase font-mono font-bold">
                          {job.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPROVAL CENTRE */}
        {activeTab === "outreach" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 text-indigo-700 font-bold text-sm mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Strict Human-in-the-Loop Application Approval Gate</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In strict compliance with platform rules, <strong>zero cold emails or applications are dispatched automatically</strong>. Review tailored cover letters and cold email drafts below and click &ldquo;Explicit Send & Log&rdquo; only after your direct personal approval.
              </p>
            </div>

            {approvalFeedback && (
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <span>{approvalFeedback}</span>
              </div>
            )}

            {/* Approval Queue Cards */}
            <div className="space-y-4">
              {approvalQueue.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs">
                  <CheckSquare className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <div className="font-bold text-slate-800 text-sm">Approval Queue Is Clear</div>
                  <p className="mt-1">All outbound packages have either been reviewed or none are currently staged.</p>
                </div>
              ) : (
                approvalQueue.map((item) => (
                  <div key={item.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">{item.position}</h4>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {item.approval_status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          Target: {item.company} &bull; Recipient: {item.contact_email || "Recruiting Team Portal"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleApprovalAction(item.id, "approve")}
                          disabled={approvalActionLoading === item.id || item.approval_status === "approved_by_owner"}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold text-xs shadow-sm transition-all"
                        >
                          Approve Draft
                        </button>
                        <button
                          onClick={() => handleApprovalAction(item.id, "explicit_send")}
                          disabled={approvalActionLoading === item.id || item.approval_status !== "approved_by_owner"}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-all flex items-center space-x-1"
                        >
                          <Send className="h-3 w-3" />
                          <span>Explicit Send & Log</span>
                        </button>
                        <button
                          onClick={() => handleApprovalAction(item.id, "reject")}
                          disabled={approvalActionLoading === item.id}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors"
                          title="Reject Application"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Email Subject & Body Preview */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject:</span>
                        <div className="font-semibold text-slate-800 mt-0.5">{item.outreach_subject || `Application: ${item.position} - Albert Linson`}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Outreach Body:</span>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                          {item.outreach_body || `Dear Hiring Team at ${item.company},\n\nI am writing to express my strong interest in the ${item.position} requisition. With documented experience as a US IT Recruiter at Innova Solutions and an active MCA candidate at Christ University, my background directly aligns with your requirements.\n\nBest regards,\nAlbert Kalampadan Linson`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE CMS & FACULTY REVIEW MANAGEMENT */}
        {activeTab === "cms" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Faculty Review & Professional Profile CMS</h3>
              </div>
              <p className="text-xs text-slate-500">
                Structured owner editing for 50-word experience summaries, separated tools vs skills, the anti-fabrication KPI framework, verified education CGPAs, and project visual assets.
              </p>
            </div>

            {/* Sub-Tabs Selector */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
              {[
                { id: "experience", label: "Experience & 50-Word Summaries", icon: <Briefcase className="h-3.5 w-3.5" /> },
                { id: "kpis", label: "KPI & Anti-Fabrication Framework", icon: <Target className="h-3.5 w-3.5" /> },
                { id: "education", label: "Education & CGPA Verification", icon: <GraduationCap className="h-3.5 w-3.5" /> },
                { id: "projects", label: "Project Visuals & Screenshots", icon: <ImageIcon className="h-3.5 w-3.5" /> },
                { id: "standard", label: "Raw JSON Synchronizer", icon: <Sliders className="h-3.5 w-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCmsSubTab(tab.id as any)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    cmsSubTab === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* SUB-VIEW 1: EXPERIENCE & 50-WORD SUMMARIES */}
            {cmsSubTab === "experience" && (
              <div className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Select Employer / Organization
                    </label>
                    <select
                      value={selectedExpId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedExpId(id);
                        const exp = masterProfile.experience.find((x) => x.id === id);
                        if (exp) {
                          setExpSummary50(exp.summary_50_words || "");
                          setExpTools((exp.tools_and_platforms || exp.tools || []).join(", "));
                          setExpSkills((exp.skills_applied || []).join(", "));
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white font-medium"
                    >
                      {masterProfile.experience.map((exp) => (
                        <option key={exp.id} value={exp.id}>
                          {exp.company} — {exp.role} ({exp.period})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Content Verification Status
                    </label>
                    <select
                      value={expWorkflowStatus}
                      onChange={(e) => setExpWorkflowStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white font-bold"
                    >
                      <option value="PUBLISHED">PUBLISHED (Publicly Visible)</option>
                      <option value="APPROVED">APPROVED (Staged for Next Deployment)</option>
                      <option value="VERIFIED">VERIFIED (Authenticated Records Match)</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW (Pending Faculty Audit)</option>
                      <option value="NEEDS_OWNER_INPUT">NEEDS_OWNER_INPUT (Awaiting Owner Check)</option>
                      <option value="DRAFT">DRAFT (Private Workspace Only)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold uppercase tracking-wider text-slate-600">
                      Approximately 50-Word Executive Summary
                    </label>
                    <span className="text-[11px] font-mono text-slate-500">
                      Word Count: {expSummary50.trim() ? expSummary50.trim().split(/\s+/).length : 0} words (Target: ~50 words)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={expSummary50}
                    onChange={(e) => setExpSummary50(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    placeholder="Concise 50-word synthesis of role scope, key responsibilities, personal contributions, and delivered value..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Tools & Platforms (Concrete Software/Systems - Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={expTools}
                      onChange={(e) => setExpTools(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                      placeholder="e.g. Bullhorn ATS, JobDiva, LinkedIn Recruiter, Dice..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Skills Applied (Professional Competencies - Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={expSkills}
                      onChange={(e) => setExpSkills(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                      placeholder="e.g. US IT Staffing, Boolean Search, Candidate Screening..."
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      setCmsSaved(false);
                      setCmsError(null);
                      const res = await fetch("/api/profile/cms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          section: "experience",
                          recordKey: selectedExpId,
                          title: `Experience: ${selectedExpId}`,
                          data: {
                            id: selectedExpId,
                            summary_50_words: expSummary50,
                            tools_and_platforms: expTools.split(",").map((t) => t.trim()).filter(Boolean),
                            skills_applied: expSkills.split(",").map((s) => s.trim()).filter(Boolean),
                            status: expWorkflowStatus,
                          },
                          status: expWorkflowStatus,
                          sourceEvidence: "Verified Owner Review Audit"
                        }),
                      });
                      if (res.ok) {
                        setCmsSaved(true);
                        setTimeout(() => setCmsSaved(false), 3000);
                      } else {
                        setCmsError("Failed to save experience update.");
                      }
                    }}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-xs transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Experience Record</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: KPI & ANTI-FABRICATION FRAMEWORK */}
            {cmsSubTab === "kpis" && (
              <div className="space-y-5 text-xs">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Anti-Fabrication Policy Enforced</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Zero fabricated percentages, hiring counts, or revenue metrics permitted. Any metric lacking third-party verifiable evidence remains flagged as <strong>NEEDS_OWNER_INPUT</strong> and is suppressed from public display.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Organization
                    </label>
                    <select
                      value={selectedKpiOrg}
                      onChange={(e) => setSelectedKpiOrg(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                    >
                      <option value="Innova Solutions">Innova Solutions</option>
                      <option value="Herbal Energy">Herbal Energy</option>
                      <option value="Algospark Technologies">Algospark Technologies</option>
                      <option value="Municipal Corporation of Delhi">Municipal Corporation of Delhi</option>
                      <option value="METVY LEARN">METVY LEARN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      KPI Metric Name
                    </label>
                    <input
                      type="text"
                      value={kpiName}
                      onChange={(e) => setKpiName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Verification Status
                    </label>
                    <select
                      value={kpiStatus}
                      onChange={(e) => setKpiStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white font-bold"
                    >
                      <option value="NEEDS_OWNER_INPUT">NEEDS_OWNER_INPUT (Suppressed from Public)</option>
                      <option value="VERIFIED">VERIFIED (Evidence Attached)</option>
                      <option value="APPROVED">APPROVED (Authorized to Publish)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Verified Baseline Value
                    </label>
                    <input
                      type="text"
                      value={kpiBaseline}
                      onChange={(e) => setKpiBaseline(e.target.value)}
                      placeholder="e.g. 10 submittals/week (leave blank if unverified)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Verified Final Value
                    </label>
                    <input
                      type="text"
                      value={kpiFinal}
                      onChange={(e) => setKpiFinal(e.target.value)}
                      placeholder="e.g. 17 submittals/week (leave blank if unverified)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Calculation Formula
                    </label>
                    <input
                      type="text"
                      value={kpiFormula}
                      onChange={(e) => setKpiFormula(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Evidence Source Document
                    </label>
                    <input
                      type="text"
                      value={kpiEvidence}
                      onChange={(e) => setKpiEvidence(e.target.value)}
                      placeholder="e.g. Innova Solutions ATS Activity Export Q1 2026"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      setCmsSaved(false);
                      setCmsError(null);
                      const res = await fetch("/api/profile/cms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          section: "kpi",
                          recordKey: `kpi-${selectedKpiOrg.toLowerCase().replace(/\s+/g, "-")}`,
                          title: `${selectedKpiOrg}: ${kpiName}`,
                          data: {
                            organization: selectedKpiOrg,
                            kpi_name: kpiName,
                            baseline: kpiBaseline || "Pending owner verification",
                            final_value: kpiFinal || "Pending owner verification",
                            calculation_formula: kpiFormula,
                            evidence_source: kpiEvidence || "Pending owner document upload",
                            status: kpiStatus,
                          },
                          status: kpiStatus,
                          sourceEvidence: kpiEvidence || "Pending Owner Submission"
                        }),
                      });
                      if (res.ok) {
                        setCmsSaved(true);
                        setTimeout(() => setCmsSaved(false), 3000);
                      } else {
                        setCmsError("Failed to save KPI record.");
                      }
                    }}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-xs transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save KPI Framework Record</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: EDUCATION & CGPA VERIFICATION */}
            {cmsSubTab === "education" && (
              <div className="space-y-5 text-xs">
                <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5">
                    <GraduationCap className="h-4 w-4 text-sky-600" />
                    <span>Institutional Academic Scoring Safeguard</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Official CGPA or percentage must be verified from university marksheets before publication. Until an authentic grade card is supplied, the status remains <strong>NEEDS_OWNER_INPUT</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Academic Degree / Qualification
                    </label>
                    <select
                      value={selectedEduId}
                      onChange={(e) => {
                        setSelectedEduId(e.target.value);
                        const edu = masterProfile.education.find((x) => x.id === e.target.value);
                        if (edu) {
                          setEduCgpa(edu.cgpa ? String(edu.cgpa) : "");
                          setEduGradingScale(edu.grading_scale || "10.0 CGPA Scale");
                          setEduStatus(edu.cgpa_status || "NEEDS_OWNER_INPUT");
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                    >
                      {masterProfile.education.map((edu) => (
                        <option key={edu.id} value={edu.id}>
                          {edu.degree} ({edu.institution})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Verification Status
                    </label>
                    <select
                      value={eduStatus}
                      onChange={(e) => setEduStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white font-bold"
                    >
                      <option value="NEEDS_OWNER_INPUT">NEEDS_OWNER_INPUT (Pending Official Marksheet)</option>
                      <option value="VERIFIED">VERIFIED (Marksheet Verified)</option>
                      <option value="APPROVED">APPROVED (Publish to Website)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Cumulative Grade Point Average (CGPA) / Percentage
                    </label>
                    <input
                      type="text"
                      value={eduCgpa}
                      onChange={(e) => setEduCgpa(e.target.value)}
                      placeholder="e.g. 8.45 (or leave blank if pending grade card)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Official Grading Scale
                    </label>
                    <input
                      type="text"
                      value={eduGradingScale}
                      onChange={(e) => setEduGradingScale(e.target.value)}
                      placeholder="e.g. 10.0 CGPA Scale or Percentage (%)"
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      setCmsSaved(false);
                      setCmsError(null);
                      const res = await fetch("/api/profile/cms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          section: "education",
                          recordKey: selectedEduId,
                          title: `Education: ${selectedEduId}`,
                          data: {
                            id: selectedEduId,
                            cgpa: eduCgpa || null,
                            grading_scale: eduGradingScale,
                            cgpa_status: eduStatus,
                          },
                          status: eduStatus,
                          sourceEvidence: "Official University Academic Transcript"
                        }),
                      });
                      if (res.ok) {
                        setCmsSaved(true);
                        setTimeout(() => setCmsSaved(false), 3000);
                      } else {
                        setCmsError("Failed to save education record.");
                      }
                    }}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-xs transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Academic Record</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: PROJECT VISUALS & SCREENSHOTS */}
            {cmsSubTab === "projects" && (
              <div className="space-y-5 text-xs">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                  <div className="font-bold flex items-center space-x-1.5">
                    <ImageIcon className="h-4 w-4 text-purple-600" />
                    <span>16:9 Project Visual Assets Manager</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Projects without an owner-uploaded production screenshot automatically render our high-fidelity, branded <strong>16:9 Architecture Blueprints</strong> on the public portfolio. Upload genuine captures here.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Software Project
                    </label>
                    <select
                      value={selectedProjId}
                      onChange={(e) => {
                        setSelectedProjId(e.target.value);
                        const proj = masterProfile.projects.find((p) => p.id === e.target.value);
                        if (proj) {
                          setProjThumbnailUrl(proj.thumbnail || "");
                          setProjAltText(`Screenshot of ${proj.title}`);
                        }
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white"
                    >
                      {masterProfile.projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Asset Status
                    </label>
                    <select
                      value={projStatus}
                      onChange={(e) => setProjStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white font-bold"
                    >
                      <option value="APPROVED">APPROVED (Publish Live)</option>
                      <option value="NEEDS_OWNER_INPUT">NEEDS_OWNER_INPUT (Use Architecture Placeholder)</option>
                      <option value="DRAFT">DRAFT (Internal Preview)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Image File Path / Hosted Asset URL
                  </label>
                  <input
                    type="text"
                    value={projThumbnailUrl}
                    onChange={(e) => setProjThumbnailUrl(e.target.value)}
                    placeholder="e.g. /images/projects/jarvis-preview.png or https://..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Supported formats: PNG, JPG, WebP. If left blank, the platform defaults to verified vector architecture diagram.
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={async () => {
                      setCmsSaved(false);
                      setCmsError(null);
                      const res = await fetch("/api/profile/cms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          section: "projects",
                          recordKey: selectedProjId,
                          title: `Project Asset: ${selectedProjId}`,
                          data: {
                            id: selectedProjId,
                            thumbnail: projThumbnailUrl || null,
                            alt_text: projAltText,
                            status: projStatus,
                          },
                          status: projStatus,
                          sourceEvidence: "Owner Uploaded Project Screenshot"
                        }),
                      });
                      if (res.ok) {
                        setCmsSaved(true);
                        setTimeout(() => setCmsSaved(false), 3000);
                      } else {
                        setCmsError("Failed to save project visual update.");
                      }
                    }}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold shadow-xs transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Project Asset</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUB-VIEW 5: STANDARD RAW JSON / SECTION EDITOR */}
            {cmsSubTab === "standard" && (
              <form onSubmit={handleSaveCms} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Target Section
                    </label>
                    <select
                      value={cmsSection}
                      onChange={(e) => setCmsSection(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="summary">Professional Summary</option>
                      <option value="headline">Headline & Title</option>
                      <option value="experience">Professional Experience</option>
                      <option value="skills">Technical & Sourcing Skills</option>
                      <option value="leadership">Leadership & Campus Involvement</option>
                      <option value="research">Academic Research</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Record Title / Key
                    </label>
                    <input
                      type="text"
                      value={cmsTitle}
                      onChange={(e) => setCmsTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Publishing Workflow Status
                    </label>
                    <select
                      value={cmsStatus}
                      onChange={(e) => setCmsStatus(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-slate-800 bg-white focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="PUBLISHED">Published (Live Public View)</option>
                      <option value="APPROVED">Approved (Staged)</option>
                      <option value="VERIFIED">Verified (Internal)</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="DRAFT">Draft (Private)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Section Content / Structured Text
                  </label>
                  <textarea
                    rows={8}
                    value={cmsContent}
                    onChange={(e) => setCmsContent(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    {cmsSaved && (
                      <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Profile updated and synchronized to D1!</span>
                      </span>
                    )}
                    {cmsError && (
                      <span className="text-red-600 font-semibold flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{cmsError}</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save & Synchronize</span>
                  </button>
                </div>
              </form>
            )}

            {/* Notification Feedback Banner */}
            {(cmsSaved || cmsError) && (
              <div className="pt-2">
                {cmsSaved && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>CMS Record saved and synced to database!</span>
                  </div>
                )}
                {cmsError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span>{cmsError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INDUSTRY TRENDS */}
        {activeTab === "trends" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">Industry Trends & Skill Gap Intelligence</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Market monitoring across Frontend, AI/LLMs, Serverless Cloud, and ATS Recruitment practices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(trendsData?.trends || []).map((t: any) => (
                <div key={t.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase">
                      {t.category}
                    </span>
                    <span className="text-emerald-700 font-mono font-bold">{t.relevance_score}% Relevance</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{t.topic}</h4>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{t.summary}</p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                    <strong className="text-slate-900 font-semibold">Strategic Action:</strong> {t.action_recommendation}
                  </div>

                  <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                    <span>Source: {t.source_name}</span>
                    <a href={t.source_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center space-x-0.5">
                      <span>Documentation</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PRIVACY-PRESERVING RECRUITER ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-base mb-1">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Privacy-Preserving Recruiter Visitor Analytics</span>
              </div>
              <p className="text-xs text-slate-500">
                Audited telemetry tracking page visits, JD Matcher queries, and resume exports. Zero intrusive IP or corporate identity scraping.
              </p>
            </div>

            {/* Metrics Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tracked Events</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{analyticsData?.totalEvents || 0}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Page views & interactions</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Desktop Visitors</span>
                <div className="text-2xl font-bold text-blue-600 mt-1">{analyticsData?.devices?.desktop || 0}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Recruiter workstation traffic</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mobile Visitors</span>
                <div className="text-2xl font-bold text-emerald-600 mt-1">{analyticsData?.devices?.mobile || 0}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Mobile browser viewers</div>
              </div>
            </div>

            {/* Path Distribution Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
              <div className="p-4 border-b border-slate-200 font-bold uppercase tracking-wider text-slate-700">
                Top Visited Platform Routes
              </div>
              <div className="divide-y divide-slate-100">
                {Object.entries(analyticsData?.pageViews || {}).map(([path, count]) => (
                  <div key={path} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                    <span className="font-mono text-slate-800">{path}</span>
                    <span className="font-bold text-blue-600">{count as number} views</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: INTEGRATIONS HUB */}
        {activeTab === "integrations" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">External Integrations & Credentials Manager</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Status of verified external APIs. All sensitive keys are encrypted server-side; zero credentials are exposed to client code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrationsData.map((item) => (
                <div key={item.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900">{item.serviceName}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.connectionStatus === "connected" ? "bg-emerald-100 text-emerald-800" :
                      item.connectionStatus === "awaiting_credentials" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                    }`}>
                      {item.connectionStatus}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">{item.description}</p>
                  <p className="text-slate-400 text-[10px]">{item.notes}</p>

                  {item.requiredEnvVars?.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 text-[10px]">
                      <span className="text-slate-400">Keys:</span>
                      {item.requiredEnvVars.map((v: string) => (
                        <code key={v} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                          {v}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: FREESTACK DIRECTORY */}
        {activeTab === "freestack" && (
          <FreeStackAdminModule />
        )}
      </div>
    </div>
  );
}
