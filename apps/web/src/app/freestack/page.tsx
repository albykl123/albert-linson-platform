"use client";

import React, { useState, useMemo } from "react";
import { freeStackData, searchFreeStack, FreeStackService } from "@/lib/freestackData";
import { Search, ExternalLink, Filter, Layers, CheckCircle, RefreshCw, X, ArrowUpDown } from "lucide-react";

export default function FreeStackPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedForCompare, setSelectedForCompare] = useState<FreeStackService[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

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

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-midnight-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-500/10 text-electric-400 border border-electric-500/20 text-xs font-semibold mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>FreeStack Intelligence Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Curated Free Developer Services Directory
          </h1>
          <p className="text-gray-300 mt-2 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Ingested from <code>ripienaar/free-for-dev</code> ({freeStackData.total_services} services across {freeStackData.total_categories} categories). Evaluated for zero-cost developer tiers.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs text-gray-400 shrink-0">
          <span className="px-2.5 py-1 rounded-md bg-midnight-900 border border-midnight-800">
            Commit: <code className="text-electric-300 font-mono">{freeStackData.commit_sha}</code>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-midnight-900 border border-midnight-800">
            Synced: <span className="text-gray-300">{freeStackData.synced_at.slice(0, 10)}</span>
          </span>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, provider, keyword or free tier limit (e.g. SQLite, Cloudflare, 1GB)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-900 border border-midnight-800 text-white text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:border-electric-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="sm:w-72">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-midnight-900 border border-midnight-800 text-white text-xs sm:text-sm focus:outline-none focus:border-electric-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Comparison Bar */}
      {selectedForCompare.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-electric-950/80 to-midnight-900 border border-electric-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-white">Comparing ({selectedForCompare.length}/3):</span>
            <div className="flex flex-wrap gap-2">
              {selectedForCompare.map((s) => (
                <span key={s.name} className="px-2 py-0.5 rounded bg-electric-500/20 text-electric-300 text-xs flex items-center space-x-1">
                  <span>{s.name}</span>
                  <button onClick={() => toggleCompare(s)}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-1.5 rounded-lg bg-electric-500 hover:bg-electric-400 text-white text-xs font-semibold"
          >
            Compare Side-by-Side
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-xs text-gray-400 mb-4 flex items-center justify-between">
        <span>Showing {filteredServices.length} developer services</span>
        {selectedCategory !== "All" && (
          <span>Category: <strong className="text-electric-300">{selectedCategory}</strong></span>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => {
          const isComparing = selectedForCompare.some((s) => s.name === service.name);
          return (
            <div
              key={service.name}
              className={`glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all ${
                isComparing ? "border-electric-500/60 shadow-lg shadow-electric-500/10" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-midnight-900 text-electric-400 rounded border border-midnight-800">
                    {service.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleCompare(service)}
                      className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                        isComparing ? "bg-electric-500 text-white" : "bg-midnight-900 text-gray-400 hover:text-white"
                      }`}
                    >
                      {isComparing ? "Selected" : "+ Compare"}
                    </button>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white"
                      aria-label="Visit Provider"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{service.name}</h3>

                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  {service.description || "Free developer tier offering."}
                </p>

                {service.sub_features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-midnight-900 space-y-1">
                    {service.sub_features.slice(0, 3).map((f, i) => (
                      <div key={i} className="text-[11px] text-gray-400 flex items-start space-x-1.5">
                        <span className="text-electric-400 shrink-0">&bull;</span>
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-midnight-900/80 flex items-center justify-between text-[11px]">
                <span className="text-gray-500 font-mono truncate max-w-[200px]">{service.url.replace(/^https?:\/\//, "")}</span>
                <span className="text-green-400 font-medium">Free Tier Eligible</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-midnight-900 border border-midnight-800 rounded-2xl max-w-4xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-midnight-800 mb-6">
              <h2 className="text-lg font-bold text-white">Side-by-Side Free Tier Comparison</h2>
              <button onClick={() => setShowCompareModal(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedForCompare.map((s) => (
                <div key={s.name} className="p-4 rounded-xl bg-midnight-950 border border-midnight-800">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-electric-500/10 text-electric-400 border border-electric-500/20 font-semibold">
                    {s.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{s.name}</h3>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-electric-400 hover:underline inline-flex items-center space-x-1 mt-1"
                  >
                    <span>Visit Provider</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-xs text-gray-300 mt-3 leading-relaxed">{s.description}</p>
                  {s.sub_features.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-midnight-900 space-y-1.5">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase">Features:</div>
                      {s.sub_features.map((f, i) => (
                        <div key={i} className="text-xs text-gray-300">&bull; {f}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
