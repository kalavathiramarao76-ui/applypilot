import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { profiles, aiGenerations } from "@zypply/shared";
import { eq } from "@zypply/shared";
import { generateAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetJobTitles } = await request.json();

    if (!targetJobTitles || !Array.isArray(targetJobTitles) || targetJobTitles.length === 0) {
      return Response.json(
        { error: "targetJobTitles is required (array of strings)" },
        { status: 400 }
      );
    }

    const [profile] = await db
      .select({
        skills: profiles.skills,
        experiences: profiles.experiences,
        education: profiles.education,
        headline: profiles.headline,
        summary: profiles.summary,
      })
      .from(profiles)
      .where(eq(profiles.id, session.userId))
      .limit(1);

    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const prompt = `You are a senior career advisor and skills gap analyst. Analyze the user's profile against their target roles and provide a detailed skill gap analysis.

USER PROFILE:
Headline: ${profile.headline || "N/A"}
Summary: ${profile.summary || "N/A"}
Skills: ${JSON.stringify(profile.skills || [])}
Experiences: ${JSON.stringify(profile.experiences || [])}
Education: ${JSON.stringify(profile.education || [])}

TARGET JOB TITLES: ${targetJobTitles.join(", ")}

Analyze thoroughly and respond in this exact JSON format:
{
  "currentSkills": [
    { "skill": "skill name", "level": "beginner|intermediate|advanced|expert", "evidence": "where this was demonstrated" }
  ],
  "requiredSkills": [
    { "skill": "skill name", "importance": "critical|high|medium|low", "gap": "none|small|medium|large" }
  ],
  "recommendations": [
    {
      "skill": "skill to learn",
      "priority": "high|medium|low",
      "resources": [
        { "name": "resource name", "url": "https://...", "type": "course|book|tutorial|certification|practice", "duration": "estimated time" }
      ]
    }
  ],
  "readiness": <number 0-100>,
  "insights": ["insight 1", "insight 2", "insight 3"]
}

Be specific and practical. Include real resource URLs where possible. Rate readiness honestly based on how well current skills match target roles.`;

    const text = await generateAI({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 4096,
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
      type: "skill_gap_analysis",
      input: { targetJobTitles } as Record<string, unknown>,
      output: text,
    });

    return Response.json(result);
  } catch (error) {
    console.error("AI skills error:", error);
    return Response.json(
      { error: "Failed to analyze skills" },
      { status: 500 }
    );
  }
}
