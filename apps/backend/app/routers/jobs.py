"""API Router for Job Description matching, requirement extraction, and gap analysis."""

import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import ResumeEntity, JobDescriptionEntity
from app.models.schemas import (
    JobDescriptionInput,
    JobMatchReport,
    ResumeData,
)
from app.services.matcher import JobMatcher

router = APIRouter(prefix="/api/jobs", tags=["Job Description Matching"])


@router.post("/match/{resume_id}", response_model=JobMatchReport)
def match_job_description(
    resume_id: str,
    payload: JobDescriptionInput,
    db: Session = Depends(get_db),
):
    """Compare a resume against a target job description and compute match metrics."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    structured = ResumeData.model_validate_json(e.structured_json)
    report = JobMatcher.match(
        resume_text=e.raw_text,
        data=structured,
        jd_text=payload.raw_text,
        job_title=payload.title,
        company=payload.company,
    )

    # Save JD record
    jd_record = JobDescriptionEntity(
        id=str(uuid.uuid4()),
        title=payload.title,
        company=payload.company,
        raw_text=payload.raw_text,
        parsed_skills_json=report.model_dump_json(),
        created_at=datetime.utcnow(),
    )
    db.add(jd_record)
    db.commit()

    return report


@router.get("")
def list_jobs(db: Session = Depends(get_db)):
    """List all saved job postings."""
    jobs = db.query(JobDescriptionEntity).order_by(JobDescriptionEntity.created_at.desc()).all()
    return [
        {
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "created_at": j.created_at.isoformat(),
        }
        for j in jobs
    ]
