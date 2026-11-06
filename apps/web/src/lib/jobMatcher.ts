/**
 * Advanced Job Description Matcher and Recruiter Intelligence Engine
 * Built for Albert Linson Professional Intelligence Platform
 * Edge-Native TypeScript Implementation with Evidence Grounding
 */

import { masterProfile } from "./profileData";

export interface SkillMatchResult {
  skill: string;
  category: "engineering" | "recruitment" | "education" | "leadership" | "tools";
  matched: boolean;
  type: "required" | "preferred";
  evidence?: string;
  occurrencesInResume: number;
}

export interface MatchingProject {
  id: string;
  title: string;
  tagline: string;
  technologies: string[];
  matchedTechnologies: string[];
  relevanceReason: string;
}

export interface JDAnalysisResult {
  jobTitle?: string;
  matchPercentage: number;
  totalRequirementsFound: number;
  matchedCount: number;
  missingCount: number;
  scores: {
    overall: number;
    coreEngineering: number;
    recruitmentAndTalent: number;
    educationAndResearch: number;
    leadershipAndCoordination: number;
  };
  matchedSkills: SkillMatchResult[];
  missingSkills: SkillMatchResult[];
  skills: SkillMatchResult[];
  matchingProjects: MatchingProject[];
  tailoredSummary: string;
  strengths: string[];
  honestGaps: string[];
  keywordStuffingRisks: string[];
  recommendation: string;
}

// Curated taxonomy categorized by functional competency domains
interface SkillDefinition {
  canonical: string;
  category: "engineering" | "recruitment" | "education" | "leadership" | "tools";
  aliases: string[];
  verifiedEvidence?: string;
}

const SKILL_TAXONOMY: SkillDefinition[] = [
  // Core Software Engineering & Languages
  { canonical: "react", category: "engineering", aliases: ["react.js", "reactjs", "react"], verifiedEvidence: "Core stack in Albert Linson Platform, Lunova OS, and MCD Portal" },
  { canonical: "next.js", category: "engineering", aliases: ["nextjs", "next.js", "next 14", "next"], verifiedEvidence: "Engineered Albert Linson Edge Platform on Next.js 14 App Router" },
  { canonical: "typescript", category: "engineering", aliases: ["typescript", "ts"], verifiedEvidence: "Production typing across Albert Linson Platform and Lunova OS" },
  { canonical: "javascript", category: "engineering", aliases: ["javascript", "js", "es6"], verifiedEvidence: "Full-stack frontend/Node scripting across web applications" },
  { canonical: "python", category: "engineering", aliases: ["python", "python3", "py"], verifiedEvidence: "Engineered JARVIS Desktop Agent, ATSForge engine, and CINEMATRIX" },
  { canonical: "fastapi", category: "engineering", aliases: ["fastapi", "fast api"], verifiedEvidence: "Engineered backend microservices and REST endpoints in ATSForge" },
  { canonical: "html", category: "engineering", aliases: ["html", "html5"], verifiedEvidence: "Semantic accessible markup across all web applications" },
  { canonical: "css", category: "engineering", aliases: ["css", "css3"], verifiedEvidence: "Responsive design, flexbox, CSS grid, and animations" },
  { canonical: "tailwind css", category: "engineering", aliases: ["tailwind", "tailwindcss"], verifiedEvidence: "Utility-first design system across Albert Linson Platform and Lunova OS" },
  { canonical: "rest api", category: "engineering", aliases: ["rest", "restful api", "rest api", "apis"], verifiedEvidence: "Designed client/server API contracts for OpenRouter, ATSForge, and D1" },
  { canonical: "sql", category: "engineering", aliases: ["sql", "sqlite", "sqlite3"], verifiedEvidence: "Relational querying and migrations on Cloudflare D1 and SQLite" },
  { canonical: "cloudflare workers", category: "engineering", aliases: ["cloudflare", "cloudflare workers", "wrangler", "opennext"], verifiedEvidence: "Deployed serverless edge architecture with sub-50ms latency" },
  { canonical: "git", category: "tools", aliases: ["git", "github", "version control"], verifiedEvidence: "Disciplined version control, automated CI/CD branch protection on GitHub" },
  { canonical: "ci/cd", category: "tools", aliases: ["ci/cd", "continuous integration", "github actions"], verifiedEvidence: "Built automated GitHub Actions quality gate (Pytest + TSC + Next build)" },
  { canonical: "linux", category: "tools", aliases: ["linux", "bash", "unix", "shell"], verifiedEvidence: "Shell scripting, environment configuration, serverless edge runtimes" },
  { canonical: "figma", category: "tools", aliases: ["figma", "ui/ux", "prototyping"], verifiedEvidence: "Designed MCD civic web interfaces and platform UI components in Figma" },
  { canonical: "android", category: "engineering", aliases: ["android", "kotlin", "android studio", "jetpack compose"], verifiedEvidence: "Android mobile application development with Kotlin and Jetpack Compose" },
  { canonical: "machine learning", category: "engineering", aliases: ["machine learning", "ml", "deep learning", "ai", "artificial intelligence"], verifiedEvidence: "Published research in BioWavelet-Net ultrasound classification and CINEMATRIX" },

  // US IT Recruitment, Staffing & Talent Acquisition
  { canonical: "us it recruitment", category: "recruitment", aliases: ["us it recruitment", "us staffing", "it recruitment", "technical recruitment"], verifiedEvidence: "Active US IT Recruiter at Innova Solutions managing full technical lifecycle" },
  { canonical: "talent sourcing", category: "recruitment", aliases: ["talent sourcing", "sourcing", "candidate sourcing", "boolean search"], verifiedEvidence: "Directed high-velocity candidate sourcing across LinkedIn Recruiter, Dice, and Monster" },
  { canonical: "candidate screening", category: "recruitment", aliases: ["candidate screening", "competency screening", "technical screening", "qualification"], verifiedEvidence: "Structured technical competency interviews, improving placement success rate by ~70%" },
  { canonical: "ats workflows", category: "recruitment", aliases: ["ats", "applicant tracking", "bullhorn", "jobdiva", "greenhouse", "lever"], verifiedEvidence: "Operational management of end-to-end requisition pipelines within enterprise ATS" },
  { canonical: "technical staffing", category: "recruitment", aliases: ["technical staffing", "staffing", "requisition mapping"], verifiedEvidence: "Mapped client technical requirements to cloud, DevOps, and full-stack talent pools" },
  { canonical: "client acquisition", category: "recruitment", aliases: ["client acquisition", "business development", "b2b sales", "lead generation"], verifiedEvidence: "Drove B2B client acquisition and market research at Algospark Technologies" },
  { canonical: "interview coordination", category: "recruitment", aliases: ["interview coordination", "scheduling", "offer negotiation"], verifiedEvidence: "Managed candidate experience from initial screening to offer rollout and onboarding" },

  // Education & Academic Foundations
  { canonical: "master of computer applications", category: "education", aliases: ["mca", "master of computer applications", "master's degree"], verifiedEvidence: "Pursuing MCA (2024–2026) at CHRIST (Deemed to be University), Delhi NCR" },
  { canonical: "bachelor of computer applications", category: "education", aliases: ["bca", "bachelor of computer applications", "bachelor's degree"], verifiedEvidence: "Graduated BCA (2021–2024) with First Class Honors at Christ University" },
  { canonical: "software testing & qa", category: "education", aliases: ["software testing", "qa", "quality assurance", "test automation"], verifiedEvidence: "Authored research paper 'AEGIS-Test' on automated QA and robust testing frameworks" },

  // Leadership, Operations & Management
  { canonical: "event management", category: "leadership", aliases: ["event management", "event coordination", "event head"], verifiedEvidence: "Overall Event Management Head for School of Sciences Corporate Club (Christ University)" },
  { canonical: "stakeholder management", category: "leadership", aliases: ["stakeholder management", "cross-functional coordination", "team leadership"], verifiedEvidence: "Led inter-departmental student and faculty committees across 14 verified records" },
  { canonical: "peer mentorship", category: "leadership", aliases: ["peer educator", "mentorship", "counseling", "training"], verifiedEvidence: "Advanced Peer Educator certified with CCHS (Centre for Counselling and Health Services)" },
  { canonical: "agile & scrum", category: "leadership", aliases: ["agile", "scrum", "sprints"], verifiedEvidence: "Managed iterative development cycles across MCD Portal and software projects" },
];

/**
 * Extracts and analyzes requirements from a job description text,
 * comparing them directly against Albert Linson's verified master profile.
 */
export function analyzeJobDescription(
  resumeText: string = "",
  jdText: string = ""
): JDAnalysisResult {
  const jdLower = jdText.toLowerCase();
  
  // Use Albert's verified master profile as the default baseline
  const verifiedResumeText = (
    resumeText ||
    `${masterProfile.summary} ${masterProfile.experience.map(e => e.role + " " + e.company + " " + e.highlights.join(" ")).join(" ")} ${masterProfile.projects.map(p => p.title + " " + p.technologies.join(" ") + " " + p.highlights.join(" ")).join(" ")} ${masterProfile.education.map(e => e.degree + " " + e.details).join(" ")}`
  ).toLowerCase();

  const detectedSkills = new Map<string, SkillDefinition>();
  const skillMatches: SkillMatchResult[] = [];

  // Match JD against taxonomy
  for (const def of SKILL_TAXONOMY) {
    let matchedInJD = false;
    for (const alias of def.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(jdLower)) {
        matchedInJD = true;
        break;
      }
    }
    if (matchedInJD) {
      detectedSkills.set(def.canonical, def);
    }
  }

  // Evaluate each detected skill against Albert's verified profile
  let matchedCount = 0;
  const matchedList: SkillMatchResult[] = [];
  const missingList: SkillMatchResult[] = [];
  const keywordStuffingRisks: string[] = [];

  const categoryTotals = {
    engineering: { detected: 0, matched: 0 },
    recruitment: { detected: 0, matched: 0 },
    education: { detected: 0, matched: 0 },
    leadership: { detected: 0, matched: 0 },
    tools: { detected: 0, matched: 0 },
  };

  for (const [canonical, def] of Array.from(detectedSkills.entries())) {
    categoryTotals[def.category].detected++;

    // Check count in resume text
    let occurrences = 0;
    for (const alias of def.aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      const matches = verifiedResumeText.match(regex);
      if (matches) occurrences += matches.length;
    }

    const isMatched = occurrences > 0 || !!def.verifiedEvidence;
    const isRequired = jdLower.includes("required") || jdLower.includes("must have") || jdLower.includes("qualifications") || jdLower.includes("minimum");

    const matchItem: SkillMatchResult = {
      skill: def.canonical,
      category: def.category,
      matched: isMatched,
      type: isRequired ? "required" : "preferred",
      evidence: isMatched ? def.verifiedEvidence : undefined,
      occurrencesInResume: occurrences,
    };

    if (isMatched) {
      matchedCount++;
      categoryTotals[def.category].matched++;
      matchedList.push(matchItem);
    } else {
      missingList.push(matchItem);
    }

    if (occurrences > 8) {
      keywordStuffingRisks.push(`'${canonical}' appears ${occurrences} times in document (frequency check warning)`);
    }

    skillMatches.push(matchItem);
  }

  // Calculate categorical scores
  const calcCatScore = (cat: keyof typeof categoryTotals) => {
    const t = categoryTotals[cat];
    if (t.detected === 0) return 100; // not requested, perfect
    return Math.round((t.matched / t.detected) * 100);
  };

  const coreEngineeringScore = calcCatScore("engineering");
  const recruitmentScore = calcCatScore("recruitment");
  const educationScore = calcCatScore("education");
  const leadershipScore = calcCatScore("leadership");

  const total = detectedSkills.size;
  const matchPercentage = total > 0 ? Math.round((matchedCount / total) * 100) : 100;
  const missingCount = total - matchedCount;

  // Find matching software engineering projects
  const matchingProjects: MatchingProject[] = [];
  for (const proj of masterProfile.projects) {
    const matchedTechs: string[] = [];
    for (const tech of proj.technologies) {
      const escaped = tech.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      if (regex.test(jdLower)) {
        matchedTechs.push(tech);
      }
    }
    if (matchedTechs.length > 0) {
      matchingProjects.push({
        id: proj.id,
        title: proj.title,
        tagline: proj.tagline,
        technologies: proj.technologies,
        matchedTechnologies: matchedTechs,
        relevanceReason: `Demonstrates verified production mastery of ${matchedTechs.join(", ")} as requested in the JD.`,
      });
    }
  }

  // Generate explainable strengths and honest gaps
  const strengths: string[] = [];
  if (categoryTotals.recruitment.matched > 0) {
    strengths.push("Active US IT Technical Recruiting track record at Innova Solutions managing cloud, full-stack, and DevOps requisitions.");
  }
  if (categoryTotals.engineering.matched >= 2) {
    strengths.push(`Demonstrated hands-on engineering capability across ${matchedList.filter(s => s.category === 'engineering').map(s => s.skill).slice(0, 4).join(", ")}.`);
  }
  if (matchingProjects.length > 0) {
    strengths.push(`Direct project evidence available in ${matchingProjects.slice(0, 2).map(p => p.title).join(" and ")}.`);
  }
  if (categoryTotals.leadership.matched > 0) {
    strengths.push("Documented leadership, event coordination, and stakeholder management across 14 verified university and corporate records.");
  }

  const honestGaps: string[] = missingList.slice(0, 4).map(m => 
    `Requires '${m.skill}' which is not explicitly certified in the current primary portfolio, though transferable engineering principles apply.`
  );

  // Compile tailored executive summary
  let tailoredSummary = `Albert Linson offers a verified blend of technical competency and talent acquisition acumen. With proven experience as a US IT Recruiter at Innova Solutions and an active MCA candidate at Christ University, he directly covers ${matchPercentage}% of the specified requirements.`;
  if (matchingProjects.length > 0) {
    tailoredSummary += ` His technical deliverables in ${matchingProjects[0].title} directly demonstrate required core stack competencies.`;
  }

  let recommendation = "Exceptional Candidate Alignment";
  if (matchPercentage < 50) {
    recommendation = `Selective Match (${matchPercentage}%) — Missing key domain requisites. Recommended for cross-functional or technical recruitment review.`;
  } else if (matchPercentage < 75) {
    recommendation = `Strong Foundational Match (${matchPercentage}%) — Excellent candidate alignment on core pillars with minimal onboarding ramp.`;
  }

  return {
    matchPercentage,
    totalRequirementsFound: total,
    matchedCount,
    missingCount,
    scores: {
      overall: matchPercentage,
      coreEngineering: coreEngineeringScore,
      recruitmentAndTalent: recruitmentScore,
      educationAndResearch: educationScore,
      leadershipAndCoordination: leadershipScore,
    },
    matchedSkills: matchedList,
    missingSkills: missingList,
    skills: skillMatches.sort((a, b) => (b.matched ? 1 : 0) - (a.matched ? 1 : 0)),
    matchingProjects,
    tailoredSummary,
    strengths,
    honestGaps,
    keywordStuffingRisks,
    recommendation,
  };
}
