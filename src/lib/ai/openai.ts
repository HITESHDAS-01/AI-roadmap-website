import OpenAI from "openai";
import { ROADMAP_SYSTEM_PROMPT, buildRoadmapPrompt } from "./prompts";
import type { Roadmap } from "@/types/roadmap";

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function generateRoadmapWithOpenAI(
  topic: string,
  level: string = "all",
  maxDuration?: string
): Promise<Roadmap> {
  const openai = getClient();
  if (!openai) throw new Error("OpenAI API key not configured");

  const prompt = buildRoadmapPrompt(topic, level, maxDuration);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: ROADMAP_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error("No response from OpenAI");

  const roadmap: Roadmap = JSON.parse(content);
  return roadmap;
}

export async function filterResourcesWithOpenAI(
  resources: Array<{ title: string; url: string; snippet: string }>,
  topic: string
): Promise<Array<{ title: string; url: string; type: string; source: string; description: string; free: boolean }>> {
  const openai = getClient();
  if (!openai) return [];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a resource evaluator. From the given search results, select the BEST 3-5 resources for learning "${topic}". Return ONLY a JSON array with objects having: title, url, type (video/course/article/tool/project), source, description, free (boolean). No markdown, just JSON.`,
      },
      {
        role: "user",
        content: JSON.stringify(resources),
      },
    ],
    temperature: 0.3,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) return [];

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.resources || [];
  } catch {
    return [];
  }
}
