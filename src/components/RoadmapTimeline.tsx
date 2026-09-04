"use client";

import { Clock, Calendar, BookOpen, TrendingUp, GraduationCap, ExternalLink, Star } from "lucide-react";
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
  const courses = roadmap.popularCourses || [];

  // Group courses by platform
  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.platform]) acc[course.platform] = [];
    acc[course.platform].push(course);
    return acc;
  }, {} as Record<string, typeof courses>);

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

      {/* Popular Courses Section */}
      {courses.length > 0 && (
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              Best Courses to Learn {roadmap.topic}
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Top-rated courses from popular platforms to accelerate your learning
          </p>

          <div className="space-y-6">
            {Object.entries(groupedCourses).map(([platform, platformCourses]) => (
              <div key={platform}>
                <h3 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  {platform}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {platformCourses.map((course, i) => (
                    <a
                      key={i}
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors truncate">
                              {course.title}
                            </h4>
                            <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-purple-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {course.free ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/15">
                                Free
                              </span>
                            ) : (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/15">
                                Paid
                              </span>
                            )}
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                              {platform}
                            </span>
                          </div>
                        </div>
                       </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer - at very bottom */}
      <div className="mt-12 pt-6 border-t border-white/5 text-center">
        <p className="text-xs text-gray-600">
          Built by Pranjit | AI-Powered Learning Roadmaps
        </p>
      </div>
    </div>
  );
}
