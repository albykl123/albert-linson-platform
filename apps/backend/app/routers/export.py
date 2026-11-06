"""API Router for genuine document exports: vector PDF, editable DOCX, plain text, and JSON Resume."""

import re
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import ResumeEntity
from app.models.schemas import ResumeData
from app.services.exporter import DocumentExporter

router = APIRouter(prefix="/api/export", tags=["Exports"])


def safe_filename(name: str, ext: str) -> str:
    clean = re.sub(r"[^\w\s-]", "", name).strip().replace(" ", "_")
    return f"{clean or 'resume'}{ext}"


@router.get("/{resume_id}/pdf")
def export_pdf(
    resume_id: str,
    template: str = Query("classic", pattern="^(classic|modern|technical|student|business|minimal)$"),
    db: Session = Depends(get_db),
):
    """Download selectable ATS vector PDF."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    data = ResumeData.model_validate_json(e.structured_json)
    pdf_bytes = DocumentExporter.generate_pdf(data, template=template)

    filename = safe_filename(f"{e.title}_{template}", ".pdf")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{resume_id}/docx")
def export_docx(
    resume_id: str,
    template: str = Query("classic", pattern="^(classic|modern|technical|student|business|minimal)$"),
    db: Session = Depends(get_db),
):
    """Download editable ATS Microsoft Word DOCX."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    data = ResumeData.model_validate_json(e.structured_json)
    docx_bytes = DocumentExporter.generate_docx(data, template=template)

    filename = safe_filename(f"{e.title}_{template}", ".docx")
    return Response(
        content=docx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{resume_id}/txt")
def export_txt(resume_id: str, db: Session = Depends(get_db)):
    """Download standard ATS plain text."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    data = ResumeData.model_validate_json(e.structured_json)
    txt_content = DocumentExporter.generate_plain_text(data)

    filename = safe_filename(e.title, ".txt")
    return Response(
        content=txt_content,
        media_type="text/plain; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{resume_id}/json")
def export_json(resume_id: str, db: Session = Depends(get_db)):
    """Download JSON Resume standard format."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    data = ResumeData.model_validate_json(e.structured_json)
    json_content = DocumentExporter.generate_json_resume(data)

    filename = safe_filename(e.title, ".json")
    return Response(
        content=json_content,
        media_type="application/json; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
