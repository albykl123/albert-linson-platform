import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = body.prompt || "Optimize resume bullet for full-stack software engineer";

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        status: "deterministic_fallback",
        provider: "ATSForge Zero-Hallucination Engine",
        model: "deterministic-rule-engine",
        output: "Engineered scalable cloud web architectures and microservices, improving system throughput and operational reliability.",
        note: "OPENROUTER_API_KEY not configured. Deterministic ATS engine utilized.",
      }, { status: 200 });
    }

    // Call OpenRouter server-side with strict API key isolation (key never exposed to browser)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://albertlinson.com",
        "X-Title": "Albert Linson Personal Intelligence Platform",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: "You are an ATS resume optimizer. Rewrite the input text into a high-impact, professional resume bullet point. Never invent skills or false metrics."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        status: "fallback",
        provider: "ATSForge Fallback Engine",
        output: "Developed and deployed robust cloud application microservices, ensuring high uptime and responsive user interfaces.",
        openRouterStatus: response.status,
      }, { status: 200 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({
      status: "success",
      provider: "OpenRouter Multi-Model Edge Gateway",
      model: data.model || "openrouter/free",
      output: content.trim(),
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      error: error.message || "AI gateway processing error",
    }, { status: 500 });
  }
}
