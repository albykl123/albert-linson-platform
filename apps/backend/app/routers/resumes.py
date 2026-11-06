"""API Router for resume lifecycle: upload, parse, list, get, update, duplicate, delete."""

import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import ResumeEntity
from app.models.schemas import (
    ResumeResponse,
    ResumeCreate,
    ResumeUpdate,
    ResumeData,
)
from app.services.parser import DocumentParser
from app.services.ats_engine import ATSEngine
from app.services.exporter import DocumentExporter
from app.config import settings

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])


@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    title: str = Form(None),
    target_role: str = Form("Software Engineer"),
    db: Session = Depends(get_db),
):
    """Upload and parse a PDF, DOCX, or TXT resume."""
    filename = file.filename or "resume.txt"
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File size exceeds maximum limit of 5MB.")

    from io import BytesIO
    stream = BytesIO(content)
    raw_text = DocumentParser.extract_text(stream, filename)
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Unable to extract text. The document may be empty or an image scan.")

    # Structure into ResumeData
    structured = DocumentParser.parse_into_structure(raw_text)
    
    # Calculate baseline score
    initial_analysis = ATSEngine.analyze(raw_text, structured)

    resume_id = str(uuid.uuid4())
    resume_title = title or filename.rsplit(".", 1)[0].replace("-", " ").replace("_", " ").title()

    entity = ResumeEntity(
        id=resume_id,
        title=resume_title,
        target_role=target_role,
        raw_text=raw_text,
        structured_json=structured.model_dump_json(),
        current_ats_score=initial_analysis.overall_score,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(entity)
    db.commit()
    db.refresh(entity)

    return ResumeResponse(
        id=entity.id,
        title=entity.title,
        target_role=entity.target_role,
        raw_text=entity.raw_text,
        structured_data=ResumeData.model_validate_json(entity.structured_json),
        current_ats_score=entity.current_ats_score,
        created_at=entity.created_at.isoformat(),
        updated_at=entity.updated_at.isoformat(),
    )


@router.post("/create", response_model=ResumeResponse)
def create_resume(payload: ResumeCreate, db: Session = Depends(get_db)):
    """Create a new resume from JSON or raw text."""
    resume_id = str(uuid.uuid4())
    raw_text = payload.raw_text or ""
    
    if payload.structured_data:
        structured = payload.structured_data
        if not raw_text:
            raw_text = DocumentExporter.generate_plain_text(structured)
    else:
        structured = DocumentParser.parse_into_structure(raw_text)

    score_report = ATSEngine.analyze(raw_text, structured)

    entity = ResumeEntity(
        id=resume_id,
        title=payload.title,
        target_role=payload.target_role,
        raw_text=raw_text,
        structured_json=structured.model_dump_json(),
        current_ats_score=score_report.overall_score,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(entity)
    db.commit()
    db.refresh(entity)

    return ResumeResponse(
        id=entity.id,
        title=entity.title,
        target_role=entity.target_role,
        raw_text=entity.raw_text,
        structured_data=ResumeData.model_validate_json(entity.structured_json),
        current_ats_score=entity.current_ats_score,
        created_at=entity.created_at.isoformat(),
        updated_at=entity.updated_at.isoformat(),
    )


@router.get("", response_model=list[ResumeResponse])
def list_resumes(db: Session = Depends(get_db)):
    """List all saved master resumes."""
    entities = db.query(ResumeEntity).order_by(ResumeEntity.updated_at.desc()).all()
    results = []
    for e in entities:
        results.append(
            ResumeResponse(
                id=e.id,
                title=e.title,
                target_role=e.target_role,
                raw_text=e.raw_text,
                structured_data=ResumeData.model_validate_json(e.structured_json),
                current_ats_score=e.current_ats_score,
                created_at=e.created_at.isoformat(),
                updated_at=e.updated_at.isoformat(),
            )
        )
    return results


@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: str, db: Session = Depends(get_db)):
    """Retrieve resume by ID."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")
    return ResumeResponse(
        id=e.id,
        title=e.title,
        target_role=e.target_role,
        raw_text=e.raw_text,
        structured_data=ResumeData.model_validate_json(e.structured_json),
        current_ats_score=e.current_ats_score,
        created_at=e.created_at.isoformat(),
        updated_at=e.updated_at.isoformat(),
    )


@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(resume_id: str, payload: ResumeUpdate, db: Session = Depends(get_db)):
    """Update resume fields, raw text, or structured sections."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")

    if payload.title is not None:
        e.title = payload.title
    if payload.target_role is not None:
        e.target_role = payload.target_role
    if payload.structured_data is not None:
        e.structured_json = payload.structured_data.model_dump_json()
        e.raw_text = DocumentExporter.generate_plain_text(payload.structured_data)
    elif payload.raw_text is not None:
        e.raw_text = payload.raw_text
        e.structured_json = DocumentParser.parse_into_structure(payload.raw_text).model_dump_json()

    # Recompute score
    st = ResumeData.model_validate_json(e.structured_json)
    score_report = ATSEngine.analyze(e.raw_text, st)
    e.current_ats_score = score_report.overall_score
    e.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(e)

    return ResumeResponse(
        id=e.id,
        title=e.title,
        target_role=e.target_role,
        raw_text=e.raw_text,
        structured_data=st,
        current_ats_score=e.current_ats_score,
        created_at=e.created_at.isoformat(),
        updated_at=e.updated_at.isoformat(),
    )


@router.post("/{resume_id}/duplicate", response_model=ResumeResponse)
def duplicate_resume(resume_id: str, db: Session = Depends(get_db)):
    """Create an exact copy of a resume."""
    orig = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not orig:
        raise HTTPException(status_code=404, detail="Resume not found.")

    new_id = str(uuid.uuid4())
    dup = ResumeEntity(
        id=new_id,
        title=f"{orig.title} (Copy)",
        target_role=orig.target_role,
        raw_text=orig.raw_text,
        structured_json=orig.structured_json,
        current_ats_score=orig.current_ats_score,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(dup)
    db.commit()
    db.refresh(dup)

    return ResumeResponse(
        id=dup.id,
        title=dup.title,
        target_role=dup.target_role,
        raw_text=dup.raw_text,
        structured_data=ResumeData.model_validate_json(dup.structured_json),
        current_ats_score=dup.current_ats_score,
        created_at=dup.created_at.isoformat(),
        updated_at=dup.updated_at.isoformat(),
    )


@router.delete("/{resume_id}")
def delete_resume(resume_id: str, db: Session = Depends(get_db)):
    """Delete a resume."""
    e = db.query(ResumeEntity).filter(ResumeEntity.id == resume_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Resume not found.")
    db.delete(e)
    db.commit()
    return {"message": "Resume deleted successfully.", "id": resume_id}
