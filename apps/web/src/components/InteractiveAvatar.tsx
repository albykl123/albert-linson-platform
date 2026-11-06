"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { MessageSquare, Sparkles, UserCheck, ShieldCheck, Zap } from "lucide-react";
import { openAlbertChat } from "./AvatarChatbot";

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
    const maxTilt = size === "hero" ? 12 : 8;
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

  const handleTriggerChat = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      openAlbertChat();
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTriggerChat}
      className={`relative select-none transition-transform duration-200 ease-out cursor-pointer group ${className}`}
      style={{
        perspective: "1100px",
      }}
      title="Click to chat with Albert's AI Digital Twin"
    >
      {/* Outer 3D Holographic Stage Shell */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/35 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 transition-all duration-300 group-hover:border-cyan-400/70 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]"
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
            background: `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, ${glarePos.opacity}), rgba(6, 182, 212, 0.05) 50%, transparent 75%)`,
          }}
        />

        {/* Ambient Hologram Grid & Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b215_1px,transparent_1px),linear-gradient(to_bottom,#0891b215_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10 opacity-70" />

        {/* Top Status HUD Badge */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono pointer-events-none">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 border border-cyan-500/50 text-cyan-300 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-[11px] font-semibold tracking-wide">3D DIGITAL TWIN</span>
          </div>

          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-900/85 border border-cyan-500/40 text-cyan-300 text-[10px] backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>Interactive AI</span>
          </div>
        </div>

        {/* 3D Holographic Stage Chamber */}
        <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden flex items-end justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-12 pb-2">
          {/* Backstage Holographic Depth Light */}
          <div className="absolute inset-0 bg-radial-gradient from-cyan-900/25 via-transparent to-transparent pointer-events-none" />

          {/* Floating HUD Widget (Left Side): Primary Track */}
          <div
            className="absolute left-3 top-24 z-20 hidden sm:block p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-white backdrop-blur-md shadow-xl transition-transform duration-300 pointer-events-none"
            style={{
              transform: `translateZ(45px) translateX(${rotateY * -0.6}px) translateY(${rotateX * 0.6}px)`,
            }}
          >
            <div className="text-[10px] text-cyan-400 font-mono font-semibold uppercase flex items-center space-x-1">
              <Zap className="h-2.5 w-2.5" />
              <span>Primary Track</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">US IT Recruiter</div>
            <div className="text-[10px] text-slate-400">Innova Solutions &bull; ~70% Success</div>
          </div>

          {/* Floating HUD Widget (Right Side): Education & Tech */}
          <div
            className="absolute right-3 top-36 z-20 hidden sm:block p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-white backdrop-blur-md shadow-xl transition-transform duration-300 pointer-events-none"
            style={{
              transform: `translateZ(50px) translateX(${rotateY * -0.8}px) translateY(${rotateX * 0.8}px)`,
            }}
          >
            <div className="text-[10px] text-cyan-400 font-mono font-semibold uppercase flex items-center space-x-1">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Academic Degree</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">MCA (Pursuing)</div>
            <div className="text-[10px] text-slate-400">Christ University &bull; 8 Projects</div>
          </div>

          {/* Albert Avatar Cutout with 3D Parallax Depth */}
          <div
            className="relative w-4/5 h-[88%] z-20 flex items-end justify-center transition-transform duration-200 pointer-events-none"
            style={{
              transform: `translateZ(30px) rotateY(${rotateY * 0.3}deg)`,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/albert-avatar-cutout.png"
                alt="Albert Linson AI Digital Twin Avatar Cutout"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                priority
                className="object-contain object-bottom filter contrast-[1.05] brightness-[1.02] drop-shadow-[0_20px_25px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Holographic Glowing Base Stage Rings Under Feet */}
          <div className="absolute bottom-1 left-0 right-0 h-24 pointer-events-none z-10 flex flex-col items-center justify-end pb-3">
            {/* Outer Concentric Cyan Ring */}
            <div className="w-56 h-12 rounded-[100%] border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.6)] bg-cyan-500/10 transform -rotate-x-65 animate-pulse" />
            {/* Inner Concentric Glow Ring */}
            <div className="absolute bottom-5 w-36 h-8 rounded-[100%] border border-cyan-300/80 bg-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.8)] transform -rotate-x-65" />
          </div>
        </div>

        {/* Bottom Interactive Action Bar */}
        <div className="p-4 bg-slate-900/95 border-t border-slate-800 text-left flex items-center justify-between">
          <div>
            <div className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
              <span>Albert Kalampadan Linson</span>
              <UserCheck className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-[11px] text-slate-400">
              Hover to tilt 3D &bull; Click to converse with AI Twin
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTriggerChat();
            }}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all group-hover:shadow-[0_0_20px_rgba(6,182,212,0.7)]"
          >
            <MessageSquare className="h-3.5 w-3.5 fill-current" />
            <span>Chat AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
