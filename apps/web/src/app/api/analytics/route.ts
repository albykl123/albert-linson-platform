import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getD1, inMemoryStore, ensureD1Schema } from "@/lib/d1";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pagePath = body.pagePath || "/";
    const interactionType = body.interactionType || "page_view";
    const referrer = (body.referrer || req.headers.get("referer") || "").slice(0, 255);
    const userAgent = req.headers.get("user-agent") || "";
    
    // Privacy-preserving device categorization without tracking individual identity
    let deviceCategory = "desktop";
    if (/mobile/i.test(userAgent)) deviceCategory = "mobile";
    else if (/tablet|ipad/i.test(userAgent)) deviceCategory = "tablet";

    const timestamp = new Date().toISOString();
    const eventId = `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const db = getD1();
    if (db) {
      await ensureD1Schema(db);
      await db.prepare(`
        INSERT INTO recruiter_analytics (id, page_path, interaction_type, referrer, device_category, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(eventId, pagePath, interactionType, referrer || null, deviceCategory, timestamp).run();
    } else {
      inMemoryStore.analytics.push({
        id: eventId,
        page_path: pagePath,
        interaction_type: interactionType,
        referrer: referrer || null,
        device_category: deviceCategory,
        timestamp
      });
      if (inMemoryStore.analytics.length > 500) inMemoryStore.analytics.shift();
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false }, { status: 200 }); // Fail silently for telemetry
  }
}

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized access to Recruiter Analytics" }, { status: 401 });
  }

  const db = getD1();
  let events: any[] = [];

  if (db) {
    await ensureD1Schema(db);
    try {
      const res = await db.prepare("SELECT * FROM recruiter_analytics ORDER BY timestamp DESC LIMIT 200").all();
      events = res.results || [];
    } catch (e) {
      events = inMemoryStore.analytics;
    }
  } else {
    events = inMemoryStore.analytics;
  }

  // Aggregate summaries
  const totalEvents = events.length;
  const pageViews: Record<string, number> = {};
  const interactions: Record<string, number> = {};
  const devices: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };

  for (const ev of events) {
    pageViews[ev.page_path] = (pageViews[ev.page_path] || 0) + 1;
    interactions[ev.interaction_type] = (interactions[ev.interaction_type] || 0) + 1;
    if (devices[ev.device_category] !== undefined) {
      devices[ev.device_category]++;
    }
  }

  return NextResponse.json({
    totalEvents,
    pageViews,
    interactions,
    devices,
    recentEvents: events.slice(0, 30),
    timestamp: new Date().toISOString()
  }, { status: 200 });
}
