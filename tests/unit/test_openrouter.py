"""Unit tests for OpenRouter Multi-Model Provider and Heuristic Fallbacks."""

import pytest
from app.services.ai.openrouter import OpenRouterProvider, FREE_MODEL_REGISTRY
from app.services.ai.preservation import FactualityGuard


def test_openrouter_free_model_registry_contains_free_endpoints():
    assert "openrouter/free" in FREE_MODEL_REGISTRY
    assert any(":free" in m for m in FREE_MODEL_REGISTRY)


def test_openrouter_cascade_order():
    provider = OpenRouterProvider(
        api_key="",
        primary_model="openrouter/free",
        fallback_model="google/gemini-2.0-flash-exp:free"
    )
    cascade = provider._get_model_cascade()
    assert cascade[0] == "openrouter/free"
    assert cascade[1] == "google/gemini-2.0-flash-exp:free"
    assert len(cascade) >= 3


def test_openrouter_fallback_when_unauthenticated():
    provider = OpenRouterProvider(api_key="")
    suggestion = provider.improve_bullet(
        "worked on python code and fixed bugs",
        target_role="Backend Engineer"
    )
    assert suggestion.proposed_text is not None
    assert len(suggestion.proposed_text) > 0
    assert "Backend Engineer" in suggestion.rationale or "ATS" in suggestion.rationale or "action verb" in suggestion.rationale.lower()


def test_openrouter_factuality_preservation():
    bullet = "Maintained internal microservices and monitored system performance."
    hallucinated = "Single-handedly increased enterprise revenue by 450% and saved $2.4M."
    guarded, status, requires_input = FactualityGuard.verify_and_sanitize(bullet, hallucinated)
    assert status == "metric_placeholder_needed"
    assert requires_input is True
    assert "[insert metric e.g. 450%]" in guarded
