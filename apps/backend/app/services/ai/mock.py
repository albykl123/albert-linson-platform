"""Mock AI Provider for automated testing."""

from typing import Optional
from app.models.schemas import ContentSuggestion
from app.services.ai.base import BaseAIProvider


class MockAIProvider(BaseAIProvider):
    def improve_bullet(
        self,
        bullet: str,
        target_role: str = "Software Engineer",
        jd_requirement: Optional[str] = None,
    ) -> ContentSuggestion:
        return ContentSuggestion(
            suggestion_id="mock-sug-1",
            section="experience",
            original_text=bullet,
            proposed_text="Spearheaded development of core microservices, increasing throughput by 35%.",
            rationale="Mock optimization applied.",
            factuality_status="verified",
            requires_metric_input=False,
        )

    def improve_summary(
        self,
        summary: str,
        target_role: str = "Software Engineer",
        jd_text: Optional[str] = None,
    ) -> ContentSuggestion:
        return ContentSuggestion(
            suggestion_id="mock-sum-1",
            section="summary",
            original_text=summary,
            proposed_text="Senior Engineer with 8+ years building resilient distributed architectures.",
            rationale="Mock summary rewrite.",
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
        return f"Mock cover letter for {position} at {company}."
