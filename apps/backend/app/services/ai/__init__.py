"""AI Provider Factory supporting OpenRouter, Gemini, OpenAI, and Local Fallbacks."""

from app.config import settings
from app.services.ai.base import BaseAIProvider
from app.services.ai.no_ai import NoAIProvider
from app.services.ai.mock import MockAIProvider
from app.services.ai.gemini import GeminiProvider
from app.services.ai.openai_provider import OpenAICompatibleProvider
from app.services.ai.openrouter import OpenRouterProvider


def get_ai_provider(provider_name: str | None = None) -> BaseAIProvider:
    name = (provider_name or settings.AI_PROVIDER).lower()
    
    if name == "openrouter":
        return OpenRouterProvider()
    elif name == "mock":
        return MockAIProvider()
    elif name == "gemini":
        return GeminiProvider()
    elif name in ("openai", "groq"):
        return OpenAICompatibleProvider()
    elif name == "ollama":
        return OpenAICompatibleProvider(
            api_key="",
            base_url=f"{settings.OLLAMA_BASE_URL}/v1",
            model=settings.OLLAMA_MODEL,
        )
    return NoAIProvider()
