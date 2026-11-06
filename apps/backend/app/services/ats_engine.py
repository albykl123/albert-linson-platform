"""Transparent, deterministic ATS Compatibility Scoring Engine (20 Rules / 0-100 Score)."""

import re
from datetime import datetime, timezone
from app.models.schemas import (
    ResumeData,
    ATSScoreReport,
    ATSCategoryScore,
    ATSFinding,
)

# Curated High-Impact Action Verbs
ACTION_VERBS = {
    "accelerated", "achieved", "analyzed", "architected", "audited", "automated",
    "boosted", "budgeted", "built", "centralized", "championed", "collaborated",
    "consolidated", "coordinated", "created", "decreased", "delivered", "deployed",
    "designed", "developed", "directed", "drove", "eliminated", "engineered",
    "established", "exceeded", "executed", "expanded", "expedited", "facilitated",
    "forecasted", "formulated", "founded", "generated", "grew", "guided",
    "implemented", "improved", "increased", "initiated", "integrated", "launched",
    "led", "managed", "maximized", "mentored", "migrated", "minimized",
    "modernized", "negotiated", "optimized", "orchestrated", "overhauled", "oversaw",
    "partnered", "pioneered", "produced", "reduced", "redesigned", "refactored",
    "resolved", "restructured", "scaled", "secured", "shipped", "spearheaded",
    "standardized", "streamlined", "surpassed", "transformed", "unified", "upgraded"
}


def extract_tokens(text: str) -> list[str]:
    """Tokenize text preserving dots, hyphens, and tech symbols like c++, c#, node.js."""
    matches = re.findall(r"[a-zA-Z0-9][a-zA-Z0-9+#.\-]*", text.lower())
    cleaned = []
    for m in matches:
        w = m.rstrip(".-")
        if w:
            cleaned.append(w)
    return cleaned


class ATSEngine:
    @staticmethod
    def analyze(raw_text: str, data: ResumeData) -> ATSScoreReport:
        text = raw_text.strip() if raw_text.strip() else ""
        words = text.split()
        wc = len(words)
        reading_time_secs = max(1, round(wc / 3.5))

        findings: list[ATSFinding] = []
        
        # -------------------------------------------------------------
        # CATEGORY 1: CONTACT INFORMATION (15 Max)
        # -------------------------------------------------------------
        c1_score = 15
        c1_findings: list[ATSFinding] = []

        # Rule 1: Email detection
        if data.contact.email:
            c1_findings.append(
                ATSFinding(
                    rule_id="RULE-01-EMAIL",
                    category="contact",
                    title="Professional Email Present",
                    severity="good",
                    score_delta=0,
                    evidence=data.contact.email,
                    explanation="Valid email detected in contact block.",
                    why_it_matters="ATS systems use email as the primary unique candidate identifier.",
                    recommendation="Keep email clear and professional.",
                )
            )
        else:
            c1_score -= 8
            c1_findings.append(
                ATSFinding(
                    rule_id="RULE-01-EMAIL",
                    category="contact",
                    title="Missing Email Address",
                    severity="critical",
                    score_delta=-8,
                    evidence="No standard email detected.",
                    explanation="Could not detect an email address in the contact section.",
                    why_it_matters="Without an email, ATS parsers fail to index candidate profiles and recruiters cannot contact you.",
                    recommendation="Add your email (e.g. name@domain.com) prominently at the top of the resume.",
                    one_click_fix_available=True,
                    fix_type="add_email",
                )
            )

        # Rule 2: Phone number
        if data.contact.phone:
            c1_findings.append(
                ATSFinding(
                    rule_id="RULE-02-PHONE",
                    category="contact",
                    title="Contact Phone Present",
                    severity="good",
                    score_delta=0,
                    evidence=data.contact.phone,
                    explanation="Phone number successfully parsed.",
                    why_it_matters="Needed for recruiter screen scheduling and automated SMS interview notices.",
                    recommendation="Ensure international country code is included if applying remotely.",
                )
            )
        else:
            c1_score -= 4
            c1_findings.append(
                ATSFinding(
                    rule_id="RULE-02-PHONE",
                    category="contact",
                    title="Missing Phone Number",
                    severity="warning",
                    score_delta=-4,
                    evidence="No phone number found.",
                    explanation="No standard telephone or mobile number detected.",
                    why_it_matters="ATS recruiters frequently filter by phone availability for phone screens.",
                    recommendation="Include a direct phone number formatted as +1 (555) 000-0000.",
                    one_click_fix_available=True,
                    fix_type="add_phone",
                )
            )

        # Rule 3: Location / Online Presence
        has_online_profile = bool(data.contact.linkedin or data.contact.github or data.contact.website)
        has_loc = bool(data.contact.location)
        if has_online_profile and has_loc:
            c1_findings.append(
                ATSFinding(
                    rule_id="RULE-03-LINKS",
                    category="contact",
                    title="Location & Profiles Documented",
                    severity="good",
                    score_delta=0,
                    evidence=f"Location: {data.contact.location or 'N/A'}, Profiles found.",
                    explanation="Contact section includes geographical location and professional profiles.",
                    why_it_matters="Provides ATS location-matching algorithms and recruiter verification links.",
                    recommendation="Keep LinkedIn and portfolio up to date.",
                )
            )
        else:
            c1_score -= 3
            c1_findings.append(
                ATSFinding(
                    rule_id="RULE-03-LINKS",
                    category="contact",
                    title="Incomplete Profile Links or Location",
                    severity="warning",
                    score_delta=-3,
                    evidence=f"Location: {'Found' if has_loc else 'Missing'}, Online links: {'Found' if has_online_profile else 'None'}",
                    explanation="Location or online professional portfolio link (LinkedIn, GitHub) is missing.",
                    why_it_matters="Modern ATS filters filter by candidate metropolitan location and check social profiles.",
                    recommendation="Add your City, State/Country and LinkedIn profile URL.",
                    one_click_fix_available=True,
                    fix_type="add_location_link",
                )
            )

        c1_score = max(0, min(15, c1_score))

        # -------------------------------------------------------------
        # CATEGORY 2: STRUCTURAL & PARSE COMPATIBILITY (25 Max)
        # -------------------------------------------------------------
        c2_score = 25
        c2_findings: list[ATSFinding] = []

        # Rule 4: Standard Headings (Experience, Education, Skills)
        has_exp = len(data.experience) > 0 or bool(re.search(r"\b(experience|employment)\b", text, re.I))
        has_edu = len(data.education) > 0 or bool(re.search(r"\beducation\b", text, re.I))
        has_skills = any(data.skills.values()) or bool(re.search(r"\bskills\b", text, re.I))

        missing_sections = []
        if not has_exp:
            missing_sections.append("Work Experience")
        if not has_edu:
            missing_sections.append("Education")
        if not has_skills:
            missing_sections.append("Skills")

        if not missing_sections:
            c2_findings.append(
                ATSFinding(
                    rule_id="RULE-04-HEADINGS",
                    category="structure",
                    title="Standard ATS Section Headings",
                    severity="good",
                    score_delta=0,
                    evidence="Experience, Education, and Skills detected.",
                    explanation="All 3 core ATS section anchors were found.",
                    why_it_matters="ATS parsers rely on recognized semantic headings to categorize resume content into database fields.",
                    recommendation="Maintain clean, standard headings without creative renamings like 'Where I've Been'.",
                )
            )
        else:
            delta = -4 * len(missing_sections)
            c2_score += delta
            c2_findings.append(
                ATSFinding(
                    rule_id="RULE-04-HEADINGS",
                    category="structure",
                    title=f"Missing Core Sections: {', '.join(missing_sections)}",
                    severity="critical",
                    score_delta=delta,
                    evidence=f"Missing: {', '.join(missing_sections)}",
                    explanation=f"The resume does not clearly label: {', '.join(missing_sections)}.",
                    why_it_matters="Parsers fail to map your job history or credentials if standard headings are missing.",
                    recommendation="Add standard headers: 'Experience', 'Education', and 'Skills'.",
                    one_click_fix_available=True,
                    fix_type="insert_missing_sections",
                )
            )

        # Rule 5: Multi-column & Tabulation parsing risk
        tab_count = text.count("\t")
        col_spacing_matches = len(re.findall(r" {4,}\S+ {4,}\S", text))
        if tab_count >= 2 or col_spacing_matches >= 1:
            c2_score -= 6
            c2_findings.append(
                ATSFinding(
                    rule_id="RULE-05-COLUMNS",
                    category="structure",
                    title="Multi-Column or Tab Alignment Risk Detected",
                    severity="critical",
                    score_delta=-6,
                    evidence=f"Found {tab_count} tab characters and {col_spacing_matches} wide spacing intervals.",
                    explanation="Text layout indicates multi-column tables or tabbed column alignments.",
                    why_it_matters="Legacy and modern ATS parsers read horizontally across columns, scrambling disparate job descriptions together.",
                    recommendation="Use a strict single-column top-to-bottom layout.",
                    one_click_fix_available=True,
                    fix_type="convert_to_single_column",
                )
            )
        else:
            c2_findings.append(
                ATSFinding(
                    rule_id="RULE-05-COLUMNS",
                    category="structure",
                    title="Single-Column Parse Friendly Layout",
                    severity="good",
                    score_delta=0,
                    evidence="No table or columnar spacing traps detected.",
                    explanation="Clean sequential vertical text flow.",
                    why_it_matters="Ensures 100% predictable parsing order across Workday, Taleo, Greenhouse, and Lever.",
                    recommendation="Continue avoiding multi-column tables.",
                )
            )

        # Rule 6: Non-standard character symbols / encoding
        non_ascii_chars = [c for c in text if ord(c) > 127 and c not in "•–—'\"’“”"]
        if len(non_ascii_chars) > 15:
            c2_score -= 4
            c2_findings.append(
                ATSFinding(
                    rule_id="RULE-06-SYMBOLS",
                    category="structure",
                    title="Unusual Non-Standard Glyphs or Icons",
                    severity="warning",
                    score_delta=-4,
                    evidence=f"{len(non_ascii_chars)} uncommon characters detected (e.g. {' '.join(non_ascii_chars[:5])}).",
                    explanation="Contains graphic font glyphs, stars, rating symbols, or custom icons.",
                    why_it_matters="ATS engines replace uncommon unicode glyphs with '?' or blank squares, breaking search indexing.",
                    recommendation="Replace complex icons with standard bullet points (• or -) and plain text.",
                    one_click_fix_available=True,
                    fix_type="sanitize_glyphs",
                )
            )

        # Rule 7: Text selectability & length density
        if wc < 50:
            c2_score -= 8
            c2_findings.append(
                ATSFinding(
                    rule_id="RULE-07-SELECTABLE",
                    category="structure",
                    title="Low Text Density / Possible Image Scan",
                    severity="critical",
                    score_delta=-8,
                    evidence=f"Only {wc} words extracted.",
                    explanation="Document yields extremely low word count. May be an image-only PDF scan without text layer.",
                    why_it_matters="An ATS cannot read or search graphic scans of resumes.",
                    recommendation="Export directly from Word or ATSForge as a vector text PDF.",
                )
            )

        c2_score = max(0, min(25, c2_score))

        # -------------------------------------------------------------
        # CATEGORY 3: ACTION VERBS & BULLET QUALITY (20 Max)
        # -------------------------------------------------------------
        c3_score = 20
        c3_findings: list[ATSFinding] = []

        tokens = extract_tokens(text)
        token_set = set(tokens)
        matched_action_verbs = [v for v in ACTION_VERBS if v in token_set]
        unique_verb_count = len(matched_action_verbs)

        # Rule 8: Action verb count and variety
        if unique_verb_count >= 8:
            c3_findings.append(
                ATSFinding(
                    rule_id="RULE-08-VERBS",
                    category="verbs",
                    title="Strong Action-Oriented Language",
                    severity="good",
                    score_delta=0,
                    evidence=f"{unique_verb_count} distinct action verbs detected: {', '.join(matched_action_verbs[:6])}...",
                    explanation="Bullet points begin with decisive verbs signaling accomplishment.",
                    why_it_matters="Recruiters look for leadership and execution keywords rather than passive duties.",
                    recommendation="Keep initiating bullets with varied action verbs.",
                )
            )
        elif unique_verb_count >= 4:
            c3_score -= 4
            c3_findings.append(
                ATSFinding(
                    rule_id="RULE-08-VERBS",
                    category="verbs",
                    title="Moderate Action Verb Variety",
                    severity="warning",
                    score_delta=-4,
                    evidence=f"Found {unique_verb_count} action verbs: {', '.join(matched_action_verbs)}.",
                    explanation="Noticeable presence of passive phrasing ('responsible for', 'worked on', 'assisted in').",
                    why_it_matters="Passive phrasing reduces candidate authority and ATS keyword ranking.",
                    recommendation="Replace 'Responsible for' with active verbs like 'Architected', 'Spearheaded', 'Optimized'.",
                    one_click_fix_available=True,
                    fix_type="strengthen_verbs",
                )
            )
        else:
            c3_score -= 9
            c3_findings.append(
                ATSFinding(
                    rule_id="RULE-08-VERBS",
                    category="verbs",
                    title="Deficient Action Verbs",
                    severity="critical",
                    score_delta=-9,
                    evidence=f"Only {unique_verb_count} action verbs found in entire text.",
                    explanation="Resume relies heavily on passive task descriptions.",
                    why_it_matters="Severely depresses resume impact scores in automated hiring pipelines.",
                    recommendation="Begin every experience bullet with an action verb from the ATSForge action lexicon.",
                    one_click_fix_available=True,
                    fix_type="strengthen_verbs",
                )
            )

        # Rule 9: Passive phrase detection
        passive_matches = re.findall(r"\b(responsible for|duties included|helped with|assisted with)\b", text, re.I)
        if passive_matches:
            c3_score -= 3
            c3_findings.append(
                ATSFinding(
                    rule_id="RULE-09-PASSIVE",
                    category="verbs",
                    title="Passive Responsibility Phrases Detected",
                    severity="warning",
                    score_delta=-3,
                    evidence=f"Found: {', '.join(set(m.lower() for m in passive_matches))}",
                    explanation="Using passive duty language weakens accomplishments.",
                    why_it_matters="Employers want results achieved, not lists of assigned obligations.",
                    recommendation="Convert passive duty statements into specific achievement bullets.",
                )
            )

        # Rule 10: First-person pronoun avoidance (I, me, my, our)
        pronoun_matches = re.findall(r"\b(I|me|my|we|our)\b", text)
        if len(pronoun_matches) > 3:
            c3_score -= 3
            c3_findings.append(
                ATSFinding(
                    rule_id="RULE-10-PRONOUNS",
                    category="verbs",
                    title="First-Person Pronouns Detected",
                    severity="warning",
                    score_delta=-3,
                    evidence=f"Found {len(pronoun_matches)} first-person pronouns ('I', 'my', 'we').",
                    explanation="Resumes should be written in telegraphic third-person without personal pronouns.",
                    why_it_matters="Pronouns take up valuable space and violate ATS resume conventions.",
                    recommendation="Remove 'I' and 'My', starting directly with the verb: 'Engineered system...' instead of 'I engineered...'.",
                    one_click_fix_available=True,
                    fix_type="remove_pronouns",
                )
            )

        c3_score = max(0, min(20, c3_score))

        # -------------------------------------------------------------
        # CATEGORY 4: QUANTIFIED ACHIEVEMENTS & METRICS (20 Max)
        # -------------------------------------------------------------
        c4_score = 20
        c4_findings: list[ATSFinding] = []

        # Rule 11: Quantitative Metrics Detection ($, %, numerical multipliers, headcount)
        metric_matches = re.findall(r"(\$\s?\d[\d,.]*|\b\d+[\d,.]*\s?%|\b\d{2,}\b|\b\d+x\b|\b[1-9]\d*\s*(?:million|billion|k|users|clients|engineers|teams)\b)", text, re.I)
        metric_count = len(metric_matches)

        if metric_count >= 6:
            c4_findings.append(
                ATSFinding(
                    rule_id="RULE-11-METRICS",
                    category="metrics",
                    title="High Quantitative Impact Density",
                    severity="good",
                    score_delta=0,
                    evidence=f"Detected {metric_count} quantitative metrics: {', '.join(metric_matches[:5])}...",
                    explanation="Bullet points substantiate claims with numerical outcomes.",
                    why_it_matters="Quantified accomplishments are the single highest correlate with interview invitations.",
                    recommendation="Maintain metrics across all positions.",
                )
            )
        elif metric_count >= 2:
            c4_score -= 6
            c4_findings.append(
                ATSFinding(
                    rule_id="RULE-11-METRICS",
                    category="metrics",
                    title="Sparse Measurable Metrics",
                    severity="warning",
                    score_delta=-6,
                    evidence=f"Only {metric_count} metrics detected ({', '.join(metric_matches)}).",
                    explanation="Most experience bullets describe tasks without measurable outcomes.",
                    why_it_matters="ATS relevance models elevate candidates who substantiate claims with measurable business outcomes.",
                    recommendation="Add numbers: percentages saved, throughput increased, revenue generated, or team sizes led.",
                    one_click_fix_available=True,
                    fix_type="insert_metric_placeholders",
                )
            )
        else:
            c4_score -= 12
            c4_findings.append(
                ATSFinding(
                    rule_id="RULE-11-METRICS",
                    category="metrics",
                    title="Zero or Near-Zero Quantified Achievements",
                    severity="critical",
                    score_delta=-12,
                    evidence=f"Found only {metric_count} numbers in the entire document.",
                    explanation="No measurable results, percentages, or dollar values identified.",
                    why_it_matters="Without proof points, candidate claims read as unverified assertions.",
                    recommendation="Include specific figures (e.g. 'Reduced load times by 42%', 'Managed \$120K budget').",
                    one_click_fix_available=True,
                    fix_type="insert_metric_placeholders",
                )
            )

        # Rule 12: Bullet Point Length & Structure
        all_bullets = []
        for exp in data.experience:
            all_bullets.extend(exp.bullets)
        for proj in data.projects:
            all_bullets.extend(proj.bullets)

        too_long_bullets = [b for b in all_bullets if len(b.split()) > 45]
        too_short_bullets = [b for b in all_bullets if len(b.split()) < 4]

        if len(too_long_bullets) > 2:
            c4_score -= 4
            c4_findings.append(
                ATSFinding(
                    rule_id="RULE-12-BULLETS",
                    category="metrics",
                    title="Overly Long Run-on Bullet Points",
                    severity="warning",
                    score_delta=-4,
                    evidence=f"{len(too_long_bullets)} bullets exceed 45 words.",
                    explanation="Run-on bullet points turn into dense paragraphs that human recruiters skip.",
                    why_it_matters="Bullets should be crisp (15–30 words) for optimal readability and rapid skimming.",
                    recommendation="Split long bullets into two concise, focused accomplishment points.",
                )
            )
        elif len(too_short_bullets) > 3:
            c4_score -= 3
            c4_findings.append(
                ATSFinding(
                    rule_id="RULE-12-BULLETS",
                    category="metrics",
                    title="Vague Short Bullet Points",
                    severity="warning",
                    score_delta=-3,
                    evidence=f"{len(too_short_bullets)} bullets have fewer than 4 words.",
                    explanation="Overly short bullets lack context and explanatory power.",
                    why_it_matters="Provides insufficient keyword density for ATS matching.",
                    recommendation="Expand each bullet with context: What you did + How you did it + What the result was.",
                )
            )

        c4_score = max(0, min(20, c4_score))

        # -------------------------------------------------------------
        # CATEGORY 5: CONTENT QUALITY & CHRONOLOGY (20 Max)
        # -------------------------------------------------------------
        c5_score = 20
        c5_findings: list[ATSFinding] = []

        # Rule 13: Resume Word Count & Length
        if 400 <= wc <= 850:
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-13-LENGTH",
                    category="chronology",
                    title="Optimal Resume Word Count",
                    severity="good",
                    score_delta=0,
                    evidence=f"{wc} words (ideal range: 400–850 words).",
                    explanation="Resume fits perfectly onto 1 or 2 standard pages without fluff.",
                    why_it_matters="Provides sufficient keyword surface area without cognitive overload.",
                    recommendation="Maintain current length.",
                )
            )
        elif wc < 250:
            c5_score -= 8
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-13-LENGTH",
                    category="chronology",
                    title="Resume Too Brief / Underdeveloped",
                    severity="critical",
                    score_delta=-8,
                    evidence=f"Only {wc} words detected.",
                    explanation="The resume is too sparse to adequately represent technical qualifications.",
                    why_it_matters="ATS keyword match algorithms require rich technical context to reach scoring thresholds.",
                    recommendation="Expand on key projects, specific technologies utilized, and quantifiable achievements.",
                )
            )
        elif wc > 1150:
            c5_score -= 4
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-13-LENGTH",
                    category="chronology",
                    title="Excessive Resume Length",
                    severity="warning",
                    score_delta=-4,
                    evidence=f"{wc} words detected (exceeds recommended 850 words).",
                    explanation="Resume is too long and risks trailing into 3+ unformatted pages.",
                    why_it_matters="Hiring managers spend an average of 6 to 8 seconds on initial screens.",
                    recommendation="Trim experience older than 10 years and remove redundant bullet points.",
                )
            )

        # Rule 14: Employment Dates Present & Formatted
        date_matches = re.findall(r"(\b(19|20)\d{2}\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4})", text, re.I)
        if len(date_matches) >= 3:
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-14-DATES",
                    category="chronology",
                    title="Chronology & Dates Well-Structured",
                    severity="good",
                    score_delta=0,
                    evidence=f"Detected {len(date_matches)} date markers.",
                    explanation="Clear date chronological anchors identified across positions.",
                    why_it_matters="ATS systems parse employment durations to compute years of experience.",
                    recommendation="Maintain consistent date formats (e.g., 'Jan 2021 – Present').",
                )
            )
        else:
            c5_score -= 6
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-14-DATES",
                    category="chronology",
                    title="Missing or Unformatted Employment Dates",
                    severity="critical",
                    score_delta=-6,
                    evidence=f"Only {len(date_matches)} dates detected.",
                    explanation="Positions lack explicit start/end dates.",
                    why_it_matters="Without dates, ATS parsers cannot calculate total years of experience, often discarding the application.",
                    recommendation="Add month and year dates to each role (e.g., 'Mar 2022 – Oct 2024').",
                    one_click_fix_available=True,
                    fix_type="format_dates",
                )
            )

        # Rule 15: Skills section structure
        tech_skills = data.skills.get("technical", [])
        if len(tech_skills) >= 6:
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-15-SKILLS",
                    category="chronology",
                    title="Robust Dedicated Skills Taxonomy",
                    severity="good",
                    score_delta=0,
                    evidence=f"{len(tech_skills)} skills identified.",
                    explanation="Dedicated skills section enables direct ATS keyword extraction.",
                    why_it_matters="Skills taxonomies are scanned directly by recruiters using boolean search queries.",
                    recommendation="Keep skills organized by domain (Languages, Frameworks, Cloud/Tools).",
                )
            )
        else:
            c5_score -= 4
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-15-SKILLS",
                    category="chronology",
                    title="Sparse Skills Section",
                    severity="warning",
                    score_delta=-4,
                    evidence=f"Only {len(tech_skills)} skills parsed in skills section.",
                    explanation="Skills are scattered in bullets rather than indexed in a dedicated skills section.",
                    why_it_matters="ATS search algorithms prioritize hard keywords found in standard Skills headers.",
                    recommendation="Create a prominent 'Skills' section listing languages, frameworks, and developer tools.",
                    one_click_fix_available=True,
                    fix_type="expand_skills",
                )
            )

        # Rule 16: Duplicate phrase / repetition check
        phrases = [b.lower() for b in all_bullets if len(b) > 20]
        duplicates = [p for p in set(phrases) if phrases.count(p) > 1]
        if duplicates:
            c5_score -= 3
            c5_findings.append(
                ATSFinding(
                    rule_id="RULE-16-DUPLICATE",
                    category="chronology",
                    title="Duplicate Content Detected",
                    severity="warning",
                    score_delta=-3,
                    evidence=f"Found {len(duplicates)} identical bullet phrases repeated across roles.",
                    explanation="Exact duplicate sentences weaken content uniqueness.",
                    why_it_matters="ATS redundancy filters flag cut-and-paste resumes.",
                    recommendation="Make each bullet distinct to the specific accomplishments of that role.",
                )
            )

        c5_score = max(0, min(20, c5_score))

        # -------------------------------------------------------------
        # COMPOSITE SCORE & SUMMARY
        # -------------------------------------------------------------
        total_score = c1_score + c2_score + c3_score + c4_score + c5_score
        total_score = max(0, min(100, total_score))

        if total_score >= 85:
            rating = "ATS-Ready"
            summary = "Excellent ATS compatibility. Document features standard headings, clean typography, quantified accomplishments, and robust keyword anchors."
        elif total_score >= 70:
            rating = "Competitive"
            summary = "Good baseline resume. Minor formatting or metric adjustments recommended to maximize recruiter search ranking."
        elif total_score >= 50:
            rating = "Needs Work"
            summary = "Significant ATS hurdles identified. Standardize section headings, convert passive language to action verbs, and add quantifiable metrics."
        else:
            rating = "Critical Issues"
            summary = "High risk of ATS parse failure. Missing core contact information, standard headings, or text extractability."

        categories = [
            ATSCategoryScore(
                category="contact",
                name="Contact Information",
                score=c1_score,
                max_score=15,
                findings=c1_findings,
            ),
            ATSCategoryScore(
                category="structure",
                name="Structural & Layout Compatibility",
                score=c2_score,
                max_score=25,
                findings=c2_findings,
            ),
            ATSCategoryScore(
                category="verbs",
                name="Action Verbs & Impact",
                score=c3_score,
                max_score=20,
                findings=c3_findings,
            ),
            ATSCategoryScore(
                category="metrics",
                name="Quantified Achievements",
                score=c4_score,
                max_score=20,
                findings=c4_findings,
            ),
            ATSCategoryScore(
                category="chronology",
                name="Content Quality & Chronology",
                score=c5_score,
                max_score=20,
                findings=c5_findings,
            ),
        ]

        return ATSScoreReport(
            overall_score=total_score,
            rating=rating,
            word_count=wc,
            reading_time_seconds=reading_time_secs,
            categories=categories,
            summary_text=summary,
            calculated_at=datetime.now(timezone.utc).isoformat(),
        )
