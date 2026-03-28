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

    const [profile] = await db
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

    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    return Response.json({ profile });
  } catch (error) {
    console.error("Profile GET error:", error);
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

    const allowedFields: Record<string, unknown> = {};
    const updatable = [
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

    for (const key of updatable) {
      if (key in body) {
        allowedFields[key] = body[key];
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(profiles)
      .set({ ...allowedFields, updatedAt: new Date() })
      .where(eq(profiles.id, session.userId))
      .returning({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
      });

    return Response.json({ profile: updated });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const allowedFields: Record<string, unknown> = {};
    const updatable = [
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

    for (const key of updatable) {
      if (key in body) {
        allowedFields[key] = body[key];
      }
    }

    if (Object.keys(allowedFields).length === 0) {
      return Response.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(profiles)
      .set({ ...allowedFields, updatedAt: new Date() })
      .where(eq(profiles.id, session.userId))
      .returning({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
      });

    return Response.json({ profile: updated });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
