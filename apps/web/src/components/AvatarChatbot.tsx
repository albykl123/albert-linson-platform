"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Activity,
  Layers,
  FileText
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice Interaction State (STT / TTS)
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveSubtitle, setLiveSubtitle] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

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
        "Open Recruiter JD Matcher"
      ]
    }
  ]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechRecognition(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMessage(transcript);
            setIsListening(false);
            handleSendMessage(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

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

  // Text-To-Speech Synthesis function
  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleaned = text
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_#`~]/g, "")
        .trim();

      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("David") || v.name.includes("Male"))) || voices.find(v => v.lang.startsWith("en"));
      if (preferred) {
        utterance.voice = preferred;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setLiveSubtitle(cleaned.slice(0, 110) + (cleaned.length > 110 ? "..." : ""));
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setTimeout(() => setLiveSubtitle(null), 1200);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setLiveSubtitle(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleToggleVoiceOutput = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setLiveSubtitle(null);
    }
    setIsVoiceOutputEnabled(!isVoiceOutputEnabled);
  };

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

  // Context-aware navigation detection
  const checkNavigationIntent = (query: string): boolean => {
    const q = query.toLowerCase();
    if (q.includes("go to project") || q.includes("show me project") || q.includes("view project") || q.includes("open project")) {
      router.push("/projects");
      return true;
    }
    if (q.includes("go to resume") || q.includes("show me resume") || q.includes("open resume") || q.includes("view resume")) {
      router.push("/resume");
      return true;
    }
    if (q.includes("go to matcher") || q.includes("open matcher") || q.includes("match jd") || q.includes("job matcher")) {
      router.push("/matcher");
      return true;
    }
    if (q.includes("go to leadership") || q.includes("show me leadership") || q.includes("view leadership")) {
      router.push("/leadership");
      return true;
    }
    if (q.includes("go to education") || q.includes("show me education")) {
      router.push("/education");
      return true;
    }
    if (q.includes("go to experience") || q.includes("show me experience")) {
      router.push("/experience");
      return true;
    }
    return false;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    // Check if user requested context-aware navigation
    checkNavigationIntent(text);

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
        const replyText = data.response || "I am ready to help. Feel free to ask about Albert's background, skills, or portfolio.";
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: "albert_ai",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: data.suggestions,
          actionLink: data.actionLink
        };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(replyText);
      } else {
        throw new Error("Chat request failed");
      }
    } catch (err) {
      const fallbackText = "Albert specializes in US IT technical recruitment at Innova Solutions (~70% hiring success) and full-stack software development with React, Next.js, and Python. You can reach him directly on WhatsApp or phone at +91 9910705796, or email at albertkalampadan@gmail.com.";
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "albert_ai",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionLink: { label: "Chat on WhatsApp (+91 9910705796)", href: "https://wa.me/919910705796" },
        suggestions: ["Download verified resume", "Open Recruiter JD Matcher", "View all software projects"]
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      speakText(fallbackText);
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
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setLiveSubtitle(null);
    }
    setMessages([
      {
        id: "welcome-reset",
        sender: "albert_ai",
        text: "Conversation reset. What questions can I answer about Albert's qualifications, recruitment experience, or engineering projects?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          "What is his experience in US IT recruiting?",
          "What software projects has he built?",
          "Open Recruiter JD Matcher"
        ]
      }
    ]);
  };

  return (
    <>
      {/* 1. Global Floating Executive Copilot Launcher (Bottom Right) */}
      <div id="site-albert-chatbot" className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden">
        {/* The Interactive Avatar Trigger Button (Circular Launcher Only) */}
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
            title="Chat with Albert's AI Digital Twin"
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

            {/* Live Online / Audio Pulse Dot */}
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
            </div>
          </button>
        )}
      </div>

      {/* 2. Expanded Interactive Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[88vh] h-[660px] flex flex-col rounded-3xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans print:hidden">
          {/* Header with Speaking Visualizer & Controls */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.5)] bg-slate-900">
                <Image
                  src="/albert-avatar-cutout.png"
                  alt="Albert AI"
                  fill
                  sizes="40px"
                  className="object-contain object-top pt-0.5"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xs font-bold text-white tracking-wide">Albert AI Digital Twin</h3>
                  {/* Speaking Waveform Equalizer */}
                  {isSpeaking && (
                    <div className="flex items-end space-x-0.5 h-3.5">
                      <span className="w-1 bg-cyan-400 rounded-full animate-bounce h-2" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.15s] h-3.5" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.3s] h-2.5" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.45s] h-3" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-cyan-400/90 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{isSpeaking ? "Speaking Response..." : isListening ? "Listening to Voice..." : "Online &bull; Recruiter Assistant"}</span>
                </div>
              </div>
            </div>

            {/* Conversation Control Actions */}
            <div className="flex items-center space-x-1 text-slate-400">
              {/* Voice Output Mute / Unmute */}
              <button
                onClick={handleToggleVoiceOutput}
                className={`p-1.5 rounded-lg transition-colors ${
                  isVoiceOutputEnabled ? "text-cyan-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-800"
                }`}
                title={isVoiceOutputEnabled ? "Voice Output Active (Click to Mute)" : "Voice Output Muted (Click to Enable)"}
                aria-label="Toggle voice synthesis"
              >
                {isVoiceOutputEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              {/* Reset Conversation */}
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Close Window */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                    setLiveSubtitle(null);
                  }
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                title="Close Window"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Subtitles / Caption Stream Banner (When Digital Twin is speaking) */}
          {liveSubtitle && (
            <div className="px-4 py-2 bg-cyan-950/70 border-b border-cyan-500/30 text-cyan-200 text-xs flex items-center space-x-2 animate-in fade-in duration-150">
              <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse flex-shrink-0" />
              <span className="font-mono text-[9px] uppercase font-bold text-cyan-400 bg-cyan-900/60 px-1 py-0.5 rounded">
                Captions
              </span>
              <p className="truncate text-[11px] text-cyan-100">{liveSubtitle}</p>
            </div>
          )}

          {/* Messages Scroll View */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
            {messages.map((m) => {
              const isAi = m.sender === "albert_ai";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAi ? "items-start" : "items-end"} animate-in fade-in slide-in-from-bottom-1 duration-150`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl ${
                      isAi
                        ? "bg-slate-900 text-slate-100 border border-slate-800 shadow-md"
                        : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md rounded-br-none"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                    {/* Action Deep Links */}
                    {isAi && m.actionLink && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                        {m.actionLink.href.startsWith("mailto:") ? (
                          <a
                            href={m.actionLink.href}
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

            {/* Loading Indicator */}
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
              onClick={() => handleSendMessage("Open Recruiter JD Matcher")}
              className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 whitespace-nowrap transition-colors flex items-center space-x-1"
            >
              <Sparkles className="h-3 w-3" />
              <span>Match Your JD</span>
            </button>
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
              💻 Tech Stack
            </button>
            <button
              onClick={() => handleSendMessage("How can I download your resume or schedule an interview?")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              📅 Schedule Call
            </button>
          </div>

          {/* Chat Input Bar with Microphone & Voice Toggle */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            {hasSpeechRecognition && (
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all shadow-sm ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                }`}
                title={isListening ? "Listening... Click to stop" : "Speak to Albert AI (Microphone)"}
                aria-label="Microphone Voice Input"
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
            )}

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening to your voice..." : "Ask Albert anything (experience, projects, skills)..."}
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
