export interface Resource {
  title: string;
  url: string;
  type: "video" | "course" | "article" | "book" | "tool" | "project";
  source: string;
  description: string;
  free: boolean;
  rating?: number;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  summary: string;
  aiPrompt: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  resources: Resource[];
  prerequisites?: string[];
  tips?: string[];
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  steps: RoadmapStep[];
  estimatedTime: string;
}

export interface Roadmap {
  topic: string;
  title: string;
  description: string;
  totalEstimatedTime: string;
  phases: RoadmapPhase[];
  generatedAt: string;
  popularCourses?: PopularCourse[];
}

export interface PopularCourse {
  platform: string;
  title: string;
  url: string;
  description: string;
  free: boolean;
  rating?: string;
}

export interface GenerateRoadmapRequest {
  topic: string;
  level?: "beginner" | "intermediate" | "advanced" | "all";
  maxDuration?: string;
  provider?: "openai" | "gemini" | "groq" | "auto";
}
