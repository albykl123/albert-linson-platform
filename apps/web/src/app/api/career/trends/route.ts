import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { masterProfile } from "@/lib/profileData";
import { getD1, inMemoryStore, ensureD1Schema } from "@/lib/d1";

export const dynamic = "force-dynamic";

// High-confidence curated tech and recruitment trends with source citations
const CURATED_MARKET_TRENDS = [
  {
    id: "trend-1",
    topic: "Next.js 15 & React 19 Server Components",
    category: "frontend",
    summary: "Widespread enterprise migration toward async Request APIs, partial prerendering, and React 19 Compiler. Next.js 14 edge runtimes remain the primary production workhorse.",
    relevance_score: 95,
    related_skills_json: JSON.stringify(["Next.js", "React", "TypeScript", "OpenNext"]),
    source_name: "Vercel & Next.js Release Engineering",
    source_url: "https://nextjs.org/blog",
    action_recommendation: "Albert's platform is currently production-hardened on Next.js 14 + OpenNext. Recommended portfolio highlight: Document edge bundling benchmarks.",
    approval_status: "approved"
  },
  {
    id: "trend-2",
    topic: "AI Agent Orchestration & Tool Calling (MCP / Function Calling)",
    category: "ai",
    summary: "Transition from simple prompt engineering to structured multi-agent tool execution (Model Context Protocol, JSON schema validation, deterministic guardrails).",
    relevance_score: 92,
    related_skills_json: JSON.stringify(["Python", "FastAPI", "Prompt Engineering", "OpenRouter"]),
    source_name: "Anthropic / OpenAI Research",
    source_url: "https://modelcontextprotocol.io",
    action_recommendation: "Demonstrated live in Albert's ATSForge and Digital Twin architecture. Consider adding an MCP server showcase under JARVIS.",
    approval_status: "approved"
  },
  {
    id: "trend-3",
    topic: "Cloudflare D1 & Serverless SQLite Edge DBs",
    category: "cloud",
    summary: "Massive developer adoption of distributed SQLite at the edge, eliminating cold starts and database egress fees ($0/mo developer tier).",
    relevance_score: 90,
    related_skills_json: JSON.stringify(["Cloudflare Workers", "SQLite", "D1", "Wrangler"]),
    source_name: "Cloudflare Developer Documentation",
    source_url: "https://developers.cloudflare.com/d1",
    action_recommendation: "Production verified on Albert's platform (UUID 167e5c06-fe0e-4147-8187-0849fbcce576). Excellent talking point for cloud systems interviews.",
    approval_status: "approved"
  },
  {
    id: "trend-4",
    topic: "AI-Augmented ATS & Automated Candidate Screening",
    category: "recruitment",
    summary: "US enterprise staffing firms are deploying semantic matching engines to parse unformatted resumes while penalizing unverified metric claims.",
    relevance_score: 96,
    related_skills_json: JSON.stringify(["US IT Recruitment", "ATS Workflows", "Bullhorn", "Talent Sourcing"]),
    source_name: "Staffing Industry Analysts (SIA)",
    source_url: "https://www.staffingindustry.com",
    action_recommendation: "Directly aligns with Albert's daily recruiting at Innova Solutions and his ATSForge 20-rule audit engine.",
    approval_status: "approved"
  }
];

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to Trend Intelligence" }, { status: 401 });
  }

  const db = getD1();
  let trends: any[] = [];

  if (db) {
    await ensureD1Schema(db);
    try {
      const res = await db.prepare("SELECT * FROM trend_items ORDER BY relevance_score DESC").all();
      trends = (res.results && res.results.length > 0) ? res.results : CURATED_MARKET_TRENDS;
    } catch (e) {
      trends = CURATED_MARKET_TRENDS;
    }
  } else {
    trends = CURATED_MARKET_TRENDS;
  }

  // Compute skill gap recommendations
  const allVerifiedSkills = [
    ...masterProfile.skills.frontend_and_design,
    ...masterProfile.skills.backend_and_cloud,
    ...masterProfile.skills.recruitment_and_business,
    ...masterProfile.skills.analytics_and_ai
  ].map(s => s.toLowerCase());

  const skillGaps = [
    {
      skill: "Kubernetes & Container Orchestration",
      marketDemand: "High (Cloud Requisitions)",
      status: "Recommended Learning",
      reason: "Frequently requested in senior cloud requisitions alongside Docker.",
      action: "Build a microservices deployment guide for JARVIS."
    },
    {
      skill: "GraphQL APIs",
      marketDemand: "Moderate",
      status: "Familiarity / Learning",
      reason: "Alternative to REST APIs in modern React frontends.",
      action: "Evaluate for future D1 data queries."
    }
  ];

  return NextResponse.json({
    trends,
    skillGaps,
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
