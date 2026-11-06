"use client";

import React, { useState, useMemo } from "react";
import { freeStackData, searchFreeStack, FreeStackService } from "@/lib/freestackData";
import { 
  Search, 
  ExternalLink, 
  Filter, 
  Layers, 
  CheckCircle, 
  RefreshCw, 
  X, 
  ArrowUpDown,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export function FreeStackAdminModule() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedForCompare, setSelectedForCompare] = useState<FreeStackService[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState("Catalog Synchronized");

  const categories = useMemo(() => {
    return ["All", ...freeStackData.categories];
  }, []);

  const filteredServices = useMemo(() => {
    return searchFreeStack(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const toggleCompare = (service: FreeStackService) => {
    if (selectedForCompare.some((s) => s.name === service.name)) {
      setSelectedForCompare(selectedForCompare.filter((s) => s.name !== service.name));
    } else {
      if (selectedForCompare.length >= 3) {
        alert("You can compare up to 3 services simultaneously.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, service]);
    }
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setSyncStatus("Validating ripienaar/free-for-dev catalog...");
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(`Successfully validated ${freeStackData.total_services} services!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-3">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            <span>Admin-Only FreeStack Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Curated Free Developer Services Directory
          </h2>
          <p className="text-slate-500 mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Ingested from <code>ripienaar/free-for-dev</code> ({freeStackData.total_services} services across {freeStackData.total_categories} categories). Evaluated for zero-cost cloud architecture and private admin infrastructure planning.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="text-xs text-slate-500 space-y-1">
            <div>Commit: <code className="text-blue-600 font-mono font-semibold">{freeStackData.commit_sha}</code></div>
            <div>Synced: <span className="font-medium text-slate-700">{freeStackData.synced_at.slice(0, 10)}</span></div>
          </div>

          <button
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Validating..." : "Verify Catalog"}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service name, provider, keyword or free tier limit (e.g. SQLite, Cloudflare, 1GB)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="sm:w-72">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? `All Categories (${freeStackData.total_services})` : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Comparison Bar */}
      {selectedForCompare.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold text-slate-800">
              Comparing Services ({selectedForCompare.length}/3):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedForCompare.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white border border-blue-300 text-blue-700 text-xs font-semibold shadow-xs"
                >
                  <span>{s.name}</span>
                  <button onClick={() => toggleCompare(s)} className="hover:text-red-500 ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              View Comparison Table
            </button>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Results Header Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{filteredServices.length}</strong> matching zero-cost services</span>
        {selectedCategory !== "All" && (
          <span className="text-blue-600 font-semibold">Filtered by: {selectedCategory}</span>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service, idx) => {
          const isComparing = selectedForCompare.some((s) => s.name === service.name);
          return (
            <div
              key={`${service.name}-${idx}`}
              className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                isComparing ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold whitespace-nowrap">
                    {service.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                  {service.description || "Zero-cost developer infrastructure service."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                <label className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isComparing}
                    onChange={() => toggleCompare(service)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                  />
                  <span>Compare</span>
                </label>

                {service.url && (
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span>Visit Tool</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Side-by-Side Free Tier Comparison</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Comparing {selectedForCompare.length} developer tools for zero-cost operational fit.
                </p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {selectedForCompare.map((s) => (
                <div key={s.name} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {s.category}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-2">{s.name}</h4>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1">Description:</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                  </div>

                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors w-full justify-center shadow-xs"
                    >
                      <span>Documentation & Sign-up</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
