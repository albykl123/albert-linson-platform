"""Unit tests for Document Exporters: PDF, DOCX, TXT, JSON."""

import json
from io import BytesIO
from pypdf import PdfReader
from docx import Document

from app.models.schemas import ResumeData, ContactInfo, ExperienceItem, EducationItem
from app.services.exporter import DocumentExporter


def sample_resume():
    return ResumeData(
        contact=ContactInfo(
            name="Morgan Lee",
            email="morgan.lee@example.com",
            phone="+1 202-555-0143",
            location="Boston, MA",
            linkedin="https://linkedin.com/in/morganlee",
            github="https://github.com/morganlee",
        ),
        summary="Results-driven DevOps and Site Reliability Engineer with 6 years experience.",
        skills={
            "technical": ["Go", "Python", "Kubernetes", "Terraform", "AWS"],
            "tools": ["Prometheus", "Grafana", "ArgoCD", "Linux"],
        },
        experience=[
            ExperienceItem(
                id="exp-1",
                title="Lead SRE",
                company="CloudScale Networks",
                start_date="Jan 2022",
                end_date="Present",
                bullets=[
                    "Maintained 99.99% uptime across 12 Kubernetes production clusters.",
                    "Automated disaster recovery testing, decreasing MTTR by 45%.",
                ],
            )
        ],
        education=[
            EducationItem(
                id="edu-1",
                degree="B.S. in Computer Engineering",
                institution="Northeastern University",
                graduation_date="2018",
            )
        ],
    )


def test_pdf_export_and_text_selectability():
    data = sample_resume()
    pdf_bytes = DocumentExporter.generate_pdf(data, template="classic")
    assert len(pdf_bytes) > 1000

    # Extract text using pypdf to verify genuine vector text extraction
    reader = PdfReader(BytesIO(pdf_bytes))
    full_text = ""
    for page in reader.pages:
        full_text += page.extract_text() or ""

    assert "Morgan Lee" in full_text
    assert "CloudScale Networks" in full_text
    assert "99.99%" in full_text
    assert "Northeastern University" in full_text


def test_docx_export_and_structure():
    data = sample_resume()
    docx_bytes = DocumentExporter.generate_docx(data, template="modern")
    assert len(docx_bytes) > 2000

    doc = Document(BytesIO(docx_bytes))
    all_paras = [p.text for p in doc.paragraphs if p.text.strip()]
    full_docx_text = " ".join(all_paras)

    assert "Morgan Lee" in full_docx_text
    assert "CloudScale Networks" in full_docx_text
    assert "Kubernetes" in full_docx_text


def test_plain_text_export():
    data = sample_resume()
    txt = DocumentExporter.generate_plain_text(data)
    assert "MORGAN LEE" in txt
    assert "morgan.lee@example.com" in txt
    assert "WORK EXPERIENCE" in txt


def test_json_resume_export():
    data = sample_resume()
    json_str = DocumentExporter.generate_json_resume(data)
    obj = json.loads(json_str)
    assert obj["basics"]["name"] == "Morgan Lee"
    assert obj["basics"]["email"] == "morgan.lee@example.com"
    assert len(obj["work"]) == 1
