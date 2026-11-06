import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getD1, inMemoryStore, ensureD1Schema } from "@/lib/d1";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to Career Pipeline" }, { status: 401 });
  }

  const db = getD1();
  let jobs: any[] = [];
  let applications: any[] = [];
  let preferences: any = inMemoryStore.preferences;

  if (db) {
    await ensureD1Schema(db);
    try {
      const jobsResult = await db.prepare("SELECT * FROM job_pipeline ORDER BY compatibility_score DESC LIMIT 50").all();
      jobs = jobsResult.results || [];

      const appsResult = await db.prepare("SELECT * FROM applications ORDER BY created_at DESC LIMIT 50").all();
      applications = appsResult.results || [];

      const prefResult = await db.prepare("SELECT * FROM career_preferences WHERE id = 'default'").first();
      if (prefResult) preferences = prefResult;
    } catch (e) {
      // Fallback
      jobs = Array.from(inMemoryStore.jobs.values());
      applications = Array.from(inMemoryStore.applications.values());
    }
  } else {
    jobs = Array.from(inMemoryStore.jobs.values());
    applications = Array.from(inMemoryStore.applications.values());
  }

  // Calculate real-time pipeline metrics
  const metrics = {
    totalDiscovered: jobs.length,
    highMatchCount: jobs.filter(j => (j.compatibility_score || j.compatibilityScore) >= 75).length,
    applicationsInProgress: applications.filter(a => a.approval_status !== "rejected" && a.current_stage !== "closed").length,
    interviewsScheduled: applications.filter(a => a.current_stage === "interview_scheduled").length,
    offersReceived: applications.filter(a => a.current_stage === "offer_received").length,
    awaitingApproval: applications.filter(a => a.approval_status === "pending_review").length,
  };

  return NextResponse.json({
    metrics,
    jobs,
    applications,
    preferences,
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: { "Cache-Control": "private, no-cache, no-store" }
  });
}

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body.action || "update_status";
  const now = new Date().toISOString();
  const db = getD1();

  if (action === "update_job_status") {
    const { jobId, status } = body;
    if (!jobId || !status) {
      return NextResponse.json({ error: "jobId and status are required" }, { status: 400 });
    }

    if (db) {
      await db.prepare("UPDATE job_pipeline SET status = ?, updated_at = ? WHERE id = ?")
        .bind(status, now, jobId)
        .run();
    } else {
      const existing = inMemoryStore.jobs.get(jobId);
      if (existing) {
        existing.status = status;
        existing.updated_at = now;
      }
    }

    return NextResponse.json({ success: true, jobId, status }, { status: 200 });
  }

  if (action === "create_application") {
    const { jobId, company, position, contactEmail, resumeVersionId, coverLetter, outreachSubject, outreachBody } = body;
    const appId = `app-${Date.now()}`;

    if (db) {
      await db.prepare(`
        INSERT INTO applications (
          id, job_id, company, position, contact_email, resume_version_id,
          cover_letter, outreach_subject, outreach_body, approval_status,
          current_stage, applied_at, follow_up_date, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        appId,
        jobId || null,
        company || "Target Enterprise",
        position || "Technical Role",
        contactEmail || null,
        resumeVersionId || "master_v1",
        coverLetter || "",
        outreachSubject || "",
        outreachBody || "",
        "pending_review",
        "applied",
        now,
        null,
        "Created via AI Career Studio",
        now,
        now
      ).run();
    } else {
      inMemoryStore.applications.set(appId, {
        id: appId,
        job_id: jobId,
        company,
        position,
        contact_email: contactEmail,
        resume_version_id: resumeVersionId,
        cover_letter: coverLetter,
        outreach_subject: outreachSubject,
        outreach_body: outreachBody,
        approval_status: "pending_review",
        current_stage: "applied",
        applied_at: now,
        created_at: now,
        updated_at: now
      });
    }

    return NextResponse.json({ success: true, application: { id: appId, company, position, status: "pending_review" } }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
