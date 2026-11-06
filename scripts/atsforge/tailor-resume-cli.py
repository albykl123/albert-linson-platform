"""ATSForge AI - Command Line Resume Tailoring Tool.

Usage:
  python scripts/tailor-resume-cli.py --resume path/to/resume.pdf --jd path/to/jd.txt --title "Senior Engineer" --company "Stripe"
"""

import argparse
import sys
from pathlib import Path

# Add backend to sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
BACKEND_DIR = PROJECT_ROOT / "apps" / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.db.session import SessionLocal, init_db
from app.services.parser import DocumentParser
from app.services.pipeline import UnifiedPipeline, PipelineRequest
from app.services.exporter import DocumentExporter

init_db()


def main():
    parser = argparse.ArgumentParser(description="ATSForge AI Automatic Resume Tailoring CLI")
    parser.add_argument("--resume", required=True, help="Path to resume file (PDF, DOCX, TXT)")
    parser.add_argument("--jd", required=True, help="Path to job description text file")
    parser.add_argument("--title", default="Software Engineer", help="Target Job Title")
    parser.add_argument("--company", default="Target Company", help="Target Company Name")
    parser.add_argument("--template", default="classic", help="Template: classic, modern, technical, student, business, minimal")
    parser.add_argument("--outdir", default=str(PROJECT_ROOT / "apps" / "backend" / "data" / "exports"), help="Output directory")

    args = parser.parse_args()

    resume_path = Path(args.resume)
    jd_path = Path(args.jd)

    if not resume_path.is_file():
        print(f"Error: Resume file not found at {resume_path}")
        sys.exit(1)
    if not jd_path.is_file():
        print(f"Error: Job description file not found at {jd_path}")
        sys.exit(1)

    print(f"\n[+] Loading resume from {resume_path.name}...")
    with open(resume_path, "rb") as f:
        raw_resume = DocumentParser.extract_text(f, resume_path.name)

    with open(jd_path, "r", encoding="utf-8", errors="replace") as f:
        raw_jd = f.read()

    print("[+] Executing Unified Automatic Tailoring Pipeline...")
    db = SessionLocal()
    try:
        req = PipelineRequest(
            raw_resume_text=raw_resume,
            job_description=raw_jd,
            target_job_title=args.title,
            target_company=args.company,
            template=args.template,
        )
        res = UnifiedPipeline.execute(db=db, request=req)

        print("\n" + "=" * 50)
        print(" PIPELINE RESULTS SUMMARY")
        print("=" * 50)
        print(f"  Target Role:         {args.title} at {args.company}")
        print(f"  Baseline ATS Score:  {res.baseline_ats_score} / 100")
        print(f"  Tailored ATS Score:  {res.tailored_ats_score} / 100 (+{res.score_improvement} pts)")
        print(f"  Job Match Score:     {res.job_match.overall_match_score}%")
        print(f"  Optimizations Made:  {len(res.diffs)} sections improved")
        print("=" * 50)

        # Export files
        out_dir = Path(args.outdir)
        out_dir.mkdir(parents=True, exist_ok=True)

        pdf_bytes = DocumentExporter.generate_pdf(res.tailored_resume.structured_data, template=args.template)
        docx_bytes = DocumentExporter.generate_docx(res.tailored_resume.structured_data, template=args.template)

        pdf_file = out_dir / f"{args.company}_{args.title}_tailored.pdf".replace(" ", "_")
        docx_file = out_dir / f"{args.company}_{args.title}_tailored.docx".replace(" ", "_")

        with open(pdf_file, "wb") as f:
            f.write(pdf_bytes)
        with open(docx_file, "wb") as f:
            f.write(docx_bytes)

        print(f"\n[OK] Generated ATS Vector PDF:  {pdf_file}")
        print(f"[OK] Generated Editable DOCX:   {docx_file}")

    finally:
        db.close()


if __name__ == "__main__":
    main()
