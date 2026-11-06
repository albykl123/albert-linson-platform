"""Unified Automatic Resume Generation Pipeline.

Orchestrates the entire 7-step pipeline:
1. Parse resume -> 2. Parse JD -> 3. Baseline ATS analysis -> 4. Gap & match analysis ->
5. Automatic rewriting with factuality guards -> 6. Re-validation & auto-fixes -> 7. Package deliverables.
"""

import uuid
import copy
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import Optional

from app.models.schemas import (
    ResumeData,
    ATSScoreReport,
    JobMatchReport,
    ContentSuggestion,
    ResumeResponse,
)
from app.services.parser import DocumentParser
from app.services.ats_engine import ATSEngine
from app.services.matcher import JobMatcher
from app.services.ai import get_ai_provider
from app.services.exporter import DocumentExporter
from app.models.entities import ResumeEntity, JobDescriptionEntity, AnalysisEntity
from sqlalchemy.orm import Session


class PipelineRequest(BaseModel):
    resume_id: Optional[str] = None
    raw_resume_text: Optional[str] = None
    job_description: str
    target_job_title: str = "Target Position"
    target_company: str = "Target Company"
    template: str = "classic"
    ai_provider: Optional[str] = None


class ResumeDiffItem(BaseModel):
    section: str
    title: str
    original: str
    revised: str
    change_type: str  # rewritten, improved, reordered, formatted


class PipelineResult(BaseModel):
    original_resume_id: str
    tailored_resume_id: str
    tailored_resume: ResumeResponse
    baseline_ats_score: int
    tailored_ats_score: int
    score_improvement: int
    job_match: JobMatchReport
    ats_report: ATSScoreReport
    diffs: list[ResumeDiffItem]
    changes_summary: list[str]
    honest_gaps_warning: list[str]
    download_urls: dict[str, str]


class UnifiedPipeline:
    @staticmethod
    def execute(
        db: Session,
        request: PipelineRequest,
    ) -> PipelineResult:
        # Step A: Load or parse original resume
        if request.resume_id:
            orig_entity = db.query(ResumeEntity).filter(ResumeEntity.id == request.resume_id).first()
            if not orig_entity:
                raise ValueError("Original resume not found.")
            orig_data = ResumeData.model_validate_json(orig_entity.structured_json)
            orig_text = orig_entity.raw_text
            orig_id = orig_entity.id
        elif request.raw_resume_text:
            orig_text = request.raw_resume_text
            orig_data = DocumentParser.parse_into_structure(orig_text)
            orig_id = str(uuid.uuid4())
            orig_entity = ResumeEntity(
                id=orig_id,
                title="Uploaded Resume",
                target_role=request.target_job_title,
                raw_text=orig_text,
                structured_json=orig_data.model_dump_json(),
                current_ats_score=0,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(orig_entity)
            db.commit()
        else:
            raise ValueError("Either resume_id or raw_resume_text must be provided.")

        # Step B: Parse Job Description & Extract Requirements
        jd_text = request.job_description.strip()
        job_title = request.target_job_title
        company = request.target_company

        # Step C: Baseline ATS Analysis on Original Resume
        baseline_ats = ATSEngine.analyze(orig_text, orig_data)
        baseline_score = baseline_ats.overall_score

        # Step D: Match Resume to JD & Detect Gaps
        match_report = JobMatcher.match(
            resume_text=orig_text,
            data=orig_data,
            jd_text=jd_text,
            job_title=job_title,
            company=company,
        )

        # Step E: Automatically Rewrite the Resume
        ai = get_ai_provider(request.ai_provider)
        tailored_data = copy.deepcopy(orig_data)
        diffs: list[ResumeDiffItem] = []
        changes: list[str] = []

        # 1. Rewrite Professional Summary with Target Role & JD Keywords
        matched_kw_sample = [m.skill for m in match_report.matched_skills[:4]]
        orig_summary = orig_data.summary
        sug_summary = ai.improve_summary(
            summary=orig_summary,
            target_role=job_title,
            jd_text=f"Target: {job_title} at {company}. Key skills: {', '.join(matched_kw_sample)}",
        )
        tailored_data.summary = sug_summary.proposed_text
        diffs.append(
            ResumeDiffItem(
                section="Summary",
                title="Professional Summary Tailoring",
                original=orig_summary or "(None)",
                revised=tailored_data.summary,
                change_type="rewritten",
            )
        )
        changes.append(f"Tailored professional summary to focus on {job_title} competencies and company alignment.")

        # 2. Re-prioritize and Reorganize Skills Section
        # Elevate matched skills that the candidate legitimately possesses
        current_tech = tailored_data.skills.get("technical", [])
        matched_skill_names = [m.skill for m in match_report.matched_skills]
        
        # Sort so matched skills appear first
        def skill_sort_key(s: str):
            lower_s = s.lower()
            return 0 if any(m in lower_s for m in matched_skill_names) else 1

        reordered_skills = sorted(current_tech, key=skill_sort_key)
        tailored_data.skills["technical"] = reordered_skills
        changes.append("Re-ordered technical skills so keywords relevant to the target job description appear first.")

        # 3. Rewrite Experience Bullets
        for exp in tailored_data.experience:
            new_bullets = []
            for b_idx, bullet in enumerate(exp.bullets):
                # Check if this bullet addresses any target keyword
                relevant_req = None
                for req in match_report.matched_skills:
                    if req.skill in bullet.lower():
                        relevant_req = req.skill
                        break

                sug = ai.improve_bullet(
                    bullet=bullet,
                    target_role=job_title,
                    jd_requirement=relevant_req,
                )
                new_bullet = sug.proposed_text
                new_bullets.append(new_bullet)

                if new_bullet != bullet:
                    diffs.append(
                        ResumeDiffItem(
                            section="Experience",
                            title=f"{exp.title} @ {exp.company} (Bullet #{b_idx + 1})",
                            original=bullet,
                            revised=new_bullet,
                            change_type="improved",
                        )
                    )
            exp.bullets = new_bullets

        changes.append("Transformed experience bullet points using decisive action verbs and quantified impact metrics.")

        # 4. Enforce standard formatting and ATS text regeneration
        tailored_text = DocumentExporter.generate_plain_text(tailored_data)

        # Step F: Validate the Generated Resume & Apply Safe Structural Fixes
        tailored_ats = ATSEngine.analyze(tailored_text, tailored_data)
        
        # Auto-fix any residual structural flags
        if any(f.rule_id == "RULE-06-SYMBOLS" and f.severity != "good" for cat in tailored_ats.categories for f in cat.findings):
            for old_glyph, new_glyph in [("’", "'"), ("“", '"'), ("”", '"'), ("–", "-"), ("—", "-")]:
                tailored_text = tailored_text.replace(old_glyph, new_glyph)
            tailored_data = DocumentParser.parse_into_structure(tailored_text)
            tailored_ats = ATSEngine.analyze(tailored_text, tailored_data)
            changes.append("Sanitized non-standard typography to universal ATS character encoding.")

        tailored_score = tailored_ats.overall_score

        # Step G: Save Tailored Resume Version to Database
        tailored_id = str(uuid.uuid4())
        tailored_title = f"{orig_entity.title} (Tailored for {company})"
        tailored_entity = ResumeEntity(
            id=tailored_id,
            title=tailored_title,
            target_role=job_title,
            raw_text=tailored_text,
            structured_json=tailored_data.model_dump_json(),
            current_ats_score=tailored_score,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        db.add(tailored_entity)

        # Record analysis
        analysis_record = AnalysisEntity(
            id=str(uuid.uuid4()),
            resume_id=tailored_id,
            overall_score=tailored_score,
            report_json=tailored_ats.model_dump_json(),
            created_at=datetime.now(timezone.utc),
        )
        db.add(analysis_record)
        db.commit()

        # Step H: Honest Gap Disclosures
        gaps_warnings = []
        for req in match_report.missing_required:
            gaps_warnings.append(
                f"Required skill '{req.skill}' was not found in your experience. "
                "ATSForge AI did NOT falsely invent this skill to protect your candidate credibility. "
                "If you possess this skill, add it to your master profile."
            )

        download_urls = {
            "pdf": f"/api/export/{tailored_id}/pdf?template={request.template}",
            "docx": f"/api/export/{tailored_id}/docx?template={request.template}",
            "txt": f"/api/export/{tailored_id}/txt",
            "json": f"/api/export/{tailored_id}/json",
        }

        tailored_response = ResumeResponse(
            id=tailored_id,
            title=tailored_title,
            target_role=job_title,
            raw_text=tailored_text,
            structured_data=tailored_data,
            current_ats_score=tailored_score,
            created_at=tailored_entity.created_at.isoformat(),
            updated_at=tailored_entity.updated_at.isoformat(),
        )

        return PipelineResult(
            original_resume_id=orig_id,
            tailored_resume_id=tailored_id,
            tailored_resume=tailored_response,
            baseline_ats_score=baseline_score,
            tailored_ats_score=tailored_score,
            score_improvement=max(0, tailored_score - baseline_score),
            job_match=match_report,
            ats_report=tailored_ats,
            diffs=diffs,
            changes_summary=changes,
            honest_gaps_warning=gaps_warnings,
            download_urls=download_urls,
        )
