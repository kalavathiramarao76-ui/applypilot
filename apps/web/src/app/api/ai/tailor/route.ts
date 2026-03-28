import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { jobs, resumes, applications, aiGenerations } from "@zypply/shared";
import { eq } from "@zypply/shared";
import { generateAI } from "@/lib/ai";

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

    // Fetch job and resume
    const [job] = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    const [resume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (!job || !resume) {
      return Response.json(
        { error: "Job or resume not found" },
        { status: 404 }
      );
    }

    const resumeContent = resume.content as unknown as Record<string, unknown>;

    const prompt = `You are an expert resume tailor and ATS optimization specialist.

Given the following job posting and resume, perform these tasks:
1. Analyze the job requirements and extract key keywords
2. Compare the resume against job requirements
3. Generate a tailored version of the resume that:
   - Maintains the candidate's authentic voice and truthfulness
   - Optimizes keyword placement for ATS systems
   - Reorders and emphasizes relevant experience
   - Adjusts the summary to match the role
4. Generate a personalized cover letter
5. Calculate an ATS match score (0-100)
6. List the specific changes made

JOB POSTING:
Title: ${job.jobTitle}
Company: ${job.companyName || "Unknown"}
Description: ${job.description || "N/A"}
Requirements: ${JSON.stringify(job.requirements)}
Keywords: ${JSON.stringify(job.keywords)}

CURRENT RESUME:
${JSON.stringify(resumeContent, null, 2)}

Respond in this exact JSON format:
{
  "tailoredResume": {<same structure as the input resume with optimized content>},
  "coverLetter": "<full cover letter text>",
  "atsScore": {
    "overall": <number 0-100>,
    "keywordMatch": <number 0-100>,
    "formatScore": <number 0-100>,
    "missingKeywords": [<keywords from job not in resume>],
    "matchedKeywords": [<keywords that match>],
    "suggestions": [<improvement suggestions>]
  },
  "changes": [<list of specific changes made>]
}`;

    const text = await generateAI({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 4096,
    });

    // Parse the JSON response
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

    // Save to AI generations
    await db.insert(aiGenerations).values({
      userId: session.userId,
      type: "tailor",
      input: { jobId, resumeId } as Record<string, unknown>,
      output: text,
    });

    // Update or create application with the ATS score
    const existingApps = await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId))
      .limit(1);

    if (existingApps.length > 0) {
      await db
        .update(applications)
        .set({
          tailoredResume: result.tailoredResume,
          coverLetter: result.coverLetter,
          atsScore: result.atsScore?.overall || 0,
          updatedAt: new Date(),
        })
        .where(eq(applications.id, existingApps[0].id));
    }

    return Response.json(result);
  } catch (error) {
    console.error("AI tailor error:", error);
    return Response.json(
      { error: "Failed to generate tailored resume" },
      { status: 500 }
    );
  }
}
