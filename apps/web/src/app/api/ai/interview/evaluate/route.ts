import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { jobs, aiGenerations } from "@zypply/shared";
import { eq } from "@zypply/shared";
import { generateAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, answer, jobId } = await request.json();

    if (!question || !answer) {
      return Response.json(
        { error: "question and answer are required" },
        { status: 400 }
      );
    }

    let jobContext = "";
    if (jobId) {
      const [job] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, jobId))
        .limit(1);
      if (job) {
        jobContext = `\nJOB CONTEXT:\nTitle: ${job.jobTitle}\nCompany: ${job.companyName || "Unknown"}\nDescription: ${job.description || "N/A"}`;
      }
    }

    const prompt = `You are an expert interview coach. Evaluate the following interview answer using the STAR method framework (Situation, Task, Action, Result).
${jobContext}

INTERVIEW QUESTION: ${question}

CANDIDATE'S ANSWER: ${answer}

Evaluate thoroughly and provide:
1. An overall score from 0-100
2. Detailed feedback on the answer quality
3. Specific strengths of the answer
4. Areas for improvement
5. A suggested ideal answer

Respond in this exact JSON format:
{
  "score": <number 0-100>,
  "feedback": "detailed feedback paragraph",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "suggestedAnswer": "A model answer that demonstrates best practices"
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

    await db.insert(aiGenerations).values({
      userId: session.userId,
      type: "interview_evaluate",
      input: { question, jobId } as Record<string, unknown>,
      output: text,
    });

    return Response.json(result);
  } catch (error) {
    console.error("AI interview evaluate error:", error);
    return Response.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
