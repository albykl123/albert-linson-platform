"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  UserCheck, 
  ArrowUpRight, 
  ExternalLink,
  Bot,
  User,
  RotateCcw,
  Minimize2,
  ChevronDown
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "albert_ai";
  text: string;
  timestamp: string;
  actionLink?: { label: string; href: string };
  suggestions?: string[];
}

/**
 * Global helper to trigger opening the Albert AI chatbot from any component or link
 */
export function openAlbertChat(initialMessage?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-albert-chat", { detail: { initialMessage } })
    );
  }
}

export function AvatarChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome greeting
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "albert_ai",
      text: "Hello! I am Albert Linson's AI Digital Twin. I can answer any questions about Albert's US IT recruitment experience at Innova Solutions, his software engineering projects (AURIVA, CINEMATRIX, JARVIS), his MCA degree at Christ University, or help you schedule an interview. What would you like to explore?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        "Tell me about your US IT recruiting experience",
        "What software projects have you built?",
        "What are your academic research papers?",
        "Can I download your verified resume?"
      ]
    }
  ]);

  // Listen for open-albert-chat event from InteractiveAvatar or external buttons
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ initialMessage?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.initialMessage) {
        handleSendMessage(customEvent.detail.initialMessage);
      }
    };

    window.addEventListener("open-albert-chat", handleOpenEvent);
    return () => {
      window.removeEventListener("open-albert-chat", handleOpenEvent);
    };
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Subtle mouse tracking for floating avatar badge
  const handleBadgeMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    setTilt({ x: -y, y: x });
  };

  const handleBadgeMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const history = messages.slice(-4).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "albert_ai",
          text: data.response || "I am ready to help. Feel free to ask about Albert's background, skills, or portfolio.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestions,
          actionLink: data.actionLink
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Chat request failed");
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "albert_ai",
        text: "Albert specializes in US IT technical recruitment at Innova Solutions (~70% hiring success) and full-stack software development with React, Next.js, and Python. You can also contact him directly at albertkalampadan@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: { label: "Contact Albert Directly", href: "mailto:albertkalampadan@gmail.com" },
        suggestions: ["Download verified resume", "View all software projects"]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "albert_ai",
        text: "Conversation reset. What questions can I answer about Albert's qualifications, recruitment experience, or engineering projects?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "What is his experience in US IT recruiting?",
          "What software projects has he built?",
          "Can I download his resume?"
        ]
      }
    ]);
  };

  return (
    <>
      {/* 1. Global Floating Executive Copilot Launcher (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Floating Tooltip Speech Bubble on Hover (when closed) */}
        {!isOpen && isHovered && (
          <div className="mb-3 mr-1 p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 text-white shadow-2xl backdrop-blur-md max-w-xs text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Albert AI &bull; Interactive Copilot</span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11px]">
              Hi! Click to ask me anything about Albert&apos;s US IT recruiting background, software builds, or schedule an interview!
            </p>
          </div>
        )}

        {/* The Interactive Avatar Trigger Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            onMouseMove={handleBadgeMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleBadgeMouseLeave}
            style={{
              transform: `perspective(400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.08 : 1})`,
              transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
            }}
            className="relative flex items-center justify-center p-1 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-900 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] cursor-pointer group focus:outline-none"
            aria-label="Open Albert AI Chatbot"
          >
            {/* Pulsing Holographic Ring */}
            <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-40 blur-sm group-hover:opacity-75 transition-opacity animate-pulse"></span>

            {/* Circular Avatar Cutout with Gradient Backdrop & Online Status Dot */}
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden border-2 border-white/90 bg-gradient-to-b from-slate-800 to-slate-950 flex items-center justify-center">
              <Image
                src="/albert-avatar-cutout.png"
                alt="Albert AI Avatar"
                fill
                sizes="80px"
                className="object-contain object-top filter contrast-[1.05] group-hover:scale-110 transition-transform duration-300 pt-1"
              />
            </div>

            {/* Live Online Badge */}
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
            </div>
          </button>
        )}
      </div>

      {/* 2. Expanded Interactive Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[640px] flex flex-col rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.5)] bg-slate-900">
                <Image
                  src="/albert-avatar-cutout.png"
                  alt="Albert AI Digital Twin"
                  fill
                  sizes="44px"
                  className="object-contain object-top pt-0.5"
                />
              </div>
              <div>
                <div className="flex items-center space-x-1.5 font-bold text-sm text-white">
                  <span>Albert AI &bull; Digital Twin</span>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-cyan-400/90 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ONLINE &bull; MCA / US IT Recruiter</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Minimize Chat"
                aria-label="Minimize Chat"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/70 text-xs">
            {messages.map((m) => {
              const isAi = m.sender === "albert_ai";
              return (
                <div key={m.id} className={`flex flex-col ${isAi ? "items-start" : "items-end"}`}>
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                      isAi
                        ? "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm"
                        : "bg-cyan-600 text-white rounded-tr-sm font-medium"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Action Link Button if provided */}
                    {m.actionLink && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800">
                        {m.actionLink.href.startsWith("http") || m.actionLink.href.startsWith("mailto:") ? (
                          <a
                            href={m.actionLink.href}
                            target={m.actionLink.href.startsWith("http") ? "_blank" : undefined}
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-[11px] font-semibold transition-all"
                          >
                            <span>{m.actionLink.label}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <Link
                            href={m.actionLink.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-[11px] font-semibold transition-all"
                          >
                            <span>{m.actionLink.label}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>

                  {/* Suggestion Chips */}
                  {isAi && m.suggestions && m.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(s)}
                          className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-[10px] font-medium transition-all text-left"
                        >
                          &bull; {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center space-x-2 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 w-fit">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-400 ml-1">Albert AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSendMessage("Tell me about your US IT recruitment experience at Innova Solutions")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              💼 US IT Recruiting
            </button>
            <button
              onClick={() => handleSendMessage("What software projects and tech stack have you built?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              💻 Tech Stack & Projects
            </button>
            <button
              onClick={() => handleSendMessage("How can I download your resume or schedule an interview?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              📅 Schedule Call
            </button>
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Albert anything (experience, projects, skills)..."
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold transition-all shadow-md"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
