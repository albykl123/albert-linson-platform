"""Deterministic, offline rule-based writing optimizer. Works 100% without external AI or network calls."""

import re
import uuid
from typing import Optional
from app.models.schemas import ContentSuggestion
from app.services.ai.base import BaseAIProvider
from app.services.ai.preservation import FactualityGuard

PASSIVE_REPLACEMENTS = [
    (r"\b(was responsible for managing|responsible for managing|managed)\b", "Directed and coordinated"),
    (r"\b(was responsible for developing|responsible for developing|responsible for creating)\b", "Architected and delivered"),
    (r"\b(responsible for|helped with|assisted with|worked on)\b", "Spearheaded and executed"),
    (r"\b(made changes to|changed|updated)\b", "Refactored and modernized"),
    (r"\b(fixed bugs in|fixed problems in)\b", "Diagnosed and resolved critical defects in"),
    (r"\b(talked with|communicated with)\b", "Collaborated cross-functionally with"),
    (r"\b(looked at data|analyzed)\b", "Conducted deep-dive quantitative analysis on"),
]


class NoAIProvider(BaseAIProvider):
    def improve_bullet(
        self,
        bullet: str,
        target_role: str = "Software Engineer",
        jd_requirement: Optional[str] = None,
    ) -> ContentSuggestion:
        text = bullet.strip()
        improved = text

        # 1. Eliminate passive phrasing
        for pattern, replacement in PASSIVE_REPLACEMENTS:
            if re.search(pattern, improved, re.I):
                improved = re.sub(pattern, replacement, improved, count=1, flags=re.I)
                break

        # 2. Capitalize first letter and ensure strong opening verb
        if improved and not improved[0].isupper():
            improved = improved[0].upper() + improved[1:]

        # 3. If no metrics exist, append a structured outcome placeholder
        has_metrics = bool(re.search(r"(\$|\%|\b\d+\b)", text))
        requires_metric = False
        if not has_metrics:
            improved = improved.rstrip(".") + ", achieving [insert measurable impact e.g. 25% efficiency gain]."
            requires_metric = True

        sanitized, status, req_input = FactualityGuard.verify_and_sanitize(bullet, improved)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4())[:8],
            section="experience",
            original_text=bullet,
            proposed_text=sanitized,
            rationale="Transformed passive duty statement into high-impact action verb structure with measurable outcome anchor.",
            target_job_requirement=jd_requirement,
            factuality_status="metric_placeholder_needed" if req_input or requires_metric else "verified",
            requires_metric_input=req_input or requires_metric,
        )

    def improve_summary(
        self,
        summary: str,
        target_role: str = "Software Engineer",
        jd_text: Optional[str] = None,
    ) -> ContentSuggestion:
        clean_sum = summary.strip()
        if not clean_sum:
            proposed = (
                f"Results-driven {target_role} with proven expertise in architecting scalable systems, "
                "optimizing mission-critical workflows, and delivering high-impact technical solutions. "
                "Known for cross-functional collaboration, technical mentorship, and aligning engineering outcomes with core business objectives."
            )
        else:
            # Clean first person
            clean_sum = re.sub(r"\b(I am a|I am an|I am)\b", "", clean_sum, flags=re.I).strip()
            if clean_sum and not clean_sum[0].isupper():
                clean_sum = clean_sum[0].upper() + clean_sum[1:]
            proposed = f"Accomplished {target_role}. {clean_sum}"

        sanitized, status, req_input = FactualityGuard.verify_and_sanitize(summary, proposed)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4())[:8],
            section="summary",
            original_text=summary,
            proposed_text=sanitized,
            rationale="Standardized professional summary to ATS telegraphic style, removing personal pronouns and elevating role clarity.",
            factuality_status="verified",
            requires_metric_input=False,
        )

    def generate_cover_letter(
        self,
        resume_text: str,
        jd_text: str,
        company: str,
        position: str,
        tone: str = "professional",
    ) -> str:
        lines = [
            f"Dear Hiring Team at {company},",
            "",
            f"I am writing to express my strong enthusiasm for the {position} position at {company}. With a track record of architecting reliable systems and delivering measurable technical outcomes, I am excited about the opportunity to contribute to your engineering organization.",
            "",
            f"Throughout my career, I have focused on solving high-impact problems, designing clean and maintainable architectures, and collaborating cross-functionally to exceed project goals. Your focus on quality and innovation strongly resonates with my professional standards.",
            "",
            f"Thank you for your time and consideration. I welcome the opportunity to discuss how my qualifications align with {company}'s objectives for the {position} role.",
            "",
            "Sincerely,",
            "[Your Name]",
        ]
        return "\n".join(lines)
