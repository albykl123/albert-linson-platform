"""Unit tests for the FactualityGuard anti-hallucination engine."""

from app.services.ai.preservation import FactualityGuard


def test_verified_metrics_pass():
    original = "Led development of API service, reducing latency by 40%."
    proposed = "Spearheaded architecture of high-performance API service, decreasing latency by 40%."
    sanitized, status, req_input = FactualityGuard.verify_and_sanitize(original, proposed)
    assert status == "verified"
    assert req_input is False
    assert "40%" in sanitized


def test_hallucinated_metrics_converted_to_placeholder():
    original = "Managed team and delivered projects on time."
    # An untrusted LLM might invent a fake 50% improvement and $200K savings
    hallucinated = "Orchestrated engineering team delivering deliverables, accelerating speed by 50% and saving $200k."
    sanitized, status, req_input = FactualityGuard.verify_and_sanitize(original, hallucinated)
    assert status == "metric_placeholder_needed"
    assert req_input is True
    # The fake numbers should be wrapped in user placeholder tags
    assert "[insert metric e.g." in sanitized
    assert "50%" not in sanitized.replace("[insert metric e.g. 50%]", "")
