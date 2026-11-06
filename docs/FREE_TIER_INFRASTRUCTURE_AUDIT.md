# FREE-TIER INFRASTRUCTURE AUDIT

**Audit Reference:** ripienaar/free-for-dev catalog  
**Project:** Albert Linson Personal Intelligence Platform  
**Target Environment:** 100% Free Developer Tier, Production-Grade, Globally Distributed  

---

## 1. Executive Summary

This document evaluates the free-tier cloud services cataloged in `ripienaar/free-for-dev` against the architectural requirements of the **Albert Linson Personal Intelligence Platform**. Each service is scrutinized for generous free quotas, absence of sleep/spin-down penalties, commercial suitability, custom domain support, and operational stability on a low-resource client machine.

---

## 2. Infrastructure Comparison Matrix

| Layer | Provider | Free Tier Limits | Cold Start / Sleeping | Custom Domain / SSL | Selected? | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Compute / Edge** | **Cloudflare Workers & Pages** | 100,000 requests/day, 10ms CPU/req | **0 ms (Edge distributed)** | Yes (Free wildcard SSL) | **PRIMARY** | Zero spin-down; instant worldwide response; supports Next.js via OpenNext / Cloudflare adapter; no credit card required. |
| Compute / Serverless | Vercel | 100GB bandwidth, 1M edge req/mo | ~200-500ms serverless | Yes | Fallback | Generous for Next.js, but commercial usage terms can be restrictive on hobby tier. |
| Compute / Container | Render | 750 free hours/mo (1 web service) | **Spins down after 15m idle (50s cold start)** | Yes | Python Microservice | Suitable as an optional background microservice for heavyweight ReportLab/Docx tasks, but unacceptable for user-facing web app. |
| Compute / Container | Fly.io | 3 shared-cpu VMs (256MB RAM) | Minimal if configured | Yes | Alternative | Requires credit card verification even for free tier. |
| **Database (Relational)** | **Cloudflare D1** | **5,000,000 reads/day, 100,000 writes/day, 5 GB storage** | **0 ms (Edge co-located)** | Native | **PRIMARY** | Native serverless SQLite dialect at the edge; zero connection pooling bottlenecks; perfect for Next.js API. |
| Database (Relational) | Turso (libSQL) | 9 GB storage, 1B row reads/mo | 0 ms | Native | Fallback | High-performance distributed SQLite; excellent developer experience. |
| Database (Postgres) | Supabase | 500 MB DB, 50k monthly active users | Pauses after 1 week inactivity | Yes | Rejected | Pausing mechanism introduces unacceptable production outages. |
| **Object Storage** | **Cloudflare R2** | **10 GB / month, 1M Class A operations, 10M Class B** | **0 ms** | Yes | **PRIMARY** | S3-compatible, **zero egress bandwidth fees**; ideal for private resume storage and research paper distribution. |
| Object Storage | Backblaze B2 | 10 GB free, 1GB egress/day | 0 ms | Yes | Secondary | Good backup target, but Cloudflare R2 has zero egress. |
| **AI Gateway** | **OpenRouter** | **Multiple Free Models (`:free` endpoints)** | Dependent on upstream model | API-based | **PRIMARY** | Multi-model fallback (`openrouter/free`, `google/gemini-2.0-flash-exp:free`, `meta-llama/llama-3.3-70b-instruct:free`). Single API key handles all models with rate-limit headers. |
| **CI / CD** | **GitHub Actions** | **2,000 free runner minutes / month** | On-demand runners | Native | **PRIMARY** | Native integration with GitHub repository; automated linting, test execution, and Cloudflare deployment. |
| **Monitoring** | **UptimeRobot** | **50 monitors, 5-minute check intervals** | Continuous | Alert via email/SMS | **PRIMARY** | Industry standard free HTTP/HTTPS uptime monitoring. |

---

## 3. Selected Free-Tier Architecture Blueprint

1. **Frontend & Unified Edge API:**
   - **Cloudflare Pages / Workers**: Hosts the compiled Next.js application.
   - Zero cold start, 275+ global edge locations, free automatic HTTPS certificate.
2. **Edge Relational Database:**
   - **Cloudflare D1**: Serverless SQLite database for user sessions, portfolio data, job descriptions, ATS analyses, and FreeStack services.
   - For local development and testing, SQLite file database (`data/platform.db`) maintains 100% schema parity.
3. **Private Document Storage:**
   - **Cloudflare R2**: Secure S3-compatible bucket with signed upload/download tokens for PDF/DOCX resumes and research materials.
4. **AI Gateway:**
   - **OpenRouter API**: Server-side proxy routing requests to free models with client backoff and deterministic fallback to local rule-based heuristic rewriting.
5. **Continuous Deployment:**
   - **GitHub Actions**: On push to `main`, executes TypeScript type-check, Python pytest suite, and deploys directly to Cloudflare via `wrangler-action`.

---

## 4. Quota Monitoring & Budget Safeguards

- **Zero-Billing Policy:** No paid addons, billing credit lines, or auto-scaling pay-per-use thresholds are enabled without explicit user authorization.
- **Rate-Limiting:** Next.js middleware implements in-memory IP throttling (max 60 requests/minute per client) to prevent free quota exhaustion.
- **AI Token Throttling:** Strict 2,000-token input and 1,500-token output limits per ATS analysis, with token counting and daily usage tracking in database.
