"""API Router for running ATS analysis and executing one-click automated fixes."""

import re
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.entities import ResumeEntity, AnalysisEntity
from app.models.schemas import ATSScoreReport, ResumeData
from app.services.ats_engine import ATSEngine
from app.services.exporter import DocumentExporter

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])


class ApplyFixPayload(BaseModel):
    fix_type: str


@router.post("/run/{resume_id}", response_model=ATSScoreReport)
def run_analysis(resume_id: str, db: Session = Depends(get_db)):
    """Run full 20-rule deterministic ATS analysis on a resume."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    structured = ResumeData.model_validate_json(e.structured_json)
    report = ATSEngine.analyze(e.raw_text, structured)

    # Save to analyses history
    analysis_record = AnalysisEntity(
        id=str(uuid.uuid4()),
        resume_id=resume_id,
        overall_score=report.overall_score,
        report_json=report.model_dump_json(),
        created_at=datetime.utcnow(),
    )
    db.add(analysis_record)

    # Update resume score
    e.current_ats_score = report.overall_score
    e.updated_at = datetime.utcnow()
    db.commit()

    return report


@router.post("/apply-fix/{resume_id}")
def apply_fix(resume_id: str, payload: ApplyFixPayload, db: Session = Depends(get_db)):
    """Apply safe, one-click automatic fix to resume content."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    data = ResumeData.model_validate_json(e.structured_json)
    fix_applied = False
    message = ""

    if payload.fix_type == "sanitize_glyphs":
        # Replace non-ascii quotes, bullets, icons with standard chars
        cleaned_text = e.raw_text
        replacements = [
            ("’", "'"), ("“", '"'), ("”", '"'), ("–", "-"), ("—", "-"),
            ("★", "*"), ("✔", "*"), ("▪", "-"), ("►", "-"), ("◆", "-"),
        ]
        for bad, good in replacements:
            cleaned_text = cleaned_text.replace(bad, good)
        e.raw_text = cleaned_text
        fix_applied = True
        message = "Sanitized fancy unicode glyphs and icons to standard ASCII/bullet characters."

    elif payload.fix_type == "remove_pronouns":
        # Remove first-person pronouns from summary and experience bullets
        for exp in data.experience:
            new_bullets = []
            for b in exp.bullets:
                clean_b = re.sub(r"^(I\s+|My\s+|We\s+)", "", b, flags=re.I)
                clean_b = re.sub(r"\b(I was responsible for|I helped with|I)\b\s*", "", clean_b, flags=re.I)
                if clean_b and not clean_b[0].isupper():
                    clean_b = clean_b[0].upper() + clean_b[1:]
                new_bullets.append(clean_b)
            exp.bullets = new_bullets
        e.structured_json = data.model_dump_json()
        e.raw_text = DocumentExporter.generate_plain_text(data)
        fix_applied = True
        message = "Stripped first-person pronouns ('I', 'My') from bullet points."

    elif payload.fix_type == "convert_to_single_column":
        # Remove tabs and columnar multiple-spaces
        cleaned_text = re.sub(r"\t+", " ", e.raw_text)
        cleaned_text = re.sub(r" {4,}", " ", cleaned_text)
        e.raw_text = cleaned_text
        fix_applied = True
        message = "Removed tab alignments and multi-column spaces for ATS single-column reading order."

    elif payload.fix_type == "insert_metric_placeholders":
        # Append impact placeholder to bullets lacking metrics
        for exp in data.experience:
            new_bullets = []
            for b in exp.bullets:
                if not re.search(r"(\$|\%|\b\d+\b)", b):
                    b = b.rstrip(".") + ", achieving [insert measurable outcome e.g. 20% efficiency gain]."
                new_bullets.append(b)
            exp.bullets = new_bullets
        e.structured_json = data.model_dump_json()
        e.raw_text = DocumentExporter.generate_plain_text(data)
        fix_applied = True
        message = "Added quantifiable metric placeholders to accomplishment bullets."

    if fix_applied:
        # Re-run analysis
        updated_data = ResumeData.model_validate_json(e.structured_json)
        new_report = ATSEngine.analyze(e.raw_text, updated_data)
        e.current_ats_score = new_report.overall_score
        e.updated_at = datetime.utcnow()
        db.commit()
        return {
            "success": True,
            "message": message,
            "new_score": new_report.overall_score,
            "report": new_report,
        }

    return {"success": False, "message": f"Fix type '{payload.fix_type}' is not supported."}
