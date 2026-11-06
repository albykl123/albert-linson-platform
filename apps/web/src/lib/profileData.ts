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
