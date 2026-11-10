-- ==============================================================================
-- ALBERT LINSON PROFESSIONAL INTELLIGENCE PLATFORM
-- Migration: 0002_email_identity_schema.sql
-- Cloudflare D1 Relational SQLite Schema — Email Identity & Operational Health
-- ==============================================================================

-- 1. Centralized Verified Professional Contact Identity
CREATE TABLE IF NOT EXISTS professional_contact_identity (
  id TEXT PRIMARY KEY,                       -- e.g. 'primary'
  full_name TEXT NOT NULL,                   -- 'Albert Linson K'
  professional_email TEXT NOT NULL,          -- 'hello@albert.does.software'
  subdomain TEXT NOT NULL,                   -- 'albert.does.software'
  provider_name TEXT NOT NULL,               -- 'does.software'
  website_url TEXT NOT NULL,                 -- 'https://albert-linson-platform.albertkalampadan.workers.dev'
  linkedin_url TEXT NOT NULL,                -- 'https://www.linkedin.com/in/albert-linson-k-63792b23a/'
  github_url TEXT NOT NULL,                  -- 'https://github.com/albykl123'
  phone TEXT NOT NULL,                       -- '+91 9910705796'
  whatsapp_url TEXT NOT NULL,                -- 'https://wa.me/919910705796'
  forwarding_configured INTEGER DEFAULT 1,   -- 1 = True (private Gmail destination kept in secure env)
  is_active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- 2. Email Provider Status & Real-Time Health Telemetry
CREATE TABLE IF NOT EXISTS email_provider_status (
  id TEXT PRIMARY KEY,                       -- 'does_software'
  provider_domain TEXT NOT NULL,             -- 'does.software'
  subdomain TEXT NOT NULL,                   -- 'albert'
  professional_email TEXT NOT NULL,          -- 'hello@albert.does.software'
  registration_status TEXT NOT NULL,         -- SUBDOMAIN_CLAIMED, REGISTRATION_ACTIVE, FORWARDING_PENDING, DESTINATION_VERIFIED, MX_VERIFIED, DELIVERY_VERIFIED, FULLY_OPERATIONAL
  api_endpoint TEXT NOT NULL,                -- 'https://api.does.software/v1'
  mx_verified INTEGER DEFAULT 1,
  mx_host TEXT DEFAULT 'mail.does.software',
  mx_priority INTEGER DEFAULT 10,
  lease_start_at TEXT,
  lease_expires_at TEXT,
  last_health_check_at TEXT,
  last_health_status TEXT DEFAULT 'healthy',
  latency_ms INTEGER DEFAULT 0,
  monitoring_paused INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL
);

-- 3. Email Inbound Delivery Verification History
CREATE TABLE IF NOT EXISTS email_delivery_tests (
  id TEXT PRIMARY KEY,
  test_timestamp TEXT NOT NULL,
  sender_email_masked TEXT NOT NULL,         -- e.g. 'te***@external.com' (Redacted)
  target_email TEXT NOT NULL,                -- 'hello@albert.does.software'
  subject TEXT NOT NULL,
  received_in_inbox INTEGER DEFAULT 1,
  sender_retained INTEGER DEFAULT 1,
  subject_retained INTEGER DEFAULT 1,
  is_spam INTEGER DEFAULT 0,
  passed INTEGER DEFAULT 1,
  notes TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_delivery_timestamp ON email_delivery_tests(test_timestamp DESC);

-- 4. 45-Day Lease & Automated Renewal Schedule
CREATE TABLE IF NOT EXISTS email_renewal_schedule (
  id TEXT PRIMARY KEY,                       -- 'active_lease'
  subdomain TEXT NOT NULL,                   -- 'albert'
  lease_duration_days INTEGER DEFAULT 45,
  lease_start_at TEXT NOT NULL,
  lease_expires_at TEXT NOT NULL,
  reminder_7d_triggered INTEGER DEFAULT 0,
  reminder_1d_triggered INTEGER DEFAULT 0,
  renewal_status TEXT DEFAULT 'active',      -- active, pending_renewal, renewed, grace_period, expired
  last_renewed_at TEXT,
  updated_at TEXT NOT NULL
);

-- 5. Security Audit Log for Identity & Forwarding Lifecycle
CREATE TABLE IF NOT EXISTS email_audit_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,                  -- STAGE_TRANSITION, HEALTH_CHECK, MX_VERIFIED, DELIVERY_TEST, RENEWAL_REMINDER, etc.
  details_json TEXT NOT NULL,                -- Redacted JSON payload
  actor TEXT DEFAULT 'system',               -- 'system', 'owner', 'cron'
  ip_address TEXT DEFAULT '127.0.0.1',
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON email_audit_events(timestamp DESC);

-- Seed initial verified identity row
INSERT OR IGNORE INTO professional_contact_identity (
  id, full_name, professional_email, subdomain, provider_name, website_url,
  linkedin_url, github_url, phone, whatsapp_url, forwarding_configured, is_active,
  created_at, updated_at
) VALUES (
  'primary',
  'Albert Linson K',
  'hello@albert.does.software',
  'albert.does.software',
  'does.software',
  'https://albert-linson-platform.albertkalampadan.workers.dev',
  'https://www.linkedin.com/in/albert-linson-k-63792b23a/',
  'https://github.com/albykl123',
  '+91 9910705796',
  'https://wa.me/919910705796',
  1,
  1,
  datetime('now'),
  datetime('now')
);

-- Seed provider status row
INSERT OR IGNORE INTO email_provider_status (
  id, provider_domain, subdomain, professional_email, registration_status,
  api_endpoint, mx_verified, mx_host, mx_priority, lease_start_at, lease_expires_at,
  last_health_check_at, last_health_status, latency_ms, monitoring_paused, updated_at
) VALUES (
  'does_software',
  'does.software',
  'albert',
  'hello@albert.does.software',
  'REGISTRATION_ACTIVE',
  'https://api.does.software/v1',
  1,
  'mail.does.software',
  10,
  datetime('now'),
  datetime('now', '+45 days'),
  datetime('now'),
  'healthy',
  45,
  0,
  datetime('now')
);
