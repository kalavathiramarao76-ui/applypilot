import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { profiles } from "@applypilot/shared";
import { eq } from "@applypilot/shared";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
        headline: profiles.headline,
        summary: profiles.summary,
        skills: profiles.skills,
        experiences: profiles.experiences,
        education: profiles.education,
        preferredJobTitles: profiles.preferredJobTitles,
        targetSalaryRange: profiles.targetSalaryRange,
        location: profiles.location,
        remotePreference: profiles.remotePreference,
        subscriptionTier: profiles.subscriptionTier,
        aiCreditsUsed: profiles.aiCreditsUsed,
      })
      .from(profiles)
      .where(eq(profiles.id, session.userId))
      .limit(1);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
  } catch (error) {
    console.error("Me error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
