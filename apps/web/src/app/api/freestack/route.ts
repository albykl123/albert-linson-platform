import { NextRequest, NextResponse } from "next/server";
import { searchFreeStack, freeStackData } from "@/lib/freestackData";
import { verifyAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // FreeStack is restricted exclusively to authenticated platform administrators
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized. FreeStack API is restricted to platform administrators." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";

  const results = searchFreeStack(q, category);

  return NextResponse.json(
    {
      total: results.length,
      catalogTotal: freeStackData.total_services,
      categories: freeStackData.categories,
      commitSha: freeStackData.commit_sha,
      syncedAt: freeStackData.synced_at,
      services: results,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, no-cache, no-store",
      },
    }
  );
}
