# DATABASE SCHEMA: ALBERT LINSON PROFESSIONAL INTELLIGENCE PLATFORM
**Target Database:** Cloudflare D1 Relational SQLite  
**Database Name:** `albert-linson-db`  
**Binding ID:** `167e5c06-fe0e-4147-8187-0849fbcce576`  
**Migration File:** `migrations/0001_career_and_cms_schema.sql`  

---

## 1. Relational Entity Overview

```
 [ career_preferences ]
         │ (configures)
         ▼
  [ job_pipeline ] ──────────────► [ applications ] ──────────────► [ outreach_drafts ]
         │                                │                                │
         │                                ▼                                ▼
  (scored against)               [ resume_versions ]              [ Google / Gmail API ]
         │                                │                          (Strict Approval)
         ▼                                ▼
[ master_profile ] ◄───────────── [ profile_records ] ──────────► [ profile_revisions ]
 (source of truth)                        │
                                          ▼
                                  [ trend_items ]
                                          │
                                          ▼
                               [ recruiter_analytics ]
```

---

## 2. Table Specifications

### 2.1. `job_pipeline`
Stores all discovered requisitions from RemoteOK, Remotive, Adzuna, and curated enterprise feeds.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique job identifier (`job-hash`) |
| `title` | TEXT | NOT NULL | Job title (e.g., US IT Recruiter) |
| `company` | TEXT | NOT NULL | Hiring company name |
| `location` | TEXT | DEFAULT 'Remote' | Geographical location or remote zone |
| `remote_type` | TEXT | DEFAULT 'remote' | `remote`, `hybrid`, or `onsite` |
| `source` | TEXT | NOT NULL | Source adapter name |
| `url` | TEXT | NOT NULL | Requisition URL |
| `description` | TEXT | NOT NULL | Cleaned requisition text |
| `salary_range` | TEXT | NULLABLE | Salary compensation information |
| `compatibility_score` | INTEGER | DEFAULT 0 | 0–100% multi-pillar match score |
| `match_breakdown_json` | TEXT | NULLABLE | Sub-scores (tech, recruiting, education) |
| `status` | TEXT | DEFAULT 'discovered'| Lifecycle stage |
| `source_retrieved_at` | TEXT | NOT NULL | Ingestion timestamp |
| `created_at` | TEXT | NOT NULL | Creation timestamp |
| `updated_at` | TEXT | NOT NULL | Last update timestamp |

### 2.2. `applications`
Manages the application lifecycle from shortlisting to interview and offer.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Unique application identifier |
| `job_id` | TEXT | REFERENCES `job_pipeline(id)` | Foreign key to target requisition |
| `company` | TEXT | NOT NULL | Company name |
| `position` | TEXT | NOT NULL | Target role title |
| `contact_email` | TEXT | NULLABLE | Hiring manager / recruiter contact |
| `resume_version_id` | TEXT | NULLABLE | Reference to tailored resume version |
| `cover_letter` | TEXT | NULLABLE | Tailored cover letter content |
| `outreach_subject` | TEXT | NULLABLE | Cold outreach email subject |
| `outreach_body` | TEXT | NULLABLE | Cold outreach email body |
| `approval_status` | TEXT | DEFAULT 'pending_review' | `pending_review`, `approved_by_owner`, `rejected`, `dispatched` |
| `current_stage` | TEXT | DEFAULT 'applied' | `applied`, `acknowledged`, `interview_scheduled`, `offer_received`, `closed` |
| `applied_at` | TEXT | NULLABLE | Timestamp of approved dispatch |
| `follow_up_date` | TEXT | NULLABLE | Scheduled follow-up date |
| `notes` | TEXT | NULLABLE | Private notes and interview records |
| `created_at` | TEXT | NOT NULL | Creation timestamp |
| `updated_at` | TEXT | NOT NULL | Modification timestamp |

### 2.3. `profile_records` & `profile_revisions`
Enforces the dynamic owner CMS with revision audit trails.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | TEXT | PRIMARY KEY | Record key (e.g., `rec-research-papers`) |
| `section` | TEXT | NOT NULL | `summary`, `experience`, `skills`, `research`, `leadership` |
| `record_key` | TEXT | NOT NULL | Unique key within section |
| `title` | TEXT | NOT NULL | Title of record |
| `data_json` | TEXT | NOT NULL | Serialized JSON data |
| `source_evidence` | TEXT | NULLABLE | Proof/evidence backing the claim |
| `publishing_status` | TEXT | DEFAULT 'published' | `draft`, `under_review`, `verified`, `approved`, `published` |
| `version` | INTEGER | DEFAULT 1 | Incremental revision number |
| `created_at` | TEXT | NOT NULL | Creation timestamp |
| `updated_at` | TEXT | NOT NULL | Modification timestamp |

---

## 3. Data Integrity & Safety Guardrails

1. **Strict Research Invariant:** Schema and API layer validate that the `research` section strictly contains **exactly two research papers** (AEGIS-Test and Breast Cancer Ultrasound). Any mutation attempting to insert a 3rd unverified paper is rejected with `HTTP 422 Unprocessable Entity`.
2. **Approval Enforcement:** The `applications` table rejects dispatch updates unless `approval_status` was explicitly changed to `approved_by_owner`.
3. **Privacy Analytics Minimization:** `recruiter_analytics` only stores page paths and device categories; full IP addresses are discarded.
