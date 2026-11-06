"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isWelcoming, setIsWelcoming] = useState(true);

  // Initialize and play silent avatar walking & waving clip on first load / refresh
  useEffect(() => {
    setIsWelcoming(true);

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }

    // Video duration is 3.4 seconds
    const timer = setTimeout(() => {
      setIsWelcoming(false);
    }, 3400);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Handle replaying video clip
  const handleReplayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsWelcoming(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
    setTimeout(() => {
      setIsWelcoming(false);
    }, 3400);
  };

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
      className={`relative select-none flex flex-col items-center justify-between w-full max-w-[360px] sm:max-w-[400px] mx-auto cursor-pointer group transition-all duration-300 ${className}`}
      style={{
        perspective: "1200px",
      }}
      title="Click to speak or chat with Albert's AI Digital Twin"
    >
      {/* 1. Top Speech Bubble (Exact Approved Design) */}
      <div className="relative z-20 mb-2 transition-transform duration-300 ease-out group-hover:scale-105">
        <div
          className={`relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-[#0c1527]/95 border border-cyan-400/50 text-white text-xs sm:text-[13px] font-medium shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center space-x-2 transition-all duration-300 ${
            isHovered ? "border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.45)]" : ""
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin [animation-duration:8s] shrink-0" />
          <span className="font-sans tracking-wide">
            {isWelcoming ? (
              <>
                Hi! I&apos;m Albert&apos;s AI Twin &bull; Speak or Chat{" "}
                <span className="animate-hand-wave">👋</span>
              </>
            ) : isHovered ? (
              <>Click to converse with AI Twin &bull; Voice &amp; Chat 🎙️</>
            ) : (
              <>
                Hi! I&apos;m Albert&apos;s AI Twin &bull; Speak or Chat{" "}
                <span className="inline-block transition-transform group-hover:rotate-12">👋</span>
              </>
            )}
          </span>

          {/* Replay Walking & Waving Clip Button */}
          {!isWelcoming && (
            <button
              type="button"
              onClick={handleReplayVideo}
              className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/60 transition-colors ml-1"
              title="Replay walk-in and wave animation"
              aria-label="Replay greeting animation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Downward Beak pointing to Avatar head */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c1527] border-r border-b border-cyan-400/50 transform rotate-45" />
        </div>
      </div>

      {/* 2. Center 3D Avatar Character Stage: Pure White Background Walking & Waving Character */}
      <div
        className="relative z-10 w-full h-[400px] sm:h-[460px] flex items-end justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft Natural Ground Contact Shadow on the Floor */}
        <div
          className="absolute bottom-1 w-44 sm:w-52 h-6 rounded-[100%] bg-black/25 blur-md pointer-events-none transition-all duration-200"
          style={{
            transform: `scale(${isHovered ? 1.06 : 1}) translateX(${-rotateY * 1.5}px)`,
          }}
        />

        {/* Pure White Background Walking & Waving Video Clip */}
        <div className="relative w-full h-full flex items-end justify-center pointer-events-none">
          <video
            ref={videoRef}
            src="/albert-avatar-walk-wave.webm?v=white-v6"
            poster="/albert-avatar-poster.png?v=white-v6"
            playsInline
            autoPlay
            muted
            loop={false}
            preload="auto"
            onEnded={() => setIsWelcoming(false)}
            className="w-full h-full object-contain object-bottom transition-all duration-300"
            style={{
              background: "#ffffff",
            }}
          />
        </div>
      </div>
    </div>
  );
}
