import profileJson from "@/data/profile_data.json";

export interface SkillItem {
  name: string;
  category: string;
  evidence: string;
}

export interface ProfileData {
  personal: {
    name: string;
    full_legal_name: string;
    headline: string;
    sub_headline: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio_url: string;
    languages?: Array<{ name: string; proficiency: string }>;
    bio: string;
  };
  summary: string;
  skills: {
    analytics_and_ai: string[];
    frontend_and_design: string[];
    backend_and_cloud: string[];
    recruitment_and_business: string[];
  };
  skill_levels?: {
    professional_experience: SkillItem[];
    project_experience: SkillItem[];
    learning_familiarity: SkillItem[];
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
}

export const masterProfile: ProfileData = profileJson as ProfileData;
