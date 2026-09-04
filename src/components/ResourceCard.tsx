"use client";

import { ExternalLink, Play, BookOpen, FileText, Wrench, GraduationCap } from "lucide-react";
import type { Resource } from "@/types/roadmap";

const typeIcons: Record<string, React.ReactNode> = {
  video: <Play className="w-3 h-3" />,
  course: <GraduationCap className="w-3 h-3" />,
  article: <FileText className="w-3 h-3" />,
  book: <BookOpen className="w-3 h-3" />,
  tool: <Wrench className="w-3 h-3" />,
  project: <Wrench className="w-3 h-3" />,
};

const typeColors: Record<string, string> = {
  video: "text-red-400 bg-red-500/10",
  course: "text-blue-400 bg-blue-500/10",
  article: "text-green-400 bg-green-500/10",
  book: "text-yellow-400 bg-yellow-500/10",
  tool: "text-purple-400 bg-purple-500/10",
  project: "text-orange-400 bg-orange-500/10",
};

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-150 overflow-hidden"
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
            typeColors[resource.type] || typeColors.article
          }`}
        >
          {typeIcons[resource.type] || typeIcons.article}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-1 break-words">
              {resource.title}
            </h4>
            <ExternalLink className="w-2.5 h-2.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
          <p className="text-[10px] text-gray-600 line-clamp-1 mb-1.5">
            {resource.description}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
              {resource.source}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500 capitalize">
              {resource.type}
            </span>
            {resource.free && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400">
                Free
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
