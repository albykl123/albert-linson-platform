# Albert Professional Email Automation — Setup & Execution Guide

This document provides step-by-step instructions for establishing the free professional email identity:
**`hello@albert.does.software`** &rarr; **`PERSONAL_FORWARD_EMAIL`** (`albertkalampadan@gmail.com`).

---

## 1. Automated vs. Human-in-the-Loop Boundaries

In strict compliance with DevOps security principles and project automation rules:
- **Automated Capabilities:**
  - Real-time API availability checks against `https://api.does.software/v1/subdomains/availability?name=albert`.
  - DNS MX status and health checks (`mail.does.software`, priority 10).
  - Subdomain pool health and candidate alternatives monitoring.
  - Token-based forward confirmation via API (`POST /v1/subdomains/forward/confirm`).
  - 45-day token-based renewal automation (`POST /v1/subdomains/renew-by-token`).
  - End-to-end verification scoring, test procedures, and checklist state tracking.
- **Human-in-the-Loop Actions Required:**
  - **Cloudflare Turnstile CAPTCHA:** does.software enforces human verification on new subdomain claims (`POST /v1/requests/`) with site key `0x4AAAAAAFqY1Dkd_WNpBawx`. Automated bypassing of Turnstile violates provider terms and security boundaries.
  - **Destination Email Confirmation:** Provider sends a verification email to your personal Gmail. You must either click the link or paste the token into the dashboard.

---

## 2. Step-by-Step Claim & Setup Protocol

### Step 1: Clone & Configure Environment
1. Ensure your `.env` file exists in `AlbertEmailSetup/.env`:
   ```bash
   cp .env.example .env
   ```
2. Verify `PERSONAL_FORWARD_EMAIL`:
   ```ini
   TARGET_SUBDOMAIN=albert
   PROVIDER_DOMAIN=does.software
   PREFERRED_ALIAS=hello
   PERSONAL_FORWARD_EMAIL=albertkalampadan@gmail.com
   TARGET_REDIRECT_URL=https://albert-linson-platform.albertkalampadan.workers.dev
   ```

### Step 2: Start the Setup Dashboard
Run the dashboard server:
```bash
python run.py
```
Open [http://localhost:3050](http://localhost:3050) in your browser.

### Step 3: Claim Subdomain with Turnstile (15 seconds)
1. On the dashboard (or directly at `https://does.software/`), enter:
   - **Subdomain:** `albert`
   - **Forward to:** `albertkalampadan@gmail.com`
   - **Web destination:** `https://albert-linson-platform.albertkalampadan.workers.dev`
2. Complete the simple 1-click Cloudflare Turnstile human check.
3. Click **Claim Subdomain**.

### Step 4: Confirm Destination in Personal Gmail
1. Open your personal Gmail inbox (`albertkalampadan@gmail.com`).
2. Open the confirmation email from `does.software`.
3. Either:
   - Click the **"Confirm Forwarding"** button inside the email, OR
   - Copy the verification token from the link URL and paste it into the **Token Submitter** on the dashboard ([http://localhost:3050](http://localhost:3050)) to activate forwarding via API.

---

## 3. End-to-End Email Verification Testing (Section 3D)

Follow this testing procedure to verify delivery and header integrity:

```
[External Sender]                               [does.software MX]                             [Personal Gmail]
(e.g. test@external.com)                         (mail.does.software)                    (albertkalampadan@gmail.com)
         |                                               |                                             |
         |---- 1. Send to hello@albert.does.software --->|                                             |
         |                                               |---- 2. Forward with SRS & Original Subj --->|
         |                                               |                                             |
         |                                                                                             | (Delivered to Inbox)
         |                                                                                             | 3. Verify Sender/Subject
```

1. **Send Test Message:** From a secondary Gmail, Outlook, or external account, compose an email:
   - **To:** `hello@albert.does.software`
   - **Subject:** `[Test] Portfolio Identity Verification #001`
   - **Body:** `Hello Albert, testing the free email forwarding route.`
2. **Confirm Receipt:** Verify arrival in `albertkalampadan@gmail.com` within 10–30 seconds.
3. **Verify Headers & Reply-To:**
   - Click **Reply**: The reply should target your external test account (not the forwarding daemon).
   - Check Subject: Must match `[Test] Portfolio Identity Verification #001`.
4. **Spam Whitelist (One-Time):**
   - If Gmail places the first message in Spam, open the message and click **"Report not spam"**.
   - Add `hello@albert.does.software` to your Google Contacts to permanently ensure Primary inbox placement.

---

## 4. 45-Day Renewal Protocol

The free plan includes free subdomains and forwarding forever, renewed every 45 days:
- **Automated Reminders:** does.software sends reminder emails **7 days before** and **1 day before** expiration.
- **Grace Period:** 3 days after expiration.
- **Renewal Execution:**
  - 1-click in the does.software dashboard, OR
  - Via CLI:
    ```bash
    python -m albert_email_setup --renew-token <YOUR_RENEWAL_TOKEN>
    ```
