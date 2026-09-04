"use client";

import { Clock, Calendar, BookOpen, TrendingUp } from "lucide-react";
import PhaseCard from "./PhaseCard";
import DownloadPDF from "./DownloadPDF";
import ShareButton from "./ShareButton";
import type { Roadmap } from "@/types/roadmap";

export default function RoadmapTimeline({ roadmap }: { roadmap: Roadmap }) {
  const totalSteps = roadmap.phases.reduce((acc, phase) => acc + phase.steps.length, 0);
  const totalResources = roadmap.phases.reduce(
    (acc, phase) => acc + phase.steps.reduce((a, step) => a + step.resources.length, 0),
    0
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          <span className="text-[10px] uppercase tracking-widest text-purple-400 font-medium">Learning Roadmap</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
          {roadmap.title}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">{roadmap.description}</p>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/15">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{roadmap.totalEstimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/15">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-medium">{roadmap.phases.length} Phases</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/15">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">{totalSteps} Steps</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/15">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-medium">{totalResources} Resources</span>
          </div>
          <DownloadPDF roadmap={roadmap} />
          <ShareButton topic={roadmap.topic} title={roadmap.title} />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] sm:left-[22px] top-0 bottom-0 w-px">
          <div className="h-full bg-gradient-to-b from-purple-500/50 via-blue-500/30 to-transparent" />
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {roadmap.phases.map((phase, index) => (
            <PhaseCard key={phase.id} phase={phase} index={index} total={roadmap.phases.length} />
          ))}
        </div>

        {/* End node */}
        <div className="relative flex items-center mt-6">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/20 z-10 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-4 sm:ml-6">
            <p className="text-sm font-medium text-green-400">Roadmap Complete!</p>
            <p className="text-xs text-gray-600">Follow this path to master {roadmap.topic}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-gray-600">
          Built by Pranjit | AI-Powered Learning Roadmaps
        </p>
      </div>
    </div>
  );
}
