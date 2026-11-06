"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Mic, Volume2 } from "lucide-react";
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
  const [isWelcoming, setIsWelcoming] = useState(true);
  const [isSpeakingGreeting, setIsSpeakingGreeting] = useState(false);
  const hasSpokenRef = useRef(false);

  // Play realistic voice greeting saying "Hi!"
  const playVoiceGreeting = () => {
    if (hasSpokenRef.current) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
      const text = "Hi! I'm Albert's AI Twin. Welcome to my website!";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Guy") ||
              v.name.includes("David") ||
              v.name.includes("Daniel") ||
              v.name.includes("George"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => {
        setIsSpeakingGreeting(true);
      };

      utterance.onend = () => {
        setIsSpeakingGreeting(false);
      };

      utterance.onerror = () => {
        setIsSpeakingGreeting(false);
      };

      window.speechSynthesis.speak(utterance);
      hasSpokenRef.current = true;
    } catch (err) {
      console.warn("Speech synthesis notice:", err);
    }
  };

  // Welcome greeting & hand wave animation on first load or refresh
  useEffect(() => {
    setIsWelcoming(true);

    // 1. Attempt immediate speech greeting on load
    playVoiceGreeting();

    // 2. Fallback for browser autoplay policies: trigger speech on first user gesture
    const handleFirstGesture = () => {
      if (!hasSpokenRef.current) {
        playVoiceGreeting();
      }
      window.removeEventListener("pointermove", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointermove", handleFirstGesture, { passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("scroll", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    // Settle into resting state after greeting
    const timer = setTimeout(() => {
      setIsWelcoming(false);
    }, 3200);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, []);

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

    const maxTilt = 9;
    setRotateY(deltaX * maxTilt);
    setRotateX(-deltaY * maxTilt);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!hasSpokenRef.current) {
      playVoiceGreeting();
    }
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
      {/* 1. Top Speech Bubble (Exact Match to User Reference) */}
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

          {/* Real-time speaking audio waveform visualizer */}
          {isSpeakingGreeting && (
            <div className="flex items-end space-x-0.5 h-3 ml-1">
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2" />
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s] h-3.5" />
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s] h-2.5" />
            </div>
          )}

          {/* Beak pointing downwards to avatar */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c1527] border-r border-b border-cyan-400/50 transform rotate-45" />
        </div>
      </div>

      {/* 2. Center 3D Avatar Character Stage with Real Hand Waving */}
      <div
        className="relative z-10 w-full h-[400px] sm:h-[460px] flex items-end justify-center transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft Natural Ground Contact Shadow on the Floor */}
        <div
          className="absolute bottom-1 w-44 sm:w-52 h-6 rounded-[100%] bg-black/45 blur-md pointer-events-none transition-all duration-200"
          style={{
            transform: `scale(${isHovered ? 1.06 : 1}) translateX(${-rotateY * 1.5}px)`,
          }}
        />

        {/* Base Body Layer (With subtle welcoming body tilt) */}
        <div
          className={`relative w-full h-full ${isWelcoming ? "animate-avatar-welcome-body" : ""}`}
        >
          <Image
            src="/albert-avatar-body.png"
            alt="Albert Linson 3D AI Digital Twin"
            fill
            sizes="(max-width: 640px) 300px, 380px"
            priority
            className="object-contain object-bottom filter contrast-[1.05] brightness-[1.02] drop-shadow-[0_15px_35px_rgba(0,0,0,0.65)] group-hover:drop-shadow-[0_20px_45px_rgba(6,182,212,0.35)] transition-all duration-300"
          />

          {/* Independent Waving Right Arm Layer (Pivots directly at elbow 35.17% 48.5%) */}
          <div
            className={`absolute inset-0 w-full h-full pointer-events-none ${
              isWelcoming ? "animate-arm-wave" : ""
            }`}
            style={{
              transformOrigin: "35.17% 48.5%", // Exact elbow pivot (115px / 327px, 420px / 866px)
            }}
          >
            <Image
              src="/albert-avatar-arm.png"
              alt="Albert Linson Waving Hand"
              fill
              sizes="(max-width: 640px) 300px, 380px"
              priority
              className="object-contain object-bottom filter contrast-[1.05] brightness-[1.02] drop-shadow-[0_15px_35px_rgba(0,0,0,0.65)] group-hover:drop-shadow-[0_20px_45px_rgba(6,182,212,0.35)] transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* 3. Bottom Interactive Action Capsule Pill (Exact Match to User Reference) */}
      <div className="relative z-20 mt-3 transition-transform duration-300 ease-out group-hover:scale-105">
        <div
          className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#0c1527]/95 border border-cyan-400/50 text-white text-xs sm:text-[13px] font-medium shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center space-x-2.5 transition-all duration-300 ${
            isHovered ? "border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.45)]" : ""
          }`}
        >
          {/* Pulsing Live Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <span className="font-sans font-semibold tracking-wide">
            Albert AI Digital Twin &bull; Voice &amp; Chat
          </span>

          <div className="flex items-center space-x-1.5 pl-1 text-cyan-400">
            <Mic className="h-3.5 w-3.5" />
            <Volume2 className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
