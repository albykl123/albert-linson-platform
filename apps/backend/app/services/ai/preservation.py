"""Factuality & Preservation Guard: Enforces zero-hallucination and candidate factuality rules."""

import re


class FactualityGuard:
    @staticmethod
    def extract_numbers_and_metrics(text: str) -> set[str]:
        """Extract all numerical tokens, percentages, and dollar figures."""
        matches = re.findall(r"(\$\s?\d[\d,.]*|\b\d+[\d,.]*\s?%|\b\d+\b)", text)
        return set(m.replace(" ", "").lower() for m in matches)

    @staticmethod
    def verify_and_sanitize(original: str, proposed: str) -> tuple[str, str, bool]:
        """
        Verify that proposed text does not hallucinate new metrics.
        If the proposed text adds metrics not in the original, replace with a placeholder.
        Returns: (sanitized_proposed_text, factuality_status, requires_metric_input)
        """
        orig_metrics = FactualityGuard.extract_numbers_and_metrics(original)
        prop_metrics = FactualityGuard.extract_numbers_and_metrics(proposed)

        invented_metrics = prop_metrics - orig_metrics
        requires_input = False
        status = "verified"

        sanitized = proposed

        if invented_metrics:
            status = "metric_placeholder_needed"
            requires_input = True
            for inv in invented_metrics:
                # Replace invented metric with user placeholder
                pattern = re.escape(inv)
                sanitized = re.sub(pattern, "[insert metric e.g. " + inv + "]", sanitized, flags=re.I)

        return sanitized, status, requires_input
