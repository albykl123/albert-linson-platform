"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { MessageSquare, Sparkles, Mic, Volume2 } from "lucide-react";
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

    const maxTilt = 10;
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
      className={`relative select-none flex flex-col items-center justify-center cursor-pointer group bg-transparent ${className}`}
      style={{
        perspective: "1000px",
      }}
      title="Click to interact with Albert's AI Digital Twin"
    >
      {/* Floating Animated Speech Bubble on Hover */}
      <div
        className={`mb-3 px-4 py-2 rounded-2xl bg-slate-900/95 text-white text-xs font-medium shadow-xl border border-cyan-500/40 flex items-center space-x-2 transition-all duration-300 pointer-events-none ${
          isHovered ? "opacity-100 transform -translate-y-1 scale-105" : "opacity-90 transform translate-y-0"
        }`}
      >
        <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin [animation-duration:5s]" />
        <span>Hi! I&apos;m Albert&apos;s AI Twin &bull; Speak or Chat 👋</span>
        {/* Speech bubble pointer beak */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-r border-b border-cyan-500/40 transform rotate-45" />
      </div>

      {/* 3D Tilting Character Stage with subtle idle breathing */}
      <div
        className="relative w-64 sm:w-80 h-[440px] sm:h-[500px] flex items-end justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft Ground Contact Shadow (Natural 3D Depth) */}
        <div className="absolute bottom-1 w-48 h-5 rounded-full bg-black/15 blur-md transform -rotate-x-60 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute bottom-2 w-36 h-3 rounded-full bg-black/25 blur-sm transform -rotate-x-60" />

        {/* Pure Transparent Avatar Cutout with subtle organic breathing */}
        <div className="relative w-full h-full animate-[pulse_6s_ease-in-out_infinite]">
          <Image
            src="/albert-avatar-cutout.png"
            alt="Albert Linson AI Digital Twin Avatar"
            fill
            sizes="(max-width: 768px) 280px, 340px"
            priority
            className="object-contain object-bottom filter contrast-[1.04] brightness-[1.01] drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] group-hover:drop-shadow-[0_16px_32px_rgba(6,182,212,0.35)] transition-all duration-300"
          />
        </div>
      </div>

      {/* Subtle Floating Interactive Pill under feet */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleTriggerChat();
        }}
        className="mt-2 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-950 text-white hover:bg-slate-900 text-xs font-semibold shadow-md transition-all border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span>Albert AI Digital Twin &bull; Voice & Chat</span>
        <Mic className="h-3 w-3 text-cyan-400" />
        <Volume2 className="h-3 w-3 text-cyan-400" />
      </button>
    </div>
  );
}
