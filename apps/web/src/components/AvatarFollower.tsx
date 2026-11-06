"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, MessageSquare } from "lucide-react";

interface AvatarFollowerProps {
  onOpenChat: () => void;
  isChatOpen?: boolean;
}

// Contextual dialogue bank tailored to recruiter inquiries and website sections
const CONTEXT_DIALOGUES: Record<string, string[]> = {
  hero: [
    "Welcome to my platform! 👋",
    "I'm Albert's AI Digital Twin. Hover around or click me to chat!",
    "Looking for a Lead US IT Recruiter or Full-Stack Developer?"
  ],
  experience: [
    "I led US IT recruitment at Innova Solutions!",
    "Achieved ~70% candidate placement improvement via ATS screening.",
    "Experienced across tech staffing, IT ops & UI/UX engineering."
  ],
  projects: [
    "Check out AURIVA: real-time audio & vision intelligence!",
    "Built JARVIS Desktop Agent in Python for OS automation.",
    "Explore CINEMATRIX for semantic movie discovery!"
  ],
  education: [
    "Currently pursuing MCA at Christ University (2024–2026)!",
    "Graduated BCA with honors from Christ University.",
    "Schooling at St. Columba's School, New Delhi."
  ],
  resume: [
    "Need my verified ATS resume? Click to download PDF or TXT!",
    "Every metric here is 100% verified with zero hallucination.",
    "Check out my 4-tier evidence-backed skills matrix!"
  ],
  leadership: [
    "Headed event management for the School of Sciences Corporate Club!",
    "Mentored students as Advanced Peer Educator with CCHS."
  ],
  freestack: [
    "1,369 curated zero-cost cloud tools for developers!",
    "This entire platform runs at $0/mo on Cloudflare Workers."
  ],
  default: [
    "Click me anytime to chat with my AI Twin! 🚀",
    "Available for US IT Recruitment & Software Engineering roles.",
    "Ask me about my experience, projects, or schedule a call!",
    "Hover over any section to see details, or click me to converse!"
  ]
};

export function AvatarFollower({ onOpenChat, isChatOpen = false }: AvatarFollowerProps) {
  // Cursor tracking coordinates
  const [targetPos, setTargetPos] = useState({ x: -200, y: -200 });
  const [currentPos, setCurrentPos] = useState({ x: -200, y: -200 });
  const [velocity, setVelocity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState("Hi! I'm Albert's AI Twin 👋");
  const [isTalking, setIsTalking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const prevX = useRef(0);
  const animFrameRef = useRef<number>();
  const dialogueTimerRef = useRef<NodeJS.Timeout>();

  // Check if device has fine pointer (mouse)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
      setIsMobile(!hasFinePointer);
    }
  }, []);

  // Mouse move listener across entire window
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Detect which section the cursor is hovering over
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const closestSection = element.closest("[id]");
        const sectionId = closestSection?.id?.toLowerCase();

        if (sectionId && CONTEXT_DIALOGUES[sectionId]) {
          const dialogues = CONTEXT_DIALOGUES[sectionId];
          const chosen = dialogues[Math.floor(Math.random() * dialogues.length)];
          triggerDialogue(chosen);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, isMobile]);

  // Periodic speech bubble rotations
  useEffect(() => {
    dialogueTimerRef.current = setInterval(() => {
      const defaults = CONTEXT_DIALOGUES.default;
      const randomMsg = defaults[Math.floor(Math.random() * defaults.length)];
      triggerDialogue(randomMsg);
    }, 6500);

    return () => {
      if (dialogueTimerRef.current) clearInterval(dialogueTimerRef.current);
    };
  }, []);

  const triggerDialogue = (text: string) => {
    if (text === currentDialogue) return;
    setIsTalking(true);
    setCurrentDialogue(text);
    setTimeout(() => setIsTalking(false), 300);
  };

  // Smooth lerp physics loop (requestAnimationFrame)
  useEffect(() => {
    if (isMobile) return;

    const updatePhysics = () => {
      setCurrentPos((prev) => {
        const winWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
        const winHeight = typeof window !== "undefined" ? window.innerHeight : 800;

        // Viewport edge collision avoidance
        const isNearRight = targetPos.x > winWidth - 160;
        const offsetX = isNearRight ? -100 : 28;

        const isNearBottom = targetPos.y > winHeight - 190;
        const offsetY = isNearBottom ? -140 : 14;

        const dx = targetPos.x + offsetX - prev.x;
        const dy = targetPos.y + offsetY - prev.y;

        const newX = prev.x + dx * 0.14;
        const newY = prev.y + dy * 0.14;

        // Calculate horizontal velocity for banking tilt
        const currentVel = newX - prevX.current;
        prevX.current = newX;
        setVelocity(currentVel);

        return { x: newX, y: newY };
      });

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetPos, isMobile]);

  // If on mobile, or hidden, or while chatbot modal is open, avoid distracting the user
  if (isMobile || !isVisible || isChatOpen) return null;

  // Calculate dynamic banking angle (-15 deg to +15 deg)
  const tiltAngle = Math.max(-15, Math.min(15, velocity * 1.2));

  return (
    <div
      style={{
        transform: `translate3d(${currentPos.x}px, ${currentPos.y}px, 0)`,
      }}
      className="fixed top-0 left-0 z-40 transition-opacity duration-300 select-none pointer-events-none"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onOpenChat();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col items-center pointer-events-auto cursor-pointer group"
        style={{
          transform: `rotate(${tiltAngle}deg) scale(${isHovered ? 1.15 : 1})`,
          transition: "transform 0.15s ease-out",
        }}
        title="Click to chat with Albert's AI Digital Twin"
      >
        {/* Animated Speech Bubble Floating Above the Avatar */}
        <div
          className={`absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-2xl bg-slate-950/95 border border-cyan-400/70 text-white text-[11px] font-medium shadow-[0_4px_25px_rgba(6,182,212,0.4)] backdrop-blur-md transition-all duration-300 flex items-center space-x-1.5 ${
            isTalking ? "scale-105 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)]" : "scale-100"
          }`}
        >
          <Sparkles className="h-3 w-3 text-cyan-400 shrink-0 animate-spin [animation-duration:4s]" />
          <span className="text-slate-100 tracking-wide font-sans">{currentDialogue}</span>
          {/* Speech bubble beak pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 border-r border-b border-cyan-400/70 transform rotate-45" />
        </div>

        {/* Character Cutout Body */}
        <div className="relative w-14 h-36 drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)] group-hover:drop-shadow-[0_0_22px_rgba(6,182,212,0.85)] transition-all">
          <Image
            src="/albert-avatar-cutout.png"
            alt="Albert AI Mouse Follower"
            fill
            sizes="64px"
            priority
            className="object-contain object-bottom filter contrast-[1.05] brightness-[1.02]"
          />
        </div>

        {/* Miniature Holographic Floor Ring under feet */}
        <div className="absolute -bottom-1 w-12 h-3 rounded-full border border-cyan-400/80 bg-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.75)] animate-pulse" />
      </div>
    </div>
  );
}
