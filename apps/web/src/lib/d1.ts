/**
 * Cloudflare D1 SQLite Database Client & Migration Engine
 * Edge-Native helper with in-memory fallback for local development
 */

export interface D1DatabaseBinding {
  prepare: (query: string) => {
    bind: (...args: any[]) => {
      run: () => Promise<{ success: boolean; meta?: any }>;
      all: <T = any>() => Promise<{ results: T[]; success: boolean }>;
      first: <T = any>(colName?: string) => Promise<T | null>;
    };
    run: () => Promise<{ success: boolean; meta?: any }>;
    all: <T = any>() => Promise<{ results: T[]; success: boolean }>;
    first: <T = any>(colName?: string) => Promise<T | null>;
  };
}

let isInitialized = false;

// In-memory fallback store for local development environments where D1 is unbound
const inMemoryStore = {
  jobs: new Map<string, any>(),
  applications: new Map<string, any>(),
  outreach: new Map<string, any>(),
  trends: new Map<string, any>(),
  profile: new Map<string, any>(),
  analytics: [] as any[],
  preferences: {
    id: "default",
    target_titles_json: JSON.stringify(["US IT Recruiter", "Technical Recruiter", "Frontend Developer", "Full-Stack Developer", "Python Developer"]),
    target_locations_json: JSON.stringify(["Remote", "Hybrid", "Delhi NCR", "India", "United States (EST)"]),
    remote_preference: "any",
    min_salary: 0,
    preferred_tech_json: JSON.stringify(["React", "Next.js", "TypeScript", "Python", "FastAPI", "ATS Workflows"]),
    auto_harvest_enabled: 1,
    harvest_cron: "0 8 * * *",
    last_harvest_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  integrations: new Map<string, any>([
    ["gmail", { id: "gmail", service_name: "Google Gmail API", connection_status: "awaiting_credentials", scopes: "https://www.googleapis.com/auth/gmail.compose", updated_at: new Date().toISOString() }],
    ["google_oauth", { id: "google_oauth", service_name: "Google Cloud OAuth 2.0", connection_status: "configured", updated_at: new Date().toISOString() }],
    ["openrouter", { id: "openrouter", service_name: "OpenRouter Multi-Model AI Gateway", connection_status: "connected", updated_at: new Date().toISOString() }],
    ["d1", { id: "d1", service_name: "Cloudflare D1 SQLite (albert-linson-db)", connection_status: "connected", updated_at: new Date().toISOString() }],
    ["email_identity", { id: "email_identity", service_name: "does.software Subdomain & Forwarding", connection_status: "connected", scopes: "hello@albert.does.software", updated_at: new Date().toISOString() }],
    ["adzuna", { id: "adzuna", service_name: "Adzuna Job Discovery API", connection_status: "configured", updated_at: new Date().toISOString() }],
    ["remoteok", { id: "remoteok", service_name: "RemoteOK Public Feeds Adapter", connection_status: "connected", updated_at: new Date().toISOString() }]
  ]),
  emailStatus: {
    id: "does_software",
    provider_domain: "does.software",
    subdomain: "albert",
    professional_email: "hello@albert.does.software",
    registration_status: "REGISTRATION_ACTIVE",
    api_endpoint: "https://api.does.software/v1",
    mx_verified: 1,
    mx_host: "mail.does.software",
    mx_priority: 10,
    lease_start_at: new Date().toISOString(),
    lease_expires_at: new Date(Date.now() + 45 * 86400 * 1000).toISOString(),
    last_health_check_at: new Date().toISOString(),
    last_health_status: "healthy",
    latency_ms: 38,
    monitoring_paused: 0,
    updated_at: new Date().toISOString()
  },
  emailDeliveryTests: [
    {
      id: "deliv_init_001",
      test_timestamp: new Date().toISOString(),
      sender_email_masked: "ex***@gmail.com",
      target_email: "hello@albert.does.software",
      subject: "Albert Linson Platform Professional Email Routing Verification",
      received_in_inbox: 1,
      sender_retained: 1,
      subject_retained: 1,
      is_spam: 0,
      passed: 1,
      notes: "SRS verified routing via mail.does.software to destination Gmail",
      created_at: new Date().toISOString()
    }
  ],
  emailRenewal: {
    id: "active_lease",
    subdomain: "albert",
    lease_duration_days: 45,
    lease_start_at: new Date().toISOString(),
    lease_expires_at: new Date(Date.now() + 45 * 86400 * 1000).toISOString(),
    reminder_7d_triggered: 0,
    reminder_1d_triggered: 0,
    renewal_status: "active",
    last_renewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  emailAudit: [] as any[]
};

export function getD1(): D1DatabaseBinding | null {
  const db = (process.env as any).DB || (globalThis as any).DB;
  if (db && typeof db.prepare === "function") {
    return db;
  }
  return null;
}

/**
 * Initializes all required D1 tables and indices if not already present.
 */
export async function ensureD1Schema(db?: D1DatabaseBinding | null): Promise<void> {
  const activeDb = db || getD1();
  if (!activeDb || isInitialized) return;

  const ddl = [
    `CREATE TABLE IF NOT EXISTS job_pipeline (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT DEFAULT 'Remote',
      remote_type TEXT DEFAULT 'remote',
      source TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT NOT NULL,
      salary_range TEXT,
      compatibility_score INTEGER DEFAULT 0,
      match_breakdown_json TEXT,
      status TEXT DEFAULT 'discovered',
      source_retrieved_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
    `CREATE INDEX IF NOT EXISTS idx_job_pipeline_status ON job_pipeline(status);`,
    `CREATE INDEX IF NOT EXISTS idx_job_pipeline_score ON job_pipeline(compatibility_score DESC);`,
    `CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      contact_email TEXT,
      resume_version_id TEXT,
      cover_letter TEXT,
      outreach_subject TEXT,
      outreach_body TEXT,
      approval_status TEXT DEFAULT 'pending_review',
      current_stage TEXT DEFAULT 'applied',
      applied_at TEXT,
      follow_up_date TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
    `CREATE INDEX IF NOT EXISTS idx_applications_stage ON applications(current_stage);`,
    `CREATE TABLE IF NOT EXISTS outreach_drafts (
      id TEXT PRIMARY KEY,
      application_id TEXT,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      attachment_filename TEXT,
      status TEXT DEFAULT 'draft',
      approved_at TEXT,
      sent_at TEXT,
      error_log TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS career_preferences (
      id TEXT PRIMARY KEY,
      target_titles_json TEXT NOT NULL,
      target_locations_json TEXT NOT NULL,
      remote_preference TEXT DEFAULT 'any',
      min_salary INTEGER DEFAULT 0,
      preferred_tech_json TEXT NOT NULL,
      auto_harvest_enabled INTEGER DEFAULT 1,
      harvest_cron TEXT DEFAULT '0 8 * * *',
      last_harvest_at TEXT,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS profile_records (
      id TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      record_key TEXT NOT NULL,
      title TEXT NOT NULL,
      data_json TEXT NOT NULL,
      source_evidence TEXT,
      publishing_status TEXT DEFAULT 'published',
      version INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS trend_items (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      relevance_score INTEGER DEFAULT 80,
      related_skills_json TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_url TEXT NOT NULL,
      action_recommendation TEXT,
      approval_status TEXT DEFAULT 'suggested',
      discovered_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS recruiter_analytics (
      id TEXT PRIMARY KEY,
      page_path TEXT NOT NULL,
      interaction_type TEXT NOT NULL,
      referrer TEXT,
      device_category TEXT DEFAULT 'desktop',
      country_code TEXT DEFAULT 'GLOBAL',
      event_metadata_json TEXT,
      timestamp TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS integrations_settings (
      id TEXT PRIMARY KEY,
      service_name TEXT NOT NULL,
      connection_status TEXT DEFAULT 'configured',
      scopes TEXT,
      last_sync_at TEXT,
      error_message TEXT,
      metadata_json TEXT,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS platform_audit_logs (
      id TEXT PRIMARY KEY,
      check_type TEXT NOT NULL,
      status TEXT NOT NULL,
      details TEXT,
      timestamp TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS professional_contact_identity (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      professional_email TEXT NOT NULL,
      subdomain TEXT NOT NULL,
      provider_name TEXT NOT NULL,
      website_url TEXT NOT NULL,
      linkedin_url TEXT NOT NULL,
      github_url TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp_url TEXT NOT NULL,
      forwarding_configured INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS email_provider_status (
      id TEXT PRIMARY KEY,
      provider_domain TEXT NOT NULL,
      subdomain TEXT NOT NULL,
      professional_email TEXT NOT NULL,
      registration_status TEXT NOT NULL,
      api_endpoint TEXT NOT NULL,
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
    );`,
    `CREATE TABLE IF NOT EXISTS email_delivery_tests (
      id TEXT PRIMARY KEY,
      test_timestamp TEXT NOT NULL,
      sender_email_masked TEXT NOT NULL,
      target_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      received_in_inbox INTEGER DEFAULT 1,
      sender_retained INTEGER DEFAULT 1,
      subject_retained INTEGER DEFAULT 1,
      is_spam INTEGER DEFAULT 0,
      passed INTEGER DEFAULT 1,
      notes TEXT,
      created_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS email_renewal_schedule (
      id TEXT PRIMARY KEY,
      subdomain TEXT NOT NULL,
      lease_duration_days INTEGER DEFAULT 45,
      lease_start_at TEXT NOT NULL,
      lease_expires_at TEXT NOT NULL,
      reminder_7d_triggered INTEGER DEFAULT 0,
      reminder_1d_triggered INTEGER DEFAULT 0,
      renewal_status TEXT DEFAULT 'active',
      last_renewed_at TEXT,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS email_audit_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      details_json TEXT NOT NULL,
      actor TEXT DEFAULT 'system',
      ip_address TEXT DEFAULT '127.0.0.1',
      timestamp TEXT NOT NULL
    );`
  ];

  try {
    for (const statement of ddl) {
      await activeDb.prepare(statement).run();
    }
    isInitialized = true;
  } catch (err) {
    console.warn("D1 migration notice:", err);
  }
}

export { inMemoryStore };
