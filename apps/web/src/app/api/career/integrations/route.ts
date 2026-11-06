import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getD1, inMemoryStore, ensureD1Schema } from "@/lib/d1";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const hasOpenRouterKey = !!process.env.OPENROUTER_API_KEY;
  const hasGmailClient = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
  const hasD1 = !!getD1();

  const integrations = [
    {
      id: "gmail",
      serviceName: "Google Gmail API",
      connectionStatus: hasGmailClient ? "connected" : "awaiting_credentials",
      scopes: "https://www.googleapis.com/auth/gmail.compose",
      description: "Direct email draft creation and approved outreach dispatch via albertkalampadan@gmail.com.",
      requiredEnvVars: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
      lastSyncAt: new Date().toISOString(),
      notes: hasGmailClient ? "Active OAuth credentials bound." : "Awaiting Google Cloud Console OAuth Client ID & Secret configuration."
    },
    {
      id: "openrouter",
      serviceName: "OpenRouter AI Multi-Model Gateway",
      connectionStatus: hasOpenRouterKey ? "connected" : "standby_free",
      scopes: "chat/completions (openrouter/free, gemini-2.0-flash)",
      description: "Server-side zero-leak AI inference for ATS bullet tailoring and Digital Twin reasoning.",
      requiredEnvVars: ["OPENROUTER_API_KEY"],
      lastSyncAt: new Date().toISOString(),
      notes: "Bound in Cloudflare Worker secrets. 100% free-tier zero cost cascade."
    },
    {
      id: "d1",
      serviceName: "Cloudflare D1 SQLite Database",
      connectionStatus: hasD1 ? "connected" : "configured",
      scopes: "DB (albert-linson-db)",
      description: "Serverless relational data persistence at the edge (167e5c06-fe0e-4147-8187-0849fbcce576).",
      requiredEnvVars: ["DB"],
      lastSyncAt: new Date().toISOString(),
      notes: "5 GB free storage, 5M reads/day allocation."
    },
    {
      id: "remoteok",
      serviceName: "RemoteOK & Remotive Job Feed Adapters",
      connectionStatus: "connected",
      scopes: "Public Job Requisitions Ingest",
      description: "Continuous semantic job harvesting for US IT Recruiting and Software Development positions.",
      requiredEnvVars: [],
      lastSyncAt: new Date().toISOString(),
      notes: "Operating within public rate limits and robots.txt terms."
    },
    {
      id: "r2",
      serviceName: "Cloudflare R2 Object Storage",
      connectionStatus: "standby",
      scopes: "albert-linson-resumes",
      description: "Persistent storage for compiled PDF and DOCX resume artifacts.",
      requiredEnvVars: ["RESUME_STORAGE"],
      lastSyncAt: null,
      notes: "On standby. Client-side vector PDF and ATS plaintext generation operate 100% independently."
    }
  ];

  return NextResponse.json({
    totalIntegrations: integrations.length,
    integrations,
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
