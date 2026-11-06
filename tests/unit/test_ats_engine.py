"""Unit tests for the 20-Rule Deterministic ATS Compatibility Scoring Engine."""

import pytest
from app.models.schemas import ResumeData, ContactInfo, ExperienceItem, EducationItem
from app.services.ats_engine import ATSEngine, extract_tokens


def test_tech_tokens_preservation():
    text = "Experienced in C++, Node.js, C#, React.js, and Full-Stack development."
    tokens = extract_tokens(text)
    assert "c++" in tokens
    assert "node.js" in tokens
    assert "c#" in tokens
    assert "react.js" in tokens


def test_empty_resume_low_score():
    data = ResumeData()
    report = ATSEngine.analyze("", data)
    assert report.overall_score < 40
    assert report.rating == "Critical Issues"
    assert report.word_count == 0


def test_strong_resume_high_score():
    data = ResumeData(
        contact=ContactInfo(
            name="Alex Mercer",
            email="alex.mercer@example.com",
            phone="+1 (555) 019-2834",
            location="Seattle, WA",
            linkedin="https://linkedin.com/in/alexmercer",
            github="https://github.com/alexmercer",
        ),
        summary="Results-driven Senior Software Engineer with 8+ years designing high-throughput distributed systems.",
        skills={
            "technical": ["Python", "Go", "Docker", "Kubernetes", "PostgreSQL", "AWS"],
            "frameworks": ["FastAPI", "React"],
            "tools": ["Git", "Terraform", "CI/CD"],
            "soft": ["Leadership", "Agile", "Mentorship"],
        },
        experience=[
            ExperienceItem(
                id="exp-1",
                title="Staff Software Engineer",
                company="TechCorp Inc.",
                start_date="Jan 2021",
                end_date="Present",
                current=True,
                bullets=[
                    "Architected and deployed distributed event streaming pipelines, processing 15M messages daily.",
                    "Spearheaded cloud migration to Kubernetes on AWS, reducing infrastructure costs by 32% ($140K/year).",
                    "Led a cross-functional squad of 8 engineers, improving sprint delivery velocity by 25%.",
                    "Optimized database query performance in PostgreSQL, decreasing p99 latency from 450ms to 65ms.",
                ],
            ),
            ExperienceItem(
                id="exp-2",
                title="Software Engineer",
                company="DataFlow Systems",
                start_date="Mar 2018",
                end_date="Dec 2020",
                bullets=[
                    "Engineered microservices using Python and FastAPI, handling 5,000 requests per second.",
                    "Automated deployment pipelines with Docker and GitHub Actions, cutting release cycles by 40%.",
                    "Refactored legacy monolith into modular services, eliminating 80% of recurring production defects.",
                ],
            ),
        ],
        education=[
            EducationItem(
                id="edu-1",
                degree="B.S. in Computer Science",
                institution="University of Washington",
                graduation_date="May 2018",
                highlights=["Dean's List", "Distributed Systems Capstone"],
            )
        ],
    )

    from app.services.exporter import DocumentExporter
    raw_text = DocumentExporter.generate_plain_text(data)

    report = ATSEngine.analyze(raw_text, data)
    assert report.overall_score >= 80
    assert report.rating in ("Competitive", "ATS-Ready")
    assert report.word_count > 150

    # Verify categories
    contact_cat = next(c for c in report.categories if c.category == "contact")
    assert contact_cat.score == 15

    structure_cat = next(c for c in report.categories if c.category == "structure")
    assert structure_cat.score >= 20

    verbs_cat = next(c for c in report.categories if c.category == "verbs")
    assert verbs_cat.score >= 15


def test_multi_column_and_symbols_penalties():
    data = ResumeData(
        contact=ContactInfo(name="John Doe", email="john@example.com", phone="1234567890"),
    )
    # Text with heavy tabs, wide columnar spaces, and decorative glyphs
    bad_text = (
        "John Doe\t\tjohndoe@example.com\t\t1234567890\n"
        "Experience    Company A    2020-2022    Software Engineer\n"
        "Education     University B 2016-2020    Computer Science\n"
        "Skills        Python, Java, C++, Docker, AWS, React, SQL\n"
        "★ Top Performer Award 2021 ★ ✔ Certified Architect ► Special Honors ◆ Level 5\n"
        "• ★ ◆ ✔ ◄ ► ✦ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ✱ ✲ ✳ ✴ ✵ ✶ ✷\n"
    )

    report = ATSEngine.analyze(bad_text, data)
    col_finding = next((f for f in report.categories[1].findings if f.rule_id == "RULE-05-COLUMNS"), None)
    assert col_finding is not None
    assert col_finding.severity == "critical"
