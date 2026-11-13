import React from "react";
import Image from "next/image";
import { 
  Cpu, 
  Terminal, 
  Layers, 
  Sparkles, 
  Activity, 
  Database, 
  Bot, 
  Monitor, 
  ShieldCheck, 
  FileText, 
  Film, 
  Mic 
} from "lucide-react";

interface ProjectThumbnailProps {
  projectId: string;
  title: string;
  category?: string;
  imageUrl?: string | null;
  technologies: string[];
}

export function ProjectThumbnail({
  projectId,
  title,
  category = "Software System",
  imageUrl,
  technologies,
}: ProjectThumbnailProps) {
  // If a genuine uploaded screenshot exists, render it with Next.js Image
  if (imageUrl && !imageUrl.includes("placeholder")) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 border border-swiss-divider">
        <Image
          src={imageUrl}
          alt={`Screenshot of ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  // Tailored, high-fidelity SVG/CSS Architecture Previews for each project
  const getArchitectureTheme = (id: string) => {
    switch (id) {
      case "proj-jarvis":
      case "project-jarvis":
        return {
          icon: <Terminal className="h-6 w-6 text-cyan-400" />,
          bgGradient: "from-slate-950 via-cyan-950 to-slate-900",
          accentColor: "text-cyan-400",
          borderColor: "border-cyan-500/30",
          nodes: ["Electron Tray GUI", "FastAPI Worker", "Faster-Whisper (Offline)"],
          badge: "Desktop AI Engine",
        };
      case "proj-auriva":
      case "project-auriva":
        return {
          icon: <Mic className="h-6 w-6 text-purple-400" />,
          bgGradient: "from-slate-950 via-purple-950 to-slate-900",
          accentColor: "text-purple-400",
          borderColor: "border-purple-500/30",
          nodes: ["WebRTC Audio Stream", "Neural VAD Engine", "Low-Latency Synthesizer"],
          badge: "Conversational Audio AI",
        };
      case "proj-cinematrix":
      case "project-cinematrix":
        return {
          icon: <Film className="h-6 w-6 text-emerald-400" />,
          bgGradient: "from-slate-950 via-emerald-950 to-slate-900",
          accentColor: "text-emerald-400",
          borderColor: "border-emerald-500/30",
          nodes: ["Script Parser", "Storyboard Prompter", "FFmpeg Assembler"],
          badge: "Video AI Orchestration",
        };
      case "proj-lunova":
      case "project-lunova":
        return {
          icon: <Monitor className="h-6 w-6 text-blue-400" />,
          bgGradient: "from-slate-950 via-blue-950 to-slate-900",
          accentColor: "text-blue-400",
          borderColor: "border-blue-500/30",
          nodes: ["Virtual Window Manager", "State Container", "Sandboxed Apps"],
          badge: "Web Desktop Environment",
        };
      case "proj-atsforge":
      case "project-atsforge":
        return {
          icon: <FileText className="h-6 w-6 text-amber-400" />,
          bgGradient: "from-slate-950 via-amber-950 to-slate-900",
          accentColor: "text-amber-400",
          borderColor: "border-amber-500/30",
          nodes: ["ATS Heuristic Parser", "Semantic Keyword Matcher", "Vector PDF Exporter"],
          badge: "ATS Resume Intelligence",
        };
      case "proj-mcd":
      case "project-mcd":
        return {
          icon: <Layers className="h-6 w-6 text-sky-400" />,
          bgGradient: "from-slate-950 via-sky-950 to-slate-900",
          accentColor: "text-sky-400",
          borderColor: "border-sky-500/30",
          nodes: ["Citizen Civic Portal", "Figma Design System", "Responsive Frontend"],
          badge: "Civic Digital Portal",
        };
      case "proj-bots":
      case "project-bots":
        return {
          icon: <Bot className="h-6 w-6 text-pink-400" />,
          bgGradient: "from-slate-950 via-pink-950 to-slate-900",
          accentColor: "text-pink-400",
          borderColor: "border-pink-500/30",
          nodes: ["Intent Classifier", "Speech-to-Text Pipeline", "Discord Integration"],
          badge: "Conversational Bot Suite",
        };
      default:
        return {
          icon: <Cpu className="h-6 w-6 text-slate-300" />,
          bgGradient: "from-slate-950 via-slate-900 to-slate-950",
          accentColor: "text-slate-300",
          borderColor: "border-slate-700",
          nodes: ["Next.js App Router", "Cloudflare Workers", "D1 Edge Store"],
          badge: "Full-Stack System",
        };
    }
  };

  const theme = getArchitectureTheme(projectId);

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br ${theme.bgGradient} border ${theme.borderColor} p-5 flex flex-col justify-between shadow-xs select-none group`}
    >
      {/* Background Blueprint Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* Top Bar: Icon, Architecture Blueprint Watermark & Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-black/40 border border-white/10 shadow-inner">
            {theme.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/50 block font-mono">
              SYSTEM ARCHITECTURE
            </span>
            <span className={`text-xs font-bold ${theme.accentColor} tracking-tight`}>
              {theme.badge}
            </span>
          </div>
        </div>

        <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10 font-mono">
          Verified Blueprint
        </span>
      </div>

      {/* Center Flow Diagram Visualization */}
      <div className="relative z-10 my-auto py-2">
        <div className="grid grid-cols-3 gap-2 items-center">
          {theme.nodes.map((node, idx) => (
            <div key={idx} className="relative">
              <div className="p-2 rounded-lg bg-black/50 border border-white/15 text-center shadow-sm">
                <span className="text-[10px] font-medium text-slate-200 line-clamp-1 block">
                  {node}
                </span>
              </div>
              {idx < 2 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-white/30 text-xs font-mono">
                  &rarr;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Technologies & Title */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
        <div className="flex items-center space-x-1.5 overflow-hidden">
          {technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded bg-white/5 text-white/80 border border-white/10 text-[10px] font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        <span className="text-[10px] text-white/40 font-mono hidden sm:inline">
          16:9 Model
        </span>
      </div>
    </div>
  );
}
