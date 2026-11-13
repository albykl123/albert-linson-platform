import { NextRequest, NextResponse } from "next/server";
import { analyzeJobDescription } from "@/lib/jobMatcher";
import { verifyAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminRequest(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access: Owner session required for ATS matching analysis." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const jdText = (body.jdText || "").trim();
    const resumeText = (body.resumeText || "").trim();

    if (!jdText) {
      return NextResponse.json(
        { error: "A job description (jdText) is required for analysis." },
        { status: 400 }
      );
    }

    // Runs explainable evidence-grounded matching
    const result = analyzeJobDescription(resumeText, jdText);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to analyze job description match", details: error.message },
      { status: 500 }
    );
  }
}
