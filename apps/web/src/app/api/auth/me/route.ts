import { db } from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";
import { profiles } from "@zypply/shared";
import { eq } from "@zypply/shared";

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

export async function PUT(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "fullName",
      "headline",
      "summary",
      "skills",
      "experiences",
      "education",
      "preferredJobTitles",
      "targetSalaryRange",
      "location",
      "remotePreference",
    ];

    for (const key of allowedFields) {
      if (key in body) {
        updateData[key] = body[key];
      }
    }

    if (body.newPassword && typeof body.newPassword === "string") {
      updateData.passwordHash = await hashPassword(body.newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.id, session.userId))
      .returning({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
      });

    return Response.json({ user: updated });
  } catch (error) {
    console.error("Me PUT error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
