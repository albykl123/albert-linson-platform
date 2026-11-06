import { NextRequest, NextResponse } from "next/server";
import { searchFreeStack, freeStackData } from "@/lib/freestackData";

export const runtime = "edge";

export async function GET(req: NextRequest) {
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
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
      },
    }
  );
}
