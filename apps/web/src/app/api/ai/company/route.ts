import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiGenerations } from "@zypply/shared";
import { generateAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyName, jobTitle } = await request.json();

    if (!companyName) {
      return Response.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    const roleContext = jobTitle
      ? `The user is interested in the role: ${jobTitle}`
      : "The user is researching this company for potential job applications.";

    const prompt = `You are a senior career intelligence analyst. Generate comprehensive company research for "${companyName}".
${roleContext}

Provide the following in strict JSON format:
{
  "overview": {
    "description": "What the company does in 2-3 sentences",
    "industry": "Primary industry",
    "size": "Estimated employee count range",
    "founded": "Year or approximate",
    "fundingStage": "e.g., Public, Series C, Bootstrapped",
    "headquarters": "City, State/Country",
    "techStack": ["key technologies they use"]
  },
  "culture": {
    "values": ["list of 4-6 core company values"],
    "workStyle": "Description of work culture",
    "diversity": "Notes on D&I initiatives",
    "benefits": ["notable benefits and perks"]
  },
  "interviewProcess": {
    "rounds": [
      { "stage": "Stage name", "description": "What to expect", "tips": "How to prepare" }
    ],
    "duration": "Typical timeline",
    "difficulty": "Easy/Medium/Hard",
    "commonQuestions": ["5 common interview questions"]
  },
  "salaryInsights": {
    "range": "${jobTitle ? `Estimated range for ${jobTitle}` : 'General salary range for tech roles'}",
    "glassdoorRating": "Estimated rating out of 5",
    "compensationNotes": "Notes on total comp structure"
  },
  "whatTheyLookFor": ["5-6 qualities they value in candidates"],
  "prosAndCons": {
    "pros": ["4-5 pros from employee perspective"],
    "cons": ["3-4 cons from employee perspective"]
  },
  "recentDevelopments": ["3-4 recent news items or developments"],
  "tipsForApplicants": ["5-6 specific tips for standing out"]
}

Be specific and actionable. Base insights on publicly known information about ${companyName}.`;

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
      type: "company_research",
      input: { companyName, jobTitle } as Record<string, unknown>,
      output: text,
    });

    return Response.json({ company: companyName, jobTitle, ...result });
  } catch (error) {
    console.error("AI company research error:", error);
    return Response.json(
      { error: "Failed to generate company research" },
      { status: 500 }
    );
  }
}
