import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { resumes, jobs, aiGenerations } from "@zypply/shared";
import { eq } from "@zypply/shared";
import { generateAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeId, jobId } = await request.json();

    if (!resumeId) {
      return Response.json(
        { error: "resumeId is required" },
        { status: 400 }
      );
    }

    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (!resume) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }

    let jobContext = "";
    if (jobId) {
      const [job] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId))
        .limit(1);
      if (job) {
        jobContext = `\nTARGET JOB:\nTitle: ${job.jobTitle}\nCompany: ${job.companyName || "Unknown"}\nDescription: ${job.description || "N/A"}\nRequirements: ${JSON.stringify(job.requirements || [])}\nKeywords: ${JSON.stringify(job.keywords || [])}`;
      }
    }

    const resumeContent = resume.content as unknown as Record<string, unknown>;

    const prompt = `You are a world-class resume reviewer, ATS expert, and career coach. Perform a comprehensive resume analysis.

RESUME:
${JSON.stringify(resumeContent, null, 2)}
${jobContext}

${jobId ? "Score this resume against the specific job posting above." : "Provide a general quality assessment of this resume."}

Analyze every aspect thoroughly and respond in this exact JSON format:
{
  "overallScore": <number 0-100>,
  "categories": {
    "impact": { "score": <0-100>, "feedback": "..." },
    "brevity": { "score": <0-100>, "feedback": "..." },
    "atsCompatibility": { "score": <0-100>, "feedback": "..." },
    "keywords": { "score": <0-100>, "feedback": "..." },
    "formatting": { "score": <0-100>, "feedback": "..." },
    "actionVerbs": { "score": <0-100>, "feedback": "..." },
    "quantification": { "score": <0-100>, "feedback": "..." }
  },
  "sections": {
    "summary": { "score": <0-100>, "feedback": "..." },
    "experience": [{ "company": "...", "score": <0-100>, "feedback": "..." }],
    "education": { "score": <0-100>, "feedback": "..." },
    "skills": { "score": <0-100>, "feedback": "..." }
  },
  "redFlags": [
    { "type": "warning|error", "title": "...", "description": "..." }
  ],
  "suggestions": [
    {
      "section": "...",
      "before": "original text",
      "after": "improved text",
      "reason": "why this is better"
    }
  ]
}`;

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
      type: "resume_score",
      input: { resumeId, jobId } as Record<string, unknown>,
      output: text,
    });

    return Response.json(result);
  } catch (error) {
    console.error("AI score error:", error);
    return Response.json(
      { error: "Failed to score resume" },
      { status: 500 }
    );
  }
}
