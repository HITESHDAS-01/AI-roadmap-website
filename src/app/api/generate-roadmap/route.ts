import { NextRequest, NextResponse } from "next/server";
import { generateRoadmapWithOpenAI } from "@/lib/ai/openai";
import { generateRoadmapWithGemini, searchResourcesWithGemini } from "@/lib/ai/gemini";
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
    } else if (process.env.GEMINI_API_KEY) {
      roadmap = await generateRoadmapWithGemini(topic, level, maxDuration);
    } else if (process.env.OPENAI_API_KEY) {
      roadmap = await generateRoadmapWithOpenAI(topic, level, maxDuration);
    } else if (process.env.GROQ_API_KEY) {
      roadmap = await generateRoadmapWithGroq(topic, level, maxDuration);
    } else {
      roadmap = generateFallbackRoadmap(topic);
    }

    // If roadmap has no resources, try to fetch them
    const hasResources = roadmap.phases?.some((p) =>
      p.steps?.some((s) => s.resources && s.resources.length > 0)
    );

    if (!hasResources) {
      roadmap = await enrichRoadmapWithResources(roadmap);
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}

async function enrichRoadmapWithResources(roadmap: Roadmap): Promise<Roadmap> {
  const isGeminiAvailable = !!process.env.GEMINI_API_KEY;
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

            if (isGeminiAvailable) {
              // Use Gemini's built-in Google Search
              const query = `${roadmap.topic} ${step.title} best tutorial 2024 2025`;
              resources = await searchResourcesWithGemini(query);
            } else if (isSerpAvailable) {
              // Fallback to SerpAPI
              const [webResults, ytResults] = await Promise.all([
                searchResources(`${roadmap.topic} ${step.title} tutorial`, 3),
                searchYouTubeResources(`${roadmap.topic} ${step.title}`, 3),
              ]);

              const allResults = [...webResults, ...ytResults];
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

            return { ...step, resources: resources.slice(0, 5) };
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
            duration: "3-5 days",
            difficulty: "beginner",
            resources: [],
            tips: ["Start with official documentation", "Join community forums"],
          },
          {
            id: "step-2",
            title: "Core Concepts",
            description: `Learn the fundamental concepts of ${topic}`,
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
            duration: "2-3 weeks",
            difficulty: "intermediate",
            resources: [],
          },
          {
            id: "step-4",
            title: "Advanced Topics",
            description: `Dive deeper into advanced ${topic} concepts`,
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
            duration: "3-4 weeks",
            difficulty: "advanced",
            resources: [],
          },
          {
            id: "step-6",
            title: "Community & Contribution",
            description: `Contribute to open source and teach others`,
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
