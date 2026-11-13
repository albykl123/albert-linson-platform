import profileJson from "@/data/profile_data.json";

export interface SkillItem {
  name: string;
  category: string;
  evidence: string;
}

export interface LeadershipRecord {
  id: string;
  title: string;
  role_level: string;
  organization: string;
  institution: string;
  period: string;
  category: string;
  year?: number;
  responsibilities: string[];
  skills: string[];
  progression_note?: string;
  verification_status: string;
  public_visibility: boolean;
}

export interface ProfileData {
  personal: {
    name: string;
    full_legal_name: string;
    headline: string;
    sub_headline: string;
    location: string;
    email: string;
    secondary_email?: string;
    phone: string;
    whatsapp?: string;
    whatsapp_number?: string;
    linkedin: string;
    github: string;
    portfolio_url: string;
    languages?: Array<{ name: string; proficiency: string }>;
    bio: string;
  };
  summary: string;
  skills: {
    frontend_and_design: string[];
    backend_and_cloud: string[];
    recruitment_and_business: string[];
    analytics_and_ai: string[];
    frontend_development?: string[];
    programming_and_backend?: string[];
    android_development?: string[];
    ai_and_development?: string[];
    design?: string[];
    development_tools?: string[];
    professional_skills?: string[];
  };
  skill_levels?: {
    professional_work?: SkillItem[];
    professional_experience?: SkillItem[];
    project_experience?: SkillItem[];
    academic_experience?: SkillItem[];
    currently_learning?: SkillItem[];
    learning_familiarity?: SkillItem[];
  };
  experience: Array<{
    id: string;
    role: string;
    company: string;
    location: string;
    employment_type?: string;
    period: string;
    summary_50_words?: string;
    role_overview?: string;
    key_responsibilities?: string[];
    work_contributions?: string[];
    tools_and_platforms?: string[];
    skills_applied?: string[];
    kpis?: Array<{
      kpi_name: string;
      status: string;
      baseline: string;
      final_value: string;
      measurement_period: string;
      calculation_formula: string;
      evidence_source: string;
      business_outcome: string;
      is_published: boolean;
    }>;
    additional_context?: string;
    tools?: string[];
    responsibilities?: string[];
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    period: string;
    academic_status?: string;
    graduation_year?: string;
    cgpa_status?: string;
    cgpa?: number | string | null;
    grading_scale?: string;
    coursework?: string[];
    details: string;
    specialization?: string;
  }>;
  leadership: LeadershipRecord[];
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    year: string;
    description: string;
  }>;
  research: Array<{
    id: string;
    title: string;
    role: string;
    status: string;
    category: string;
    abstract: string;
    objectives: string[];
    methodology: string;
    paper_url: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    tagline: string;
    description: string;
    technologies: string[];
    architecture?: string;
    my_contribution?: string;
    highlights: string[];
    github_url: string;
    status: string;
    thumbnail?: string;
    category?: string;
    problem_addressed?: string;
    objectives?: string[];
    key_features?: string[];
    challenges_and_solutions?: string;
    verified_outcomes?: string[];
    live_url?: string;
  }>;
  github_repositories?: Array<{
    name: string;
    full_name: string;
    url: string;
    description: string;
    language: string;
    is_source: boolean;
    visibility: string;
    role: string;
  }>;
}

export const masterProfile: ProfileData = profileJson as ProfileData;

export interface VerifiedContactIdentity {
  name: string;
  professionalEmail: string;
  subdomain: string;
  website: string;
  linkedin: string;
  github: string;
  phone: string;
  whatsapp: string;
  forwardingConfigured: boolean;
}

export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export const verifiedContact: VerifiedContactIdentity = {
  name: masterProfile.personal.name || "Albert Linson K",
  professionalEmail: masterProfile.personal.email || "hello@albert.does.software",
  subdomain: "albert.does.software",
  website: masterProfile.personal.portfolio_url || "https://albert-linson-platform.albertkalampadan.workers.dev",
  linkedin: masterProfile.personal.linkedin || "https://www.linkedin.com/in/albert-linson-k-63792b23a/",
  github: masterProfile.personal.github || "https://github.com/albykl123",
  phone: masterProfile.personal.phone || "+91 9910705796",
  whatsapp: masterProfile.personal.whatsapp || "https://wa.me/919910705796",
  forwardingConfigured: true,
};
