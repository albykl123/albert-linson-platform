import { NextRequest, NextResponse } from "next/server";
import { masterProfile } from "@/lib/profileData";
import { verifyAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);

  if (isAuthorized) {
    // Authenticated owner gets full master profile
    return NextResponse.json(masterProfile, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  }

  // Unauthenticated visitors receive sanitized public profile
  // Sensitive full resume templates and private 4-tier skill matrices are redacted
  const publicProfile = {
    personal: masterProfile.personal,
    summary: masterProfile.summary,
    experience: masterProfile.experience.map((exp) => ({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      location: exp.location,
      period: exp.period,
      employment_type: exp.employment_type,
      summary_50_words: (exp as any).summary_50_words || exp.responsibilities?.[0] || "",
      highlights: exp.highlights,
      responsibilities: exp.responsibilities,
      tools_and_platforms: (exp as any).tools_and_platforms || exp.tools || [],
      skills_applied: (exp as any).skills_applied || [],
      kpis: (exp as any).kpis || [],
    })),
    education: masterProfile.education,
    leadership: masterProfile.leadership,
    certifications: masterProfile.certifications,
    projects: masterProfile.projects,
    research: masterProfile.research,
    github_repositories: masterProfile.github_repositories,
  };

  return NextResponse.json(publicProfile, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

