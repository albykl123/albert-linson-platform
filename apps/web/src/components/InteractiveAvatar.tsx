"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, Sparkles, UserCheck, ShieldCheck, ExternalLink, Zap } from "lucide-react";

interface InteractiveAvatarProps {
  size?: "sm" | "md" | "lg" | "hero";
  className?: string;
  onOpenChat?: () => void;
  interactive?: boolean;
}

export function InteractiveAvatar({
  size = "hero",
  className = "",
  onOpenChat,
  interactive = true,
}: InteractiveAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Mouse move handler for smooth 3D parallax tilt & holographic sheen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX; // -1 to 1
    const deltaY = (y - centerY) / centerY; // -1 to 1

    // Rotation angles (degrees)
    const maxTilt = size === "hero" ? 14 : 10;
    setRotateY(deltaX * maxTilt);
    setRotateX(-deltaY * maxTilt);

    // Dynamic specular glare position (%)
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smooth return to center
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onOpenChat}
      className={`relative select-none transition-transform duration-200 ease-out cursor-pointer group ${className}`}
      style={{
        perspective: "1000px",
      }}
      title="Click to chat with Albert's AI Digital Twin"
    >
      {/* Outer 3D Card Shell */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-900/90 transition-all duration-300 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.35)]"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: "preserve-3d",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
      >
        {/* Holographic Specular Glare Layer */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, ${glarePos.opacity}), rgba(6, 182, 212, 0.05) 45%, transparent 70%)`,
          }}
        />

        {/* Ambient Hologram Grid & Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b212_1px,transparent_1px),linear-gradient(to_bottom,#0891b212_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10 opacity-70" />

        {/* Top Status HUD Badge */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono pointer-events-none">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-300 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wide">DIGITAL TWIN ONLINE</span>
          </div>

          <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 text-[10px] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>Interactive 3D</span>
          </div>
        </div>

        {/* Avatar Image Container with Perspective Depth */}
        <div className="relative w-full aspect-[3/4] overflow-hidden flex items-center justify-center bg-slate-950">
          <Image
            src="/albert-avatar.jpg"
            alt="Albert Linson AI Digital Twin Avatar"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            priority
            className="object-cover object-center filter saturate-[1.08] contrast-[1.03] transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Floating HUD Widget (Left Side): Verification Metrics */}
          <div
            className="absolute left-3 bottom-20 z-20 hidden sm:block p-2.5 rounded-xl bg-slate-900/85 border border-cyan-500/30 text-white backdrop-blur-md shadow-lg transition-transform duration-300 pointer-events-none"
            style={{
              transform: `translateZ(40px) translateX(${rotateY * -0.6}px) translateY(${rotateX * 0.6}px)`,
            }}
          >
            <div className="text-[10px] text-cyan-400 font-mono font-semibold uppercase">Primary Track</div>
            <div className="text-xs font-bold text-white mt-0.5">US IT Recruiter</div>
            <div className="text-[10px] text-slate-400">Innova Solutions &bull; ~70% Success</div>
          </div>

          {/* Floating HUD Widget (Right Side): Education & Tech */}
          <div
            className="absolute right-3 bottom-32 z-20 hidden sm:block p-2.5 rounded-xl bg-slate-900/85 border border-cyan-500/30 text-white backdrop-blur-md shadow-lg transition-transform duration-300 pointer-events-none"
            style={{
              transform: `translateZ(50px) translateX(${rotateY * -0.8}px) translateY(${rotateX * 0.8}px)`,
            }}
          >
            <div className="text-[10px] text-cyan-400 font-mono font-semibold uppercase">Academic Degree</div>
            <div className="text-xs font-bold text-white mt-0.5">MCA (Pursuing)</div>
            <div className="text-[10px] text-slate-400">Christ University &bull; 8 Projects</div>
          </div>

          {/* Holographic Glowing Base Ring at Feet */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cyan-950/60 via-cyan-900/20 to-transparent pointer-events-none z-10 flex items-center justify-center">
            <div className="w-48 h-10 rounded-full border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] transform -rotate-x-60 animate-pulse" />
          </div>
        </div>

        {/* Bottom Interactive Bar */}
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 text-left flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
              <span>Albert Kalampadan Linson</span>
              <UserCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              Hover to tilt &bull; Click to converse with AI Twin
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenChat) onOpenChat();
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            <span>Chat AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
