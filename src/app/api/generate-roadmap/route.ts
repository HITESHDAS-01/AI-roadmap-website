import { NextRequest, NextResponse } from "next/server";
import { generateRoadmapWithOpenAI } from "@/lib/ai/openai";
import { generateRoadmapWithGemini } from "@/lib/ai/gemini";
import { generateRoadmapWithGroq } from "@/lib/ai/groq";
import { searchResources, searchYouTubeResources } from "@/lib/search/serpapi";
import type { Roadmap, GenerateRoadmapRequest } from "@/types/roadmap";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRoadmapRequest = await request.json();
    const { topic, level = "all", maxDuration } = body;

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    let roadmap: Roadmap;

    const provider = body.provider || "auto";

    if (provider === "gemini" && process.env.GEMINI_API_KEY) {
      roadmap = await generateRoadmapWithGemini(topic, level, maxDuration);
    } else if (provider === "groq" && process.env.GROQ_API_KEY) {
      roadmap = await generateRoadmapWithGroq(topic, level, maxDuration);
    } else if (provider === "openai" && process.env.OPENAI_API_KEY) {
      roadmap = await generateRoadmapWithOpenAI(topic, level, maxDuration);
    } else {
      if (process.env.GEMINI_API_KEY) {
        try {
          roadmap = await generateRoadmapWithGemini(topic, level, maxDuration);
        } catch (err) {
          console.error("Gemini failed, trying Groq:", err);
          if (process.env.GROQ_API_KEY) {
            roadmap = await generateRoadmapWithGroq(topic, level, maxDuration);
          } else {
            throw err;
          }
        }
      } else if (process.env.OPENAI_API_KEY) {
        roadmap = await generateRoadmapWithOpenAI(topic, level, maxDuration);
      } else if (process.env.GROQ_API_KEY) {
        roadmap = await generateRoadmapWithGroq(topic, level, maxDuration);
      } else {
        roadmap = generateFallbackRoadmap(topic);
      }
    }

    // Add summaries to steps if missing
    roadmap = await addStepSummaries(roadmap);

    // Fetch real resources: YouTube + Web for each step
    roadmap = await enrichRoadmapWithResources(roadmap);

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}

async function addStepSummaries(roadmap: Roadmap): Promise<Roadmap> {
  const hasSummary = roadmap.phases.some((p) =>
    p.steps.some((s) => s.summary && s.summary.length > 10)
  );

  if (hasSummary) return roadmap;

  try {
    if (process.env.GEMINI_API_KEY) {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });

      const stepsText = roadmap.phases
        .flatMap((p) => p.steps.map((s) => `${s.id}: ${s.title} - ${s.description}`))
        .join("\n");

      const prompt = `For each step below, write a 2-3 sentence summary explaining what the learner will accomplish and why it matters.

${stepsText}

Return ONLY a JSON object where keys are step IDs and values are summary strings:
{"step-1": "summary text", "step-2": "summary text"}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const summaries: Record<string, string> = JSON.parse(cleaned);

      return {
        ...roadmap,
        phases: roadmap.phases.map((phase) => ({
          ...phase,
          steps: phase.steps.map((step) => ({
            ...step,
            summary: summaries[step.id] || step.description,
          })),
        })),
      };
    }
  } catch (err) {
    console.error("Summary generation failed:", err);
  }

  // Fallback: use description as summary
  return {
    ...roadmap,
    phases: roadmap.phases.map((phase) => ({
      ...phase,
      steps: phase.steps.map((step) => ({
        ...step,
        summary: step.summary || step.description,
      })),
    })),
  };
}

async function enrichRoadmapWithResources(roadmap: Roadmap): Promise<Roadmap> {
  const isSerpAvailable = !!process.env.SERPAPI_KEY;

  const enrichedPhases = await Promise.all(
    roadmap.phases.map(async (phase) => {
      const enrichedSteps = await Promise.all(
        phase.steps.map(async (step) => {
          try {
            let resources: Array<{
              title: string;
              url: string;
              type: string;
              source: string;
              description: string;
              free: boolean;
            }> = [];

            if (isSerpAvailable) {
              // Search YouTube specifically (1 search)
              const ytQuery = `${roadmap.topic} ${step.title} tutorial`;
              const ytResults = await searchYouTubeResources(ytQuery, 3);

              // Search web resources (1 search)
              const webQuery = `${roadmap.topic} ${step.title} tutorial best`;
              const webResults = await searchResources(webQuery, 3);

              // Combine: YouTube first, then web
              const allResults = [...ytResults, ...webResults];
              const seen = new Set<string>();
              resources = allResults
                .filter((r) => {
                  if (seen.has(r.url)) return false;
                  seen.add(r.url);
                  return r.title && r.title.trim().length > 0;
                })
                .slice(0, 6)
                .map((r) => ({
                  title: r.title,
                  url: r.url,
                  type: detectResourceType(r.url),
                  source: detectSource(r.url),
                  description: r.snippet || `Learn ${step.title}`,
                  free: !r.url.includes("udemy.com") && !r.url.includes("coursera.org"),
                }));
            }

            // Always ensure at least 1 YouTube link via fallback
            const hasYT = resources.some((r) => r.source === "YouTube");
            if (!hasYT) {
              const topic = roadmap.topic;
              const stepTitle = step.title;
              const fallbackYT = getFallbackYouTube(topic, stepTitle);
              resources.unshift(fallbackYT);
            }

            return { ...step, resources: resources.slice(0, 6) };
          } catch {
            return step;
          }
        })
      );

      return { ...phase, steps: enrichedSteps };
    })
  );

  return { ...roadmap, phases: enrichedPhases };
}

function getFallbackYouTube(topic: string, stepTitle: string) {
  const q = encodeURIComponent(`${topic} ${stepTitle} tutorial`);
  return {
    title: `${stepTitle} - YouTube Tutorial`,
    url: `https://www.youtube.com/results?search_query=${q}`,
    type: "video" as const,
    source: "YouTube",
    description: `Search YouTube for ${stepTitle} tutorials`,
    free: true,
  };
}

function generateFallbackRoadmap(topic: string): Roadmap {
  return {
    topic,
    title: `Complete ${topic} Learning Roadmap`,
    description: `A comprehensive roadmap to master ${topic} from beginner to advanced level.`,
    totalEstimatedTime: "3-6 months",
    phases: [
      {
        id: "phase-1",
        title: "Foundations",
        description: `Build a strong foundation in ${topic} basics`,
        estimatedTime: "2-4 weeks",
        steps: [
          {
            id: "step-1",
            title: "Introduction & Setup",
            description: `Understand what ${topic} is and set up your learning environment`,
            summary: `Start your ${topic} journey by understanding the core concepts and setting up your development environment. This foundational step ensures you have the right tools and mindset before diving deeper.`,
            duration: "3-5 days",
            difficulty: "beginner",
            resources: [],
            tips: ["Start with official documentation", "Join community forums"],
          },
          {
            id: "step-2",
            title: "Core Concepts",
            description: `Learn the fundamental concepts of ${topic}`,
            summary: `Master the building blocks of ${topic}. Understanding these core concepts will make everything else click into place and give you a solid mental model.`,
            duration: "1-2 weeks",
            difficulty: "beginner",
            resources: [],
          },
        ],
      },
      {
        id: "phase-2",
        title: "Intermediate Skills",
        description: `Develop practical skills in ${topic}`,
        estimatedTime: "4-6 weeks",
        steps: [
          {
            id: "step-3",
            title: "Hands-on Practice",
            description: `Apply your knowledge through projects and exercises`,
            summary: `Put theory into practice by building small projects. This hands-on experience solidifies your understanding and builds confidence.`,
            duration: "2-3 weeks",
            difficulty: "intermediate",
            resources: [],
          },
          {
            id: "step-4",
            title: "Advanced Topics",
            description: `Dive deeper into advanced ${topic} concepts`,
            summary: `Explore advanced concepts that separate beginners from professionals. These topics will expand your capabilities significantly.`,
            duration: "2-3 weeks",
            difficulty: "intermediate",
            resources: [],
          },
        ],
      },
      {
        id: "phase-3",
        title: "Mastery",
        description: `Achieve expert-level proficiency in ${topic}`,
        estimatedTime: "4-8 weeks",
        steps: [
          {
            id: "step-5",
            title: "Real-world Projects",
            description: `Build portfolio-worthy projects`,
            summary: `Apply everything you've learned by building complete, real-world projects. These become portfolio pieces that demonstrate your skills to employers.`,
            duration: "3-4 weeks",
            difficulty: "advanced",
            resources: [],
          },
          {
            id: "step-6",
            title: "Community & Contribution",
            description: `Contribute to open source and teach others`,
            summary: `Give back to the community by contributing to open source and teaching others. Teaching is the best way to deepen your own understanding.`,
            duration: "2-4 weeks",
            difficulty: "advanced",
            resources: [],
          },
        ],
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

function detectResourceType(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "video";
  if (url.includes("udemy.com") || url.includes("coursera.org") || url.includes("edx.org"))
    return "course";
  if (url.includes("github.com")) return "project";
  if (url.includes("docs.") || url.includes("documentation")) return "article";
  return "article";
}

function detectSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const sources: Record<string, string> = {
      "youtube.com": "YouTube",
      "youtu.be": "YouTube",
      "udemy.com": "Udemy",
      "coursera.org": "Coursera",
      "freecodecamp.org": "freeCodeCamp",
      "medium.com": "Medium",
      "dev.to": "Dev.to",
      "github.com": "GitHub",
      "w3schools.com": "W3SchoolS",
      "mozilla.org": "MDN",
      "geeksforgeeks.org": "GeeksforGeeks",
      "codecademy.com": "Codecademy",
      "leetcode.com": "LeetCode",
      "hackerrank.com": "HackerRank",
      "scrimba.com": "Scrimba",
      "khanacademy.org": "Khan Academy",
    };

    for (const [domain, name] of Object.entries(sources)) {
      if (hostname.includes(domain)) return name;
    }
    return hostname.split(".")[0];
  } catch {
    return "Web";
  }
}
