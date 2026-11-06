import { NextResponse } from "next/server";
import reposData from "@/data/github_repos.json";
import profileData from "@/data/profile_data.json";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Return verified connected repositories under Albert's GitHub account (@albykl123)
    const username = "albykl123";
    const userProfileUrl = `https://github.com/${username}`;

    return NextResponse.json({
      success: true,
      github_user: username,
      profile_url: userProfileUrl,
      total_connected_repos: (reposData || []).length,
      repositories: reposData || [],
      curated_featured: (profileData as any).github_repositories || [],
      software_projects: profileData.projects || []
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Failed to load GitHub repositories" 
    }, { status: 500 });
  }
}
