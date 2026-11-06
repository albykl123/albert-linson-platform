"""SQLAlchemy ORM Entities for ATSForge AI."""

from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class ResumeEntity(Base):
    __tablename__ = "resumes"

    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False, default="Untitled Resume")
    target_role = Column(String(255), nullable=False, default="General")
    raw_text = Column(Text, nullable=False, default="")
    structured_json = Column(Text, nullable=False, default="{}")
    current_ats_score = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    analyses = relationship("AnalysisEntity", back_populates="resume", cascade="all, delete-orphan")


class JobDescriptionEntity(Base):
    __tablename__ = "job_descriptions"

    id = Column(String(36), primary_key=True)
    title = Column(String(255), nullable=False, default="Target Position")
    company = Column(String(255), nullable=False, default="Target Company")
    raw_text = Column(Text, nullable=False)
    parsed_skills_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow)


class AnalysisEntity(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=False)
    overall_score = Column(Integer, default=0)
    report_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("ResumeEntity", back_populates="analyses")


class ApplicationEntity(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True)
    resume_id = Column(String(36), ForeignKey("resumes.id"), nullable=True)
    company = Column(String(255), nullable=False)
    position = Column(String(255), nullable=False)
    status = Column(String(50), default="Draft")  # Draft, Applied, Interview, Offer, Rejected
    notes = Column(Text, default="")
    applied_date = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SettingEntity(Base):
    __tablename__ = "settings"

    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
