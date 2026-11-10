# Professional Email Identity Architecture — Albert Linson Platform

**Identity:** `hello@albert.does.software`  
**Subdomain:** `albert.does.software` (Claimed & Active)  
**Destination:** `PERSONAL_FORWARD_EMAIL` (Private Gmail: `al***n@gmail.com`)  
**Web Platform:** `https://albert-linson-platform.albertkalampadan.workers.dev`  
**Date:** 2026-11-10  

---

## 1. System Topology & Dual-Layer Architecture

The email identity infrastructure operates across two decoupled layers:
1. **The Edge Platform Layer (`albert-linson-platform`):**
   - Cloudflare Workers runtime (`nodejs_compat`).
   - Cloudflare D1 Relational SQLite storage (`albert-linson-db`).
   - Next.js 14 App Router with centralized verified contact profile (`masterProfile`, `verifiedContact`).
   - Private authenticated admin dashboard (`/admin/email-identity`).
   - Daily scheduled cron monitor (`/api/cron/email-renewal`).
2. **The Autonomous Lifecycle Subsystem (`AlbertEmailSetup`):**
   - Python automation suite bound locally to `127.0.0.1:3050`.
   - Direct integration with `https://api.does.software/v1`.
   - Authoritative DNS MX resolver and 45-day renewal manager.
   - Redacted security audit log (`claim_state.json`).

```mermaid
flowchart TD
    subgraph Inbound Email Flow
        Sender[External Sender / Recruiter] -->|To: hello@albert.does.software| MX[Authoritative MX: mail.does.software]
        MX -->|SPF/DKIM Validation + Sender Rewriting Scheme| Forward[Forward Route to PERSONAL_FORWARD_EMAIL]
        Forward -->|Delivers to Primary Inbox| Gmail[Albert Personal Gmail Inbox]
    end

    subgraph Outbound Communication Boundary
        Visitor[Portfolio Visitor] -->|Clicks Email Action| Mailto[Client-Side Mailto Link]
        Mailto -->|Direct Reply| VisitorClient[Visitor Native Email Client]
        Owner[Albert Admin] -->|Staged Outreach| GmailDraft[Gmail Drafts via OAuth API]
    end

    subgraph Platform Integration
        Web[Next.js 14 App Router] -->|Central Profile Source| Contacts[lib/profileData.ts]
        Contacts --> Footer[Global Footer]
        Contacts --> Resume[Resume Generator & TXT Export]
        Contacts --> Copilot[AI Copilot & Digital Twin]
        Admin[/admin/email-identity] -->|Authenticated Telemetry| D1[(Cloudflare D1: email_provider_status)]
    end
```

---

## 2. Inbound Forwarding vs. Outbound Sending Separation

A core architectural principle of this system is the strict separation between **Inbound Forwarding** and **Outbound Sending**:

| Dimension | Inbound Forwarding | Outbound Sending |
| :--- | :--- | :--- |
| **Provider** | `does.software` | Visitor Client / Owner Gmail Draft |
| **Mail Server** | `mail.does.software` (Priority 10) | User SMTP / Google OAuth |
| **Authentication** | Provider-managed SPF, DKIM, SRS | Apex TXT / DKIM Selector Required |
| **Domain Control** | Subdomain tenant | Requires Apex DNS ownership |
| **Status** | 🟢 **100% Active & Operational** | 🔒 **Draft / Mailto Only (By Design)** |

### Third-Party Subdomain DNS Boundary Analysis
- The free subdomain `albert.does.software` is a leaf zone under the public suffix domain `does.software`.
- Configuring custom DKIM selectors, custom SPF TXT records, or custom DMARC `p=reject` policies requires authoritative control over the apex domain (`does.software`).
- Direct SMTP outbound relay from `@albert.does.software` through unverified external SMTP servers would cause major mail providers (Gmail, Outlook, Yahoo) to reject messages due to DMARC/SPF misalignment.
- **Architectural Solution:** The platform defaults to `mailto:` links for website visitors and stages recruiter applications as drafts in Albert's Gmail via official Google OAuth. Direct unverified SMTP sending is intentionally disabled.

---

## 3. Seven-Stage Lifecycle Progression Engine

```
[Stage 1] SUBDOMAIN_CLAIMED      --> Verified active on does.software API (Code 10152, taken)
[Stage 2] REGISTRATION_ACTIVE    --> 45-day lease accepted; web redirect operational
[Stage 3] FORWARDING_CONFIGURED  --> Inbound destination route bound to PERSONAL_FORWARD_EMAIL
[Stage 4] DESTINATION_VERIFIED   --> Double opt-in confirmation completed
[Stage 5] MX_VERIFIED            --> Authoritative DNS MX resolved to mail.does.software (Priority 10)
[Stage 6] DELIVERY_VERIFIED      --> External test received with subject & sender preserved via SRS
[Stage 7] FULLY_OPERATIONAL      --> Integrated into website, exports, AI Copilot, and admin hub
```

---

## 4. D1 Relational Schema Specification

Migration `migrations/0002_email_identity_schema.sql` introduces 5 dedicated tables:
1. `professional_contact_identity`: Single source of truth for name, email, subdomain, social URLs.
2. `email_provider_status`: Live provider status, DNS MX priority, health latency, lease timestamps.
3. `email_delivery_tests`: Delivery test records with SRS retention flags and spam bypass verification.
4. `email_renewal_schedule`: 45-day lease countdown, 7-day and 1-day reminder flags.
5. `email_audit_events`: Security event log with actor tracking and redacted payloads.
