import profileJson from "../../../packages/shared/profile_data.json";

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
    bio: string;
  };
  summary: string;
  skills: {
    analytics_and_ai: string[];
    frontend_and_design: string[];
    backend_and_cloud: string[];
    recruitment_and_business: string[];
  };
  experience: Array<{
    id: string;
    role: string;
    company: string;
    location: string;
    period: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    period: string;
    details: string;
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
    highlights: string[];
    github_url: string;
    status: string;
  }>;
}

export const masterProfile: ProfileData = profileJson as ProfileData;
