import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Server-side secret key from environment variable
const ADMIN_SECRET = (process.env.ADMIN_SECRET_KEY || "").trim();

async function generateSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret + ":albert-platform-session-salt-v3");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json({ error: "Passcode required" }, { status: 400 });
    }

    if (!ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Server authentication key not configured. Set ADMIN_SECRET_KEY." },
        { status: 403 }
      );
    }

    const inputPasscode = passcode.trim();

    // Constant-time length and value check to prevent timing attacks
    if (inputPasscode.length !== ADMIN_SECRET.length || inputPasscode !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Authentication successful
    const response = NextResponse.json({ authenticated: true }, { status: 200 });
    const sessionToken = await generateSessionToken(ADMIN_SECRET);

    // Set secure, tamper-proof session cookie (invalidates all v1/v2 sessions)
    response.cookies.set({
      name: "albert_admin_session_v3",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Authentication processing failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("albert_admin_session_v3");
  if (!sessionCookie || !sessionCookie.value || !ADMIN_SECRET) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const expectedToken = await generateSessionToken(ADMIN_SECRET);
  const isAuthenticated = sessionCookie.value === expectedToken;
  return NextResponse.json({ authenticated: isAuthenticated }, { status: 200 });
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false }, { status: 200 });
  response.cookies.delete("albert_admin_session_v3");
  response.cookies.delete("albert_admin_session");
  return response;
}
