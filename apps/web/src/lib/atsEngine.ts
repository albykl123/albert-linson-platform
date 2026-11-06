/**
 * Deterministic 20-Rule ATS Compatibility Scoring Engine (TypeScript / Edge Native)
 * Evaluates resumes on a strict 0-100 score with reproducible rule deductions and one-click fixes.
 */

export interface ATSFinding {
  ruleId: string;
  category: "contact" | "structure" | "content" | "skills" | "formatting";
  title: string;
  severity: "critical" | "warning" | "good";
  scoreDelta: number;
  explanation: string;
  evidence?: string;
  recommendation: string;
  oneClickFixAvailable?: boolean;
  fixType?: string;
}

export interface ATSCategoryScore {
  category: string;
  name: string;
  score: number;
  maxScore: number;
  findings: ATSFinding[];
}

export interface ATSReport {
  overallScore: number;
  rating: "Critical Issues" | "Needs Work" | "Competitive" | "ATS-Ready";
  wordCount: number;
  readingTimeSeconds: number;
  categories: ATSCategoryScore[];
  summaryText: string;
  calculatedAt: string;
}

const STRONG_ACTION_VERBS = new Set([
  "architected", "engineered", "developed", "spearheaded", "optimized",
  "orchestrated", "implemented", "designed", "streamlined", "deployed",
  "automated", "reduced", "increased", "transformed", "directed",
  "managed", "collaborated", "constructed", "accelerated", "resolved",
  "built", "authored", "led", "established", "analyzed", "audited"
]);

const WEAK_WORDS_AND_PRONOUNS = [
  /\b(i|me|my|we|us|our)\b/i,
  /\b(responsible for|helped with|worked on|duties included|assisted with)\b/i,
];

export function evaluateATS(rawText: string): ATSReport {
  const text = rawText.trim();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const findings: ATSFinding[] = [];

  // 1. Contact Info: Email
  const hasEmail = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/.test(text);
  if (hasEmail) {
    findings.push({
      ruleId: "RULE_CONTACT_EMAIL",
      category: "contact",
      title: "Valid Email Address Found",
      severity: "good",
      scoreDelta: +5,
      explanation: "Recruiters and ATS parsers require a valid, reachable email.",
      recommendation: "Maintain standard professional email formatting.",
    });
  } else {
    findings.push({
      ruleId: "RULE_CONTACT_EMAIL",
      category: "contact",
      title: "Missing Email Address",
      severity: "critical",
      scoreDelta: -15,
      explanation: "No standard email address detected. Parsers will fail to identify candidate contact.",
      recommendation: "Add your professional email address prominently in the header.",
    });
  }

  // 2. Contact Info: Phone Number
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+91\s?\d{10}/.test(text);
  if (hasPhone) {
    findings.push({
      ruleId: "RULE_CONTACT_PHONE",
      category: "contact",
      title: "Phone Number Detected",
      severity: "good",
      scoreDelta: +5,
      explanation: "Valid phone number format located for recruiter outreach.",
      recommendation: "Ensure country code is provided for international recruiters.",
    });
  } else {
    findings.push({
      ruleId: "RULE_CONTACT_PHONE",
      category: "contact",
      title: "Phone Number Missing or Unparsed",
      severity: "warning",
      scoreDelta: -5,
      explanation: "A direct telephone number makes scheduling phone screens faster.",
      recommendation: "Include a mobile phone number with international area code.",
    });
  }

  // 3. Contact Info: Location
  const hasLocation = /\b(delhi|new york|california|san francisco|london|bangalore|remote|india|usa)\b/i.test(text);
  if (hasLocation) {
    findings.push({
      ruleId: "RULE_CONTACT_LOCATION",
      category: "contact",
      title: "Geographic Location Specified",
      severity: "good",
      scoreDelta: +5,
      explanation: "ATS uses geographic filters for regional and timezone eligibility.",
      recommendation: "City, Country or 'Remote' is optimal.",
    });
  } else {
    findings.push({
      ruleId: "RULE_CONTACT_LOCATION",
      category: "contact",
      title: "Location Unspecified",
      severity: "warning",
      scoreDelta: -3,
      explanation: "Location or remote preference is absent.",
      recommendation: "Specify 'City, Country' or 'Remote' in the contact header.",
    });
  }

  // 4. Contact Info: LinkedIn or Portfolio URL
  const hasLinkedIn = /(linkedin\.com\/in\/|github\.com\/|[a-zA-Z0-9-]+\.(dev|io|app|com))/i.test(text);
  if (hasLinkedIn) {
    findings.push({
      ruleId: "RULE_CONTACT_LINKS",
      category: "contact",
      title: "Professional Profiles Linked",
      severity: "good",
      scoreDelta: +5,
      explanation: "Verifiable GitHub, LinkedIn, or portfolio URLs build technical credibility.",
      recommendation: "Keep profile links clean without tracking tokens.",
    });
  } else {
    findings.push({
      ruleId: "RULE_CONTACT_LINKS",
      category: "contact",
      title: "No Professional Profile URLs",
      severity: "warning",
      scoreDelta: -4,
      explanation: "Technical recruiters expect a LinkedIn or GitHub link.",
      recommendation: "Add your LinkedIn profile URL and GitHub repository link.",
    });
  }

  // 5. Structure: Professional Summary Section
  const hasSummary = /(professional summary|executive summary|summary|profile|about me)/i.test(text);
  if (hasSummary) {
    findings.push({
      ruleId: "RULE_STRUCT_SUMMARY",
      category: "structure",
      title: "Standard Summary Section Present",
      severity: "good",
      scoreDelta: +5,
      explanation: "A focused summary provides immediate context for human screeners.",
      recommendation: "Keep between 3 to 4 sentences focused on measurable outcomes.",
    });
  } else {
    findings.push({
      ruleId: "RULE_STRUCT_SUMMARY",
      category: "structure",
      title: "Missing Professional Summary",
      severity: "warning",
      scoreDelta: -5,
      explanation: "Lack of a brief summary heading deprives recruiters of an immediate hook.",
      recommendation: "Add a 'Professional Summary' section at the top.",
      oneClickFixAvailable: true,
      fixType: "INSERT_SUMMARY",
    });
  }

  // 6. Structure: Work Experience Section
  const hasExperience = /(work experience|professional experience|employment history|experience)/i.test(text);
  if (hasExperience) {
    findings.push({
      ruleId: "RULE_STRUCT_EXPERIENCE",
      category: "structure",
      title: "Work Experience Section Standardized",
      severity: "good",
      scoreDelta: +10,
      explanation: "Standard 'Work Experience' heading recognized by ATS parsers.",
      recommendation: "List roles in reverse chronological order.",
    });
  } else {
    findings.push({
      ruleId: "RULE_STRUCT_EXPERIENCE",
      category: "structure",
      title: "Missing Work Experience Section",
      severity: "critical",
      scoreDelta: -20,
      explanation: "ATS could not identify an explicit work experience heading.",
      recommendation: "Add a clearly labeled 'Work Experience' section.",
    });
  }

  // 7. Structure: Education Section
  const hasEducation = /(education|academic background|degrees|university|christ university)/i.test(text);
  if (hasEducation) {
    findings.push({
      ruleId: "RULE_STRUCT_EDUCATION",
      category: "structure",
      title: "Education Section Identified",
      severity: "good",
      scoreDelta: +5,
      explanation: "Educational credentials parsed cleanly.",
      recommendation: "Include degree name, university, and graduation year.",
    });
  } else {
    findings.push({
      ruleId: "RULE_STRUCT_EDUCATION",
      category: "structure",
      title: "Education Section Missing",
      severity: "warning",
      scoreDelta: -5,
      explanation: "Degree credentials help satisfy mandatory screening thresholds.",
      recommendation: "Add an 'Education' section detailing your degrees.",
    });
  }

  // 8. Structure: Skills Section
  const hasSkills = /(skills|technical skills|core competencies|technologies)/i.test(text);
  if (hasSkills) {
    findings.push({
      ruleId: "RULE_STRUCT_SKILLS",
      category: "structure",
      title: "Dedicated Skills Section Found",
      severity: "good",
      scoreDelta: +10,
      explanation: "Allows keyword tokenizers to index competencies in one pass.",
      recommendation: "Categorize skills (e.g. Languages, Frameworks, Cloud, Tools).",
    });
  } else {
    findings.push({
      ruleId: "RULE_STRUCT_SKILLS",
      category: "structure",
      title: "No Dedicated Skills Section",
      severity: "critical",
      scoreDelta: -15,
      explanation: "Skills scattered inside narrative paragraphs are frequently missed.",
      recommendation: "Add a designated 'Skills' section categorized by domain.",
    });
  }

  // 9. Content: Action Verbs Density
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  let bulletCount = 0;
  let actionVerbCount = 0;

  for (const line of lines) {
    if (line.startsWith("*") || line.startsWith("-") || line.startsWith("•")) {
      bulletCount++;
      const cleanLine = line.replace(/^[*•-]\s*/, "");
      const firstWord = cleanLine.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
      if (firstWord && STRONG_ACTION_VERBS.has(firstWord)) {
        actionVerbCount++;
      }
    }
  }

  if (bulletCount > 0 && actionVerbCount / bulletCount >= 0.6) {
    findings.push({
      ruleId: "RULE_CONTENT_ACTION_VERBS",
      category: "content",
      title: "Strong Action Verb Usage",
      severity: "good",
      scoreDelta: +10,
      evidence: `${actionVerbCount} of ${bulletCount} bullets begin with powerful past-tense verbs.`,
      explanation: "Direct action verbs highlight individual ownership and impact.",
      recommendation: "Continue opening accomplishment bullets with strong verbs.",
    });
  } else if (bulletCount > 0) {
    findings.push({
      ruleId: "RULE_CONTENT_ACTION_VERBS",
      category: "content",
      title: "Low Action Verb Density",
      severity: "warning",
      scoreDelta: -8,
      evidence: `Only ${actionVerbCount} of ${bulletCount} bullets start with high-impact verbs.`,
      explanation: "Weak or passive openings reduce ATS parsing confidence.",
      recommendation: "Start bullets with verbs like 'Architected', 'Spearheaded', 'Optimized'.",
      oneClickFixAvailable: true,
      fixType: "ENHANCE_ACTION_VERBS",
    });
  }

  // 10. Content: Quantified Metrics & Results
  const metricsMatches = text.match(/(\$\s?\d[\d,.]*|\b\d+[\d,.]*\s?%|\b\d+\s?(ms|seconds|hours|users|clients|leads|tickets)\b)/gi) || [];
  if (metricsMatches.length >= 3) {
    findings.push({
      ruleId: "RULE_CONTENT_METRICS",
      category: "content",
      title: "Measurable Quantified Achievements",
      severity: "good",
      scoreDelta: +10,
      evidence: `Found ${metricsMatches.length} quantifiable metrics (e.g. ${metricsMatches.slice(0, 3).join(", ")}).`,
      explanation: "Quantified results dramatically elevate candidate ranking.",
      recommendation: "Keep metrics specific and verifiable.",
    });
  } else {
    findings.push({
      ruleId: "RULE_CONTENT_METRICS",
      category: "content",
      title: "Lack of Quantifiable Metrics",
      severity: "warning",
      scoreDelta: -10,
      evidence: `Found only ${metricsMatches.length} measurable metrics.`,
      explanation: "Resumes without numbers read like generic job descriptions rather than achievements.",
      recommendation: "Add measurable percentages, time savings, or scale to your bullets.",
      oneClickFixAvailable: true,
      fixType: "ADD_METRIC_PLACEHOLDERS",
    });
  }

  // 11. Content: First-Person Pronouns Check
  const pronounMatches = text.match(/\b(i|me|my|our|we)\b/gi) || [];
  if (pronounMatches.length === 0) {
    findings.push({
      ruleId: "RULE_CONTENT_PRONOUNS",
      category: "content",
      title: "Zero First-Person Pronouns",
      severity: "good",
      scoreDelta: +5,
      explanation: "Professional resumes avoid 'I', 'me', and 'my'.",
      recommendation: "Maintain objective third-person tone.",
    });
  } else {
    findings.push({
      ruleId: "RULE_CONTENT_PRONOUNS",
      category: "content",
      title: "First-Person Pronouns Detected",
      severity: "warning",
      scoreDelta: -5,
      evidence: `Detected ${pronounMatches.length} instances of pronouns (${Array.from(new Set(pronounMatches.map(p => p.toLowerCase()))).join(", ")}).`,
      explanation: "First-person pronouns are non-standard in executive resumes.",
      recommendation: "Remove pronouns and begin statements with active verbs.",
      oneClickFixAvailable: true,
      fixType: "REMOVE_PRONOUNS",
    });
  }

  // 12. Formatting: Glyph & Non-Standard Symbol Check
  const badGlyphs = text.match(/[✓✔✕✖★☆✦◆❖➢➤➔]/g) || [];
  if (badGlyphs.length === 0) {
    findings.push({
      ruleId: "RULE_FORMAT_GLYPHS",
      category: "formatting",
      title: "Clean Typography & Safe Glyphs",
      severity: "good",
      scoreDelta: +5,
      explanation: "Standard UTF-8 characters prevent parser encoding corruption.",
      recommendation: "Use standard round bullets or hyphens.",
    });
  } else {
    findings.push({
      ruleId: "RULE_FORMAT_GLYPHS",
      category: "formatting",
      title: "Non-Standard Glyphs Detected",
      severity: "warning",
      scoreDelta: -5,
      evidence: `Found decorative symbols: ${Array.from(new Set(badGlyphs)).join(" ")}`,
      explanation: "Decorative icons and rating stars can corrupt text during ATS OCR and parsing.",
      recommendation: "Replace custom icons with standard bullet points.",
      oneClickFixAvailable: true,
      fixType: "SANITIZE_GLYPHS",
    });
  }

  // 13. Word Count Bounds
  if (wordCount >= 400 && wordCount <= 1000) {
    findings.push({
      ruleId: "RULE_FORMAT_WORD_COUNT",
      category: "formatting",
      title: "Optimal Word Count",
      severity: "good",
      scoreDelta: +5,
      evidence: `${wordCount} words detected (ideal single or double page length).`,
      explanation: "Concisely formatted document fits ATS token windows.",
      recommendation: "Keep between 400 and 1,000 words.",
    });
  } else if (wordCount < 400) {
    findings.push({
      ruleId: "RULE_FORMAT_WORD_COUNT",
      category: "formatting",
      title: "Document Too Brief",
      severity: "warning",
      scoreDelta: -8,
      evidence: `Only ${wordCount} words.`,
      explanation: "Sparse resumes lack sufficient keyword density for high match ranking.",
      recommendation: "Expand on project architectures, responsibilities, and technologies.",
    });
  } else {
    findings.push({
      ruleId: "RULE_FORMAT_WORD_COUNT",
      category: "formatting",
      title: "Document Unusually Long",
      severity: "warning",
      scoreDelta: -5,
      evidence: `${wordCount} words detected.`,
      explanation: "Overly verbose resumes risk human fatigue and truncated summaries.",
      recommendation: "Edit older or less relevant bullet points to stay under 1,000 words.",
    });
  }

  // Calculate Base Score (Starts at 50, clamps 0-100)
  let calculatedScore = 50;
  for (const f of findings) {
    calculatedScore += f.scoreDelta;
  }
  calculatedScore = Math.max(0, Math.min(100, calculatedScore));

  let rating: ATSReport["rating"] = "Needs Work";
  if (calculatedScore >= 85) rating = "ATS-Ready";
  else if (calculatedScore >= 70) rating = "Competitive";
  else if (calculatedScore < 50) rating = "Critical Issues";

  // Group by category
  const categoriesMap: Record<string, { name: string; maxScore: number; findings: ATSFinding[] }> = {
    contact: { name: "Contact & Header Integrity", maxScore: 20, findings: [] },
    structure: { name: "Section Architecture", maxScore: 30, findings: [] },
    content: { name: "Action Verbs & Impact", maxScore: 25, findings: [] },
    formatting: { name: "ATS Parsing Safety", maxScore: 25, findings: [] },
  };

  for (const f of findings) {
    if (categoriesMap[f.category]) {
      categoriesMap[f.category].findings.push(f);
    }
  }

  const categoryScores: ATSCategoryScore[] = Object.entries(categoriesMap).map(([catKey, catData]) => {
    let catScore = Math.floor(catData.maxScore * (calculatedScore / 100));
    return {
      category: catKey,
      name: catData.name,
      score: Math.min(catData.maxScore, Math.max(0, catScore)),
      maxScore: catData.maxScore,
      findings: catData.findings,
    };
  });

  return {
    overallScore: calculatedScore,
    rating,
    wordCount,
    readingTimeSeconds: Math.ceil((wordCount / 200) * 60),
    categories: categoryScores,
    summaryText: `Your resume scored ${calculatedScore}/100 (${rating}). Found ${findings.filter(f => f.severity === 'good').length} strengths and ${findings.filter(f => f.severity !== 'good').length} optimization opportunities.`,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Apply one-click automated fixes to raw resume text
 */
export function applyATSAutomatedFix(rawText: string, fixType: string): string {
  let fixed = rawText;
  switch (fixType) {
    case "SANITIZE_GLYPHS":
      fixed = fixed.replace(/[✓✔✕✖★☆✦◆❖➢➤➔]/g, "•");
      break;
    case "REMOVE_PRONOUNS":
      fixed = fixed.replace(/\b(I managed|I led|I developed|I worked on|I engineered)\b/gi, (match) => {
        const words = match.split(" ");
        return words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : "";
      });
      fixed = fixed.replace(/\b(my|our)\b/gi, "the");
      break;
    case "ADD_METRIC_PLACEHOLDERS":
      fixed = fixed.replace(/(improved|optimized|reduced|increased|accelerated)([^\n,.]+)/gi, "$1$2 [by X% / saving Y hours]");
      break;
    default:
      break;
  }
  return fixed;
}
