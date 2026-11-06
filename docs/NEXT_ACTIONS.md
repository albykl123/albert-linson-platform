# NEXT ACTIONS: MILESTONE 1 EXECUTION

---

## Active Tasks (Milestone 1 — Recruiter Intelligence Experience) [COMPLETED]

1. [x] **Upgrade `AvatarChatbot.tsx` & `InteractiveAvatar.tsx`:**
   - [x] Implement Speech-to-Text (STT) via Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) with explicit user microphone permission prompt.
   - [x] Implement Text-to-Speech (TTS) synthesis using browser `window.speechSynthesis` with speech rate/pitch tuning and voice selection.
   - [x] Add dynamic animated speaking indicator (waveform visualizer) when the digital twin is actively speaking.
   - [x] Add live subtitle caption bar beneath the hero avatar and in the expanded chat window.
   - [x] Add conversation controls: Voice toggle (mic), Audio toggle (speaker mute/unmute), Clear conversation, Close/Minimize.
   - [x] Add context-aware navigation handler (e.g. if the user says "take me to projects", it navigates directly to `/projects`).
   - [x] Add subtle idle breathing animation to the 3D hero stage.

2. [x] **Build Recruiter JD Matcher (`/matcher` & `/resume` integration):**
   - [x] Create `/matcher` route (`apps/web/src/app/matcher/page.tsx`).
   - [x] Integrate tab / button inside `/resume` pointing to the JD Matcher.
   - [x] Provide interactive text paste area for Job Descriptions.
   - [x] Provide file dropzone supporting `.txt`, `.docx`, `.pdf` text extraction.
   - [x] Display transparent score breakdown: Overall Compatibility (0–100%), Core Engineering Skills, US IT Recruitment Expertise, Education/Certifications, Leadership.
   - [x] Display matched vs. missing skills with honest gap analysis.
   - [x] Generate recruiter tailored professional summary.
   - [x] Provide preview of approved recruiter-facing tailored resume view with print/copy capability.

3. [x] **Testing & Quality Gate:**
   - [x] Run Pytest 20-test suite (`python -m pytest -o pythonpath=apps/backend tests -v`) -> **20/20 PASSED**.
   - [x] Run TypeScript typecheck (`npx tsc --noEmit`) -> **0 ERRORS**.
   - [x] Run Next.js production build (`npm run build`) -> **18/18 ROUTES COMPILED (100% PASS)**.

---

## Upcoming Tasks (Milestone 2 — Private Career Intelligence)

1. [ ] **Cloudflare D1 Pipeline Schema Migration:**
   - [ ] Author SQL migration file for `job_pipeline`, `applications`, and `outreach_drafts`.
   - [ ] Integrate D1 query handlers in `/api/db`.
2. [ ] **Job Harvester Engine:**
   - [ ] Implement multi-source job fetching worker using free endpoints (Adzuna / RemoteOK / Google Jobs RSS).
   - [ ] Deduplicate and score against Albert's verified profile before staging.
3. [ ] **Approval-Gated Outreach Staging Queue:**
   - [ ] Build private queue in `/admin?tab=outreach`.
   - [ ] Ensure zero emails or applications can be sent without explicit user one-click approval.
