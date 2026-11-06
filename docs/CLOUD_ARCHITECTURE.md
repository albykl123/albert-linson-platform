# CLOUD ARCHITECTURE & COMPATIBILITY AUDIT

**Target:** Cloudflare Pages, Workers, D1, R2  
**Ecosystem:** Next.js 14 App Router + Python FastAPI Microservice  

---

## 1. Cloudflare Edge Architecture

The platform takes advantage of Cloudflare's globally distributed network across 275+ cities:

1. **Pages & Workers (SSR & Edge API)**:
   - Next.js server components and edge route handlers run on Cloudflare Workers using the V8 isolate runtime.
   - Zero cold start, sub-50ms latency globally.
   - Built-in automatic DDoS protection and free SSL certificate.

2. **D1 Serverless Database**:
   - D1 is a serverless, distributed relational SQL database powered by SQLite.
   - Read queries execute at the nearest edge PoP, providing instantaneous query response times.
   - Maintains 100% schema parity with the local `apps/backend/data/atsforge.db` SQLite development database.

3. **R2 Object Storage**:
   - S3-compatible private document storage with **zero egress bandwidth fees**.
   - Used for private user resumes, tailored output documents, and confidential research drafts.
   - Secured with signed, time-limited upload/download tokens.

---

## 2. Dual-Engine Runtime Compatibility

Because Python dependencies (`reportlab`, `python-docx`) require a Python runtime while Cloudflare Workers execute V8 JavaScript isolates, the architecture cleanly bifurcates execution:

| Operation | Edge Runtime (TypeScript / Cloudflare) | Python Runtime (FastAPI / Local / Worker) |
| :--- | :--- | :--- |
| **Public Portfolio & SSR** | Cloudflare Pages (Instant) | N/A |
| **20-Rule ATS Compatibility Engine** | Edge TypeScript (`atsEngine.ts`) | Python Engine (`ats_engine.py`) |
| **JD Keyword Extraction & Matching** | Edge TypeScript (`jobMatcher.ts`) | Python Matcher (`matcher.py`) |
| **Zero-Hallucination Factuality Guard** | Edge TypeScript (`factualityGuard.ts`) | Python Guard (`preservation.py`) |
| **FreeStack Search & Directory** | Edge JSON & D1 (`freestackData.ts`) | Python Parser (`parser.py`) |
| **Vector PDF & DOCX Generation** | Client-Side / Vector Print / Web Worker | ReportLab & python-docx (`exporter.py`) |
| **AI Gateway & Cascading** | Edge API Route (`openrouter/free`) | Python Provider (`openrouter.py`) |

This dual-engine architecture guarantees that the web platform can deploy to Cloudflare Pages with **zero external server dependencies**, while retaining the full Python test suite and CLI tooling for local and batch operations!
