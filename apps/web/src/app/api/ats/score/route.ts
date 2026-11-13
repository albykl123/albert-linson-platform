import { NextRequest, NextResponse } from "next/server";
import { evaluateATS } from "@/lib/atsEngine";
import { verifyAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const isAuthorized = await verifyAdminRequest(req);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized access: Owner session required for ATS score evaluation." },
        { status: 401 }
      );
    }

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
