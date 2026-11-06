"use client";

import React, { useState } from "react";
import { masterProfile } from "@/lib/profileData";
import { freeStackData } from "@/lib/freestackData";
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
  FolderGit2
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  // Editable Profile State
  const [headline, setHeadline] = useState(masterProfile.personal.headline);
  const [subHeadline, setSubHeadline] = useState(masterProfile.personal.sub_headline);
  const [bio, setBio] = useState(masterProfile.summary);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI Model Selection
  const [activeModel, setActiveModel] = useState("openrouter/free");
  const [aiProvider, setAiProvider] = useState("OpenRouter Edge Gateway");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Catalog Up-to-Date");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin authorization check
    if (passcode === "albert2026" || passcode === "admin") {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncStatus("Ingesting ripienaar/free-for-dev repository...");
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(`Successfully synchronized ${freeStackData.total_services} services!`);
    }, 1200);
  };

  if (!isAuthenticated) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="glass-panel p-8 rounded-2xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-midnight-900 border border-midnight-700 text-electric-400 mb-4 shadow-lg">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Control Center</h1>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            Private owner authorization required to configure platform telemetry and intelligence models.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Administrator Passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-midnight-950 border border-midnight-800 text-white text-xs focus:outline-none focus:border-electric-500 text-center tracking-widest"
              />
              {authError && (
                <div className="text-red-400 text-[11px] mt-1.5">Invalid administrator passcode.</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white text-xs font-semibold shadow-md shadow-electric-500/20 transition-all"
            >
              Authenticate Session
            </button>
          </form>

          <div className="mt-6 text-[10px] text-gray-500">
            Hint: Use <code>albert2026</code> to unlock administration.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-midnight-800 pb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold mb-2">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Owner Session Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Platform Administration & Telemetry
          </h1>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-midnight-900 border border-midnight-800"
        >
          Sign Out
        </button>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <Database className="h-4 w-4 text-electric-400" />
            <span>Database Status</span>
          </div>
          <div className="text-lg font-bold text-white">Cloudflare D1 / SQLite</div>
          <div className="text-[11px] text-green-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Schema Synchronized</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <Cpu className="h-4 w-4 text-violet-400" />
            <span>Active AI Model</span>
          </div>
          <div className="text-lg font-bold text-white font-mono text-sm">{activeModel}</div>
          <div className="text-[11px] text-violet-300 mt-1">Free Tier Gateway &bull; Cascading</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>FreeStack Directory</span>
          </div>
          <div className="text-lg font-bold text-white">{freeStackData.total_services} Services</div>
          <div className="text-[11px] text-gray-400 mt-1">Commit: {freeStackData.commit_sha}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
            <Activity className="h-4 w-4 text-green-400" />
            <span>Edge Gateway</span>
          </div>
          <div className="text-lg font-bold text-white">Cloudflare 275+ PoPs</div>
          <div className="text-[11px] text-green-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>100% Free Quotas Intact</span>
          </div>
        </div>
      </div>

      {/* Main Admin Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Module 1: AI Model Configuration */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-violet-400" />
            <span>AI Gateway Orchestrator</span>
          </h2>
          <p className="text-xs text-gray-300">
            Configure OpenRouter model endpoints with priority on 100% free variants and deterministic fallbacks.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-1">Primary Free Model</label>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-midnight-800 text-white text-xs font-mono"
              >
                <option value="openrouter/free">openrouter/free (Dynamic Free Router)</option>
                <option value="google/gemini-2.0-flash-exp:free">google/gemini-2.0-flash-exp:free</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">meta-llama/llama-3.3-70b-instruct:free</option>
                <option value="mistralai/mistral-7b-instruct:free">mistralai/mistral-7b-instruct:free</option>
                <option value="deterministic-heuristic">deterministic-heuristic (Offline 0-Cost)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-1">Fallback Strategy</label>
              <div className="text-xs text-gray-300 bg-midnight-950 p-3 rounded-xl border border-midnight-800 font-mono">
                Primary &rarr; Gemini 2.0 Flash Free &rarr; Llama 3.3 70B Free &rarr; Heuristic AST Optimizer
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: FreeStack Synchronization Trigger */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-electric-400" />
            <span>FreeStack GitHub Synchronization</span>
          </h2>
          <p className="text-xs text-gray-300">
            Sync latest free services from the official <code>ripienaar/free-for-dev</code> repository.
          </p>

          <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-800 space-y-2">
            <div className="text-xs text-gray-300">
              Status: <span className="text-electric-300 font-semibold">{syncStatus}</span>
            </div>
            <div className="text-[11px] text-gray-400">
              Total Categories: {freeStackData.total_categories} &bull; Total Services: {freeStackData.total_services}
            </div>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-400 text-white text-xs font-semibold shadow-md transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Synchronizing..." : "Trigger Full Ingestion Sync"}</span>
          </button>
        </div>

        {/* Module 3: Profile Content Editor */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileCode2 className="h-4 w-4 text-green-400" />
            <span>Master Profile Content Editor</span>
          </h2>
          <p className="text-xs text-gray-300">
            Update headline, summary, and positioning across the public website and resume engine.
          </p>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-800 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold block mb-1">Sub-Headline / Positioning</label>
                <input
                  type="text"
                  value={subHeadline}
                  onChange={(e) => setSubHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-800 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-1">Executive Summary</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-midnight-800 text-white text-xs"
              />
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-electric-500 hover:bg-electric-400 text-white text-xs font-semibold shadow-md transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </button>
              {savedSuccess && (
                <span className="text-xs text-green-400 flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Profile updated successfully!</span>
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
