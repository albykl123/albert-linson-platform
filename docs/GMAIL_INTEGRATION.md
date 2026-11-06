# GMAIL INTEGRATION: OAUTH 2.0 & DRAFT CREATION
**Platform:** Albert Linson Professional Intelligence Platform  
**Target Email:** `albertkalampadan@gmail.com`  
**Status:** IMPLEMENTED (Awaiting User OAuth Credentials)  

---

## 1. Overview & Security Scope

The platform integrates with Google OAuth 2.0 using the least privileged permission model:
* **Target Scope:** `https://www.googleapis.com/auth/gmail.compose`
* **Limitation:** The platform cannot read the user's inbox, cannot delete emails, and cannot access Google Drive. It is restricted exclusively to composing drafts and approved dispatching.

---

## 2. API Endpoints

1. **Initiate OAuth Flow:** `GET /api/auth/google` (Gated by admin authentication)
   - Inspects whether `GOOGLE_CLIENT_ID` is set in the environment.
   - If not set, returns clear configuration guidance:
     ```json
     {
       "status": "awaiting_credentials",
       "configuredEmail": "albertkalampadan@gmail.com",
       "targetScope": "https://www.googleapis.com/auth/gmail.compose"
     }
     ```
   - If configured, redirects to Google's consent screen with offline access for refresh tokens.
2. **OAuth Callback Handler:** `GET /api/auth/google/callback`
   - Exchanges authorization code for access and refresh tokens.
   - Persists encrypted token records in D1 `integrations_settings`.
   - Redirects to `/admin?tab=integrations&oauth_status=success`.

---

## 3. How the User Connects Gmail (Step-by-Step)

When you are ready to enable direct Gmail drafting from the Admin Panel:
1. Go to [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project (e.g. `Albert-Linson-Platform`).
3. Enable the **Gmail API** under *APIs & Services*.
4. Configure the **OAuth Consent Screen** with your email `albertkalampadan@gmail.com`.
5. Under *Credentials*, create an **OAuth 2.0 Client ID (Web Application)**:
   - Authorized redirect URI: `https://albert-linson-platform.albertkalampadan.workers.dev/api/auth/google/callback`
6. Add the two secrets to Cloudflare Worker secrets via Wrangler or Cloudflare Dashboard:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
7. Click **Connect Gmail** in your Admin Panel at `/admin?tab=integrations`.
