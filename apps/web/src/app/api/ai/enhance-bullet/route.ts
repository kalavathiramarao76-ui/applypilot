import { getSession } from "@/lib/auth";
import { generateAI } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bullet, context } = await request.json();

    if (!bullet) {
      return Response.json(
        { error: "Bullet text is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume writer. Enhance this resume bullet point to be more impactful.

Rules:
- Start with a strong action verb
- Quantify results where possible (add realistic metrics if none exist)
- Show impact and outcomes
- Keep it concise (1-2 lines max)
- Maintain truthfulness - enhance, don't fabricate

${context?.title ? `Job Title: ${context.title}` : ""}
${context?.company ? `Company: ${context.company}` : ""}

Original bullet: "${bullet}"

Return ONLY valid JSON:
{
  "enhanced": "<the improved bullet point>",
  "explanation": "<brief explanation of what changed and why>"
}`;

    const text = await generateAI({
      messages: [{ role: "user", content: prompt }],
      maxTokens: 512,
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
    console.error("AI enhance-bullet error:", error);
    return Response.json(
      { error: "Failed to enhance bullet point" },
      { status: 500 }
    );
  }
}
