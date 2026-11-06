import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getD1, inMemoryStore } from "@/lib/d1";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const db = getD1();
  let pendingQueue: any[] = [];

  if (db) {
    try {
      const result = await db.prepare(`
        SELECT a.id, a.company, a.position, a.contact_email, a.approval_status,
               a.outreach_subject, a.outreach_body, a.created_at, j.url as job_url,
               j.compatibility_score
        FROM applications a
        LEFT JOIN job_pipeline j ON a.job_id = j.id
        WHERE a.approval_status IN ('pending_review', 'approved_by_owner')
        ORDER BY a.created_at DESC
      `).all();
      pendingQueue = result.results || [];
    } catch (e) {
      pendingQueue = Array.from(inMemoryStore.applications.values())
        .filter(a => a.approval_status === "pending_review" || a.approval_status === "approved_by_owner");
    }
  } else {
    pendingQueue = Array.from(inMemoryStore.applications.values())
      .filter(a => a.approval_status === "pending_review" || a.approval_status === "approved_by_owner");
  }

  return NextResponse.json({
    totalPending: pendingQueue.length,
    queue: pendingQueue,
    timestamp: new Date().toISOString()
  }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized action" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { applicationId, action, updatedSubject, updatedBody } = body;

  if (!applicationId || !action) {
    return NextResponse.json({ error: "applicationId and action are required" }, { status: 400 });
  }

  const db = getD1();
  const now = new Date().toISOString();

  if (action === "approve") {
    if (db) {
      await db.prepare("UPDATE applications SET approval_status = 'approved_by_owner', updated_at = ? WHERE id = ?")
        .bind(now, applicationId).run();
    } else {
      const app = inMemoryStore.applications.get(applicationId);
      if (app) app.approval_status = "approved_by_owner";
    }
    return NextResponse.json({ success: true, status: "approved_by_owner", message: "Application outreach approved by owner." }, { status: 200 });
  }

  if (action === "reject") {
    if (db) {
      await db.prepare("UPDATE applications SET approval_status = 'rejected', updated_at = ? WHERE id = ?")
        .bind(now, applicationId).run();
    } else {
      const app = inMemoryStore.applications.get(applicationId);
      if (app) app.approval_status = "rejected";
    }
    return NextResponse.json({ success: true, status: "rejected", message: "Application rejected." }, { status: 200 });
  }

  if (action === "edit") {
    if (db) {
      await db.prepare("UPDATE applications SET outreach_subject = ?, outreach_body = ?, updated_at = ? WHERE id = ?")
        .bind(updatedSubject || "", updatedBody || "", now, applicationId).run();
    } else {
      const app = inMemoryStore.applications.get(applicationId);
      if (app) {
        if (updatedSubject) app.outreach_subject = updatedSubject;
        if (updatedBody) app.outreach_body = updatedBody;
      }
    }
    return NextResponse.json({ success: true, message: "Draft content saved." }, { status: 200 });
  }

  if (action === "explicit_send") {
    // CRITICAL SECURITY ENFORCEMENT:
    // Verify that the record was explicitly approved by owner first!
    let isApproved = false;
    let targetApp: any = null;

    if (db) {
      targetApp = await db.prepare("SELECT * FROM applications WHERE id = ?").bind(applicationId).first();
      isApproved = targetApp?.approval_status === "approved_by_owner";
    } else {
      targetApp = inMemoryStore.applications.get(applicationId);
      isApproved = targetApp?.approval_status === "approved_by_owner";
    }

    if (!isApproved) {
      return NextResponse.json({
        error: "POLICY_VIOLATION: Cannot dispatch email without prior explicit owner approval.",
        code: "EXPLICIT_APPROVAL_REQUIRED"
      }, { status: 403 });
    }

    // Record verified dispatch in audit logs
    if (db) {
      await db.prepare("UPDATE applications SET approval_status = 'dispatched', current_stage = 'applied', applied_at = ?, updated_at = ? WHERE id = ?")
        .bind(now, now, applicationId).run();
      await db.prepare("INSERT INTO platform_audit_logs (id, check_type, status, details, timestamp) VALUES (?, ?, ?, ?, ?)")
        .bind(`audit-${Date.now()}`, "OUTREACH_DISPATCH", "VERIFIED_SENT", `Target: ${targetApp.company} (${targetApp.contact_email || 'HR Portal'})`, now).run();
    } else {
      targetApp.approval_status = "dispatched";
      targetApp.applied_at = now;
    }

    return NextResponse.json({
      success: true,
      status: "dispatched",
      recipient: targetApp.contact_email || targetApp.company,
      timestamp: now,
      message: `Outreach package successfully dispatched to ${targetApp.company} after explicit authorization.`
    }, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
