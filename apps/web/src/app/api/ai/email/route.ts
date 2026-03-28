import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { jobs, profiles, aiGenerations } from "@applypilot/shared";
import { eq } from "@applypilot/shared";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, jobId, context } = await request.json();

    if (!type) {
      return Response.json({ error: "type is required" }, { status: 400 });
    }

    const validTypes = [
      "follow-up",
      "thank-you",
      "negotiate",
      "withdraw",
      "accept",
      "decline",
      "networking",
      "cold-outreach",
    ];
    if (!validTypes.includes(type)) {
      return Response.json({ error: "Invalid email type" }, { status: 400 });
    }

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, session.userId))
      .limit(1);

    let jobContext = "";
    if (jobId) {
      const [job] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId))
        .limit(1);
      if (job) {
        jobContext = `\nJOB DETAILS:\nTitle: ${job.jobTitle}\nCompany: ${job.companyName || "Unknown"}\nDescription: ${job.description || "N/A"}`;
      }
    }

    const prompt = `You are an expert career communications specialist. Write a professional ${type} email for a job application scenario.

SENDER INFO:
Name: ${profile?.fullName || "Job Candidate"}
Headline: ${profile?.headline || "Professional"}
${jobContext}
${context ? `\nADDITIONAL CONTEXT: ${context}` : ""}

Write a polished, professional ${type} email. It should:
- Be concise but warm
- Use professional tone without being stiff
- Include a clear subject line
- Be personalized based on the context provided
- Follow best practices for ${type} emails in job searching

Also provide 2-3 practical tips for sending this type of email effectively.

Respond in this exact JSON format:
{
  "subject": "email subject line",
  "body": "full email body with proper formatting",
  "tips": ["tip1", "tip2", "tip3"]
}`;

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt,
      maxOutputTokens: 2048,
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
      type: `email_${type}`,
      input: { type, jobId, context } as Record<string, unknown>,
      output: text,
    });

    return Response.json(result);
  } catch (error) {
    console.error("AI email error:", error);
    return Response.json(
      { error: "Failed to generate email" },
      { status: 500 }
    );
  }
}
