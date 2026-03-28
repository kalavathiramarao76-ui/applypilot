import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiGenerations } from "@applypilot/shared";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobTitle, location, experienceLevel, skills } =
      await request.json();

    if (!jobTitle) {
      return Response.json(
        { error: "jobTitle is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a senior compensation analyst with expertise in tech industry salaries. Provide detailed salary intelligence for the following role.

Role: ${jobTitle}
Location: ${location || "United States (average)"}
Experience Level: ${experienceLevel || "Mid-level"}
Key Skills: ${(skills || []).join(", ") || "General"}

Return strict JSON:
{
  "salaryRange": {
    "low": 85000,
    "median": 120000,
    "high": 165000,
    "currency": "USD"
  },
  "totalCompBreakdown": {
    "baseSalary": "Range description",
    "annualBonus": "Typical percentage or range",
    "equity": "RSU/options typical grant",
    "signingBonus": "Typical range if applicable",
    "benefits": "Estimated benefits value"
  },
  "factorsAffectingPay": {
    "increase": ["4-5 factors that increase comp"],
    "decrease": ["3-4 factors that decrease comp"]
  },
  "cityComparison": [
    { "city": "San Francisco", "adjustedMedian": 155000, "costIndex": 1.3 },
    { "city": "New York", "adjustedMedian": 145000, "costIndex": 1.25 },
    { "city": "Austin", "adjustedMedian": 120000, "costIndex": 1.0 },
    { "city": "Chicago", "adjustedMedian": 115000, "costIndex": 0.95 },
    { "city": "Remote (US)", "adjustedMedian": 125000, "costIndex": 1.0 }
  ],
  "negotiationTips": ["6-8 specific negotiation strategies for this role"],
  "marketTrend": "Brief note on whether salaries are trending up, stable, or down for this role",
  "counterOfferTemplate": "A professional 3-4 sentence counter-offer email template customized for this role"
}

Use realistic salary figures based on current market data for ${jobTitle}. All numbers should be annual USD figures.`;

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt,
      maxOutputTokens: 4096,
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
      type: "salary_intelligence",
      input: { jobTitle, location, experienceLevel, skills } as Record<
        string,
        unknown
      >,
      output: text,
    });

    return Response.json({
      jobTitle,
      location: location || "United States",
      experienceLevel: experienceLevel || "Mid-level",
      ...result,
    });
  } catch (error) {
    console.error("AI salary error:", error);
    return Response.json(
      { error: "Failed to generate salary intelligence" },
      { status: 500 }
    );
  }
}
