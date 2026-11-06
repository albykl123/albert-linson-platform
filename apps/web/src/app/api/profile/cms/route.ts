import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { masterProfile } from "@/lib/profileData";
import { getD1, inMemoryStore, ensureD1Schema } from "@/lib/d1";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to Profile CMS" }, { status: 401 });
  }

  const db = getD1();
  let customRecords: any[] = [];

  if (db) {
    await ensureD1Schema(db);
    try {
      const res = await db.prepare("SELECT * FROM profile_records ORDER BY updated_at DESC").all();
      customRecords = res.results || [];
    } catch (e) {
      // Fallback
    }
  }

  return NextResponse.json({
    baseProfile: masterProfile,
    customRecords,
    allowedSections: [
      "personal",
      "summary",
      "skills",
      "experience",
      "education",
      "research",
      "leadership",
      "projects"
    ],
    timestamp: new Date().toISOString()
  }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { section, recordKey, title, data, status, sourceEvidence } = body;

  if (!section || !recordKey || !title || !data) {
    return NextResponse.json({ error: "section, recordKey, title, and data are required" }, { status: 400 });
  }

  // HARD FACTUALITY GUARD: Research papers must strictly equal exactly two!
  if (section === "research") {
    if (Array.isArray(data) && data.length !== 2) {
      return NextResponse.json({
        error: "FACTUALITY_VIOLATION: Research portfolio must contain strictly exactly two verified papers (AEGIS-Test and Breast Cancer Ultrasound). All other works belong under Projects.",
        code: "EXACTLY_TWO_RESEARCH_PAPERS_REQUIRED"
      }, { status: 422 });
    }
  }

  const db = getD1();
  const now = new Date().toISOString();
  const recordId = `rec-${section}-${recordKey}`;

  if (db) {
    await ensureD1Schema(db);
    await db.prepare(`
      INSERT INTO profile_records (
        id, section, record_key, title, data_json, source_evidence,
        publishing_status, version, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        data_json = excluded.data_json,
        source_evidence = excluded.source_evidence,
        publishing_status = excluded.publishing_status,
        version = version + 1,
        updated_at = excluded.updated_at
    `).bind(
      recordId,
      section,
      recordKey,
      title,
      JSON.stringify(data),
      sourceEvidence || "Verified Owner Submission",
      status || "published",
      now,
      now
    ).run();

    // Insert revision audit record
    await db.prepare(`
      INSERT INTO profile_revisions (
        id, record_id, changed_by, new_data_json, change_summary, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      `rev-${Date.now()}`,
      recordId,
      "owner",
      JSON.stringify(data),
      `Updated ${section}:${title} to ${status || 'published'}`,
      now
    ).run();
  }

  return NextResponse.json({
    success: true,
    recordId,
    section,
    title,
    publishingStatus: status || "published",
    message: "Profile record updated and synchronized across platform."
  }, { status: 200 });
}
