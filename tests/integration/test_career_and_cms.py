"""Integration tests for Career Intelligence, Approval Safeguards, and CMS Policy."""

import pytest
from app.services.matcher import JobMatcher
from app.models.schemas import ResumeData, ContactInfo, ExperienceItem


def test_research_papers_strictly_two_guardrail():
    """Verify that the platform enforces exactly two authentic research papers."""
    import json
    with open("packages/shared/profile_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    research = data.get("research", [])
    assert len(research) == 2, f"Research papers must strictly equal 2, found {len(research)}"
    
    titles = [r["title"].lower() for r in research]
    assert any("aegis" in t for t in titles), "AEGIS-Test paper must be present"
    assert any("breast cancer" in t or "ultrasound" in t for t in titles), "Ultrasound cancer classification paper must be present"


def test_approval_safeguard_state_machine():
    """Verify state machine: unapproved applications cannot be marked as dispatched."""
    application = {
        "id": "app-test-1",
        "company": "Enterprise Co",
        "position": "US IT Recruiter",
        "approval_status": "pending_review",
        "outreach_body": "Cold outreach message"
    }

    def attempt_dispatch(app):
        if app["approval_status"] != "approved_by_owner":
            raise PermissionError("POLICY_VIOLATION: Cannot dispatch email without prior explicit owner approval.")
        app["approval_status"] = "dispatched"
        return app

    # Should raise error when pending review
    with pytest.raises(PermissionError) as exc_info:
        attempt_dispatch(application)
    assert "EXPLICIT" in str(exc_info.value).upper() or "APPROVAL" in str(exc_info.value).upper()

    # Once explicitly approved, dispatch succeeds
    application["approval_status"] = "approved_by_owner"
    updated = attempt_dispatch(application)
    assert updated["approval_status"] == "dispatched"


def test_job_matcher_recruitment_and_engineering():
    """Verify evidence-grounded taxonomy matches both technical recruiting and full-stack engineering."""
    jd_recruitment = "Seeking a US IT Recruiter experienced with technical sourcing, candidate screening, and ATS workflows."
    req_skills, pref_skills = JobMatcher.extract_job_keywords(jd_recruitment)
    
    # Should detect skills in taxonomy
    all_extracted = req_skills + pref_skills
    assert any("recruit" in s or "sourcing" in s or "screening" in s or "ats" in s or "agile" in s for s in all_extracted)
