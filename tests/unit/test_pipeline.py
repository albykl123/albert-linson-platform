"""Unit tests for the Unified Automatic Resume Generation Pipeline."""

from app.db.session import SessionLocal, init_db
from app.services.pipeline import UnifiedPipeline, PipelineRequest

init_db()


def test_unified_pipeline_end_to_end():
    db = SessionLocal()
    try:
        resume_text = (
            "David Chen\n"
            "david.chen@example.com | (415) 555-8901 | San Francisco, CA\n"
            "https://linkedin.com/in/davidchen | https://github.com/davidchen\n\n"
            "PROFESSIONAL SUMMARY\n"
            "Software engineer with experience building web applications.\n\n"
            "WORK EXPERIENCE\n"
            "Software Engineer - CloudWorks (Jan 2021 - Present)\n"
            "* Was responsible for developing microservices in Python.\n"
            "* Helped with Docker deployments on AWS.\n"
            "* Fixed bugs and wrote tests.\n\n"
            "EDUCATION\n"
            "B.S. in Computer Science - San Jose State University (2020)\n\n"
            "SKILLS\n"
            "Python, JavaScript, Docker, AWS, SQL, Git\n"
        )

        jd_text = """
        Senior Backend Engineer needed at Stripe.
        Requirements:
        - 3+ years experience with Python, Docker, and AWS
        - Demonstrated expertise in distributed microservices and database optimization
        - Strong communication and cross-functional leadership
        Preferred:
        - Experience with Kubernetes and CI/CD
        """

        req = PipelineRequest(
            raw_resume_text=resume_text,
            job_description=jd_text,
            target_job_title="Senior Backend Engineer",
            target_company="Stripe",
            template="classic",
        )

        result = UnifiedPipeline.execute(db=db, request=req)

        assert result.tailored_resume_id is not None
        assert result.tailored_ats_score >= result.baseline_ats_score
        assert len(result.diffs) >= 2  # Summary was rewritten, bullets were improved
        assert len(result.changes_summary) >= 2
        assert "pdf" in result.download_urls
        assert "docx" in result.download_urls

        # Verify summary rewrite has Stripe and role alignment
        assert "Senior Backend Engineer" in result.tailored_resume.structured_data.summary

        # Verify passive phrase replacement
        all_tailored_bullets = []
        for exp in result.tailored_resume.structured_data.experience:
            all_tailored_bullets.extend(exp.bullets)
        full_bullets_str = " ".join(all_tailored_bullets).lower()
        assert "was responsible for" not in full_bullets_str
        assert "helped with" not in full_bullets_str

    finally:
        db.close()
