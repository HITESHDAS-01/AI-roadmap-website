"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, Zap, Lightbulb } from "lucide-react";
import ResourceCard from "./ResourceCard";
import type { RoadmapPhase } from "@/types/roadmap";

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex-shrink-0">
            {index + 1}
          </div>
          {index < 2 && <div className="w-px flex-1 bg-gradient-to-b from-purple-500/30 to-transparent min-h-[100px]" />}
        </div>

        <div className="flex-1 pb-6 min-w-0 overflow-hidden">
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{phase.title}</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-2">{phase.description}</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-purple-400">
                <Clock className="w-3 h-3" />
                {phase.estimatedTime}
              </span>
              <span className="text-xs text-gray-600">
                {phase.steps.length} steps
              </span>
            </div>
          </div>

          <div className="space-y-2 mt-3">
            {phase.steps.map((step) => (
              <div
                key={step.id}
                className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full flex items-center gap-3 p-3 sm:p-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  {expandedSteps.has(step.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-medium text-white text-sm truncate">{step.title}</h4>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${
                          difficultyColors[step.difficulty]
                        }`}
                      >
                        {step.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate pr-12">{step.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {step.duration}
                  </div>
                </button>

                {expandedSteps.has(step.id) && (
                  <div className="px-3 sm:px-4 pb-4 space-y-3 border-t border-white/5 overflow-hidden">
                    <div className="pt-3">
                      <p className="text-sm text-gray-300 mb-3">{step.description}</p>

                      {step.prerequisites && step.prerequisites.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-500 mb-1.5">Prerequisites</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {step.prerequisites.map((prereq, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5"
                              >
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.tips && step.tips.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-yellow-400/80 mb-1.5 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> Tips
                          </h5>
                          <ul className="space-y-1">
                            {step.tips.map((tip, i) => (
                              <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                                <Zap className="w-3 h-3 text-yellow-500/50 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {step.resources.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-purple-400/80 mb-2">
                          Resources ({step.resources.length})
                        </h5>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {step.resources.map((resource, i) => (
                            <ResourceCard key={i} resource={resource} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
