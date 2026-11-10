# Professional Email Identity — Standard Operating Procedures (SOP)

**System:** Albert Professional Email Infrastructure  
**Primary Subdomain:** `albert.does.software`  
**Professional Email:** `hello@albert.does.software`  
**Forwarding Target:** `PERSONAL_FORWARD_EMAIL` (`al***n@gmail.com`)  
**Date:** 2026-11-10  

---

## 1. Daily & Routine Operations

The email identity runs autonomously on Cloudflare Workers and does.software infrastructure. Under normal operations, zero daily maintenance is required.

### Key Telemetry Endpoints:
- **Web Admin Dashboard:** `https://albert-linson-platform.albertkalampadan.workers.dev/admin/email-identity`
- **Local Control Daemon:** `http://127.0.0.1:3050`
- **Automated Renewal Cron:** Scheduled daily at `09:00 UTC` via Cloudflare Cron Trigger (`/api/cron/email-renewal`).

---

## 2. 45-Day Lease & Renewal Procedure

`does.software` provides free subdomains with a renewable 45-day lease. To prevent subdomain forfeiture, the platform executes a 3-tier warning protocol:

```
[Day 0–37] Normal Lease Operation    --> Days remaining: 45 to 8. Status: Active.
[Day 38]   7-Day Renewal Warning     --> Reminder triggered in D1 audit log & admin banner.
[Day 44]   1-Day Urgent Warning      --> Critical alert in admin dashboard.
[Day 45]   Lease Expiry / Grace Day 1--> 3-day grace period commences; forwarding remains active.
[Day 48]   Grace Period Termination  --> Subdomain released back to public availability pool.
```

### How to Renew (1-Click, €0.00):
1. **Method A — Via Platform Admin:**
   - Log into `/admin/email-identity`.
   - In the Lease Lifecycle panel, click **Renew Subdomain**.
2. **Method B — Via Local CLI:**
   - Run: `python AlbertEmailSetup/run.py --renew-token <TOKEN_FROM_PROVIDER_EMAIL>`
3. **Method C — Via Provider Email:**
   - Open the renewal reminder email sent by `does.software` to `PERSONAL_FORWARD_EMAIL` and click the 1-click renewal link.

---

## 3. Inbound Delivery Verification Runbook

To conduct a periodic delivery test:
1. **Send Test Message:**
   - From an external email account (e.g., secondary work or personal email), send a message to:
     ```
     To: hello@albert.does.software
     Subject: [Test] Portfolio Identity Verification #001
     Body: Hello Albert, testing inbound email forwarding delivery.
     ```
2. **Inspect Delivery:**
   - Open `albertkalampadan@gmail.com`.
   - Message should arrive within 5–30 seconds.
3. **Verify Header Preservation:**
   - Inspect the message headers:
     - `From:` preserves the external sender's original address.
     - `Return-Path:` uses `SRS0=...=does.software` (Sender Rewriting Scheme).
     - Clicking **Reply** populates the external sender's address, not the forwarding mail server.
4. **Log the Test in Admin:**
   - In `/admin/email-identity`, click **Execute Inbound Verification Test** to record the successful test in the audit history.

---

## 4. Incident Response & Troubleshooting

### Scenario A: Inbound Email Not Received
1. Check spam folder in Gmail. If message is present, click **Report Not Spam** and add `*@does.software` to Gmail filter rules.
2. Verify DNS MX records: `nslookup -q=mx does.software`. Confirm answer is `mail.does.software` (Priority 10).
3. Check provider API status via `/admin/email-identity` (Refresh Provider Health).

### Scenario B: Lease Expiration Warning Appears
1. Access `/admin/email-identity`.
2. Review remaining days.
3. Complete the free 1-click token renewal.

### Scenario C: Visitor Inquires About Outbound Emails
- Remind the visitor or recruiter that replies are sent directly from Albert's verified account.
- Direct outbound SMTP relay is disabled to maintain 100% domain deliverability.
