import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { jobs, aiGenerations } from "@applypilot/shared";
import { eq } from "@applypilot/shared";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, type } = await request.json();

    if (!jobId || !type) {
      return Response.json(
        { error: "jobId and type are required" },
        { status: 400 }
      );
    }

    const validTypes = ["behavioral", "technical", "situational"];
    if (!validTypes.includes(type)) {
      return Response.json(
        { error: "type must be behavioral, technical, or situational" },
        { status: 400 }
      );
    }

    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    const prompt = `You are a senior hiring manager and interview coach. Generate exactly 10 ${type} interview questions for the following job position.

JOB DETAILS:
Title: ${job.jobTitle}
Company: ${job.companyName || "Unknown"}
Description: ${job.description || "N/A"}
Requirements: ${JSON.stringify(job.requirements || [])}
Keywords: ${JSON.stringify(job.keywords || [])}

For each question, provide:
- The question text
- Difficulty level (easy, medium, hard)
- What the interviewer is really looking for (the hidden evaluation criteria)
- Key points a strong answer should cover

Respond in this exact JSON format:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "difficulty": "easy|medium|hard",
      "lookingFor": "...",
      "keyPoints": ["point1", "point2", "point3"]
    }
  ]
}`;

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
      type: "interview_questions",
      input: { jobId, type } as Record<string, unknown>,
      output: text,
    });

    return Response.json(result);
  } catch (error) {
    console.error("AI interview error:", error);
    return Response.json(
      { error: "Failed to generate interview questions" },
      { status: 500 }
    );
  }
}
