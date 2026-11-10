import { NextRequest, NextResponse } from "next/server";
import { getD1, inMemoryStore, ensureD1Schema } from "@/lib/d1";

export const dynamic = "force-dynamic";

/**
 * Idempotent Renewal Lifecycle Monitor & Cron Handler
 * ====================================================
 * Runs periodically (e.g. daily at 09:00 UTC via Cloudflare Cron Trigger).
 * Monitors 45-day lease expiry, enforces 7-day and 1-day warnings,
 * tracks 3-day grace period, and records audit events without duplication.
 */
export async function GET(req: NextRequest) {
  return handleRenewalCheck(req);
}

export async function POST(req: NextRequest) {
  return handleRenewalCheck(req);
}

async function handleRenewalCheck(req: NextRequest) {
  // Optional security check: authorization token if configured
  const authHeader = req.headers.get("Authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
  }

  const db = getD1();
  await ensureD1Schema(db);

  const now = new Date();
  let renewalRecord: any = inMemoryStore.emailRenewal;

  if (db) {
    try {
      const existing = await db.prepare("SELECT * FROM email_renewal_schedule WHERE id = 'active_lease'").first();
      if (existing) {
        renewalRecord = existing;
      } else {
        // Initialize active lease record
        const expiresAt = new Date(now.getTime() + 45 * 86400 * 1000).toISOString();
        await db.prepare(
          "INSERT OR IGNORE INTO email_renewal_schedule (id, subdomain, lease_duration_days, lease_start_at, lease_expires_at, reminder_7d_triggered, reminder_1d_triggered, renewal_status, updated_at) VALUES ('active_lease', 'albert', 45, ?, ?, 0, 0, 'active', ?)"
        ).bind(now.toISOString(), expiresAt, now.toISOString()).run();
        renewalRecord = await db.prepare("SELECT * FROM email_renewal_schedule WHERE id = 'active_lease'").first();
      }
    } catch (err) {
      console.warn("D1 query notice, using in-memory renewal store:", err);
    }
  }

  const leaseExpires = new Date(renewalRecord?.lease_expires_at || now.getTime() + 45 * 86400 * 1000);
  const diffMs = leaseExpires.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let triggered7d = renewalRecord?.reminder_7d_triggered === 1;
  let triggered1d = renewalRecord?.reminder_1d_triggered === 1;
  let newStatus = renewalRecord?.renewal_status || "active";
  const actionsTaken: string[] = [];

  // 1. Evaluate 7-day reminder
  if (diffDays <= 7 && diffDays > 1 && !triggered7d) {
    triggered7d = true;
    actionsTaken.push("7_DAY_RENEWAL_WARNING_TRIGGERED");
    await logAuditEvent(db, "RENEWAL_REMINDER_7D", {
      subdomain: "albert.does.software",
      days_remaining: diffDays,
      lease_expires_at: leaseExpires.toISOString(),
      action: "Please execute 1-click renewal before lease expiration."
    });
  }

  // 2. Evaluate 1-day urgent reminder
  if (diffDays <= 1 && diffDays > 0 && !triggered1d) {
    triggered1d = true;
    actionsTaken.push("1_DAY_URGENT_RENEWAL_WARNING_TRIGGERED");
    await logAuditEvent(db, "RENEWAL_REMINDER_1D", {
      subdomain: "albert.does.software",
      days_remaining: diffDays,
      lease_expires_at: leaseExpires.toISOString(),
      action: "URGENT: Subdomain lease expires tomorrow. 1-click renewal required."
    });
  }

  // 3. Grace period evaluation (3 days after expiry)
  if (diffDays <= 0 && diffDays >= -3) {
    newStatus = "grace_period";
    actionsTaken.push("ENTERED_GRACE_PERIOD");
    await logAuditEvent(db, "LEASE_GRACE_PERIOD", {
      subdomain: "albert.does.software",
      days_past_expiry: Math.abs(diffDays),
      grace_period_days_left: 3 - Math.abs(diffDays)
    });
  } else if (diffDays < -3) {
    newStatus = "expired";
    actionsTaken.push("LEASE_EXPIRED");
  }

  // Persist updated reminder flags and status in D1
  if (db && actionsTaken.length > 0) {
    try {
      await db.prepare(
        "UPDATE email_renewal_schedule SET reminder_7d_triggered = ?, reminder_1d_triggered = ?, renewal_status = ?, updated_at = ? WHERE id = 'active_lease'"
      ).bind(triggered7d ? 1 : 0, triggered1d ? 1 : 0, newStatus, now.toISOString()).run();
    } catch (err) {
      console.warn("Failed to update renewal schedule in D1:", err);
    }
  }

  return NextResponse.json({
    success: true,
    subdomain: "albert.does.software",
    days_remaining: diffDays,
    status: newStatus,
    reminder_7d_triggered: triggered7d,
    reminder_1d_triggered: triggered1d,
    actions_taken: actionsTaken,
    checked_at: now.toISOString()
  });
}

async function logAuditEvent(db: any, eventType: string, details: any) {
  const eventId = `cron_audit_${Date.now()}`;
  const nowIso = new Date().toISOString();
  if (db) {
    try {
      await db.prepare(
        "INSERT INTO email_audit_events (id, event_type, details_json, actor, timestamp) VALUES (?, ?, ?, 'cron_daemon', ?)"
      ).bind(eventId, eventType, JSON.stringify(details), nowIso).run();
    } catch {}
  }
}
