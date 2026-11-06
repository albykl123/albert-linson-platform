"""Unit tests for FreeStack parser and synchronization."""

from pathlib import Path
import pytest
from app.services.freestack.parser import parse_free_for_dev_markdown, parse_local_free_for_dev_file

SAMPLE_MD = """
# Table of Contents
  * [Major Cloud Providers](#major-cloud-providers)
  * [Analytics](#analytics)

## Major Cloud Providers

  * [Google Cloud Platform](https://cloud.google.com)
    * App Engine - 28 frontend instance hours per day
    * Cloud Storage - 5GB free
  * [Amazon Web Services](https://aws.amazon.com)
    * Lambda - 1M requests per month

## Analytics

  * [Mixpanel](https://mixpanel.com) - 20M events per month free
  * [PostHog](https://posthog.com) - 1M events per month free
"""


def test_freestack_parse_sample_markdown():
    res = parse_free_for_dev_markdown(SAMPLE_MD)
    assert res["total_categories"] == 2
    assert "Major Cloud Providers" in res["categories"]
    assert "Analytics" in res["categories"]
    assert res["total_services"] == 4

    gcp = next(s for s in res["services"] if s["name"] == "Google Cloud Platform")
    assert gcp["url"] == "https://cloud.google.com"
    assert len(gcp["sub_features"]) == 2

    mixpanel = next(s for s in res["services"] if s["name"] == "Mixpanel")
    assert "20M events" in mixpanel["description"]


def test_freestack_parse_cloned_repo():
    repo_file = Path(r"C:\Users\sheeb\Documents\spicitifyextension\free-for-dev-repo\README.md")
    if repo_file.exists():
        res = parse_local_free_for_dev_file(repo_file)
        assert res["total_categories"] > 25
        assert res["total_services"] > 500
        print(f"Successfully parsed {res['total_services']} services across {res['total_categories']} categories!")
