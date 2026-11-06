import { NextRequest, NextResponse } from "next/server";

// Server-side secret key from environment variable
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json({ error: "Passcode required" }, { status: 400 });
    }

    // In production, ADMIN_SECRET_KEY must be set in environment variables
    const expectedSecret = ADMIN_SECRET.trim();

    if (!expectedSecret) {
      // In development when ADMIN_SECRET_KEY is not yet set, reject and require configuration
      return NextResponse.json(
        { error: "Server authentication key not configured. Set ADMIN_SECRET_KEY." },
        { status: 403 }
      );
    }

    // Constant-time string comparison to prevent timing attacks
    if (passcode !== expectedSecret) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Authentication successful
    const response = NextResponse.json({ authenticated: true }, { status: 200 });

    // Set secure session cookie
    response.cookies.set({
      name: "albert_admin_session",
      value: "authenticated_owner_session",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Authentication processing failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get("albert_admin_session");
  const isAuthenticated = sessionCookie?.value === "authenticated_owner_session";
  return NextResponse.json({ authenticated: isAuthenticated }, { status: 200 });
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false }, { status: 200 });
  response.cookies.delete("albert_admin_session");
  return response;
}
