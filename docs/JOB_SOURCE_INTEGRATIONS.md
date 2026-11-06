# JOB SOURCE INTEGRATIONS & ADAPTER MATRIX
**Platform:** Albert Linson Professional Intelligence Platform  
**Harvester Module:** `apps/web/src/lib/jobHarvester.ts`  

---

## 1. Verified Sources & API Terms

| Job Source | Integration Method | API Terms & Status | Rate Limit | Ingestion Frequency |
|---|---|---|---|---|
| **RemoteOK** | Public REST API (`https://remoteok.com/api`) | Permitted open API with descriptive User-Agent | 1 request per cycle | Daily Cron (`0 8 * * *`) |
| **Remotive** | Public REST API (`https://remotive.com/api/remote-jobs`) | Permitted free open feed | 1 request per cycle | Daily Cron |
| **Adzuna API** | REST API (`api.adzuna.com/v1/api`) | Free developer tier (up to 250 calls/month) | Configurable | Manual or Scheduled |
| **Curated Enterprise Feeds** | Verified Seed Requisitions | Direct corporate career pages (Apex Systems, Innova, TEKsystems) | Unlimited local ingest | Continuous baseline |

---

## 2. Ingestion & Normalization Pipeline

1. **Query Terms:** The harvester queries roles matching Albert's profile:
   - *Recruiting:* US IT Recruiter, Technical Recruiter, Talent Acquisition, Talent Sourcer.
   - *Software Development:* Frontend Developer, React Developer, Full-Stack Developer, Python Developer.
   - *AI & Testing:* AI Applications Engineer, Software Testing Engineer.
2. **Deduplication:** Uses content-addressable hash `hash(title + company + url)`. Existing listings in `job_pipeline` are updated with the latest score rather than creating duplicates.
3. **Scoring:** Automatically runs `analyzeJobDescription("", description)` against Albert's verified profile data.
4. **Classification:**
   - Jobs with compatibility $\ge 75\%$ are categorized as `shortlisted`.
   - Jobs with compatibility $< 75\%$ remain as `discovered`.
