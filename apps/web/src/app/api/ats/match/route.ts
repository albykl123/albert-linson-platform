import { NextRequest, NextResponse } from "next/server";
import { analyzeJobDescription } from "@/lib/jobMatcher";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resumeText = body.resumeText || "";
    const jdText = body.jdText || "";

    if (!resumeText.trim() || !jdText.trim()) {
      return NextResponse.json(
        { error: "Both resumeText and jdText are required" },
        { status: 400 }
      );
    }

    const result = analyzeJobDescription(resumeText, jdText);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to analyze job description match" },
      { status: 500 }
    );
  }
}
