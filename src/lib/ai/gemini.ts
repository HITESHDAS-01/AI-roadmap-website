import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Roadmap } from "@/types/roadmap";

function getClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const ROADMAP_PROMPT = `Generate a learning roadmap as JSON. Follow this EXACT structure - field names must match exactly:

{
  "topic": "the topic",
  "title": "catchy title",
  "description": "brief overview",
  "totalEstimatedTime": "e.g. 6 months",
  "generatedAt": "2026-01-01T00:00:00.000Z",
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
          "summary": "2-3 sentence summary of what the learner will accomplish and why it matters",
          "aiPrompt": "Professional prompt to give to AI chatbot like ChatGPT/Gemini to learn this step. Example: 'Act as an expert teacher. Teach me [topic] step by step with examples, exercises, and real-world applications. Start from basics and gradually increase difficulty.'",
          "duration": "estimated time",
          "difficulty": "beginner",
          "resources": [
            {
              "title": "Resource title",
              "url": "FULL working URL",
              "type": "video",
              "source": "YouTube",
              "description": "What it covers",
              "free": true
            }
          ],
          "tips": ["helpful tips"],
          "prerequisites": []
        }
      ]
    }
  ]
}

Rules:
1. Field names MUST match exactly: topic, title, description, totalEstimatedTime, phases, id, steps, resources, etc.
2. For each step include 3-5 REAL resources with COMPLETE URLs (YouTube, courses, articles)
3. Prefer FREE resources
4. Generate 3-6 phases with 2-4 steps each
5. Return ONLY the JSON object, no markdown, no explanation`;

export async function generateRoadmapWithGemini(
  topic: string,
  level: string = "all",
  maxDuration?: string
): Promise<Roadmap> {
  const genAI = getClient();
  if (!genAI) throw new Error("Gemini API key not configured");

  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite",
  });

  const levelText = level === "all" ? "all levels" : level;

  const fullPrompt = `${ROADMAP_PROMPT}

Generate a roadmap for: "${topic}"
Target level: ${levelText}
${maxDuration ? `Max time: ${maxDuration}` : ""}`;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;

  let text = response.text();
  text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

  // Try to fix common JSON issues
  try {
    const roadmap: Roadmap = JSON.parse(text);
    return roadmap;
  } catch {
    // If wrapped in extra key, try to unwrap
    const parsed = JSON.parse(text);
    if (parsed.roadmap) return parsed.roadmap as Roadmap;
    if (parsed.data) return parsed.data as Roadmap;
    throw new Error("Invalid roadmap JSON from Gemini");
  }
}

export async function searchResourcesWithGemini(
  query: string
): Promise<Array<{ title: string; url: string; type: string; source: string; description: string; free: boolean }>> {
  const genAI = getClient();
  if (!genAI) return [];

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
    });

    const prompt = `Find the 5 best learning resources for: "${query}"
Return ONLY a JSON array:
[{"title":"title","url":"full URL","type":"video","source":"YouTube","description":"what it covers","free":true}]
Real URLs only, mix types, prefer free, JSON only`;

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
