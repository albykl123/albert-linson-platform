import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Dynamic resolver for server-side master authentication secret
function getAdminSecret(): string {
  const secret = (
    process.env.ADMIN_SECRET_KEY ||
    (globalThis as any).ADMIN_SECRET_KEY ||
    (process.env as any).ADMIN_SECRET ||
    ""
  ).trim();
  return secret;
}

// Constant-time comparison using bitwise XOR across SHA-256 digests
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const hashA = await crypto.subtle.digest("SHA-256", enc.encode(a));
  const hashB = await crypto.subtle.digest("SHA-256", enc.encode(b));
  const arrA = new Uint8Array(hashA);
  const arrB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < 32; i++) {
    diff |= arrA[i] ^ arrB[i];
  }
  return diff === 0 && a.length === b.length;
}

// PBKDF2 with SHA-256 password verifier support
async function verifyPBKDF2(password: string, verifier: string): Promise<boolean> {
  // Format: pbkdf2:sha256:<iterations>:<saltHex>:<hashHex>
  const parts = verifier.split(":");
  if (parts.length !== 5 || parts[0] !== "pbkdf2" || parts[1] !== "sha256") {
    return false;
  }
  const iterations = parseInt(parts[2], 10);
  const saltHex = parts[3];
  const expectedHashHex = parts[4];

  if (!saltHex || !expectedHashHex || isNaN(iterations) || iterations < 10000) {
    return false;
  }

  const saltMatches = saltHex.match(/.{1,2}/g);
  if (!saltMatches) return false;
  const salt = new Uint8Array(saltMatches.map((byte) => parseInt(byte, 16)));

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256
  );

  const derivedHex = Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (derivedHex.length !== expectedHashHex.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < expectedHashHex.length; i++) {
    diff |= derivedHex.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  return diff === 0;
}

// Master password verification: accepts ONLY the configured master password
async function verifyMasterPassword(candidate: string, storedSecret: string): Promise<boolean> {
  if (!candidate || !storedSecret) return false;
  if (storedSecret.startsWith("pbkdf2:sha256:")) {
    return verifyPBKDF2(candidate, storedSecret);
  }
  return timingSafeEqual(candidate, storedSecret);
}

// Session token generation (v4 with SHA-256 HMAC salted token)
async function generateSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret + ":albert-platform-session-salt-v4");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const passcode = body.passcode;

    if (!passcode || typeof passcode !== "string" || !passcode.trim()) {
      return NextResponse.json({ error: "Master password required" }, { status: 400 });
    }

    const adminSecret = getAdminSecret();
    if (!adminSecret) {
      return NextResponse.json(
        { error: "Server authentication key not configured. Set ADMIN_SECRET_KEY." },
        { status: 403 }
      );
    }

    const inputPasscode = passcode.trim();
    const isValid = await verifyMasterPassword(inputPasscode, adminSecret);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid master password" }, { status: 401 });
    }

    // Authentication successful
    const response = NextResponse.json({ authenticated: true }, { status: 200 });
    const sessionToken = await generateSessionToken(adminSecret);

    // Set secure, tamper-proof session cookie (invalidates all v1/v2/v3 sessions)
    response.cookies.set({
      name: "albert_admin_session_v4",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 12, // 12 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Authentication processing failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const adminSecret = getAdminSecret();
  const sessionCookie = req.cookies.get("albert_admin_session_v4");
  if (!sessionCookie || !sessionCookie.value || !adminSecret) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const expectedToken = await generateSessionToken(adminSecret);
  const isAuthenticated = sessionCookie.value === expectedToken;
  return NextResponse.json({ authenticated: isAuthenticated }, { status: 200 });
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false }, { status: 200 });
  response.cookies.delete("albert_admin_session_v4");
  response.cookies.delete("albert_admin_session_v3");
  response.cookies.delete("albert_admin_session_v2");
  response.cookies.delete("albert_admin_session");
  return response;
}
