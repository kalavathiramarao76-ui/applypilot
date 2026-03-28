const API_URL = "https://sai.sharedllm.com/v1/chat/completions";
const MODEL = "gpt-oss:120b";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GenerateOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

export async function generateAI({
  messages,
  temperature = 0.7,
  maxTokens = 4096,
}: GenerateOptions): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`SharedLLM API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
