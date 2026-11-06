"""Integration tests for ATSForge AI API endpoints and complete workflow."""

from app.db.session import SessionLocal, init_db
from app.models.schemas import (
    ResumeCreate,
    JobDescriptionInput,
)
from app.routers.resumes import create_resume, get_resume, list_resumes
from app.routers.analysis import run_analysis
from app.routers.jobs import match_job_description
from app.routers.optimize import optimize_bullet, OptimizeBulletRequest
from app.routers.export import export_pdf, export_docx, export_txt, export_json

init_db()


def test_full_application_workflow():
    db = SessionLocal()
    try:
        # 1. Create / Upload resume
        create_payload = ResumeCreate(
            title="Integration Candidate",
            target_role="Full Stack Engineer",
            raw_text=(
                "Morgan Stark\n"
                "morgan.stark@example.com | +1 415-555-0199 | San Francisco, CA\n"
                "https://linkedin.com/in/morganstark | https://github.com/morganstark\n\n"
                "PROFESSIONAL SUMMARY\n"
                "High-impact Full Stack Engineer with 6+ years experience architecting cloud applications.\n\n"
                "WORK EXPERIENCE\n"
                "Senior Engineer - Stark Industries (Jan 2021 - Present)\n"
                "* Architected and deployed microservices in Python and React on AWS.\n"
                "* Optimized database queries in PostgreSQL, cutting latency by 35%.\n"
                "* Mentored 5 junior engineers and conducted weekly architecture reviews.\n\n"
                "EDUCATION\n"
                "B.S. in Computer Science - UC Berkeley (2018)\n\n"
                "SKILLS\n"
                "Python, TypeScript, React, Docker, Kubernetes, AWS, PostgreSQL, Redis, CI/CD\n"
            ),
        )
        created = create_resume(create_payload, db=db)
        assert created.id is not None
        assert created.current_ats_score >= 70

        # 2. Retrieve resume
        fetched = get_resume(created.id, db=db)
        assert fetched.title == "Integration Candidate"
        assert fetched.structured_data.contact.email == "morgan.stark@example.com"

        # 3. List resumes
        all_resumes = list_resumes(db=db)
        assert any(r.id == created.id for r in all_resumes)

        # 4. Run Deterministic ATS Analysis
        report = run_analysis(created.id, db=db)
        assert report.overall_score >= 75
        assert report.rating in ("Competitive", "ATS-Ready")
        assert len(report.categories) == 5

        # 5. Job Description Match
        jd_input = JobDescriptionInput(
            title="Senior Full Stack Engineer",
            company="Tech Corp",
            raw_text="""
            We are looking for a Senior Full Stack Engineer.
            Requirements:
            - 4+ years with Python, React, and AWS
            - Hands-on experience with Docker and PostgreSQL
            - Strong knowledge of CI/CD pipelines
            Preferred:
            - Experience with GraphQL and Go
            """,
        )
        match_report = match_job_description(created.id, jd_input, db=db)
        assert match_report.overall_match_score >= 70
        matched_skills = [m.skill for m in match_report.matched_skills]
        assert "python" in matched_skills
        assert "react" in matched_skills
        assert "aws" in matched_skills
        assert "docker" in match_report.matched_skills[3].skill or "docker" in matched_skills

        # 6. AI / Heuristic Bullet Optimization
        opt_req = OptimizeBulletRequest(
            bullet="responsible for managing database queries in postgresql",
            target_role="Full Stack Engineer",
        )
        opt_res = optimize_bullet(opt_req)
        assert "responsible for" not in opt_res.proposed_text.lower()
        assert opt_res.factuality_status in ("verified", "metric_placeholder_needed")

        # 7. Document Exports
        # PDF
        pdf_res = export_pdf(created.id, template="classic", db=db)
        assert len(pdf_res.body) > 1000
        assert pdf_res.media_type == "application/pdf"

        # DOCX
        docx_res = export_docx(created.id, template="modern", db=db)
        assert len(docx_res.body) > 2000

        # TXT
        txt_res = export_txt(created.id, db=db)
        assert "MORGAN STARK" in txt_res.body.decode("utf-8") or "Morgan Stark" in txt_res.body.decode("utf-8")

        # JSON
        json_res = export_json(created.id, db=db)
        assert "morgan.stark@example.com" in json_res.body.decode("utf-8")

    finally:
        db.close()
