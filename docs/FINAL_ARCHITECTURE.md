# FINAL PRODUCTION ARCHITECTURE

**System:** Albert Linson Personal Intelligence Platform  
**Architecture Classification:** Edge-Native Hybrid Full-Stack System  
**Frameworks:** Next.js 14 (App Router) + FastAPI (Dual-Engine Execution)  
**Edge Infrastructure:** Cloudflare (Workers, Pages, D1, R2, DNS, SSL)  
**AI Gateway:** OpenRouter Multi-Model Free-Tier Orchestrator  

---

## 1. System Architecture Overview

The system is engineered as an **Edge-Native Hybrid Platform**, designed to deliver sub-100ms response times globally while remaining 100% within free developer quotas and running efficiently on low-resource hardware during development.

```
                      +------------------------------------------+
                      |               PUBLIC WEB                 |
                      | (Recruiters, Researchers, Public Users)  |
                      +--------------------+---------------------+
                                           |
                                           v
                      +------------------------------------------+
                      |         CLOUDFLARE EDGE NETWORK          |
                      | - 275+ Global PoPs, Free SSL, DDoS       |
                      | - Cloudflare Pages / Workers SSR         |
                      +--------------------+---------------------+
                                           |
                 +-------------------------+-------------------------+
                 |                                                   |
                 v                                                   v
   +---------------------------+                       +---------------------------+
   |    PUBLIC PORTFOLIO       |                       |   PRIVATE CAREER STUDIO   |
   | - Hero 3D (Three/Canvas)  |                       | - Live Resume Builder     |
   | - Verified Profile & Bio  |                       | - 20-Rule ATS Engine      |
   | - Projects Showcase       |                       | - JD Gap Analysis         |
   | - Academic Research Hub   |                       | - 6 ATS Templates         |
   | - FreeStack Discovery     |                       | - PDF / DOCX Exporter     |
   | - Contact & Socials       |                       | - Application Pipeline    |
   +---------------------------+                       +-------------+-------------+
                 |                                                   |
                 +-------------------------+-------------------------+
                                           |
                                           v
                      +------------------------------------------+
                      |     NEXT.JS EDGE & ROUTE HANDLERS        |
                      | - Authentication & CSRF Protection       |
                      | - Deterministic Scoring Engine (TS)      |
                      | - FreeStack Sync & Query Engine          |
                      | - OpenRouter Multi-Model Gateway         |
                      +------+--------------------+--------------+
                             |                    |
             +---------------+                    +---------------+
             |                                                    |
             v                                                    v
+--------------------------+                             +--------------------------+
|      CLOUDFLARE D1       |                             |      CLOUDFLARE R2       |
| - Relational SQLite      |                             | - S3-Compatible Storage  |
| - Profiles, Resumes, JDs |                             | - Private Resumes        |
| - FreeStack Services     |                             | - Research Manuscripts   |
| - Audit & AI Logs        |                             | - Signed URLs            |
+--------------------------+                             +--------------------------+
             ^                                                    ^
             |                                                    |
+--------------------------+                             +--------------------------+
|      LOCAL DEV / CI      |                             |   OPENROUTER AI ENGINE   |
| - Local SQLite (.db)     |                             | - openrouter/free        |
| - Python FastAPI Service |                             | - gemini-2.0-flash:free  |
| - Pytest Suite (14 tests)|                             | - llama-3.3-70b:free     |
+--------------------------+                             +--------------------------+
```

---

## 2. Core Subsystems

### 2.1 Public Portfolio
- **Cinematic 3D Hero:** Procedural canvas/Three.js starfield/waveform animation interacting with mouse coordinates; falls back gracefully to CSS gradient canvas on low-power devices.
- **Master Profile Source:** Populated directly from `packages/shared/profile_data.json` containing Albert Linson's authentic education, employment, skills, and projects.
- **Academic Research Hub:** Dedicated pages and viewers for verified papers:
  1. *A Computational Perspective on Breast Cancer Detection in Ultrasound: Fusion of Multi-Image Modalities*
  2. *AEGIS-Test: Adaptive Evidence-Guided Iterative Synthesis for Reliable LLM-Based Software Testing*
  3. *EduMind: Adaptive AI Learning Platforms*
- **Verified Projects:** Interactive modal and deep-dive pages for JARVIS Desktop, Lunova OS, ATSForge AI, MCD Civic Dashboard, and CINEMATRIX AI.

### 2.2 Private Career Studio (`/studio`)
- **Master Resume Editor:** Visual editor synchronizing with normalized schema (`ResumeData`).
- **Job Description Matcher:** Extracts required vs. preferred technical skills, tools, and domains; identifies keyword gaps with contextual match percentages.
- **20-Rule ATS Engine:**
  - Contact information completeness (Phone, Email, Location, LinkedIn, GitHub).
  - Standard section headers (Summary, Experience, Education, Skills, Projects).
  - Single-column formatting guarantee (zero table layouts, zero non-standard columns).
  - Action verb density at the beginning of each bullet point.
  - Measurable metric quantification.
  - Glyph and non-standard symbol sanitization (replaces decorative glyphs with standard bullets).
  - Keyword stuffing prevention (caps keyword frequency at threshold).
- **Template System:** 6 industry-validated ATS templates (Classic Professional, Modern Single Column, Technical Developer, Student & Graduate, Business & Management, Minimal Executive).
- **Multi-Format Vector Exporters:**
  - ATS-compliant vector PDF (100% selectable text).
  - Pure native DOCX (heading styles, standard list bullets, zero text boxes).
  - Clean plaintext for legacy ATS portals.
  - JSON Resume standard format.

### 2.3 FreeStack Intelligence
- Ingests `ripienaar/free-for-dev` repository (277 KB Markdown database).
- Parses Markdown into structured catalog with categories: Cloud Hosting, Serverless, Database, Storage, AI/ML, CI/CD, Monitoring, Security, APIs.
- Features instant client-side full-text search, category filtering, bookmarking, and side-by-side service comparisons.
- Records sync history and commit SHA in database.

### 2.4 OpenRouter AI Integration
- Gateway endpoint with priority routing:
  1. Primary: `openrouter/free`
  2. Fallback 1: `google/gemini-2.0-flash-exp:free`
  3. Fallback 2: `meta-llama/llama-3.3-70b-instruct:free`
  4. Local Fallback: Deterministic heuristic rule-based tailoring engine (works 100% offline with zero API keys).
- Strict Factuality Guard: Verifies that any AI-generated rewrite only enhances existing verified experience, converting unverified claims to bracketed user placeholders (`[e.g., improved metric by X%]`).

---

## 3. Database Schema

Tables implemented across SQLite and Cloudflare D1:
- `users`: Administrator credentials and session tokens (argon2/bcrypt hashed).
- `profiles`: Albert Linson's master biography, contact, and professional headline.
- `experiences`: Verified employment entries (Innova Solutions, Herbal Energy, Algospark, MCD).
- `educations`: Christ University BCA, MCA, St. Columba's School.
- `skills`: Categorized technical, analytical, recruitment, and domain skills.
- `projects`: Real software projects with architecture, repo links, and status.
- `research_papers`: Abstract, methodology, publication venue, DOI, and manuscript links.
- `job_descriptions`: Uploaded/pasted JDs with parsed requirements.
- `resume_versions`: Tailored resume revisions with ATS score and template choice.
- `ats_analyses`: Breakdown of 20-rule ATS score and keyword gap metrics.
- `developer_services`: Catalog of FreeStack services parsed from free-for-dev.
- `service_categories`: FreeStack category index.
- `service_sync_history`: Synchronization log with commit SHA and item counts.
- `ai_usage_logs`: Token consumption, latency, and model endpoints.
- `audit_logs`: Administrative action timestamps and IP signatures.

---

## 4. Security & Privacy Architecture

- **Zero API Key Leakage:** OpenRouter API keys and database tokens reside strictly in server-side environment variables (`.env.local` or Cloudflare Secrets). No keys are ever bundled into client assets.
- **Role-Based Authorization:** Studio and Admin routes are protected by server-side session cookies. Unauthorized requests redirect to `/login`.
- **Private Document Segregation:** Uploaded resumes and private drafts are stored in private R2 buckets and accessed only via pre-signed, time-limited URLs.
- **Prompt Injection Defense:** Uploaded resumes and job descriptions are sanitized; LLM prompts isolate user text in XML tags with explicit boundary instructions.
