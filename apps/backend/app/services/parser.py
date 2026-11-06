"""Document parser service: extracts text and structures resumes from PDF, DOCX, and TXT."""

import re
import uuid
from typing import BinaryIO
from pypdf import PdfReader
from docx import Document

from app.models.schemas import (
    ResumeData,
    ContactInfo,
    ExperienceItem,
    EducationItem,
    ProjectItem,
    CertificationItem,
)

# Standard section regex patterns
SECTION_PATTERNS = {
    "summary": re.compile(r"^(professional\s+summary|executive\s+summary|summary|profile|about\s+me)\b", re.I),
    "experience": re.compile(r"^(work\s+experience|professional\s+experience|employment\s+history|experience|work\s+history)\b", re.I),
    "education": re.compile(r"^(education|academic\s+background|academic\s+history|qualifications)\b", re.I),
    "skills": re.compile(r"^(technical\s+skills|core\s+competencies|skills\s+&\s+technologies|skills|technologies)\b", re.I),
    "projects": re.compile(r"^(key\s+projects|personal\s+projects|projects)\b", re.I),
    "certifications": re.compile(r"^(certifications|licenses|courses\s+&\s+certifications)\b", re.I),
    "languages": re.compile(r"^(languages|spoken\s+languages)\b", re.I),
}

EMAIL_REGEX = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE_REGEX = re.compile(r"(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b")
LINKEDIN_REGEX = re.compile(r"(https?://)?(www\.)?linkedin\.com/in/[A-Za-z0-9_-]+", re.I)
GITHUB_REGEX = re.compile(r"(https?://)?(www\.)?github\.com/[A-Za-z0-9_-]+", re.I)
URL_REGEX = re.compile(r"https?://[^\s/$.?#].[^\s]*", re.I)


class DocumentParser:
    @staticmethod
    def extract_text_from_pdf(file_stream: BinaryIO) -> str:
        """Extract clean text stream from PDF using pypdf."""
        reader = PdfReader(file_stream)
        text_parts = []
        for page_idx, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text.strip())
        return "\n\n".join(text_parts)

    @staticmethod
    def extract_text_from_docx(file_stream: BinaryIO) -> str:
        """Extract clean text hierarchy from DOCX."""
        doc = Document(file_stream)
        lines = []
        for para in doc.paragraphs:
            text = para.text.strip()
            if text:
                lines.append(text)
        return "\n".join(lines)

    @staticmethod
    def extract_text(file_stream: BinaryIO, filename: str) -> str:
        """Extract plain text from PDF, DOCX, or text file."""
        lower = filename.lower()
        if lower.endswith(".pdf"):
            return DocumentParser.extract_text_from_pdf(file_stream)
        elif lower.endswith(".docx"):
            return DocumentParser.extract_text_from_docx(file_stream)
        else:
            # Plain text fallback
            content = file_stream.read()
            if isinstance(content, bytes):
                return content.decode("utf-8", errors="replace")
            return str(content)

    @staticmethod
    def extract_contact_info(text: str) -> ContactInfo:
        """Extract contact info using precise regex rules."""
        contact = ContactInfo()
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        
        # Name detection: typically the first non-empty line of the resume
        if lines:
            first_line = lines[0]
            if len(first_line) < 60 and not EMAIL_REGEX.search(first_line) and not URL_REGEX.search(first_line):
                contact.name = first_line.title()

        # Email
        email_match = EMAIL_REGEX.search(text)
        if email_match:
            contact.email = email_match.group(0).lower()

        # Phone
        phone_match = PHONE_REGEX.search(text)
        if phone_match:
            contact.phone = phone_match.group(0).strip()

        # Links
        linkedin_match = LINKEDIN_REGEX.search(text)
        if linkedin_match:
            contact.linkedin = linkedin_match.group(0)

        github_match = GITHUB_REGEX.search(text)
        if github_match:
            contact.github = github_match.group(0)

        # Location heuristic: look for City, State / Country patterns in the first 10 lines
        location_regex = re.compile(r"\b([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}\b|[A-Z][a-zA-Z\s.-]+,\s*[A-Z][a-zA-Z\s]+)")
        for line in lines[:10]:
            if not EMAIL_REGEX.search(line) and not URL_REGEX.search(line):
                loc_match = location_regex.search(line)
                if loc_match:
                    contact.location = loc_match.group(0).strip()
                    break

        return contact

    @staticmethod
    def parse_into_structure(raw_text: str) -> ResumeData:
        """
        Segment resume text into standard ATS sections and structure into ResumeData.
        Guarantees no fabrication: only populates data actually present in text.
        """
        lines = [l.strip() for l in raw_text.splitlines() if l.strip()]
        contact = DocumentParser.extract_contact_info(raw_text)

        sections: dict[str, list[str]] = {
            "summary": [],
            "experience": [],
            "education": [],
            "skills": [],
            "projects": [],
            "certifications": [],
            "languages": [],
            "other": [],
        }

        current_section = "other"
        
        for line in lines:
            matched_section = None
            for sec_key, pattern in SECTION_PATTERNS.items():
                if pattern.match(line) and len(line) < 40:
                    matched_section = sec_key
                    break
            
            if matched_section:
                current_section = matched_section
                continue

            sections[current_section].append(line)

        # 1. Summary
        summary = "\n".join(sections["summary"]).strip()

        # 2. Skills
        skills_dict: dict[str, list[str]] = {
            "technical": [],
            "frameworks": [],
            "tools": [],
            "soft": [],
        }
        raw_skills_text = " ".join(sections["skills"])
        if raw_skills_text:
            # Split by commas, bullets, pipes, or semicolons
            tokens = re.split(r"[,•|;·\n]+", raw_skills_text)
            for t in tokens:
                cleaned = t.strip()
                if cleaned and len(cleaned) < 35 and not cleaned.lower().startswith("skills:"):
                    skills_dict["technical"].append(cleaned)

        # 3. Experience parsing
        experience_items: list[ExperienceItem] = []
        exp_lines = sections["experience"]
        current_exp: ExperienceItem | None = None

        date_pattern = re.compile(r"(\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\b\d{4}\b|\bPresent\b)", re.I)

        for line in exp_lines:
            is_bullet = line.startswith(("-", "*", "•", "–", "—")) or re.match(r"^\d+\.", line)
            has_dates = len(date_pattern.findall(line)) >= 1
            
            if (not is_bullet and has_dates) or (not is_bullet and current_exp is None):
                # New role header
                if current_exp:
                    experience_items.append(current_exp)
                
                parts = re.split(r"[-|–—,]\s*", line)
                title = parts[0].strip() if len(parts) > 0 else line
                company = parts[1].strip() if len(parts) > 1 else ""
                
                dates = date_pattern.findall(line)
                start_date = dates[0][0] if len(dates) > 0 else ""
                end_date = dates[1][0] if len(dates) > 1 else ("Present" if "present" in line.lower() else "")

                current_exp = ExperienceItem(
                    id=str(uuid.uuid4())[:8],
                    title=title,
                    company=company,
                    start_date=start_date,
                    end_date=end_date,
                    current="present" in end_date.lower(),
                    bullets=[],
                )
            elif is_bullet:
                cleaned_bullet = re.sub(r"^[-*•–—\d.]+\s*", "", line).strip()
                if current_exp:
                    current_exp.bullets.append(cleaned_bullet)
                else:
                    # Bullet before explicit role header
                    current_exp = ExperienceItem(
                        id=str(uuid.uuid4())[:8],
                        title="Experience",
                        bullets=[cleaned_bullet],
                    )
            elif current_exp:
                # Continuation or description line
                current_exp.bullets.append(line)

        if current_exp:
            experience_items.append(current_exp)

        # 4. Education parsing
        education_items: list[EducationItem] = []
        edu_lines = sections["education"]
        for line in edu_lines:
            degree_match = re.search(r"\b(B\.?S\.?|Bachelor|M\.?S\.?|Master|Ph\.?D|Associate|Diploma|High School)\b", line, re.I)
            dates = date_pattern.findall(line)
            grad_date = dates[0][0] if dates else ""
            
            education_items.append(
                EducationItem(
                    id=str(uuid.uuid4())[:8],
                    degree=line if degree_match else line,
                    institution="",
                    graduation_date=grad_date,
                    highlights=[],
                )
            )

        # 5. Projects
        project_items: list[ProjectItem] = []
        for line in sections["projects"]:
            if line.startswith(("-", "*", "•")):
                if project_items:
                    project_items[-1].bullets.append(re.sub(r"^[-*•]\s*", "", line))
            else:
                project_items.append(
                    ProjectItem(
                        id=str(uuid.uuid4())[:8],
                        name=line,
                        bullets=[],
                    )
                )

        # 6. Certifications
        cert_items: list[CertificationItem] = []
        for line in sections["certifications"]:
            cert_items.append(
                CertificationItem(
                    id=str(uuid.uuid4())[:8],
                    name=re.sub(r"^[-*•]\s*", "", line),
                )
            )

        return ResumeData(
            contact=contact,
            summary=summary,
            skills=skills_dict,
            experience=experience_items,
            education=education_items,
            projects=project_items,
            certifications=cert_items,
            languages=[re.sub(r"^[-*•]\s*", "", l) for l in sections["languages"]],
        )
