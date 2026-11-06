# CAREER INTELLIGENCE ARCHITECTURE: ALBERT LINSON PLATFORM
**Component:** Milestone 2 Private AI Career Operating System  
**Status:** IMPLEMENTED & DEPLOYED  

---

## 1. System Overview

The Career Intelligence Operating System operates as a secure, private control center for discovering, scoring, tailoring, and managing job opportunities without manual drafting.

```
                          [ External Public Job APIs ]
                       (RemoteOK, Remotive, Adzuna Feeds)
                                       │
                                       ▼
                         [ Scheduled Job Harvester ]
                       (Deduplication + Normalization)
                                       │
                                       ▼
                        [ AI Job Matcher Matrix ]
                     (4-Pillar Scoring against Profile)
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        [ Discovered (<75%) ]                  [ Shortlisted (≥75%) ]
                    │                                     │
                    │                                     ▼
                    │                       [ Tailored Resume & Letter ]
                    │                                     │
                    │                                     ▼
                    └────────────────────────► [ Approval Centre ]
                                                          │
                                               [ Human Owner Review ]
                                                          │
                                              ┌───────────┴───────────┐
                                              ▼                       ▼
                                         [ Approved ]            [ Rejected ]
                                              │
                                              ▼
                                    [ Explicit Dispatch ]
                                     (Gmail API / Log)
```

---

## 2. Multi-Pillar Compatibility Scoring Formula

Scoring is transparent and evidence-grounded across 4 weighted competency clusters:

$$\text{Score}_{\text{total}} = 0.35 \cdot S_{\text{engineering}} + 0.30 \cdot S_{\text{recruitment}} + 0.20 \cdot S_{\text{education}} + 0.15 \cdot S_{\text{leadership}}$$

* **Core Engineering Stack ($S_{\text{engineering}}$):** Verified experience in React, Next.js 14, TypeScript, Python, FastAPI, Tailwind CSS, SQLite/D1, Git, Linux.
* **US IT Recruitment Acumen ($S_{\text{recruitment}}$):** Active track record at Innova Solutions managing candidate qualification, technical competency screening, ATS sourcing, and Boolean search.
* **Academic Foundations ($S_{\text{education}}$):** Christ University MCA (2024–2026) & BCA (2021–2024) degrees.
* **Leadership & Cross-Functional Coordination ($S_{\text{leadership}}$):** 14 verified university and corporate involvement records (Event Head, Corporate Club, Peer Educator).

---

## 3. Strict Human-in-the-Loop Safeguard

Per user directive, **no emails or job applications are ever dispatched automatically**.
1. Ingestion discovers and scores jobs into `job_pipeline`.
2. High-match opportunities generate tailored resumes and cold outreach drafts into `applications`.
3. Outbound records enter `approval_status = 'pending_review'`.
4. Only when Albert logs into the Admin Control Center and clicks **[Approve Draft]** followed by **[Explicit Send & Log]** is any dispatch recorded.
