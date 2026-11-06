export function getAdminSecret(): string {
  const secret = (
    process.env.ADMIN_SECRET_KEY ||
    (globalThis as any).ADMIN_SECRET_KEY ||
    (process.env as any).ADMIN_SECRET ||
    ""
  ).trim();
  return secret;
}

export async function generateSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret + ":albert-platform-session-salt-v4");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyAdminRequest(req: {
  cookies: { get: (name: string) => { value: string } | undefined };
}): Promise<boolean> {
  const adminSecret = getAdminSecret();
  const sessionCookie = req.cookies.get("albert_admin_session_v4");
  if (!sessionCookie || !sessionCookie.value || !adminSecret) {
    return false;
  }
  const expectedToken = await generateSessionToken(adminSecret);
  return sessionCookie.value === expectedToken;
}
