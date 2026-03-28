import { getSession } from "@/lib/auth";
import { generateAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description } = await request.json();

    if (!description) {
      return Response.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    const prompt = `Analyze this job description and extract structured data. Return ONLY valid JSON.

JOB DESCRIPTION:
${description}

Return this exact JSON format:
{
  "title": "<job title>",
  "company": "<company name>",
  "requirements": [{"skill": "<skill>", "required": <true/false>}],
  "keywords": ["<important keywords for ATS>"],
  "salaryRange": "<salary range if mentioned, or null>",
  "remoteType": "<remote/hybrid/onsite/null>",
  "experienceLevel": "<entry/mid/senior/lead/null>"
}`;

    const text = await generateAI({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 2048,
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

    return Response.json(result);
  } catch (error) {
    console.error("AI analyze-job error:", error);
    return Response.json(
      { error: "Failed to analyze job description" },
      { status: 500 }
    );
  }
}
