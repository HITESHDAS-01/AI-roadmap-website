import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Roadmap } from "@/types/roadmap";

function getClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const ROADMAP_SYSTEM_PROMPT = `You are an expert educational curriculum designer. You have access to Google Search to find the best, most up-to-date learning resources.

When generating a roadmap, return ONLY valid JSON in this exact structure:
{
  "topic": "the topic",
  "title": "catchy title",
  "description": "brief overview",
  "totalEstimatedTime": "e.g. 6 months",
  "phases": [
    {
      "id": "phase-1",
      "title": "Phase title",
      "description": "What this phase covers",
      "estimatedTime": "time for this phase",
      "steps": [
        {
          "id": "step-1",
          "title": "Step title",
          "description": "Detailed description",
          "duration": "estimated time",
          "difficulty": "beginner|intermediate|advanced",
          "resources": [
            {
              "title": "Exact title of the resource",
              "url": "FULL and COMPLETE URL (not truncated)",
              "type": "video|course|article|tool|project",
              "source": "Platform name (YouTube, Udemy, etc)",
              "description": "What this resource covers",
              "free": true
            }
          ],
          "tips": ["helpful tips"]
        }
      ]
    }
  ]
}

CRITICAL RULES for resources:
1. You MUST search the web using Google Search to find REAL, working URLs
2. For each step, find 3-5 genuine resources (mix of YouTube videos, courses, articles, tools)
3. URLs must be COMPLETE and REAL - never make up or truncate URLs
4. Prefer FREE resources, but include paid if significantly better
5. Include variety: YouTube videos, official docs, free courses, interactive tools
6. Resources must be recent and up-to-date (prefer 2023-2026 content)
7. Return ONLY the JSON object, no markdown, no explanation`;

const RESOURCE_SEARCH_PROMPT = `Search the web and find the BEST learning resources for each step of this roadmap.
For EVERY step, you MUST find and include 3-5 REAL resources with COMPLETE URLs.

Requirements:
1. Search for each topic to find real YouTube videos, courses, articles, and tools
2. URLs must be complete and working (e.g., https://www.youtube.com/watch?v=XXXXX)
3. Include free resources from: YouTube, freeCodeCamp, MDN, official docs, GeeksforGeeks, Dev.to, Codecademy
4. Also include quality paid resources from: Udemy, Coursera, Pluralsight
5. Each resource must have: title, full URL, type, source, description, whether it's free
6. Do NOT make up URLs - only include resources you actually found through search`;

export async function generateRoadmapWithGemini(
  topic: string,
  level: string = "all",
  maxDuration?: string
): Promise<Roadmap> {
  const genAI = getClient();
  if (!genAI) throw new Error("Gemini API key not configured");

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
    systemInstruction: ROADMAP_SYSTEM_PROMPT,
    tools: [{ googleSearch: {} }],
  });

  const levelText = level === "all" ? "all levels" : level;

  const prompt = `Create a comprehensive learning roadmap for: "${topic}"

Target level: ${levelText}
${maxDuration ? `Max time: ${maxDuration}` : ""}

IMPORTANT: Use Google Search to find REAL resources for each step. Do NOT invent URLs.
Search for the best YouTube tutorials, free courses, documentation, and tools for each topic.

Return ONLY valid JSON.`;

  const result = await model.generateContent(prompt);
  const response = result.response;

  let text = response.text();
  text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  const roadmap: Roadmap = JSON.parse(text);
  return roadmap;
}

export async function searchResourcesWithGemini(
  query: string
): Promise<Array<{ title: string; url: string; type: string; source: string; description: string; free: boolean }>> {
  const genAI = getClient();
  if (!genAI) return [];

  try {
    const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
      tools: [{ googleSearch: {} }],
    });

    const prompt = `Search the web for: "${query}"
Find the 5 best learning resources. Return ONLY a JSON array with objects:
{ "title": "resource title", "url": "full URL", "type": "video|course|article|tool", "source": "platform name", "description": "what it covers", "free": true/false }

Rules:
- URLs must be complete and real
- Mix of YouTube videos, articles, courses
- Prefer free resources
- Return ONLY the JSON array`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Gemini search error:", error);
    return [];
  }
}
