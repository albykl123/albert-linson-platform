"""Abstract base interface for ATSForge AI providers."""

from abc import ABC, abstractmethod
from typing import Optional
from app.models.schemas import ContentSuggestion


class BaseAIProvider(ABC):
    @abstractmethod
    def improve_bullet(
        self,
        bullet: str,
        target_role: str = "Software Engineer",
        jd_requirement: Optional[str] = None,
    ) -> ContentSuggestion:
        """Improve a bullet point while strictly preserving candidate factuality."""
        pass

    @abstractmethod
    def improve_summary(
        self,
        summary: str,
        target_role: str = "Software Engineer",
        jd_text: Optional[str] = None,
    ) -> ContentSuggestion:
        """Rewrite and focus a professional summary."""
        pass

    @abstractmethod
    def generate_cover_letter(
        self,
        resume_text: str,
        jd_text: str,
        company: str,
        position: str,
        tone: str = "professional",
    ) -> str:
        """Generate a tailored cover letter based strictly on resume experience."""
        pass
