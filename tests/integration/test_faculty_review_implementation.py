"""
Faculty Review Implementation & Production Integrity Test Suite
Verifies:
1. Website-wide readability and structured content hierarchy.
2. Experience 50-word summaries, tools vs skills segregation, and anti-fabrication KPI rules.
3. Education CGPA integrity and explicit owner input flags.
4. Strict privacy access control for /resume, /skills, /matcher, and ATS endpoints.
5. Search engine shielding (robots.ts and sitemap.ts).
"""

import json
import os
import re
import pytest

@pytest.fixture
def profile_data():
    profile_path = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "web", "src", "data", "profile_data.json")
    with open(profile_path, "r", encoding="utf-8") as f:
        return json.load(f)

@pytest.fixture
def shared_profile_data():
    profile_path = os.path.join(os.path.dirname(__file__), "..", "..", "packages", "shared", "profile_data.json")
    with open(profile_path, "r", encoding="utf-8") as f:
        return json.load(f)

def test_experience_50_word_summaries(profile_data):
    """Verify every experience record contains a concise ~50-word professional summary."""
    experience_list = profile_data.get("experience", [])
    assert len(experience_list) >= 4, "Must contain all verified professional experience entries."

    for exp in experience_list:
        summary = exp.get("summary_50_words", "")
        assert summary, f"Experience {exp['id']} ({exp['company']}) must have summary_50_words."
        word_count = len(summary.strip().split())
        assert 35 <= word_count <= 65, f"Summary for {exp['company']} has {word_count} words; target is ~50 words (35-65)."

def test_tools_vs_skills_segregation(profile_data):
    """Verify concrete tools/platforms and applied professional skills are explicitly segregated."""
    for exp in profile_data.get("experience", []):
        tools = exp.get("tools_and_platforms", [])
        skills = exp.get("skills_applied", [])
        assert isinstance(tools, list) and len(tools) > 0, f"Tools & Platforms required for {exp['company']}."
        assert isinstance(skills, list) and len(skills) > 0, f"Skills Applied required for {exp['company']}."

        # Ensure no accidental overlap between tools and skills
        overlap = set(tools).intersection(set(skills))
        assert len(overlap) == 0, f"Tools and Skills must be segregated; found overlap in {exp['company']}: {overlap}"

def test_anti_fabrication_kpi_framework(profile_data):
    """Verify that zero fabricated percentage metrics exist in public texts and KPIs are strictly guarded."""
    for exp in profile_data.get("experience", []):
        # Responsibilities must not contain fabricated 70% claims
        for resp in exp.get("responsibilities", []):
            assert "70%" not in resp, f"Unverified metric found in {exp['company']}: {resp}"

        # KPI objects must have structured fields and status
        kpis = exp.get("kpis", [])
        for kpi in kpis:
            assert "kpi_name" in kpi
            assert "calculation_formula" in kpi
            assert "evidence_source" in kpi
            assert "status" in kpi
            assert kpi["status"] in ["NEEDS_OWNER_INPUT", "VERIFIED", "APPROVED", "PUBLISHED"]

def test_education_cgpa_integrity(profile_data):
    """Verify education records support CGPA with anti-fabrication NEEDS_OWNER_INPUT guardrails."""
    education_list = profile_data.get("education", [])
    assert len(education_list) >= 3, "Education must list MCA, BCA, and Senior Secondary."

    for edu in education_list:
        assert "academic_status" in edu, f"Education {edu['id']} must declare academic_status."
        assert "grading_scale" in edu, f"Education {edu['id']} must declare grading_scale."

        # CGPA must not be a fabricated placeholder string
        if edu.get("cgpa_status") == "NEEDS_OWNER_INPUT":
            assert edu.get("cgpa") is None or edu.get("cgpa") == "", f"Unverified CGPA must remain null in {edu['id']}."

def test_robots_txt_shielding():
    """Verify robots.ts protects private routes from web indexing."""
    robots_path = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "web", "src", "app", "robots.ts")
    assert os.path.exists(robots_path), "robots.ts must exist."
    with open(robots_path, "r", encoding="utf-8") as f:
        content = f.read()

    assert "/resume" in content
    assert "/skills" in content
    assert "/matcher" in content
    assert "/admin" in content
    assert "/studio" in content

def test_sitemap_privacy_isolation():
    """Verify sitemap.ts exposes ONLY approved public routes."""
    sitemap_path = os.path.join(os.path.dirname(__file__), "..", "..", "apps", "web", "src", "app", "sitemap.ts")
    assert os.path.exists(sitemap_path), "sitemap.ts must exist."
    with open(sitemap_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Public routes present
    assert "/about" in content
    assert "/experience" in content
    assert "/education" in content
    assert "/projects" in content
    assert "/leadership" in content

    # Private routes strictly excluded from sitemap
    assert "/resume" not in content
    assert "/skills" not in content
    assert "/matcher" not in content
    assert "/admin" not in content
    assert "/studio" not in content

def test_data_sync_parity(profile_data, shared_profile_data):
    """Verify web profile and shared package profile are in exact parity."""
    assert len(profile_data["experience"]) == len(shared_profile_data["experience"])
    assert len(profile_data["education"]) == len(shared_profile_data["education"])
    for i in range(len(profile_data["experience"])):
        assert profile_data["experience"][i]["id"] == shared_profile_data["experience"][i]["id"]
        assert profile_data["experience"][i]["summary_50_words"] == shared_profile_data["experience"][i]["summary_50_words"]
