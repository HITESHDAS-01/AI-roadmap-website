"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { AdPlaceholder } from "@/components/AdBanner";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import type { Roadmap } from "@/types/roadmap";

export default function RoadmapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "";
  const provider = searchParams.get("provider") || "auto";

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateRoadmap = async () => {
    if (!topic) {
      setError("No topic provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level: "all", provider }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap. Please try again.");
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topic) {
      generateRoadmap();
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-gray-500 text-sm mb-4">No topic provided</p>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            New Topic
          </button>
          {!loading && roadmap && (
            <h1 className="text-sm text-gray-500 hidden sm:block truncate max-w-xs">
              {topic}
            </h1>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative mb-6">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <div className="absolute inset-0 w-10 h-10 border-2 border-purple-500/20 rounded-full" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Generating your roadmap
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Researching the best resources for &quot;{topic}&quot;
            </p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Analyzing topic structure
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Searching for best resources
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Filtering quality content
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Something went wrong
            </h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={generateRoadmap}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && roadmap && (
          <>
            <AdPlaceholder position="roadmap-top" />
            <RoadmapTimeline roadmap={roadmap} />
            <AdPlaceholder position="roadmap-bottom" />
          </>
        )}
      </div>
    </div>
  );
}
