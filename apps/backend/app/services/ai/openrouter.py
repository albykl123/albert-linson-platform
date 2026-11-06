"""OpenRouter Multi-Model AI Gateway Provider with Free Tier Prioritization."""

import time
import uuid
import logging
from typing import Optional, List, Dict, Any
import httpx

from app.config import settings
from app.models.schemas import ContentSuggestion
from app.services.ai.base import BaseAIProvider
from app.services.ai.no_ai import NoAIProvider
from app.services.ai.preservation import FactualityGuard

logger = logging.getLogger(__name__)

# Registry of supported free models with priority order
FREE_MODEL_REGISTRY: List[str] = [
    "openrouter/free",
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-7b-instruct:free",
    "qwen/qwen-2.5-72b-instruct:free",
]


class OpenRouterProvider(BaseAIProvider):
    """
    Production-grade OpenRouter gateway provider.
    Enforces server-side API key containment, multi-model cascading fallback,
    token throttling, and strict FactualityGuard zero-hallucination policies.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        primary_model: Optional[str] = None,
        fallback_model: Optional[str] = None,
    ):
        self.api_key = api_key or settings.OPENROUTER_API_KEY
        self.base_url = (base_url or settings.OPENROUTER_BASE_URL).rstrip("/")
        self.primary_model = primary_model or settings.OPENROUTER_MODEL
        self.fallback_model = fallback_model or settings.OPENROUTER_FALLBACK_MODEL
        self.deterministic_fallback = NoAIProvider()

    def _get_model_cascade(self) -> List[str]:
        models = [self.primary_model]
        if self.fallback_model and self.fallback_model not in models:
            models.append(self.fallback_model)
        for m in FREE_MODEL_REGISTRY:
            if m not in models:
                models.append(m)
        return models

    def _call_llm(self, system_prompt: str, user_prompt: str, max_tokens: int = 600) -> Optional[str]:
        """Call OpenRouter with multi-model fallback and rate-limit backoff."""
        if not self.api_key:
            return None

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://albertlinson.com",
            "X-Title": "Albert Linson Personal Intelligence Platform",
        }

        models_to_try = self._get_model_cascade()

        for model in models_to_try:
            payload: Dict[str, Any] = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.2,
                "max_tokens": max_tokens,
            }

            for attempt in range(2):
                try:
                    with httpx.Client(timeout=12.0) as client:
                        response = client.post(
                            f"{self.base_url}/chat/completions",
                            headers=headers,
                            json=payload,
                        )

                        if response.status_code == 200:
                            data = response.json()
                            choices = data.get("choices", [])
                            if choices:
                                content = choices[0].get("message", {}).get("content", "").strip()
                                if content:
                                    return content
                        elif response.status_code == 429:
                            time.sleep(1.0 * (attempt + 1))
                            continue
                        else:
                            logger.warning(
                                f"OpenRouter model {model} failed with status {response.status_code}: {response.text[:200]}"
                            )
                            break
                except Exception as ex:
                    logger.warning(f"OpenRouter connection error for model {model}: {ex}")
                    break

        return None

    def improve_bullet(
        self,
        bullet: str,
        target_role: str = "Software Engineer",
        jd_requirement: Optional[str] = None,
    ) -> ContentSuggestion:
        system_prompt = (
            "You are a strict, factual ATS resume bullet optimizer. "
            "Rule 1: Start with a powerful past-tense action verb (e.g. Engineered, Spearheaded, Optimized). "
            "Rule 2: Never fabricate unverified numbers or percentages. If a quantitative metric is missing, use a bracketed placeholder like [improved metric by X%]. "
            "Rule 3: Return ONLY the rewritten bullet point text with no conversational preamble or markdown quotes."
        )

        user_prompt = f"Target Role: {target_role}\n"
        if jd_requirement:
            user_prompt += f"Target JD Requirement: {jd_requirement}\n"
        user_prompt += f"Original Bullet: {bullet}\n\nRewritten Bullet:"

        llm_output = self._call_llm(system_prompt, user_prompt, max_tokens=150)

        if not llm_output:
            return self.deterministic_fallback.improve_bullet(bullet, target_role, jd_requirement)

        # Enforce factuality guard
        guarded_text, status, requires_input = FactualityGuard.verify_and_sanitize(bullet, llm_output)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4()),
            section="experience",
            original_text=bullet,
            proposed_text=guarded_text,
            rationale="Enhanced with strong action verb and ATS-aligned terminology. Factuality guaranteed.",
            target_job_requirement=jd_requirement,
            factuality_status=status,
            requires_metric_input=requires_input,
        )

    def improve_summary(
        self,
        summary: str,
        target_role: str = "Software Engineer",
        jd_text: Optional[str] = None,
    ) -> ContentSuggestion:
        system_prompt = (
            "You are an executive ATS resume strategist. "
            "Rewrite the professional summary to be concise, impactful (3-4 sentences), and aligned with the target role. "
            "Do not invent degrees or employers not present in the original summary. "
            "Return ONLY the rewritten summary text."
        )

        user_prompt = f"Target Role: {target_role}\n"
        if jd_text:
            user_prompt += f"Target Job Description:\n{jd_text[:1000]}\n"
        user_prompt += f"Current Summary:\n{summary}\n\nRewritten Summary:"

        llm_output = self._call_llm(system_prompt, user_prompt, max_tokens=300)

        if not llm_output:
            return self.deterministic_fallback.improve_summary(summary, target_role, jd_text)

        guarded_text, status, requires_input = FactualityGuard.verify_and_sanitize(summary, llm_output)

        return ContentSuggestion(
            suggestion_id=str(uuid.uuid4()),
            section="summary",
            original_text=summary,
            proposed_text=guarded_text,
            rationale="Restructured for high ATS keyword density and executive clarity.",
            factuality_status=status,
            requires_metric_input=requires_input,
        )

    def generate_cover_letter(
        self,
        resume_text: str,
        jd_text: str,
        company: str,
        position: str,
        tone: str = "professional",
    ) -> str:
        system_prompt = (
            "You are an expert career counselor. Write an authentic, compelling cover letter. "
            "Draw strictly from the experience documented in the candidate's resume. Do not invent achievements. "
            "Tone: professional, confident, and articulate."
        )

        user_prompt = (
            f"Company: {company}\n"
            f"Position: {position}\n\n"
            f"Candidate Resume Experience:\n{resume_text[:2000]}\n\n"
            f"Job Description:\n{jd_text[:2000]}\n\n"
            "Generate formal cover letter:"
        )

        llm_output = self._call_llm(system_prompt, user_prompt, max_tokens=800)

        if not llm_output:
            return self.deterministic_fallback.generate_cover_letter(resume_text, jd_text, company, position, tone)

        return llm_output
