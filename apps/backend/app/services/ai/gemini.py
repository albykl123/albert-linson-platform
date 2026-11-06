"""Google Gemini AI Provider implementation via lightweight HTTP."""

import json
import uuid
from typing import Optional
import httpx

from app.config import settings
from app.models.schemas import ContentSuggestion
from app.services.ai.base import BaseAIProvider
from app.services.ai.no_ai import NoAIProvider
from app.services.ai.preservation import FactualityGuard


class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.fallback = NoAIProvider()

    def _call_gemini(self, prompt: str) -> str:
        if not self.api_key:
            return ""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.2, "maxOutputTokens": 800},
        }
        try:
            with httpx.Client(timeout=15.0) as client:
                res = client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "").strip()
        except Exception:
            pass
        return ""

    def improve_bullet(
        self,
        bullet: str,
        target_role: str = "Software Engineer",
        jd_requirement: Optional[str] = None,
    ) -> ContentSuggestion:
        if not self.api_key:
            return self.fallback.improve_bullet(bullet, target_role, jd_requirement)

        prompt = (
            f"You are an expert ATS resume editor. Rewrite this resume bullet for a {target_role} role.\n"
            f"Original bullet: \"{bullet}\"\n"
            f"Target requirement: \"{jd_requirement or 'General'}\"\n"
            "Rules:\n"
            "1. Start with a decisive action verb.\n"
            "2. DO NOT invent fake companies, diplomas, or metrics not in the original.\n"
            "3. If a metric would help, insert a placeholder like '[e.g. 25% efficiency]'.\n"
            "Respond ONLY with the improved bullet text."
        )
        response_text = self._call_gemini(prompt)
        if not response_text:
            return self.fallback.improve_bullet(bullet, target_role, jd_requirement)

        sanitized, status, req_input = FactualityGuard.verify_and_sanitize(bullet, response_text)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4())[:8],
            section="experience",
            original_text=bullet,
            proposed_text=sanitized,
            rationale="Optimized with Gemini for action verb impact and keyword alignment.",
            target_job_requirement=jd_requirement,
            factuality_status=status,
            requires_metric_input=req_input,
        )

    def improve_summary(
        self,
        summary: str,
        target_role: str = "Software Engineer",
        jd_text: Optional[str] = None,
    ) -> ContentSuggestion:
        if not self.api_key:
            return self.fallback.improve_summary(summary, target_role, jd_text)

        prompt = (
            f"Rewrite this professional summary for a {target_role} application.\n"
            f"Current summary: \"{summary}\"\n"
            "Ensure 3-4 crisp sentences, telegraphic ATS style, no first-person pronouns (I/my).\n"
            "DO NOT fabricate unverified claims.\n"
            "Respond ONLY with the summary text."
        )
        response_text = self._call_gemini(prompt)
        if not response_text:
            return self.fallback.improve_summary(summary, target_role, jd_text)

        sanitized, status, req_input = FactualityGuard.verify_and_sanitize(summary, response_text)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4())[:8],
            section="summary",
            original_text=summary,
            proposed_text=sanitized,
            rationale="Gemini ATS telegraphic rewrite with target keyword alignment.",
            factuality_status=status,
            requires_metric_input=req_input,
        )

    def generate_cover_letter(
        self,
        resume_text: str,
        jd_text: str,
        company: str,
        position: str,
        tone: str = "professional",
    ) -> str:
        if not self.api_key:
            return self.fallback.generate_cover_letter(resume_text, jd_text, company, position, tone)

        prompt = (
            f"Write a {tone} cover letter applying for {position} at {company}.\n"
            f"Candidate experience extracted from resume:\n{resume_text[:2000]}\n"
            f"Job requirements:\n{jd_text[:1500]}\n"
            "Rules:\n"
            "1. Stick strictly to real experience in the resume.\n"
            "2. Do NOT hallucinate unearned degrees or fake achievements.\n"
            "3. Keep between 250 and 350 words."
        )
        response_text = self._call_gemini(prompt)
        return response_text or self.fallback.generate_cover_letter(resume_text, jd_text, company, position, tone)
