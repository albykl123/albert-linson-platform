"""Unit tests for the Job Description Matcher service."""

from app.models.schemas import ResumeData, ContactInfo, ExperienceItem
from app.services.matcher import JobMatcher


def test_job_matcher_extracts_and_scores():
    data = ResumeData(
        contact=ContactInfo(name="Jane Developer", email="jane@dev.com"),
        skills={"technical": ["Python", "FastAPI", "Docker", "PostgreSQL", "AWS"]},
        experience=[
            ExperienceItem(
                id="1",
                title="Backend Developer",
                company="Acme Corp",
                bullets=[
                    "Built scalable REST APIs using Python and FastAPI on AWS.",
                    "Managed PostgreSQL database clusters and optimized indexing.",
                ],
            )
        ],
    )
    from app.services.exporter import DocumentExporter
    resume_text = DocumentExporter.generate_plain_text(data)

    jd_text = """
    We are seeking a Backend Engineer with strong Python and FastAPI experience.
    Requirements:
    - 3+ years experience with Python, FastAPI, and Docker
    - Hands-on experience with PostgreSQL and AWS cloud infrastructure
    - Strong understanding of REST API design and CI/CD pipelines
    Preferred Qualifications:
    - Kubernetes and Terraform experience is a plus
    - Familiarity with React or TypeScript
    """

    report = JobMatcher.match(
        resume_text=resume_text,
        data=data,
        jd_text=jd_text,
        job_title="Backend Engineer",
        company="Startup Co",
    )

    assert report.overall_match_score >= 50
    matched_skills = [m.skill for m in report.matched_skills]
    assert "python" in matched_skills
    assert "fastapi" in matched_skills
    assert "postgresql" in matched_skills
    assert "aws" in matched_skills

    missing_req = [m.skill for m in report.missing_required]
    # ci/cd was in requirements but not in Jane's resume
    assert "ci/cd" in missing_req or "docker" in matched_skills


def test_keyword_stuffing_detection():
    data = ResumeData()
    # Resume artificially repeating 'python' 10 times
    resume_text = "python python python python python python python python python python"
    jd_text = "Must know Python."
    report = JobMatcher.match(resume_text, data, jd_text)
    assert report.keyword_density_warning is not None
    assert "stuffing" in report.keyword_density_warning.lower()
