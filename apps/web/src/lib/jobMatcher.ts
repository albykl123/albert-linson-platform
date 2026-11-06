/**
 * Job Description Matcher and Keyword Gap Analysis (TypeScript / Edge Native)
 */

export interface SkillMatchResult {
  skill: string;
  matched: boolean;
  type: "required" | "preferred";
  occurrencesInResume: number;
}

export interface JDAnalysisResult {
  matchPercentage: number;
  totalRequirementsFound: number;
  matchedCount: number;
  missingCount: number;
  skills: SkillMatchResult[];
  keywordStuffingRisks: string[];
  recommendation: string;
}

// Canonical tech vocabulary dictionary
const KNOWN_TECH_KEYWORDS = [
  "python", "javascript", "typescript", "react", "next.js", "node.js",
  "fastapi", "sql", "sqlite", "postgresql", "docker", "kubernetes", "aws",
  "cloudflare", "git", "ci/cd", "html", "css", "tailwind", "figma",
  "ui/ux", "machine learning", "artificial intelligence", "rest api",
  "graphql", "linux", "c++", "c", "bash", "powershell", "ats", "recruitment",
  "agile", "scrum", "data analysis", "microservices", "redis", "mongodb"
];

export function analyzeJobDescription(resumeText: string, jdText: string): JDAnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const detectedInJD = new Set<string>();
  const skillMatches: SkillMatchResult[] = [];

  // Match known tech words from JD
  for (const tech of KNOWN_TECH_KEYWORDS) {
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(jdLower)) {
      detectedInJD.add(tech);
    }
  }

  // Check occurrences in resume
  let matchedCount = 0;
  const keywordStuffingRisks: string[] = [];

  for (const skill of Array.from(detectedInJD)) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = resumeLower.match(regex);
    const count = matches ? matches.length : 0;
    const isMatched = count > 0;

    if (isMatched) {
      matchedCount++;
    }

    if (count > 7) {
      keywordStuffingRisks.push(`'${skill}' repeated ${count} times (risk of keyword-stuffing penalty)`);
    }

    // Heuristic: if JD has "required", "must have", "qualifications" near the term
    const isRequired = jdLower.includes("required") || jdLower.includes("must have") || jdLower.includes("qualifications");

    skillMatches.push({
      skill,
      matched: isMatched,
      type: isRequired ? "required" : "preferred",
      occurrencesInResume: count,
    });
  }

  const total = detectedInJD.size;
  const matchPercentage = total > 0 ? Math.round((matchedCount / total) * 100) : 100;
  const missingCount = total - matchedCount;

  let recommendation = "Strong alignment with target role requirements.";
  if (matchPercentage < 50) {
    recommendation = `Significant skill gap detected (${missingCount} missing keywords). Add relevant verified experience or project evidence.`;
  } else if (matchPercentage < 75) {
    recommendation = `Moderate alignment (${matchPercentage}%). Incorporate missing target keywords where you have genuine experience.`;
  }

  return {
    matchPercentage,
    totalRequirementsFound: total,
    matchedCount,
    missingCount,
    skills: skillMatches.sort((a, b) => (b.matched ? 1 : 0) - (a.matched ? 1 : 0)),
    keywordStuffingRisks,
    recommendation,
  };
}
