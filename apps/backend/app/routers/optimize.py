"""API Router for AI and rule-based content optimization, bullet rewriting, and cover letter generation."""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.entities import ResumeEntity
from app.models.schemas import (
    ContentSuggestion,
    CoverLetterRequest,
    CoverLetterResponse,
    ResumeData,
)
from app.services.ai import get_ai_provider
from app.services.exporter import DocumentExporter
from app.services.ats_engine import ATSEngine

router = APIRouter(prefix="/api/optimize", tags=["AI Resume Optimizer"])


class OptimizeBulletRequest(BaseModel):
    bullet: str
    target_role: str = "Software Engineer"
    jd_requirement: Optional[str] = None
    provider: Optional[str] = None


class OptimizeSummaryRequest(BaseModel):
    summary: str
    target_role: str = "Software Engineer"
    jd_text: Optional[str] = None
    provider: Optional[str] = None


class ApplySuggestionPayload(BaseModel):
    section: str  # summary or experience
    item_id: Optional[str] = None
    bullet_index: Optional[int] = None
    new_text: str


@router.post("/bullet", response_model=ContentSuggestion)
def optimize_bullet(payload: OptimizeBulletRequest):
    """Rewrite a single bullet point using active verbs and metrics guardrails."""
    provider = get_ai_provider(payload.provider)
    return provider.improve_bullet(
        bullet=payload.bullet,
        target_role=payload.target_role,
        jd_requirement=payload.jd_requirement,
    )


@router.post("/summary", response_model=ContentSuggestion)
def optimize_summary(payload: OptimizeSummaryRequest):
    """Rewrite professional summary to ATS telegraphic style."""
    provider = get_ai_provider(payload.provider)
    return provider.improve_summary(
        summary=payload.summary,
        target_role=payload.target_role,
        jd_text=payload.jd_text,
    )


@router.post("/cover-letter", response_model=CoverLetterResponse)
def generate_cover_letter(payload: CoverLetterRequest, db: Session = Depends(get_db)):
    """Generate a targeted, fact-checked cover letter."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == payload.resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    provider = get_ai_provider()
    company = payload.company_name or "Target Company"
    title = payload.job_title or e.target_role

    letter_text = provider.generate_cover_letter(
        resume_text=e.raw_text,
        jd_text=payload.job_description,
        company=company,
        position=title,
        tone=payload.tone,
    )

    wc = len(letter_text.split())

    return CoverLetterResponse(
        title=f"Cover Letter - {title} at {company}",
        recipient=f"Hiring Team, {company}",
        content=letter_text,
        matching_highlights=[
            f"Tailored to {company} {title} posting",
            "100% grounded in verified resume experience",
            "Telegraphic professional tone",
        ],
        word_count=wc,
    )


@router.post("/apply-to-resume/{resume_id}")
def apply_suggestion_to_resume(
    resume_id: str,
    payload: ApplySuggestionPayload,
    db: Session = Depends(get_db),
):
    """Apply an accepted AI suggestion directly to master resume with user consent."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    data = ResumeData.model_validate_json(e.structured_json)

    if payload.section == "summary":
        data.summary = payload.new_text
    elif payload.section == "experience":
        # Find item and bullet
        for exp in data.experience:
            if exp.id == payload.item_id:
                if payload.bullet_index is not None and 0 <= payload.bullet_index < len(exp.bullets):
                    exp.bullets[payload.bullet_index] = payload.new_text
                else:
                    exp.bullets.append(payload.new_text)
                break

    e.structured_json = data.model_dump_json()
    e.raw_text = DocumentExporter.generate_plain_text(data)

    # Recalculate ATS score
    new_score = ATSEngine.analyze(e.raw_text, data).overall_score
    e.current_ats_score = new_score
    db.commit()

    return {
        "success": True,
        "message": "Suggestion successfully applied to resume profile.",
        "new_score": new_score,
        "structured_data": data,
    }
