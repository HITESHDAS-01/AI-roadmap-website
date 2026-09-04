"use client";

import { ExternalLink, Play, FileText, Code, GraduationCap, Youtube } from "lucide-react";
import type { Resource } from "@/types/roadmap";

const sourceConfig: Record<string, { icon: typeof ExternalLink; color: string; bg: string }> = {
  YouTube: { icon: Youtube, color: "text-red-400", bg: "bg-red-500/10 border-red-500/15" },
  Coursera: { icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/15" },
  MDN: { icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/15" },
  freeCodeCamp: { icon: Code, color: "text-green-400", bg: "bg-green-500/10 border-green-500/15" },
};

function getSourceConfig(source: string, url: string) {
  if (sourceConfig[source]) return sourceConfig[source];
  if (url.includes("youtube.com") || url.includes("youtu.be"))
    return sourceConfig.YouTube;
  if (url.includes("coursera.org")) return sourceConfig.Coursera;
  if (url.includes("developer.mozilla.org")) return sourceConfig.MDN;
  if (url.includes("freecodecamp.org")) return sourceConfig.freeCodeCamp;
  return { icon: ExternalLink, color: "text-gray-400", bg: "bg-white/5 border-white/10" };
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  const config = getSourceConfig(resource.source, resource.url);
  const Icon = config.icon;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-card group flex items-start gap-2.5 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
    >
      <div
        className={`w-8 h-8 rounded-lg ${config.bg} border flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h5 className="text-sm font-medium text-white truncate group-hover:text-purple-400 transition-colors">
            {resource.title}
          </h5>
          <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
        </div>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
          {resource.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full border ${config.bg} ${config.color}`}
          >
            {resource.source}
          </span>
          {resource.type && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/5 capitalize">
              {resource.type}
            </span>
          )}
          {resource.free && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/15">
              Free
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
