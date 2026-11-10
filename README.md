# Albert Linson — Personal Intelligence Platform

**Unified Production Digital Ecosystem & AI Career Intelligence Platform**

Built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, **FastAPI**, **Cloudflare (Pages, Workers, D1, R2)**, **OpenRouter AI Gateway**, and **ATSForge AI**.

Designed for Windows 10 & 11 &bull; PowerShell-First Development &bull; 100% Free Developer Tier Architecture.

---

## Key Features

1. **Verified Professional Email Identity (`hello@albert.does.software`)**:
   - Subdomain `albert.does.software` claimed and active with authoritative DNS MX routing to `mail.does.software` (Priority 10).
   - Inbound email forwarding with Sender Rewriting Scheme (SRS) to private destination inbox.
   - Centralized contact identity across all pages, footers, resume exports (PDF, DOCX, TXT), AI Copilot, and Digital Twin.
   - Private administrative management console at `/admin/email-identity` and autonomous Python daemon `AlbertEmailSetup` (port 3050).
2. **Cinematic Public Portfolio**:
   - Interactive procedural 3D constellation canvas (`Hero3D`) with responsive physics and zero CPU leak, backed by an elegant CSS glow fallback.
   - Verified professional identity, career timeline, education credentials, skills matrix, and interactive projects showcase.
3. **Academic Research Hub**:
   - Complete scientific library featuring research on *Multimodal Ultrasound Fusion for Breast Cancer Detection*, *AEGIS-Test for Reliable LLM Testing*, and *EduMind Adaptive Learning*.
4. **ATSForge AI Career Studio (`/studio`)**:
   - **20-Rule Deterministic ATS Compatibility Engine** producing a 0-100 score, severity findings, and **One-Click Automated Fixes**.
   - **Job Description Matcher & Keyword Gap Analyzer** extracting mandatory vs. preferred requirements.
   - **Strict Zero-Hallucination Factuality Guard** preventing fabricated credentials.
   - **6 ATS-Compliant Templates** and multi-format exporters (selectable vector PDF, Word DOCX, clean plaintext, JSON Resume).
   - **Application Pipeline Tracker** managing job applications and interview feedback.
5. **FreeStack Intelligence Directory (`/freestack`)**:
   - **1,369 Curated Free Developer Services** across **57 Categories** parsed from `ripienaar/free-for-dev`.
   - Instant search, category filters, and **Side-by-Side Comparison**.
6. **OpenRouter AI Gateway**:
   - Cascading multi-model router prioritizing 100% free variants (`openrouter/free`, `google/gemini-2.0-flash-exp:free`, `meta-llama/llama-3.3-70b-instruct:free`).
   - Deterministic AST heuristic fallback for 100% offline, zero-API-key use.
7. **Admin Control Center (`/admin` & `/admin/email-identity`)**:
   - Passcode-secured owner studio with profile editor, telemetry monitors, FreeStack sync triggers, and model configuration.
   - Dedicated Email Identity control center for live health telemetry, authoritative MX verification, delivery testing, and 45-day lease renewal tracking.

---

## Quick Start (Windows PowerShell)

### 1. Bootstrap Platform
```powershell
.\scripts\bootstrap.ps1
```

### 2. Run Automated Test Suite (20 Tests)
```powershell
.\scripts\test.ps1
```

### 3. Launch Development Environment
```powershell
.\scripts\dev.ps1
```
- Open Frontend: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Open Backend: [http://127.0.0.1:8050](http://127.0.0.1:8050)

### 4. Deploy to Cloudflare
```powershell
.\scripts\deploy.ps1
```

---

## Automated Test Results

- **Backend, ATS & Email Identity Tests**: 29/29 Passing (100% Pass Rate).
- **AlbertEmailSetup Autonomous Daemon Tests**: 16/16 Passing (100% Pass Rate).
- **Total Platform Tests**: 45/45 Passing (100% Pass Rate).
- **Coverage**: ATS Scoring, Exporters, Factuality Guard, Matcher, Pipeline, OpenRouter Gateway, FreeStack Ingestion, Professional Email Identity, DNS MX Resolution, SRS Routing, Renewal Lifecycle.

---

## Project Structure

```
.
├── apps/
│   ├── web/                    # Next.js 14 App Router, TypeScript, Tailwind, Lucide
│   │   ├── src/app/            # App routes (/, /about, /experience, /projects, /research, /freestack, /studio, /admin)
│   │   ├── src/components/     # Navbar, Footer, Hero3D, HeroFallback
│   │   └── src/lib/            # ATS Engine, Job Matcher, Factuality Guard, FreeStack
│   └── backend/                # Python FastAPI Microservice & ATSForge Engine
│       ├── app/                # Routers, Services (ATS, Exporters, Matcher, AI)
│       └── data/               # SQLite database & export storage
├── packages/
│   └── shared/
│       ├── profile_data.json   # Albert Linson's Master Profile (Source of Truth)
│       └── freestack_data.json # 1,369 Free Developer Services Catalog
├── scripts/                    # Windows PowerShell Automation Scripts
│   ├── bootstrap.ps1
│   ├── dev.ps1
│   ├── test.ps1
│   ├── lint.ps1
│   ├── build.ps1
│   ├── health-check.ps1
│   ├── sync-freestack.ps1
│   ├── backup.ps1
│   ├── restore.ps1
│   └── deploy.ps1
├── tests/                      # Pytest suite (Unit & Integration)
├── docs/                       # Comprehensive Engineering Specifications
└── .github/workflows/          # Automated GitHub Actions CI/CD Pipeline
```

---

## License & Attribution

- Built by **Albert Kalampadan Linson**.
- FreeStack catalog derived from [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev) under its open-source license.
- ATSForge AI architecture incorporates insights from open-source ATS benchmarks with strict AGPL isolation.
