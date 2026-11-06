import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json({
      status: "awaiting_credentials",
      message: "Google OAuth credentials not configured in environment.",
      instructions: "To authorize Gmail draft composition, create an OAuth 2.0 Client in Google Cloud Console with scope 'https://www.googleapis.com/auth/gmail.compose' and set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Cloudflare Worker secrets.",
      configuredEmail: "albertkalampadan@gmail.com",
      targetScope: "https://www.googleapis.com/auth/gmail.compose"
    }, { status: 200 });
  }

  const scope = encodeURIComponent("https://www.googleapis.com/auth/gmail.compose");
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
