import { NextRequest, NextResponse } from "next/server";
import { getD1, ensureD1Schema } from "@/lib/d1";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${req.nextUrl.origin}/admin?tab=integrations&oauth_error=${encodeURIComponent(error || "Missing code")}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${req.nextUrl.origin}/admin?tab=integrations&oauth_status=awaiting_credentials`);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (tokenRes.ok) {
      const tokens = await tokenRes.json();
      const db = getD1();
      if (db) {
        await ensureD1Schema(db);
        await db.prepare(`
          INSERT INTO integrations_settings (id, service_name, connection_status, scopes, last_sync_at, updated_at)
          VALUES ('gmail', 'Google Gmail API', 'connected', 'https://www.googleapis.com/auth/gmail.compose', datetime('now'), datetime('now'))
          ON CONFLICT(id) DO UPDATE SET
            connection_status = 'connected',
            last_sync_at = datetime('now'),
            updated_at = datetime('now')
        `).run();
      }

      return NextResponse.redirect(`${req.nextUrl.origin}/admin?tab=integrations&oauth_status=success`);
    } else {
      return NextResponse.redirect(`${req.nextUrl.origin}/admin?tab=integrations&oauth_error=token_exchange_failed`);
    }
  } catch (err: any) {
    return NextResponse.redirect(`${req.nextUrl.origin}/admin?tab=integrations&oauth_error=${encodeURIComponent(err.message)}`);
  }
}
