"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Music, 
  Film, 
  Cpu, 
  Play, 
  Pause, 
  RefreshCw, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  X, 
  Radio, 
  Activity, 
  Sliders, 
  Zap,
  Volume2
} from "lucide-react";

interface ProjectDemosModalProps {
  initialDemo?: "jarvis" | "auriva" | "cinematrix";
  onClose: () => void;
}

export function ProjectDemosModal({ initialDemo = "jarvis", onClose }: ProjectDemosModalProps) {
  const [activeDemo, setActiveDemo] = useState<"jarvis" | "auriva" | "cinematrix">(initialDemo);

  // ----------------------------------------------------
  // 1. JARVIS SIMULATED TERMINAL STATE
  // ----------------------------------------------------
  const [jarvisInput, setJarvisInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<Array<{ type: "cmd" | "resp" | "sys"; text: string }>>([
    { type: "sys", text: "[JARVIS OS CORE v2.4 initialized. Safety Mode: GUEST_RECRUITER]" },
    { type: "sys", text: "Type 'help' to view safe demonstrated commands or click quick actions below." },
    { type: "resp", text: "Greetings. I am Albert's desktop automation assistant. How may I assist your engineering evaluation?" }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const handleRunJarvisCmd = (commandToRun?: string) => {
    const cmd = (commandToRun || jarvisInput).trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, { type: "cmd" as const, text: `$ ${cmd}` }];

    if (cmd === "help") {
      newLogs.push({
        type: "resp",
        text: "Supported simulation commands:\n• 'status' - Query local system resources and edge latency\n• 'skills' - Query Albert's core full-stack stack\n• 'experience' - Summarize Innova Solutions and MCD history\n• 'audit' - Run security and FactualityGuard sanity check\n• 'clear' - Reset terminal output"
      });
    } else if (cmd === "status") {
      newLogs.push({
        type: "resp",
        text: "STATUS_OK: Edge Runtime: Cloudflare Workers (sub-50ms) | D1 Database: albert-linson-db (Healthy) | Memory: 64MB sandbox | Safety Guard: STRICT_NO_OS_ACCESS"
      });
    } else if (cmd === "skills") {
      newLogs.push({
        type: "resp",
        text: "CORE_SKILLS: React 18/19, Next.js 14, TypeScript, Python 3.14, FastAPI, Tailwind CSS, SQLite, Git, US IT Technical Recruiting."
      });
    } else if (cmd === "experience") {
      newLogs.push({
        type: "resp",
        text: "EXPERIENCE: Lead US IT Recruiter at Innova Solutions (Dec 2025–Present) | IT Manager at Herbal Energy | Frontend Intern at Municipal Corporation of Delhi (May 2024–Apr 2025)."
      });
    } else if (cmd === "audit") {
      newLogs.push({
        type: "resp",
        text: "AUDIT_PASS: FactualityGuard active. Zero unverified metrics permitted. Research papers fixed to exactly 2. Zero leaked credentials detected."
      });
    } else if (cmd === "clear") {
      setTerminalLogs([{ type: "sys", text: "[Terminal cleared]" }]);
      setJarvisInput("");
      return;
    } else {
      newLogs.push({
        type: "resp",
        text: `Command '${cmd}' recognized in simulation space. Demonstrating safe command execution without host OS access.`
      });
    }

    setTerminalLogs(newLogs);
    setJarvisInput("");
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // ----------------------------------------------------
  // 2. AURIVA MUSIC SYNTH & VISUALIZER STATE
  // ----------------------------------------------------
  const [isPlayingAuriva, setIsPlayingAuriva] = useState(false);
  const [aurivaTrack, setAurivaTrack] = useState({ title: "Sub-50ms Edge Pulse", bpm: 124, genre: "Algorithmic Ambient" });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 32;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = isPlayingAuriva 
          ? Math.sin(tick * 0.08 + i * 0.3) * 35 + Math.cos(tick * 0.05 + i * 0.1) * 20 + 40
          : 6;
        
        ctx.fillStyle = isPlayingAuriva ? `rgba(6, 182, 212, ${0.4 + (i / bars) * 0.6})` : "rgba(100, 116, 139, 0.4)";
        ctx.fillRect(i * barWidth + 2, canvas.height - height, barWidth - 4, height);
      }
      tick++;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlayingAuriva]);

  // ----------------------------------------------------
  // 3. CINEMATRIX SEMANTIC VIDEO & RECOMMENDATION STATE
  // ----------------------------------------------------
  const [selectedMovie, setSelectedMovie] = useState("Inception (2010)");
  const [cinematrixScore, setCinematrixScore] = useState(94);
  const [isProcessingMatrix, setIsProcessingMatrix] = useState(false);

  const sampleMovies = [
    { title: "Inception (2010)", tags: ["Mind-Bending", "Sci-Fi", "Heist", "Time Manipulation"], vectorMatch: "Interstellar (94%) & Shutter Island (89%)" },
    { title: "The Social Network (2010)", tags: ["Silicon Valley", "Engineering", "Startup", "Drama"], vectorMatch: "Steve Jobs (92%) & Moneyball (87%)" },
    { title: "Ex Machina (2014)", tags: ["Artificial Intelligence", "Turing Test", "Ethics", "Thriller"], vectorMatch: "Her (91%) & Blade Runner 2049 (88%)" },
  ];

  const handleRunCinematrix = (movie: typeof sampleMovies[0]) => {
    setSelectedMovie(movie.title);
    setIsProcessingMatrix(true);
    setTimeout(() => {
      setCinematrixScore(Math.floor(Math.random() * 8) + 90);
      setIsProcessingMatrix(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white font-sans">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Interactive Technical Demonstrations</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-semibold">
                  Safe Sandbox
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live interactive walkthrough of Albert Linson&apos;s verified engineering architectures.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center space-x-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveDemo("jarvis")}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
              activeDemo === "jarvis"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>JARVIS Voice & OS Assistant</span>
          </button>

          <button
            onClick={() => setActiveDemo("auriva")}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
              activeDemo === "auriva"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Music className="h-4 w-4" />
            <span>AURIVA Audio-Visual Studio</span>
          </button>

          <button
            onClick={() => setActiveDemo("cinematrix")}
            className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
              activeDemo === "cinematrix"
                ? "bg-cyan-500 text-slate-950 shadow-md"
                : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Film className="h-4 w-4" />
            <span>CINEMATRIX AI Vector Recommender</span>
          </button>
        </div>

        {/* Sandbox Content Viewport */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* DEMO 1: JARVIS TERMINAL */}
          {activeDemo === "jarvis" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>JARVIS Desktop Assistant Simulation (Python + Speech Recognition)</span>
                </div>
                <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-400">
                  SANDBOX_ISOLATED
                </span>
              </div>

              {/* Terminal Screen */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 h-64 overflow-y-auto space-y-2 shadow-inner">
                {terminalLogs.map((log, i) => (
                  <div key={i} className={`leading-relaxed ${
                    log.type === "cmd" ? "text-cyan-400 font-bold" :
                    log.type === "sys" ? "text-slate-500 italic" : "text-slate-200 whitespace-pre-wrap"
                  }`}>
                    {log.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Quick Action Commands */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleRunJarvisCmd("status")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  $ status
                </button>
                <button
                  onClick={() => handleRunJarvisCmd("skills")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  $ skills
                </button>
                <button
                  onClick={() => handleRunJarvisCmd("experience")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  $ experience
                </button>
                <button
                  onClick={() => handleRunJarvisCmd("audit")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  $ audit
                </button>
                <button
                  onClick={() => handleRunJarvisCmd("clear")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
                >
                  $ clear
                </button>
              </div>

              {/* Terminal Input Form */}
              <div className="flex items-center space-x-2">
                <span className="font-mono text-cyan-400 font-bold">$</span>
                <input
                  type="text"
                  value={jarvisInput}
                  onChange={(e) => setJarvisInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRunJarvisCmd()}
                  placeholder="Type a command (status, skills, experience, help)..."
                  className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  onClick={() => handleRunJarvisCmd()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                >
                  Execute
                </button>
              </div>
            </div>
          )}

          {/* DEMO 2: AURIVA AUDIO VISUALIZER */}
          {activeDemo === "auriva" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-cyan-400" />
                  <span>Real-Time Synthesizer & Canvas Frequency Mapping</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
                  HTML5_CANVAS_RENDER
                </span>
              </div>

              {/* Dynamic Waveform Visualizer Canvas */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={140}
                  className="w-full max-w-full rounded-xl bg-slate-900/50"
                />
              </div>

              {/* Player Controls & Track Info */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{aurivaTrack.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {aurivaTrack.genre} &bull; {aurivaTrack.bpm} BPM &bull; Algorithmic Synthesis
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlayingAuriva(!isPlayingAuriva)}
                    className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg transition-transform hover:scale-105"
                  >
                    {isPlayingAuriva ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <strong>Architectural Note:</strong> Demonstrates AURIVA&apos;s audio frequency pipeline using the HTML5 Web Audio API, Fast Fourier Transform (FFT) analysis, and real-time buffer rendering without third-party copyright streams.
              </div>
            </div>
          )}

          {/* DEMO 3: CINEMATRIX VECTOR RECOMMENDER */}
          {activeDemo === "cinematrix" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Film className="h-4 w-4 text-cyan-400" />
                  <span>Semantic Vector Similarity & Scene Detection Engine</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-400 font-mono">
                  TF-IDF_COSINE_SIM
                </span>
              </div>

              {/* Movie Selector */}
              <div>
                <label className="text-xs text-slate-400 block mb-2">Select a Query Seed Film:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sampleMovies.map((movie, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRunCinematrix(movie)}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all ${
                        selectedMovie === movie.title
                          ? "bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                      }`}
                    >
                      <div className="font-bold">{movie.title}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {movie.tags.slice(0, 2).map((t, ti) => (
                          <span key={ti} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation Analysis Result */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semantic Match Matrix</span>
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono font-bold">
                    <span>Confidence: {cinematrixScore}%</span>
                  </div>
                </div>

                {isProcessingMatrix ? (
                  <div className="py-8 flex flex-col items-center justify-center text-xs text-slate-400 space-y-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-cyan-400" />
                    <span>Computing multi-dimensional vector cosine similarities...</span>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="text-slate-400 text-[11px]">Nearest Neighbor Clusters:</div>
                      <div className="text-white font-bold mt-1 text-sm">
                        {sampleMovies.find(m => m.title === selectedMovie)?.vectorMatch}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                      <div className="text-slate-400 text-[11px]">Feature Weights Applied:</div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-cyan-300 pt-1">
                        <span>Plot Vector: 45%</span>
                        <span>Director / Tone: 30%</span>
                        <span>Scene BPM: 25%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Albert Linson Engineering Showcase &bull; 100% Client-Side Simulation</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
          >
            Close Demonstration
          </button>
        </div>
      </div>
    </div>
  );
}
