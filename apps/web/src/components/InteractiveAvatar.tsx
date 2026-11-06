"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { MessageSquare, Sparkles, Mic, Volume2, User, Zap, GraduationCap, ChevronRight } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);

  // Mouse move handler for smooth 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX; // -1 to 1
    const deltaY = (y - centerY) / centerY; // -1 to 1

    const maxTilt = 8;
    setRotateY(deltaX * maxTilt);
    setRotateX(-deltaY * maxTilt);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
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
      className={`relative select-none w-full max-w-[420px] rounded-[28px] bg-[#070e1b] border border-cyan-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-5 sm:p-6 overflow-hidden cursor-pointer group transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_25px_70px_rgba(6,182,212,0.25)] ${className}`}
      style={{
        perspective: "1000px",
      }}
      title="Click to interact with Albert's AI Digital Twin"
    >
      {/* Subtle Cyan Cyber Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" 
      />

      {/* Top Header Pills (Matching Approved 3D Digital Twin Design) */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        {/* Left Badge: 3D DIGITAL TWIN */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-[11px] font-mono font-bold tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.3)]">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>3D DIGITAL TWIN</span>
        </div>

        {/* Right Badge: Interactive AI */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono font-medium tracking-wide shadow-sm">
          <Sparkles className="h-3 w-3 text-cyan-400" />
          <span>Interactive AI</span>
        </div>
      </div>

      {/* Floating Holographic Credential Tags */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mb-2">
        {/* Left Tag: Primary Track */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-sm transition-transform duration-200 group-hover:border-cyan-400/50">
          <div className="flex items-center space-x-1 text-cyan-400 text-[9px] font-bold uppercase tracking-wider">
            <Zap className="h-2.5 w-2.5" />
            <span>Primary Track</span>
          </div>
          <div className="text-xs font-bold text-white mt-0.5 tracking-tight">
            US IT Recruiter
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 truncate">
            Innova Solutions &bull; ~70% Success
          </div>
        </div>

        {/* Right Tag: Academic Degree */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-sm transition-transform duration-200 group-hover:border-cyan-400/50">
          <div className="flex items-center space-x-1 text-cyan-400 text-[9px] font-bold uppercase tracking-wider">
            <Sparkles className="h-2.5 w-2.5" />
            <span>Academic Degree</span>
          </div>
          <div className="text-xs font-bold text-white mt-0.5 tracking-tight">
            MCA (Pursuing)
          </div>
          <div className="text-[10px] text-slate-300 mt-0.5 truncate">
            Christ University &bull; 8 Projects
          </div>
        </div>
      </div>

      {/* Floating Animated Speech Bubble */}
      <div className="relative z-10 mt-3 flex justify-center pointer-events-none">
        <div
          className={`px-4 py-2 rounded-2xl bg-slate-950/95 text-white text-xs font-medium shadow-2xl border border-cyan-400/60 flex items-center space-x-2 transition-all duration-300 ${
            isHovered ? "scale-105 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "scale-100"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin [animation-duration:6s]" />
          <span className="text-[11px] sm:text-xs">Ask me about my experience, projects, or schedule a call!</span>
          {/* Beak */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-cyan-400/60 transform rotate-45" />
        </div>
      </div>

      {/* 3D Character Stage */}
      <div
        className="relative z-10 w-full h-[380px] sm:h-[420px] flex items-end justify-center mt-2 transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Holographic Glowing Ground Rings (Exact Match to User Attachment) */}
        <div className="absolute bottom-2 flex items-center justify-center pointer-events-none">
          {/* Outer Ring */}
          <div className="w-56 h-12 rounded-full border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.5)] transform -rotate-x-65 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
          {/* Inner Ring */}
          <div className="absolute w-40 h-8 rounded-full border border-cyan-300/80 shadow-[0_0_15px_rgba(6,182,212,0.8)] transform -rotate-x-65" />
          {/* Center Glow Spot */}
          <div className="absolute w-32 h-6 rounded-full bg-cyan-500/25 blur-md transform -rotate-x-65" />
        </div>

        {/* Pure Transparent Avatar Cutout */}
        <div className="relative w-full h-full">
          <Image
            src="/albert-avatar-cutout.png"
            alt="Albert Kalampadan Linson AI Digital Twin"
            fill
            sizes="(max-width: 768px) 320px, 400px"
            priority
            className="object-contain object-bottom filter contrast-[1.05] brightness-[1.02] drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_20px_40px_rgba(6,182,212,0.45)] transition-all duration-300"
          />
        </div>
      </div>

      {/* Bottom Bar: Identification + Direct Chat AI Action */}
      <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-serif font-bold text-white text-sm sm:text-base tracking-tight">
              Albert Kalampadan Linson
            </span>
            <User className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Hover to tilt 3D &bull; Click to converse with AI Twin
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTriggerChat();
          }}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all hover:scale-105"
        >
          <MessageSquare className="h-3.5 w-3.5 fill-current" />
          <span>Chat AI</span>
        </button>
      </div>
    </div>
  );
}
