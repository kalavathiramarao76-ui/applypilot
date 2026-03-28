import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { profiles, applications, jobs, aiGenerations } from "@applypilot/shared";
import { eq, desc } from "@applypilot/shared";
import { generateAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, session.userId))
      .limit(1);

    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const recentApps = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, session.userId))
      .orderBy(desc(applications.createdAt))
      .limit(20);

    const jobIds = recentApps
      .map((a) => a.jobId)
      .filter((id): id is string => id != null);

    let recentJobs: { jobTitle: string; companyName: string | null; keywords: unknown }[] = [];
    if (jobIds.length > 0) {
      const { inArray } = await import("@applypilot/shared");
      recentJobs = await db
        .select({
          jobTitle: jobs.jobTitle,
          companyName: jobs.companyName,
          keywords: jobs.keywords,
        })
        .from(jobs)
        .where(inArray(jobs.id, jobIds));
    }

    const prompt = `You are an expert career advisor and job market analyst. Based on the user's profile and recent application history, recommend 5 highly relevant job opportunities they should pursue.

USER PROFILE:
Name: ${profile.fullName}
Headline: ${profile.headline || "Not set"}
Skills: ${JSON.stringify(profile.skills || [])}
Preferred Titles: ${JSON.stringify(profile.preferredJobTitles || [])}
Location: ${profile.location || "Not specified"}
Remote Preference: ${profile.remotePreference || "Any"}
Target Salary: ${profile.targetSalaryRange ? `${profile.targetSalaryRange.min}-${profile.targetSalaryRange.max} ${profile.targetSalaryRange.currency}` : "Not specified"}

RECENT APPLICATIONS (${recentJobs.length} jobs):
${recentJobs.map((j) => `- ${j.jobTitle} at ${j.companyName || "Unknown"} (keywords: ${JSON.stringify(j.keywords || [])})`).join("\n")}

Analyze their profile and patterns to suggest roles they should target. Be specific about companies, roles, and why each is a good match.

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "title": "Specific job title",
      "company": "Specific company or type of company",
      "reasoning": "Why this is a great match based on their profile",
      "searchQuery": "What to search on LinkedIn/Indeed to find this role",
      "estimatedMatchScore": <number 0-100>,
      "tips": ["tip for landing this type of role"]
    }
  ],
  "careerInsights": "1-2 paragraph analysis of their job search patterns and strategic advice"
}`;

    const text = await generateAI({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 3000,
    });

    let result;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
    } catch {
      return Response.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    await db.insert(aiGenerations).values({
      userId: session.userId,
      type: "recommendations",
      input: { profileId: session.userId } as Record<string, unknown>,
      output: text,
    });

    return Response.json(result);
  } catch (error) {
    console.error("AI recommend error:", error);
    return Response.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
