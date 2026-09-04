"use client";

import { useState } from "react";
import { ChevronDown, Clock, Zap, Lightbulb, BookOpen, Copy, Check } from "lucide-react";
import ResourceCard from "./ResourceCard";
import type { RoadmapPhase } from "@/types/roadmap";

const difficultyConfig: Record<string, { color: string; bg: string; icon: string }> = {
  beginner: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: "1" },
  intermediate: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: "2" },
  advanced: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: "3" },
};

const phaseColors = [
  "from-purple-500 to-violet-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-cyan-500",
];

export default function PhaseCard({
  phase,
  index,
  total,
}: {
  phase: RoadmapPhase;
  index: number;
  total: number;
}) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [isPhaseExpanded, setIsPhaseExpanded] = useState(index < 2);

  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) next.delete(stepId);
      else next.add(stepId);
      return next;
    });
  };

  const expandAll = () => {
    if (expandedSteps.size === phase.steps.length) {
      setExpandedSteps(new Set());
    } else {
      setExpandedSteps(new Set(phase.steps.map((s) => s.id)));
    }
  };

  const colorClass = phaseColors[index % phaseColors.length];

  return (
    <div
      className="relative animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3 sm:gap-5">
        {/* Timeline node */}
        <div className="relative flex flex-col items-center flex-shrink-0">
          <div
            className={`timeline-node w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg z-10`}
          >
            {index + 1}
          </div>
          {index < total - 1 && (
            <div className="w-px flex-1 min-h-[40px] bg-gradient-to-b from-white/10 to-transparent" />
          )}
        </div>

        {/* Phase content */}
        <div className="flex-1 pb-6 min-w-0">
          {/* Phase header - clickable */}
          <button
            onClick={() => setIsPhaseExpanded(!isPhaseExpanded)}
            className="w-full text-left group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {phase.title}
                  </h3>
                </div>
                <p className="text-gray-500 text-xs sm:text-sm mb-2 leading-relaxed">
                  {phase.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-purple-400">
                    <Clock className="w-3 h-3" />
                    {phase.estimatedTime}
                  </span>
                  <span className="text-xs text-gray-600">
                    {phase.steps.length} steps
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      expandAll();
                    }}
                    className="text-xs text-gray-600 hover:text-purple-400 transition-colors"
                  >
                    {expandedSteps.size === phase.steps.length ? "Collapse all" : "Expand all"}
                  </button>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 mt-1 ${
                  isPhaseExpanded ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Steps */}
          {isPhaseExpanded && (
            <div className="mt-4 space-y-2 animate-slide-down">
              {phase.steps.map((step, stepIndex) => {
                const isExpanded = expandedSteps.has(step.id);
                const diff = difficultyConfig[step.difficulty] || difficultyConfig.beginner;

                return (
                  <div
                    key={step.id}
                    className="step-card rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
                    style={{ animationDelay: `${stepIndex * 50}ms` }}
                  >
                    {/* Step header */}
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="w-full flex items-center gap-3 p-3 sm:p-4 text-left hover:bg-white/[0.03] transition-colors"
                    >
                      <div
                        className={`w-6 h-6 rounded-md ${diff.bg} border flex items-center justify-center flex-shrink-0`}
                      >
                        <span className={`text-[10px] font-bold ${diff.color}`}>
                          {stepIndex + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-medium text-white text-sm truncate">
                            {step.title}
                          </h4>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0 capitalize ${diff.bg} ${diff.color}`}
                          >
                            {step.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{step.description}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          {step.duration}
                        </div>
                        {step.resources.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-purple-400">
                            <BookOpen className="w-3 h-3" />
                            {step.resources.length}
                          </div>
                        )}
                        <ChevronDown
                          className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-3 sm:px-4 pb-4 space-y-4 border-t border-white/5 animate-slide-down">
                        <div className="pt-3">
                          {/* Summary */}
                          {step.summary && (
                            <div className="mb-3 p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                              <h5 className="text-[10px] font-medium text-purple-400 mb-1 uppercase tracking-wider">
                                What You'll Learn
                              </h5>
                              <p className="text-sm text-gray-300 leading-relaxed">
                                {step.summary}
                              </p>
                            </div>
                          )}

                          <p className="text-sm text-gray-400 leading-relaxed mb-3">
                            {step.description}
                          </p>

                          {/* Prerequisites */}
                          {step.prerequisites && step.prerequisites.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                                Prerequisites
                              </h5>
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

                          {/* Tips */}
                          {step.tips && step.tips.length > 0 && (
                            <div className="mb-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                              <h5 className="text-xs font-medium text-yellow-400 mb-1.5 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                Pro Tips
                              </h5>
                              <ul className="space-y-1">
                                {step.tips.map((tip, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-gray-400 flex items-start gap-1.5"
                                  >
                                    <Zap className="w-3 h-3 text-yellow-500/50 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* AI Prompt */}
                          {step.aiPrompt && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <h5 className="text-xs font-medium text-cyan-400 flex items-center gap-1 uppercase tracking-wider">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                  Learn with AI Chatbot
                                </h5>
                                <AICopyButton prompt={step.aiPrompt} />
                              </div>
                              <p className="text-xs text-gray-400 bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-2.5 leading-relaxed">
                                {step.aiPrompt}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Resources */}
                        {step.resources.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-purple-400 mb-2 uppercase tracking-wider">
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AICopyButton({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = prompt;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors border border-cyan-500/15"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy Prompt
        </>
      )}
    </button>
  );
}
