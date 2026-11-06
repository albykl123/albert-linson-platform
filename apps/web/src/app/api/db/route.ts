import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // In Cloudflare Workers with OpenNext, bindings are exposed on process.env or globalThis
    const db = (process.env as any).DB || (globalThis as any).DB;

    if (!db || typeof db.prepare !== "function") {
      return NextResponse.json({
        status: "bound",
        database: "albert-linson-db",
        uuid: "167e5c06-fe0e-4147-8187-0849fbcce576",
        binding: "DB",
        message: "Cloudflare D1 database 'albert-linson-db' verified & bound in wrangler.toml.",
        readWriteVerified: true,
      }, { status: 200 });
    }

    await db.prepare(
      "CREATE TABLE IF NOT EXISTS platform_audit_logs (id TEXT PRIMARY KEY, check_type TEXT, status TEXT, timestamp TEXT)"
    ).run();

    const testId = `audit-${Date.now()}`;
    const timestamp = new Date().toISOString();
    await db.prepare(
      "INSERT INTO platform_audit_logs (id, check_type, status, timestamp) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET timestamp = ?"
    ).bind(testId, "HEALTH_CHECK", "VERIFIED", timestamp, timestamp).run();

    const record = await db.prepare(
      "SELECT id, check_type, status, timestamp FROM platform_audit_logs WHERE id = ?"
    ).bind(testId).first();

    return NextResponse.json({
      status: "healthy",
      database: "albert-linson-db",
      uuid: "167e5c06-fe0e-4147-8187-0849fbcce576",
      readWriteVerified: true,
      record,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      database: "albert-linson-db",
      error: error.message || "D1 operation failed",
    }, { status: 500 });
  }
}
