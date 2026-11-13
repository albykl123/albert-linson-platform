import { NextRequest, NextResponse } from "next/server";
import { masterProfile } from "@/lib/profileData";

export const dynamic = "force-dynamic";

// Deterministic knowledge base matcher for instant, zero-hallucination responses
function getDeterministicResponse(userQuery: string): { response: string; suggestions: string[]; actionLink?: { label: string; href: string } } {
  const q = userQuery.toLowerCase();

  if (q.includes("match") || q.includes("jd") || q.includes("job description") || q.includes("fit") || q.includes("alignment") || q.includes("requisition")) {
    return {
      response: "You can test candidate compatibility in real time using our interactive Recruiter JD Matcher. Paste your open job description to generate an evidence-based compatibility score, view matching experience and projects, and inspect transparent skill gap analysis.",
      suggestions: [
        "Open Recruiter JD Matcher",
        "Tell me about his US IT recruiting track record",
        "Download verified master resume"
      ],
      actionLink: { label: "Launch Recruiter JD Matcher", href: "/matcher" }
    };
  }

  if (q.includes("recruit") || q.includes("innova") || q.includes("staffing") || q.includes("sourcing") || q.includes("talent") || q.includes("us it")) {
    return {
      response: "Albert currently works as a US IT Recruiter at Innova Solutions (Dec 2025 – Present). He directs end-to-end technical staffing across cloud, DevOps, and full-stack requisitions for US-based enterprise clients. Using ATS platforms and targeted talent sourcing, he has improved placement success rates by approximately 70% through disciplined candidate qualification.",
      suggestions: [
        "What technologies does Albert specialize in?",
        "Tell me about Albert's education at Christ University",
        "Can I schedule an interview with Albert?"
      ],
      actionLink: { label: "View Experience Details", href: "/experience" }
    };
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("technolog") || q.includes("python") || q.includes("react") || q.includes("next")) {
    return {
      response: "Albert's skillset spans both software engineering and technical talent acquisition. His engineering stack includes React, Next.js 14, TypeScript, Python, FastAPI, Tailwind CSS, SQLite/Cloudflare D1, Git, and Linux. In recruitment, he specializes in full-cycle US IT hiring, ATS workflows, candidate screening, and client relationship management.",
      suggestions: [
        "Show me his verified software projects",
        "What are his 4-tier skill levels?",
        "Download verified resume"
      ],
      actionLink: { label: "Inspect 4-Tier Skills Matrix", href: "/resume#skills" }
    };
  }

  if (q.includes("project") || q.includes("build") || q.includes("code") || q.includes("auriva") || q.includes("cinematrix") || q.includes("jarvis") || q.includes("lunova")) {
    return {
      response: "Albert has engineered 8 verified software systems, including AURIVA (real-time audio-visual analysis platform), CINEMATRIX (semantic movie recommendation engine), JARVIS Desktop Agent (voice automation assistant in Python), Lunova OS (browser-based operating system UI), and this edge-native platform deployed on Cloudflare Workers.",
      suggestions: [
        "Tell me about his academic research papers",
        "How can I download his resume?",
        "What was his role at Innova Solutions?"
      ],
      actionLink: { label: "Explore All Projects", href: "/projects" }
    };
  }

  if (q.includes("research") || q.includes("paper") || q.includes("aegis") || q.includes("ultrasound") || q.includes("academic") || q.includes("publication")) {
    return {
      response: "Albert has authored two focused scientific research papers: (1) 'AEGIS-Test: Comprehensive Automated Framework for Robust Software Testing and Quality Assurance' and (2) 'Multi-modal Ultrasound Breast Cancer Classification using Deep Learning' focusing on non-invasive diagnostic accuracy.",
      suggestions: [
        "What is Albert's educational background?",
        "What are his core technical skills?",
        "Schedule an introductory call"
      ],
      actionLink: { label: "Read Academic Manuscripts", href: "/projects#research" }
    };
  }

  if (q.includes("education") || q.includes("university") || q.includes("degree") || q.includes("college") || q.includes("christ") || q.includes("mca") || q.includes("bca")) {
    return {
      response: "Albert is currently pursuing his Master of Computer Applications (MCA, 2024–2026) at CHRIST (Deemed to be University), Delhi NCR. He previously graduated with a Bachelor of Computer Applications (BCA, 2021–2024) from Christ University, and completed his schooling at St. Columba's School, New Delhi.",
      suggestions: [
        "What leadership roles did he hold at Christ University?",
        "What is his experience in US IT recruiting?",
        "Can I download his resume?"
      ],
      actionLink: { label: "View Education Credentials", href: "/education" }
    };
  }

  if (q.includes("resume") || q.includes("cv") || q.includes("download") || q.includes("pdf")) {
    return {
      response: `Albert's full resume and granular skills inventory are private platform assets reserved for verified recruiter inquiries. You can request an official, ATS-optimized copy directly via WhatsApp (+91 9910705796) or email (${masterProfile.personal.email}).`,
      suggestions: [
        "Request resume on WhatsApp",
        `Email ${masterProfile.personal.email}`,
        "Explore Verified Experience",
        "View Software Projects"
      ],
      actionLink: { 
        label: "Request Resume via WhatsApp", 
        href: "https://wa.me/919910705796?text=Hi%20Albert,%20I%20am%20a%20recruiter%20and%20would%20like%20to%20request%20your%20verified%20resume." 
      }
    };
  }

  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("interview") || q.includes("hire") || q.includes("schedule") || q.includes("reach") || q.includes("whatsapp")) {
    return {
      response: `You can reach Albert directly at his verified professional email: ${masterProfile.personal.email} (all inquiries route directly to him). You can also connect via WhatsApp or phone at ${masterProfile.personal.phone}, or explore his professional profiles on LinkedIn (${masterProfile.personal.linkedin}) and GitHub (${masterProfile.personal.github}). He is located in Delhi, India, and coordinates flexible hours including US Eastern Standard Time (EST) shifts.`,
      suggestions: [
        `Send email to ${masterProfile.personal.email}`,
        "Chat with Albert on WhatsApp",
        "View LinkedIn profile",
        "Download verified resume"
      ],
      actionLink: { label: `Email ${masterProfile.personal.email}`, href: `mailto:${masterProfile.personal.email}` }
    };
  }

  if (q.includes("lead") || q.includes("event") || q.includes("club") || q.includes("peer educator")) {
    return {
      response: "Albert holds 14 verified leadership records, including Overall Event Management Head for the School of Sciences Corporate Club at Christ University, Advanced Peer Educator with CCHS, and Event Head at St. Columba's School.",
      suggestions: [
        "View full leadership portfolio",
        "What software projects has he built?",
        "Contact Albert"
      ],
      actionLink: { label: "Explore Leadership Portfolio", href: "/leadership" }
    };
  }

  // Default welcoming response
  return {
    response: "Hello! I am Albert Linson's AI Digital Twin. I can answer questions about his US IT recruitment experience at Innova Solutions, his frontend and software engineering projects (AURIVA, CINEMATRIX, JARVIS), his MCA degree at Christ University, or help you schedule an interview. What would you like to know?",
    suggestions: [
      "Tell me about his US IT recruiting track record",
      "What software projects has he built?",
      "What are his academic research papers?",
      "How do I contact or interview Albert?"
    ],
    actionLink: { label: "Explore Portfolio", href: "/projects" }
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body.message || "").trim();

    if (!message) {
      return NextResponse.json({
        response: "Hello! How can I assist you with Albert's professional profile, skills, or portfolio today?",
        suggestions: [
          "Tell me about your US IT recruiting experience",
          "What software projects have you built?",
          "Can I download your resume?",
          "Schedule an interview"
        ]
      }, { status: 200 });
    }

    // Attempt OpenRouter AI generation if API key is present
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      try {
        const systemPrompt = `You are the official AI Digital Twin and avatar representative of Albert Kalampadan Linson on his portfolio website.
Speak professionally, enthusiastically, and concisely (2-4 sentences max). Always be helpful to recruiters and visitors.
Key verified facts about Albert:
- Full Legal Name: Albert Kalampadan Linson (Professional Identity: Albert Linson K)
- Current Role: US IT Recruiter at Innova Solutions (Dec 2025–Present), managing end-to-end technical staffing, candidate screening, ATS pipeline sourcing, and client hiring coordination.
- Other Experience: IT Manager at Herbal Energy (Oct 2025–Nov 2025), Business Development Executive at Algospark Technologies (Aug 2025–Oct 2025), Frontend Developer & UI/UX Designer Intern at Municipal Corporation of Delhi (May 2024–Apr 2025).
- Education: Pursuing Master of Computer Applications (MCA, 2024–2026) at CHRIST (Deemed to be University), Delhi NCR; Bachelor of Computer Applications (BCA, 2021–2024) at Christ University.
- Core Engineering Skills: React, Next.js, TypeScript, Python, FastAPI, Tailwind CSS, Cloudflare Workers, Git, Linux.
- Key Software Projects: AURIVA, CINEMATRIX, JARVIS Desktop Agent, Lunova OS, FunBot, SpeechoBot.
- Academic Research: 2 papers (AEGIS-Test software testing framework, and BioWavelet-Net Ultrasound breast cancer classification).
- Verified Professional Contact: Professional Email: hello@albert.does.software | Phone/WhatsApp: +91 9910705796 | Delhi, India | LinkedIn: https://www.linkedin.com/in/albert-linson-k-63792b23a/ | GitHub: https://github.com/albykl123.
Never hallucinate or claim unverified facts. If asked for an interview or contact, always provide hello@albert.does.software or WhatsApp at +91 9910705796. Never reveal private personal forwarding addresses.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://albert-linson-platform.albertkalampadan.workers.dev",
            "X-Title": "Albert Linson AI Avatar Copilot",
          },
          body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL || "openrouter/free",
            messages: [
              { role: "system", content: systemPrompt },
              ...(body.history || []).slice(-4),
              { role: "user", content: message }
            ],
            temperature: 0.3,
            max_tokens: 180,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            const fallback = getDeterministicResponse(message);
            return NextResponse.json({
              response: reply,
              suggestions: fallback.suggestions,
              actionLink: fallback.actionLink
            }, { status: 200 });
          }
        }
      } catch (e) {
        // Fall through to deterministic engine
      }
    }

    // Deterministic fallback response with 100% accuracy
    const fallback = getDeterministicResponse(message);
    return NextResponse.json(fallback, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      response: "I am ready to help. You can ask me about Albert's US IT recruiting background, software engineering projects, or how to contact him.",
      suggestions: [
        "Tell me about your US IT recruiting experience",
        "What software projects have you built?",
        "Can I download your resume?"
      ]
    }, { status: 200 });
  }
}
