import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { harvestJobs } from "@/lib/jobHarvester";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Gated: only authenticated owner can trigger ingestion
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized. Harvest trigger restricted to administrator." },
      { status: 401 }
    );
  }

  try {
    const result = await harvestJobs();
    return NextResponse.json({
      success: true,
      message: "Job Radar discovery cycle completed successfully.",
      ...result,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to execute job harvest"
    }, { status: 500 });
  }
}
