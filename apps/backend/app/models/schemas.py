"""Pydantic schemas and data models for ATSForge AI."""

from typing import Any, Optional
from pydantic import BaseModel, Field


class ContactInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""
    website: str = ""


class ExperienceItem(BaseModel):
    id: str = ""
    title: str = ""
    company: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    bullets: list[str] = Field(default_factory=list)


class EducationItem(BaseModel):
    id: str = ""
    degree: str = ""
    institution: str = ""
    location: str = ""
    graduation_date: str = ""
    gpa: str = ""
    highlights: list[str] = Field(default_factory=list)


class ProjectItem(BaseModel):
    id: str = ""
    name: str = ""
    role: str = ""
    url: str = ""
    technologies: list[str] = Field(default_factory=list)
    bullets: list[str] = Field(default_factory=list)


class CertificationItem(BaseModel):
    id: str = ""
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""


class ResumeData(BaseModel):
    contact: ContactInfo = Field(default_factory=ContactInfo)
    summary: str = ""
    skills: dict[str, list[str]] = Field(
        default_factory=lambda: {
            "technical": [],
            "frameworks": [],
            "tools": [],
            "soft": [],
        }
    )
    experience: list[ExperienceItem] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    certifications: list[CertificationItem] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    custom_sections: list[dict[str, Any]] = Field(default_factory=list)


class ResumeCreate(BaseModel):
    title: str = "My Resume"
    target_role: str = "Software Engineer"
    raw_text: Optional[str] = None
    structured_data: Optional[ResumeData] = None


class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    target_role: Optional[str] = None
    raw_text: Optional[str] = None
    structured_data: Optional[ResumeData] = None


class ResumeResponse(BaseModel):
    id: str
    title: str
    target_role: str
    raw_text: str
    structured_data: ResumeData
    current_ats_score: int = 0
    created_at: str
    updated_at: str


class ATSFinding(BaseModel):
    rule_id: str
    category: str
    title: str
    severity: str  # critical, warning, good
    score_delta: int
    explanation: str
    evidence: str = ""
    why_it_matters: str = ""
    recommendation: str = ""
    one_click_fix_available: bool = False
    fix_type: Optional[str] = None


class ATSCategoryScore(BaseModel):
    category: str
    name: str
    score: int
    max_score: int
    findings: list[ATSFinding] = Field(default_factory=list)


class ATSScoreReport(BaseModel):
    overall_score: int
    rating: str  # Critical Issues, Needs Work, Competitive, ATS-Ready
    word_count: int
    reading_time_seconds: int
    categories: list[ATSCategoryScore]
    summary_text: str
    calculated_at: str


class JobDescriptionInput(BaseModel):
    title: str = "Target Job"
    company: str = "Target Company"
    raw_text: str


class SkillMatchItem(BaseModel):
    skill: str
    category: str  # required, preferred, tool, soft
    matched: bool
    count_in_resume: int = 0
    context_found: Optional[str] = None


class JobMatchReport(BaseModel):
    job_title: str
    company: str
    overall_match_score: int  # 0-100
    matched_skills: list[SkillMatchItem] = Field(default_factory=list)
    missing_required: list[SkillMatchItem] = Field(default_factory=list)
    missing_preferred: list[SkillMatchItem] = Field(default_factory=list)
    keyword_density_warning: Optional[str] = None
    alignment_summary: str = ""


class ContentSuggestion(BaseModel):
    suggestion_id: str
    section: str  # summary, experience, skills
    item_id: Optional[str] = None
    bullet_index: Optional[int] = None
    original_text: str
    proposed_text: str
    rationale: str
    target_job_requirement: Optional[str] = None
    factuality_status: str  # verified, metric_placeholder_needed, flagged
    requires_metric_input: bool = False


class ApplySuggestionRequest(BaseModel):
    suggestion_id: str
    accepted: bool
    edited_text: Optional[str] = None


class CoverLetterRequest(BaseModel):
    resume_id: str
    job_description: str
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    tone: str = "professional"  # professional, confident, concise


class CoverLetterResponse(BaseModel):
    title: str
    recipient: str
    content: str
    matching_highlights: list[str]
    word_count: int


class ExportRequest(BaseModel):
    resume_id: str
    format: str = "pdf"  # pdf, docx, txt, json
    template: str = "classic"  # classic, modern, technical, student, business, minimal
