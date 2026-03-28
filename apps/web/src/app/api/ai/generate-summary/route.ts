import { getSession } from "@/lib/auth";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { experiences, targetRole } = await request.json();

    if (!experiences || !Array.isArray(experiences)) {
      return Response.json(
        { error: "Experiences array is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume writer. Write a professional summary for a resume.

Based on these experiences:
${experiences.map((exp: { title?: string; company?: string; bullets?: string[] }) => `- ${exp.title || "Role"} at ${exp.company || "Company"}: ${(exp.bullets || []).join("; ")}`).join("\n")}

${targetRole ? `Target role: ${targetRole}` : ""}

Write a compelling 2-3 sentence professional summary that:
- Highlights years of experience and key expertise areas
- Mentions notable achievements or impact
- Aligns with the target role if provided
- Uses confident, professional language

Return ONLY the summary text, no quotes or JSON.`;

    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt,
      maxOutputTokens: 512,
    });

    return Response.json({ summary: text.trim() });
  } catch (error) {
    console.error("AI generate-summary error:", error);
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
