import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiGenerations } from "@applypilot/shared";
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const MESSAGE_TYPES = [
  "linkedin-connection",
  "linkedin-message",
  "informational-interview",
  "referral-request",
  "thank-you-after-meeting",
  "cold-email-recruiter",
] as const;

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, context } = await request.json();

    if (!type || !MESSAGE_TYPES.includes(type)) {
      return Response.json(
        {
          error: `type must be one of: ${MESSAGE_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!context) {
      return Response.json(
        { error: "context is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a senior networking and career strategist. Generate a personalized ${type.replace(/-/g, " ")} message.

CONTEXT:
- Recipient Name: ${context.recipientName || "the recipient"}
- Recipient Role: ${context.recipientRole || "Unknown"}
- Recipient Company: ${context.recipientCompany || "Unknown"}
- How you found them: ${context.howFound || "N/A"}
- Your role/background: ${context.yourRole || "Job seeker"}
- What you want: ${context.goal || "To connect professionally"}
- Additional context: ${context.additionalContext || "None"}

Return strict JSON:
{
  "subjectLine": "Email subject line (leave empty string for LinkedIn)",
  "mainMessage": "The full message text, properly formatted with paragraphs",
  "followUpMessage": "A follow-up message to send after 1 week with no response",
  "tips": ["4-5 specific tips for this type of outreach"],
  "donts": ["3-4 things to avoid"],
  "bestTimeToSend": "Recommended day/time to send",
  "expectedResponseRate": "Estimated response rate percentage for this type"
}

Make the message authentic, warm, and professional. Avoid being overly salesy or generic. Keep the main message concise - under 150 words for LinkedIn, under 250 words for emails.`;

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
      type: "networking_message",
      input: { type, context } as Record<string, unknown>,
      output: text,
    });

    return Response.json({ type, ...result });
  } catch (error) {
    console.error("AI networking error:", error);
    return Response.json(
      { error: "Failed to generate networking message" },
      { status: 500 }
    );
  }
}
