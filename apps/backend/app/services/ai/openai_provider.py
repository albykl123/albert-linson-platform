"""OpenAI-compatible AI Provider (OpenAI, Groq, DeepSeek, Local Ollama)."""

import uuid
from typing import Optional
import httpx

from app.config import settings
from app.models.schemas import ContentSuggestion
from app.services.ai.base import BaseAIProvider
from app.services.ai.no_ai import NoAIProvider
from app.services.ai.preservation import FactualityGuard


class OpenAICompatibleProvider(BaseAIProvider):
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None, model: str = "gpt-4o-mini"):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.base_url = (base_url or settings.OPENAI_BASE_URL).rstrip("/")
        self.model = model
        self.fallback = NoAIProvider()

    def _call_llm(self, prompt: str) -> str:
        if not self.api_key and "localhost" not in self.base_url and "127.0.0.1" not in self.base_url:
            return ""
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key or 'ollama'}",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a professional ATS resume optimizer. Adhere strictly to candidate facts."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
            "max_tokens": 500,
        }

        try:
            with httpx.Client(timeout=15.0) as client:
                res = client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "").strip()
        except Exception:
            pass
        return ""

    def improve_bullet(
        self,
        bullet: str,
        target_role: str = "Software Engineer",
        jd_requirement: Optional[str] = None,
    ) -> ContentSuggestion:
        response_text = self._call_llm(
            f"Rewrite this bullet point for a {target_role} role. Do not fabricate metrics. Original: \"{bullet}\""
        )
        if not response_text:
            return self.fallback.improve_bullet(bullet, target_role, jd_requirement)

        sanitized, status, req_input = FactualityGuard.verify_and_sanitize(bullet, response_text)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4())[:8],
            section="experience",
            original_text=bullet,
            proposed_text=sanitized,
            rationale="Optimized with LLM for action verb impact.",
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
        response_text = self._call_llm(
            f"Rewrite this professional summary for a {target_role} role. No personal pronouns. Original: \"{summary}\""
        )
        if not response_text:
            return self.fallback.improve_summary(summary, target_role, jd_text)

        sanitized, status, req_input = FactualityGuard.verify_and_sanitize(summary, response_text)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4())[:8],
            section="summary",
            original_text=summary,
            proposed_text=sanitized,
            rationale="Optimized summary with target keywords.",
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
        prompt = (
            f"Write a {tone} cover letter applying for {position} at {company} using this experience:\n"
            f"{resume_text[:2000]}"
        )
        response_text = self._call_llm(prompt)
        return response_text or self.fallback.generate_cover_letter(resume_text, jd_text, company, position, tone)
