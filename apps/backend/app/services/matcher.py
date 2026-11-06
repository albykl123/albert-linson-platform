"""Job Description Matcher: extracts requirements, computes keyword overlap, and performs gap analysis."""

import re
from app.models.schemas import (
    ResumeData,
    JobMatchReport,
    SkillMatchItem,
)
from app.services.ats_engine import extract_tokens

# Curated Technical & Functional Skill Taxonomy
KNOWN_SKILLS = {
    # Programming Languages
    "python", "javascript", "typescript", "c++", "c#", "java", "golang", "go",
    "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "sql", "html", "css", "bash",
    # Frameworks & Libraries
    "react", "react.js", "next.js", "vue", "angular", "node.js", "express", "fastapi",
    "django", "flask", "spring", "spring boot", "asp.net", ".net", "tailwind", "bootstrap",
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "ci/cd",
    "jenkins", "github actions", "gitlab", "linux", "git", "microservices", "serverless",
    # Data & AI
    "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch", "kafka",
    "graphql", "rest api", "machine learning", "deep learning", "nlp", "llm", "pytorch",
    "tensorflow", "pandas", "numpy", "data analysis",
    # Soft & Management
    "agile", "scrum", "project management", "cross-functional", "system architecture",
    "code review", "problem solving", "mentorship", "leadership", "communication",
    # US IT Recruitment & Talent Acquisition
    "us it recruitment", "talent sourcing", "candidate screening", "talent acquisition",
    "technical staffing", "ats", "ats workflows", "boolean search", "interview coordination",
    "client acquisition", "lead generation", "requisition mapping"
}


class JobMatcher:
    @staticmethod
    def extract_job_keywords(jd_text: str) -> tuple[list[str], list[str]]:
        """Extract required and preferred skills from job description text."""
        lower_jd = jd_text.lower()
        
        # Split into required vs preferred sections if demarcated
        required_section = ""
        preferred_section = ""

        req_match = re.search(r"\b(requirements|qualifications|what you'?ll need|minimum qualifications|must have)\b", lower_jd)
        pref_match = re.search(r"\b(preferred qualifications|bonus|nice to have|preferred|plus)\b", lower_jd)

        if req_match and pref_match:
            if req_match.start() < pref_match.start():
                required_section = lower_jd[req_match.start():pref_match.start()]
                preferred_section = lower_jd[pref_match.start():]
            else:
                preferred_section = lower_jd[pref_match.start():req_match.start()]
                required_section = lower_jd[req_match.start():]
        elif req_match:
            required_section = lower_jd[req_match.start():]
        else:
            required_section = lower_jd

        required_skills: list[str] = []
        preferred_skills: list[str] = []

        for skill in KNOWN_SKILLS:
            pattern = r"(?:^|\W)" + re.escape(skill) + r"(?:$|\W)"
            if re.search(pattern, required_section):
                required_skills.append(skill)
            elif preferred_section and re.search(pattern, preferred_section):
                preferred_skills.append(skill)
            elif re.search(pattern, lower_jd):
                required_skills.append(skill)

        # Also extract any words following bullet points in requirements section
        bullet_words = re.findall(r"^[•*-]\s*([A-Za-z0-9+#.-]+(?:\s+[A-Za-z0-9+#.-]+){0,2})", jd_text, re.M)
        for bw in bullet_words:
            clean_bw = bw.strip().lower()
            if len(clean_bw) > 2 and clean_bw not in required_skills and clean_bw in KNOWN_SKILLS:
                required_skills.append(clean_bw)

        return sorted(list(set(required_skills))), sorted(list(set(preferred_skills)))

    @staticmethod
    def match(resume_text: str, data: ResumeData, jd_text: str, job_title: str = "Target Role", company: str = "Target Company") -> JobMatchReport:
        lower_resume = resume_text.lower()
        required_skills, preferred_skills = JobMatcher.extract_job_keywords(jd_text)

        # Fallback if no known skills found
        if not required_skills and not preferred_skills:
            # Extract most frequent nouns/keywords from JD
            jd_tokens = [t for t in extract_tokens(jd_text) if len(t) > 3]
            freq: dict[str, int] = {}
            for t in jd_tokens:
                freq[t] = freq.get(t, 0) + 1
            top_terms = [k for k, v in sorted(freq.items(), key=lambda x: x[1], reverse=True)[:10]]
            required_skills = top_terms[:6]
            preferred_skills = top_terms[6:]

        matched_items: list[SkillMatchItem] = []
        missing_required: list[SkillMatchItem] = []
        missing_preferred: list[SkillMatchItem] = []

        stuffing_warnings: list[str] = []

        # Check required skills
        for skill in required_skills:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"
            matches = re.findall(pattern, lower_resume)
            count = len(matches)

            if count > 0:
                # Find context snippet
                ctx = None
                match_obj = re.search(pattern, lower_resume)
                if match_obj:
                    start = max(0, match_obj.start() - 35)
                    end = min(len(lower_resume), match_obj.end() + 35)
                    ctx = "..." + resume_text[start:end].replace("\n", " ").strip() + "..."

                matched_items.append(
                    SkillMatchItem(
                        skill=skill,
                        category="required",
                        matched=True,
                        count_in_resume=count,
                        context_found=ctx,
                    )
                )

                if count >= 7:
                    stuffing_warnings.append(f"'{skill}' appears {count} times (risks ATS keyword-stuffing penalty)")
            else:
                missing_required.append(
                    SkillMatchItem(
                        skill=skill,
                        category="required",
                        matched=False,
                        count_in_resume=0,
                        context_found=None,
                    )
                )

        # Check preferred skills
        for skill in preferred_skills:
            pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"
            matches = re.findall(pattern, lower_resume)
            count = len(matches)

            if count > 0:
                matched_items.append(
                    SkillMatchItem(
                        skill=skill,
                        category="preferred",
                        matched=True,
                        count_in_resume=count,
                    )
                )
            else:
                missing_preferred.append(
                    SkillMatchItem(
                        skill=skill,
                        category="preferred",
                        matched=False,
                        count_in_resume=0,
                    )
                )

        total_req = len(required_skills)
        total_pref = len(preferred_skills)
        matched_req = len([m for m in matched_items if m.category == "required"])
        matched_pref = len([m for m in matched_items if m.category == "preferred"])

        # Weighted calculation: Required skills account for 75%, Preferred for 25%
        if total_req + total_pref == 0:
            overall_score = 50
        else:
            req_ratio = (matched_req / total_req) if total_req > 0 else 1.0
            pref_ratio = (matched_pref / total_pref) if total_pref > 0 else 1.0
            overall_score = round((req_ratio * 75) + (pref_ratio * 25))

        overall_score = max(0, min(100, overall_score))

        density_warning = "; ".join(stuffing_warnings) if stuffing_warnings else None

        alignment_summary = (
            f"Matched {matched_req} of {total_req} core required skills ({round(req_ratio * 100)}%) and "
            f"{matched_pref} of {total_pref} preferred skills. "
        )
        if missing_required:
            alignment_summary += f"Critical missing requirements to review: {', '.join([s.skill for s in missing_required[:4]])}."
        else:
            alignment_summary += "Outstanding alignment: all primary required skills present."

        return JobMatchReport(
            job_title=job_title,
            company=company,
            overall_match_score=overall_score,
            matched_skills=matched_items,
            missing_required=missing_required,
            missing_preferred=missing_preferred,
            keyword_density_warning=density_warning,
            alignment_summary=alignment_summary,
        )
