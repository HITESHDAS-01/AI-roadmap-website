import type { Metadata } from "next";
import { Map, Target, Zap, Users, Globe, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about RoadmapAI — an AI-powered platform that generates professional learning roadmaps with curated resources for any topic.",
  openGraph: {
    title: "About RoadmapAI",
    description: "AI-powered learning roadmaps for any topic.",
  },
};

const values = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "Quality First",
    description: "Every resource is evaluated by AI for relevance, quality, and recency before being recommended.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Instant & Free",
    description: "Generate comprehensive roadmaps in seconds. The core experience is completely free.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Any Topic",
    description: "From web development to cooking, from machine learning to photography — we cover it all.",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Learner-Centric",
    description: "Roadmaps adapt to your level and include time estimates, tips, and prerequisites.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
          <Map className="w-6 h-6 text-purple-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          About RoadmapAI
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          We believe learning should be structured, not overwhelming. RoadmapAI uses
          artificial intelligence to create personalized learning paths for any topic,
          saving you hours of research.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {values.map((value) => (
          <div
            key={value.title}
            className="p-5 rounded-xl bg-white/[0.03] border border-white/5"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-3 text-purple-400">
              {value.icon}
            </div>
            <h3 className="font-semibold text-white text-sm mb-1.5">{value.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white/[0.03] border border-white/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-4">How It Works</h2>
        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Enter Your Topic",
              desc: "Type any subject you want to learn — from programming to photography.",
            },
            {
              step: "2",
              title: "AI Generates Your Roadmap",
              desc: "Our AI analyzes the topic and creates a structured learning path with phases, steps, and time estimates.",
            },
            {
              step: "3",
              title: "Get Curated Resources",
              desc: "For each step, we search the web and recommend the best YouTube videos, courses, articles, and tools.",
            },
            {
              step: "4",
              title: "Start Learning",
              desc: "Follow the roadmap at your own pace. Each resource is selected for quality and relevance.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {item.step}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-0.5">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try It Now
        </a>
      </div>
    </div>
  );
}
