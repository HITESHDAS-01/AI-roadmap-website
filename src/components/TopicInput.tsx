"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight, TrendingUp, ChevronDown } from "lucide-react";

const SUGGESTIONS = [
  { name: "Web Development", category: "Development" },
  { name: "Machine Learning", category: "AI/ML" },
  { name: "Data Science", category: "Data" },
  { name: "Mobile App Development", category: "Development" },
  { name: "DevOps", category: "Operations" },
  { name: "Cyber Security", category: "Security" },
  { name: "Blockchain", category: "Web3" },
  { name: "Game Development", category: "Development" },
  { name: "Cloud Computing", category: "Infrastructure" },
  { name: "UI/UX Design", category: "Design" },
];

const PROVIDERS = [
  { id: "auto", label: "Auto", desc: "Best available" },
  { id: "groq", label: "Groq", desc: "Fast & free" },
  { id: "openai", label: "OpenAI", desc: "GPT-4o" },
  { id: "gemini", label: "Gemini", desc: "Google AI" },
] as const;

export default function TopicInput() {
  const [topic, setTopic] = useState("");
  const [provider, setProvider] = useState<string>("auto");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProviders, setShowProviders] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const providerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (providerRef.current && !providerRef.current.contains(e.target as Node)) {
        setShowProviders(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      const params = new URLSearchParams({ topic: topic.trim() });
      if (provider !== "auto") params.set("provider", provider);
      router.push(`/roadmap?${params.toString()}`);
    }
  };

  const handleSuggestion = (name: string) => {
    setTopic(name);
    setShowSuggestions(false);
    const params = new URLSearchParams({ topic: name });
    if (provider !== "auto") params.set("provider", provider);
    router.push(`/roadmap?${params.toString()}`);
  };

  const filtered = topic
    ? SUGGESTIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(topic.toLowerCase()) ||
          s.category.toLowerCase().includes(topic.toLowerCase())
      )
    : SUGGESTIONS;

  const selectedProvider = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];

  return (
    <div className="w-full max-w-2xl mx-auto" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative flex items-center rounded-xl border transition-all duration-200 ${
            isFocused
              ? "border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
              : "border-white/10 hover:border-white/15"
          } bg-white/5 backdrop-blur-xl`}
        >
          <Search className="absolute left-3.5 w-4 h-4 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter any topic... (e.g., Web Development, Machine Learning)"
            className="w-full bg-transparent text-white placeholder-gray-600 text-sm sm:text-base py-4 pl-10 pr-40 focus:outline-none rounded-xl"
          />
          <div className="absolute right-1.5 flex items-center gap-1.5">
            <div ref={providerRef} className="relative">
              <button
                type="button"
                onClick={() => setShowProviders(!showProviders)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {selectedProvider.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showProviders && (
                <div className="absolute bottom-full mb-1 right-0 w-40 p-1 rounded-xl bg-gray-900 border border-white/10 shadow-xl z-50">
                  {PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProvider(p.id);
                        setShowProviders(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                        provider === p.id
                          ? "bg-purple-500/10 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-medium">{p.label}</span>
                      <span className="text-[10px] text-gray-600">{p.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!topic.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {showSuggestions && (
        <div className="mt-2 p-2 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
            <TrendingUp className="w-3 h-3 text-gray-600" />
            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">
              {topic ? "Suggestions" : "Popular topics"}
            </span>
          </div>
          <div className="space-y-0.5">
            {filtered.slice(0, 8).map((suggestion) => (
              <button
                key={suggestion.name}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSuggestion(suggestion.name);
                }}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-white/5 transition-colors group"
              >
                <Search className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" />
                <span className="text-sm text-gray-300 group-hover:text-white flex-1">
                  {suggestion.name}
                </span>
                <span className="text-[10px] text-gray-700 bg-white/5 px-1.5 py-0.5 rounded">
                  {suggestion.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
