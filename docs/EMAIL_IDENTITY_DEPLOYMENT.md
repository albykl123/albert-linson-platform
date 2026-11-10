# Production Deployment Guide — Professional Email Identity

**Platform Base:** `https://albert-linson-platform.albertkalampadan.workers.dev`  
**Worker Engine:** Cloudflare Workers with OpenNext (`nodejs_compat`)  
**Database:** Cloudflare D1 (`albert-linson-db`, id: `167e5c06-fe0e-4147-8187-0849fbcce576`)  
**Date:** 2026-11-10  

---

## 1. Prerequisites & Environment Variables

Ensure the following secrets are configured in Cloudflare Workers and your local `.env`:

| Secret / Environment Variable | Scope | Description |
| :--- | :--- | :--- |
| `PERSONAL_FORWARD_EMAIL` | Production / Secret | Albert's private Gmail address (`albertkalampadan@gmail.com`) |
| `ADMIN_SECRET_KEY` | Production / Secret | Master administrative password (PBKDF2/SHA-256 hash or raw secret) |
| `CRON_SECRET` | Production / Secret | Optional Bearer token for automated renewal cron execution |
| `OPENROUTER_API_KEY` | Production / Secret | Multi-model AI gateway token for Digital Twin reasoning |

---

## 2. Cloudflare D1 Database Migration

Execute the new email identity schema migration against the production D1 database:

```bash
# Execute migration against local D1 state (for testing)
npx wrangler d1 execute albert-linson-db --local --file=migrations/0002_email_identity_schema.sql

# Execute migration against remote production Cloudflare D1
npx wrangler d1 execute albert-linson-db --remote --file=migrations/0002_email_identity_schema.sql
```

Verify tables created:
```sql
SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'email_%';
```
Expected output:
- `professional_contact_identity`
- `email_provider_status`
- `email_delivery_tests`
- `email_renewal_schedule`
- `email_audit_events`

---

## 3. Automated Test Suite Execution

Run both platform and daemon test suites prior to deployment:

```bash
# 1. Run Python Backend & Platform Integration Tests (29 tests)
$env:PYTHONPATH="apps/backend"; python -m pytest tests -v

# 2. Run AlbertEmailSetup Autonomous Daemon Tests (16 tests)
cd AlbertEmailSetup
python -m unittest discover tests
cd ..
```
**Pass Criteria:** 100% pass rate (45/45 tests passing).

---

## 4. Next.js Production Build & Worker Compilation

Compile the Next.js production bundle:

```bash
cd apps/web
npm run build
cd ../..
```
Verify that all 19 routes compile and prerender successfully, including `/admin/email-identity` and `/api/cron/email-renewal`.

---

## 5. Deployment via Wrangler & OpenNext

Deploy the compiled bundle to Cloudflare Workers Anycast edge:

```bash
cd apps/web
npm run deploy
cd ../..
```
*Note: Deployment will upload the `.open-next/worker.js` and assets to Cloudflare Anycast edge, bound to D1 database `albert-linson-db`.*

---

## 6. Post-Deployment Verification Checklist

1. **Verify Homepage:** Load `https://albert-linson-platform.albertkalampadan.workers.dev/` and check that `hello@albert.does.software` renders in the hero and contact sections.
2. **Verify Global Footer:** Check that the email link targets `mailto:hello@albert.does.software`.
3. **Verify Resume Page:** Check `https://albert-linson-platform.albertkalampadan.workers.dev/resume` and download the TXT resume to confirm `hello@albert.does.software` is present.
4. **Verify Digital Twin:** Open the AI Copilot and ask: *"How do I contact Albert?"* Confirm it answers with `hello@albert.does.software`.
5. **Verify Admin Hub:** Navigate to `https://albert-linson-platform.albertkalampadan.workers.dev/admin/email-identity`, authenticate, and verify live telemetry.
