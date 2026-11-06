import { NextRequest, NextResponse } from "next/server";
import { evaluateATS } from "@/lib/atsEngine";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText = body.text || "";

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Resume text must not be empty" },
        { status: 400 }
      );
    }

    const report = evaluateATS(rawText);
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to evaluate ATS compatibility score" },
      { status: 500 }
    );
  }
}
