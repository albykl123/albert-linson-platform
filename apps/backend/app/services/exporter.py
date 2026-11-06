"""Document Export Engine: generates ATS-friendly vector PDF, editable DOCX, plain text, and JSON."""

import json
from io import BytesIO
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT

from app.models.schemas import ResumeData


class DocumentExporter:
    @staticmethod
    def generate_pdf(data: ResumeData, template: str = "classic") -> bytes:
        """
        Generate a genuine vector ATS-friendly PDF via ReportLab.
        Ensures 100% selectable text, single-column reading order, and no raster screenshots.
        """
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            leftMargin=0.6 * inch,
            rightMargin=0.6 * inch,
            topMargin=0.6 * inch,
            bottomMargin=0.6 * inch,
        )

        styles = getSampleStyleSheet()

        # Template style palettes & fonts
        font_name = "Helvetica"
        title_font = "Helvetica-Bold"
        header_color = colors.HexColor("#1e293b")  # Slate 800
        line_color = colors.HexColor("#94a3b8")

        if template == "classic":
            font_name = "Times-Roman"
            title_font = "Times-Bold"
            header_color = colors.HexColor("#0f172a")
        elif template == "technical":
            font_name = "Helvetica"
            title_font = "Helvetica-Bold"
            header_color = colors.HexColor("#0284c7")  # Sky 600
        elif template == "minimal":
            font_name = "Helvetica"
            title_font = "Helvetica-Bold"
            header_color = colors.HexColor("#334155")
        elif template == "business":
            font_name = "Times-Roman"
            title_font = "Times-Bold"
            header_color = colors.HexColor("#1e3a8a")  # Blue 900

        name_style = ParagraphStyle(
            "NameStyle",
            parent=styles["Normal"],
            fontName=title_font,
            fontSize=18,
            leading=22,
            alignment=TA_CENTER if template in ("classic", "business", "minimal") else TA_LEFT,
            textColor=header_color,
        )

        contact_style = ParagraphStyle(
            "ContactStyle",
            parent=styles["Normal"],
            fontName=font_name,
            fontSize=9,
            leading=12,
            alignment=TA_CENTER if template in ("classic", "business", "minimal") else TA_LEFT,
            textColor=colors.HexColor("#475569"),
        )

        heading_style = ParagraphStyle(
            "HeadingStyle",
            parent=styles["Normal"],
            fontName=title_font,
            fontSize=12,
            leading=16,
            textColor=header_color,
            spaceBefore=8,
            spaceAfter=2,
            keepWithNext=True,
        )

        role_style = ParagraphStyle(
            "RoleStyle",
            parent=styles["Normal"],
            fontName=title_font,
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#0f172a"),
            keepWithNext=True,
        )

        meta_style = ParagraphStyle(
            "MetaStyle",
            parent=styles["Normal"],
            fontName=font_name,
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#64748b"),
            keepWithNext=True,
        )

        body_style = ParagraphStyle(
            "BodyStyle",
            parent=styles["Normal"],
            fontName=font_name,
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#1e293b"),
        )

        bullet_style = ParagraphStyle(
            "BulletStyle",
            parent=body_style,
            leftIndent=15,
            bulletIndent=5,
            spaceAfter=2,
        )

        elements = []

        # 1. Header (Name + Contact)
        name = data.contact.name or "Candidate Name"
        elements.append(Paragraph(name, name_style))
        elements.append(Spacer(1, 3))

        contact_parts = []
        if data.contact.email:
            contact_parts.append(data.contact.email)
        if data.contact.phone:
            contact_parts.append(data.contact.phone)
        if data.contact.location:
            contact_parts.append(data.contact.location)
        if data.contact.linkedin:
            contact_parts.append(data.contact.linkedin.replace("https://", "").replace("http://", ""))
        if data.contact.github:
            contact_parts.append(data.contact.github.replace("https://", "").replace("http://", ""))

        if contact_parts:
            elements.append(Paragraph(" | ".join(contact_parts), contact_style))
        elements.append(Spacer(1, 8))

        # 2. Professional Summary
        if data.summary:
            elements.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.75, color=line_color, spaceBefore=1, spaceAfter=4))
            elements.append(Paragraph(data.summary, body_style))
            elements.append(Spacer(1, 6))

        # Order helper: For student template, education comes first
        def render_experience():
            if not data.experience:
                return
            elements.append(Paragraph("WORK EXPERIENCE", heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.75, color=line_color, spaceBefore=1, spaceAfter=4))
            for exp in data.experience:
                title_company = f"{exp.title}" + (f" | {exp.company}" if exp.company else "")
                elements.append(Paragraph(title_company, role_style))
                
                date_loc = []
                if exp.start_date or exp.end_date:
                    date_loc.append(f"{exp.start_date} – {exp.end_date or 'Present'}")
                if exp.location:
                    date_loc.append(exp.location)
                if date_loc:
                    elements.append(Paragraph(" | ".join(date_loc), meta_style))
                
                elements.append(Spacer(1, 2))
                for bullet in exp.bullets:
                    clean_b = bullet.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                    elements.append(Paragraph(f"&bull; {clean_b}", bullet_style))
                elements.append(Spacer(1, 4))

        def render_education():
            if not data.education:
                return
            elements.append(Paragraph("EDUCATION", heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.75, color=line_color, spaceBefore=1, spaceAfter=4))
            for edu in data.education:
                elements.append(Paragraph(edu.degree, role_style))
                edu_meta = []
                if edu.institution:
                    edu_meta.append(edu.institution)
                if edu.graduation_date:
                    edu_meta.append(edu.graduation_date)
                if edu.location:
                    edu_meta.append(edu.location)
                if edu.gpa:
                    edu_meta.append(f"GPA: {edu.gpa}")
                if edu_meta:
                    elements.append(Paragraph(" | ".join(edu_meta), meta_style))
                for hl in edu.highlights:
                    clean_hl = hl.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                    elements.append(Paragraph(f"&bull; {clean_hl}", bullet_style))
                elements.append(Spacer(1, 4))

        if template == "student":
            render_education()
            render_experience()
        else:
            render_experience()
            render_education()

        # 4. Skills
        all_skills = []
        for cat, sk_list in data.skills.items():
            if sk_list:
                all_skills.append(f"<b>{cat.title()}:</b> " + ", ".join(sk_list))
        if all_skills:
            elements.append(Paragraph("SKILLS & TECHNOLOGIES", heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.75, color=line_color, spaceBefore=1, spaceAfter=4))
            for sk_line in all_skills:
                elements.append(Paragraph(sk_line, body_style))
                elements.append(Spacer(1, 2))
            elements.append(Spacer(1, 4))

        # 5. Projects
        if data.projects:
            elements.append(Paragraph("KEY PROJECTS", heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.75, color=line_color, spaceBefore=1, spaceAfter=4))
            for proj in data.projects:
                proj_title = proj.name + (f" ({', '.join(proj.technologies)})" if proj.technologies else "")
                elements.append(Paragraph(proj_title, role_style))
                for bullet in proj.bullets:
                    clean_b = bullet.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                    elements.append(Paragraph(f"&bull; {clean_b}", bullet_style))
                elements.append(Spacer(1, 3))

        # 6. Certifications
        if data.certifications:
            elements.append(Paragraph("CERTIFICATIONS", heading_style))
            elements.append(HRFlowable(width="100%", thickness=0.75, color=line_color, spaceBefore=1, spaceAfter=4))
            for cert in data.certifications:
                cert_meta = [cert.name]
                if cert.issuer:
                    cert_meta.append(cert.issuer)
                if cert.date:
                    cert_meta.append(cert.date)
                elements.append(Paragraph(" | ".join(cert_meta), body_style))
            elements.append(Spacer(1, 4))

        doc.build(elements)
        return buffer.getvalue()

    @staticmethod
    def generate_docx(data: ResumeData, template: str = "classic") -> bytes:
        """
        Generate an editable, ATS-compatible DOCX with native paragraphs and bullet styles.
        Zero multi-column tables or floating text boxes.
        """
        doc = Document()
        
        # Set 0.6 inch margins
        for section in doc.sections:
            section.top_margin = Inches(0.6)
            section.bottom_margin = Inches(0.6)
            section.left_margin = Inches(0.6)
            section.right_margin = Inches(0.6)

        # Name Title
        name_p = doc.add_paragraph()
        if template in ("classic", "business", "minimal"):
            name_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        name_run = name_p.add_run(data.contact.name or "Candidate Name")
        name_run.bold = True
        name_run.font.size = Pt(18)
        name_run.font.color.rgb = RGBColor(15, 23, 42)

        # Contact line
        contact_parts = []
        if data.contact.email:
            contact_parts.append(data.contact.email)
        if data.contact.phone:
            contact_parts.append(data.contact.phone)
        if data.contact.location:
            contact_parts.append(data.contact.location)
        if data.contact.linkedin:
            contact_parts.append(data.contact.linkedin)
        if data.contact.github:
            contact_parts.append(data.contact.github)

        if contact_parts:
            contact_p = doc.add_paragraph()
            if template in ("classic", "business", "minimal"):
                contact_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            c_run = contact_p.add_run(" | ".join(contact_parts))
            c_run.font.size = Pt(9.5)
            c_run.font.color.rgb = RGBColor(71, 85, 105)

        def add_heading(title: str):
            h = doc.add_paragraph()
            h.paragraph_format.space_before = Pt(8)
            h.paragraph_format.space_after = Pt(2)
            run = h.add_run(title.upper())
            run.bold = True
            run.font.size = Pt(11)
            run.font.color.rgb = RGBColor(30, 41, 59)

        # Summary
        if data.summary:
            add_heading("Professional Summary")
            p = doc.add_paragraph(data.summary)
            p.paragraph_format.space_after = Pt(4)

        # Experience
        if data.experience:
            add_heading("Work Experience")
            for exp in data.experience:
                role_p = doc.add_paragraph()
                r_title = role_p.add_run(exp.title + (f" | {exp.company}" if exp.company else ""))
                r_title.bold = True
                
                date_loc = []
                if exp.start_date or exp.end_date:
                    date_loc.append(f"{exp.start_date} – {exp.end_date or 'Present'}")
                if exp.location:
                    date_loc.append(exp.location)
                if date_loc:
                    role_p.add_run(" (" + " | ".join(date_loc) + ")").italic = True
                
                for bullet in exp.bullets:
                    doc.add_paragraph(bullet, style="List Bullet")

        # Education
        if data.education:
            add_heading("Education")
            for edu in data.education:
                edu_p = doc.add_paragraph()
                deg_run = edu_p.add_run(edu.degree)
                deg_run.bold = True
                meta = []
                if edu.institution:
                    meta.append(edu.institution)
                if edu.graduation_date:
                    meta.append(edu.graduation_date)
                if meta:
                    edu_p.add_run(" — " + " | ".join(meta))
                for hl in edu.highlights:
                    doc.add_paragraph(hl, style="List Bullet")

        # Skills
        all_skills = []
        for cat, sk_list in data.skills.items():
            if sk_list:
                all_skills.append(f"{cat.title()}: " + ", ".join(sk_list))
        if all_skills:
            add_heading("Skills & Technologies")
            for sk in all_skills:
                doc.add_paragraph(sk)

        # Projects
        if data.projects:
            add_heading("Key Projects")
            for proj in data.projects:
                p = doc.add_paragraph()
                p.add_run(proj.name).bold = True
                for b in proj.bullets:
                    doc.add_paragraph(b, style="List Bullet")

        # Certifications
        if data.certifications:
            add_heading("Certifications")
            for cert in data.certifications:
                doc.add_paragraph(f"{cert.name}" + (f" - {cert.issuer}" if cert.issuer else ""))

        buffer = BytesIO()
        doc.save(buffer)
        return buffer.getvalue()

    @staticmethod
    def generate_plain_text(data: ResumeData) -> str:
        """Generate clean, standard plain text formatted for legacy ATS text boxes."""
        lines = []
        name = data.contact.name or "CANDIDATE NAME"
        lines.append(name.upper())
        lines.append("=" * len(name))

        contact_parts = []
        if data.contact.email:
            contact_parts.append(data.contact.email)
        if data.contact.phone:
            contact_parts.append(data.contact.phone)
        if data.contact.location:
            contact_parts.append(data.contact.location)
        if data.contact.linkedin:
            contact_parts.append(data.contact.linkedin)
        if data.contact.github:
            contact_parts.append(data.contact.github)
        lines.append(" | ".join(contact_parts))
        lines.append("")

        if data.summary:
            lines.append("PROFESSIONAL SUMMARY")
            lines.append("-" * 25)
            lines.append(data.summary)
            lines.append("")

        if data.experience:
            lines.append("WORK EXPERIENCE")
            lines.append("-" * 25)
            for exp in data.experience:
                lines.append(f"{exp.title} - {exp.company}")
                if exp.start_date or exp.end_date:
                    lines.append(f"Dates: {exp.start_date} to {exp.end_date or 'Present'}")
                if exp.location:
                    lines.append(f"Location: {exp.location}")
                for b in exp.bullets:
                    lines.append(f"* {b}")
                lines.append("")

        if data.education:
            lines.append("EDUCATION")
            lines.append("-" * 25)
            for edu in data.education:
                lines.append(f"{edu.degree} - {edu.institution} ({edu.graduation_date})")
                for hl in edu.highlights:
                    lines.append(f"* {hl}")
                lines.append("")

        skills_lines = []
        for cat, sk_list in data.skills.items():
            if sk_list:
                skills_lines.append(f"{cat.title()}: " + ", ".join(sk_list))
        if skills_lines:
            lines.append("SKILLS")
            lines.append("-" * 25)
            lines.extend(skills_lines)
            lines.append("")

        if data.projects:
            lines.append("PROJECTS")
            lines.append("-" * 25)
            for proj in data.projects:
                lines.append(proj.name)
                for b in proj.bullets:
                    lines.append(f"* {b}")
                lines.append("")

        return "\n".join(lines)

    @staticmethod
    def generate_json_resume(data: ResumeData) -> str:
        """Export JSON Resume standard schema."""
        json_obj = {
            "basics": {
                "name": data.contact.name,
                "email": data.contact.email,
                "phone": data.contact.phone,
                "location": {"city": data.contact.location},
                "summary": data.summary,
                "profiles": [
                    {"network": "LinkedIn", "url": data.contact.linkedin} if data.contact.linkedin else None,
                    {"network": "GitHub", "url": data.contact.github} if data.contact.github else None,
                ],
            },
            "work": [
                {
                    "name": exp.company,
                    "position": exp.title,
                    "startDate": exp.start_date,
                    "endDate": exp.end_date or "Present",
                    "highlights": exp.bullets,
                }
                for exp in data.experience
            ],
            "education": [
                {
                    "institution": edu.institution,
                    "area": edu.degree,
                    "studyType": "Higher Education",
                    "endDate": edu.graduation_date,
                    "score": edu.gpa,
                }
                for edu in data.education
            ],
            "skills": [
                {"name": cat, "keywords": items}
                for cat, items in data.skills.items()
                if items
            ],
            "projects": [
                {"name": proj.name, "highlights": proj.bullets, "keywords": proj.technologies}
                for proj in data.projects
            ],
            "certificates": [
                {"name": cert.name, "issuer": cert.issuer, "date": cert.date}
                for cert in data.certifications
            ],
        }
        # Filter None
        json_obj["basics"]["profiles"] = [p for p in json_obj["basics"]["profiles"] if p]
        return json.dumps(json_obj, indent=2)
