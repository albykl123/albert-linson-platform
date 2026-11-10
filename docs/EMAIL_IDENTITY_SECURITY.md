# Professional Email Identity Security Policy & Threat Model

**Project:** Albert Linson Professional Intelligence Platform  
**Target Identity:** `hello@albert.does.software`  
**Security Architect:** Senior Cybersecurity Engineer  
**Date:** 2026-11-10  

---

## 1. Core Security & Privacy Principles

### A. Zero Credential Exposure
- No Gmail passwords, app passwords, or Google OAuth master refresh tokens are ever requested, committed, or rendered in client-side bundles.
- All outbound draft staging relies strictly on least-privilege OAuth scopes (`https://www.googleapis.com/auth/gmail.compose`).

### B. Sensitive Data Masking & Redaction
- The destination Gmail account (`PERSONAL_FORWARD_EMAIL`) is never exposed in public views, client bundles, or unauthenticated APIs.
- Anywhere destination telemetry is rendered (e.g. `/admin/email-identity`), it is masked:
  ```
  albertkalampadan@gmail.com --> al***n@gmail.com
  ```
- Public profile endpoints expose only `hello@albert.does.software`.

### C. Server-Side Administrative Protection
- All administrative operations under `/admin/email-identity` and `/api/admin/email-identity` enforce server-side session authentication (`verifyAdminRequest`) utilizing constant-time SHA-256 verification and PBKDF2 hashing against `ADMIN_SECRET_KEY`.
- Unauthenticated or forged session cookies are rejected immediately with HTTP 401 Unauthorized.

### D. Anti-Bypass & Bot Compliance
- `does.software` protects registrations and account operations with Cloudflare Turnstile bot verification (`turnstileSiteKey: 0x4AAAAAAFqY1Dkd_WNpBawx`).
- The platform strictly adheres to ethical automation rules: no CAPTCHA-solving proxies, bot bypasses, or headless fingerprint spoofing are used. Registration workflows cleanly pause and surface prefilled human checkpoints.

### E. Inbound Forwarding SRS Integrity
- `mail.does.software` rewrites the envelope sender using the Sender Rewriting Scheme (SRS) (`SRS0=...=does.software`), ensuring forwarding to Gmail satisfies SPF checks from the forwarder IP (`193.187.129.91`) while preserving the original `From:` header for single-click replies.

---

## 2. Threat Analysis & Mitigations

| Threat | Attack Vector | Mitigation Implemented |
| :--- | :--- | :--- |
| **Email Enumeration / Scraping** | Web crawlers harvesting contact emails | Branded `hello@albert.does.software` displayed; private Gmail completely decoupled. Interactive copy button avoids plain unmasked mailto spiders. |
| **Destination Inbox Exposure** | Inspecting public API payloads or HTML source | Server-side redaction (`al***n@gmail.com`); `PERSONAL_FORWARD_EMAIL` kept exclusively in Cloudflare Worker secrets and local `.env`. |
| **Email Spoofing / Spam Bounce** | Direct sending from unverified subdomain | Direct SMTP relay disabled. Outbound sending routes via visitor's client or owner-approved Gmail draft queue. |
| **Unauthorized Subdomain Takeover** | Lease expiration without renewal | Automated 45-day tracking with 7-day and 1-day warning triggers via Cloudflare Cron Trigger and D1 state persistence. |
| **CSRF / Admin Privilege Escalation** | Forged POST requests to `/api/admin/email-identity` | Strict SameSite cookie enforcement, encrypted token validation, and constant-time digest verification. |

---

## 3. Audit Logging Specification

All lifecycle state changes, health refreshes, delivery tests, and renewal notices are persisted in `email_audit_events` with:
- `id`: Unique timestamped event identifier
- `event_type`: Categorized event (e.g. `DELIVERY_TEST_EXECUTED`, `STAGE_TRANSITION`)
- `details_json`: JSON payload with emails redacted
- `actor`: Identity of caller (`admin`, `system`, `cron_daemon`)
- `timestamp`: UTC ISO 8601 timestamp
