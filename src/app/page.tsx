import TopicInput from "@/components/TopicInput";
import { AdPlaceholder } from "@/components/AdBanner";
import { Sparkles, Map, Zap, Globe, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Map className="w-5 h-5" />,
    title: "Structured Roadmaps",
    description: "Step-by-step learning paths from beginner to expert with time estimates and milestones.",
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-400",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Curated Resources",
    description: "Best YouTube videos, courses, articles, and tools — hand-picked by AI for each step.",
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Instant Generation",
    description: "Get your personalized roadmap in seconds, powered by GPT-4 and Gemini AI models.",
    color: "from-green-500/20 to-green-600/20",
    iconColor: "text-green-400",
  },
];

const popularTopics = [
  { name: "Web Development", emoji: "🌐" },
  { name: "Machine Learning", emoji: "🤖" },
  { name: "Data Science", emoji: "📊" },
  { name: "Mobile App Development", emoji: "📱" },
  { name: "DevOps", emoji: "⚙️" },
  { name: "Cyber Security", emoji: "🔐" },
  { name: "Blockchain", emoji: "⛓️" },
  { name: "Game Development", emoji: "🎮" },
  { name: "Cloud Computing", emoji: "☁️" },
  { name: "UI/UX Design", emoji: "🎨" },
  { name: "Python", emoji: "🐍" },
  { name: "React", emoji: "⚛️" },
];

const stats = [
  { value: "100+", label: "Topics Covered" },
  { value: "500+", label: "Resources Curated" },
  { value: "10K+", label: "Roadmaps Generated" },
];

export default function Home() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              AI-Powered Learning Paths
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                Master Any Topic
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                With a Roadmap
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto mb-8">
              Enter any topic and get a professional, structured learning roadmap
              with curated resources from across the web.
            </p>

            <TopicInput />
          </div>
        </div>
      </section>

      <AdPlaceholder position="homepage-after-hero" />

      <section className="border-t border-white/5 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}
                >
                  <span className={feature.iconColor}>{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdPlaceholder position="homepage-middle" />

      <section className="border-t border-white/5 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Explore Popular Roadmaps
            </h2>
            <p className="text-sm text-gray-500">
              Or type any custom topic to generate a roadmap
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {popularTopics.map((topic) => (
              <a
                key={topic.name}
                href={`/roadmap?topic=${encodeURIComponent(topic.name)}`}
                className="group flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all"
              >
                <span className="text-base">{topic.emoji}</span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {topic.name}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <AdPlaceholder position="homepage-bottom" />

      <section className="border-t border-white/5 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Start Learning Smarter
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            Stop spending hours searching for the right resources. Let AI build you a personalized learning path in seconds.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Generate Your Roadmap
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
