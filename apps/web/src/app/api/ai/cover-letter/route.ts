import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { jobs, resumes, profiles } from "@applypilot/shared";
import { eq } from "@applypilot/shared";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, resumeId } = await request.json();

    if (!jobId || !resumeId) {
      return Response.json(
        { error: "jobId and resumeId are required" },
        { status: 400 }
      );
    }

    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
    const [resume] = await db.select().from(resumes).where(eq(resumes.id, resumeId)).limit(1);
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, session.userId)).limit(1);

    if (!job || !resume) {
      return Response.json({ error: "Job or resume not found" }, { status: 404 });
    }

    const resumeContent = resume.content as unknown as Record<string, unknown>;

    const prompt = `Write a professional, personalized cover letter for this job application.

CANDIDATE:
Name: ${profile?.fullName || "Candidate"}
Resume: ${JSON.stringify(resumeContent, null, 2)}

JOB:
Title: ${job.jobTitle}
Company: ${job.companyName || "the company"}
Description: ${job.description || "N/A"}

Guidelines:
- Be professional yet personable
- Reference specific requirements from the job description
- Highlight relevant experience from the resume
- Keep it concise (3-4 paragraphs)
- Show genuine enthusiasm for the role
- Do not use generic filler phrases
- Maintain the candidate's voice if possible

Return ONLY the cover letter text, no JSON wrapping.`;

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt,
      maxOutputTokens: 2048,
    });

    return Response.json({ coverLetter: text });
  } catch (error) {
    console.error("AI cover-letter error:", error);
    return Response.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
