"""API Router for the Unified Automatic Resume Generation Pipeline."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.pipeline import UnifiedPipeline, PipelineRequest, PipelineResult

router = APIRouter(prefix="/api/pipeline", tags=["Automatic Tailoring Pipeline"])


@router.post("/generate-tailored-resume", response_model=PipelineResult)
def generate_tailored_resume(payload: PipelineRequest, db: Session = Depends(get_db)):
    """
    Unified one-click automatic resume generation pipeline:
    Upload Resume + Paste Job Description -> Automatically Rewrite & Optimize -> Re-Validate -> Deliverable Package.
    """
    try:
        result = UnifiedPipeline.execute(db=db, request=payload)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {str(e)}")
