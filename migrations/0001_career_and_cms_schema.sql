-- ==============================================================================
-- ALBERT LINSON PROFESSIONAL INTELLIGENCE PLATFORM
-- Migration: 0001_career_and_cms_schema.sql
-- Cloudflare D1 Relational SQLite Schema
-- ==============================================================================

-- 1. Job Ingestion Pipeline & Opportunities
CREATE TABLE IF NOT EXISTS job_pipeline (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'Remote',
  remote_type TEXT DEFAULT 'remote', -- remote, hybrid, onsite
  source TEXT NOT NULL,              -- Adzuna, RemoteOK, Remotive, Manual, LinkedIn Feed
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  salary_range TEXT,
  compatibility_score INTEGER DEFAULT 0,
  match_breakdown_json TEXT,         -- JSON breakdown of coreTech, recruitment, education, leadership
  status TEXT DEFAULT 'discovered',  -- discovered, analyzed, shortlisted, resume_prepared, cover_letter_prepared, waiting_approval, approved, applied, interview_scheduled, offer, rejected, archived
  source_retrieved_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_pipeline_status ON job_pipeline(status);
CREATE INDEX IF NOT EXISTS idx_job_pipeline_score ON job_pipeline(compatibility_score DESC);
CREATE INDEX IF NOT EXISTS idx_job_pipeline_source ON job_pipeline(source);

-- 2. Companies Knowledge Store
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  website TEXT,
  industry TEXT,
  notes TEXT,
  created_at TEXT NOT NULL
);

-- 3. Application Lifecycle Tracker
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  job_id TEXT REFERENCES job_pipeline(id),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  contact_email TEXT,
  resume_version_id TEXT,
  cover_letter TEXT,
  outreach_subject TEXT,
  outreach_body TEXT,
  approval_status TEXT DEFAULT 'pending_review', -- pending_review, approved_by_owner, rejected, dispatched
  current_stage TEXT DEFAULT 'applied',          -- applied, acknowledged, screening, interview_scheduled, offer_received, rejected, withdrawn, closed
  applied_at TEXT,
  follow_up_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_applications_stage ON applications(current_stage);
CREATE INDEX IF NOT EXISTS idx_applications_approval ON applications(approval_status);

-- 4. Outreach Drafts & Approval Staging Queue
CREATE TABLE IF NOT EXISTS outreach_drafts (
  id TEXT PRIMARY KEY,
  application_id TEXT REFERENCES applications(id),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  attachment_filename TEXT,
  status TEXT DEFAULT 'draft', -- draft, awaiting_approval, approved_ready_to_send, sent, cancelled
  approved_at TEXT,
  sent_at TEXT,
  error_log TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_outreach_status ON outreach_drafts(status);

-- 5. Resume & Cover Letter Version History
CREATE TABLE IF NOT EXISTS resume_versions (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  role_target TEXT NOT NULL,
  tailored_summary TEXT NOT NULL,
  selected_skills_json TEXT NOT NULL,
  selected_projects_json TEXT NOT NULL,
  format_type TEXT DEFAULT 'ats_plaintext', -- ats_plaintext, vector_pdf, docx
  raw_content TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 6. Job Search & Harvester Configuration
CREATE TABLE IF NOT EXISTS career_preferences (
  id TEXT PRIMARY KEY, -- 'default'
  target_titles_json TEXT NOT NULL,
  target_locations_json TEXT NOT NULL,
  remote_preference TEXT DEFAULT 'any',
  min_salary INTEGER DEFAULT 0,
  preferred_tech_json TEXT NOT NULL,
  auto_harvest_enabled INTEGER DEFAULT 1,
  harvest_cron TEXT DEFAULT '0 8 * * *',
  last_harvest_at TEXT,
  updated_at TEXT NOT NULL
);

-- 7. Dynamic Profile CMS & Knowledge Base
CREATE TABLE IF NOT EXISTS profile_records (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL, -- personal, summary, skills, experience, education, research, leadership, projects
  record_key TEXT NOT NULL,
  title TEXT NOT NULL,
  data_json TEXT NOT NULL,
  source_evidence TEXT,
  publishing_status TEXT DEFAULT 'published', -- draft, under_review, verified, approved, published, archived
  version INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profile_records_section ON profile_records(section);
CREATE INDEX IF NOT EXISTS idx_profile_records_status ON profile_records(publishing_status);

-- 8. Profile Revisions Audit Trail
CREATE TABLE IF NOT EXISTS profile_revisions (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  changed_by TEXT DEFAULT 'owner',
  previous_data_json TEXT,
  new_data_json TEXT NOT NULL,
  change_summary TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 9. Industry Trends & Skill Gap Intelligence
CREATE TABLE IF NOT EXISTS trend_items (
  id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  category TEXT NOT NULL, -- frontend, backend, ai, recruitment, devops
  summary TEXT NOT NULL,
  relevance_score INTEGER DEFAULT 80,
  related_skills_json TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  action_recommendation TEXT,
  approval_status TEXT DEFAULT 'suggested', -- suggested, approved, dismissed
  discovered_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trend_category ON trend_items(category);

-- 10. Privacy-Conscious Recruiter Visitor Analytics
CREATE TABLE IF NOT EXISTS recruiter_analytics (
  id TEXT PRIMARY KEY,
  page_path TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- page_view, matcher_run, resume_download, digital_twin_chat, project_demo
  referrer TEXT,
  device_category TEXT DEFAULT 'desktop', -- desktop, mobile, tablet
  country_code TEXT DEFAULT 'GLOBAL',
  event_metadata_json TEXT,
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_path ON recruiter_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON recruiter_analytics(timestamp DESC);

-- 11. External Integrations Health & Settings
CREATE TABLE IF NOT EXISTS integrations_settings (
  id TEXT PRIMARY KEY, -- gmail, google_oauth, openrouter, d1, adzuna, remoteok
  service_name TEXT NOT NULL,
  connection_status TEXT DEFAULT 'configured', -- connected, configured, disconnected, awaiting_credentials
  scopes TEXT,
  last_sync_at TEXT,
  error_message TEXT,
  metadata_json TEXT,
  updated_at TEXT NOT NULL
);

-- 12. Audit Logs
CREATE TABLE IF NOT EXISTS platform_audit_logs (
  id TEXT PRIMARY KEY,
  check_type TEXT NOT NULL,
  status TEXT NOT NULL,
  details TEXT,
  timestamp TEXT NOT NULL
);
