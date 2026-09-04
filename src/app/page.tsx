import TopicInput from "@/components/TopicInput";
import { AdPlaceholder } from "@/components/AdBanner";
import {
  Sparkles,
  Map,
  Zap,
  Globe,
  ArrowRight,
  Brain,
  Share2,
  Download,
  Copy,
  Users,
  CheckCircle2,
  BookOpen,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI-Powered Roadmaps",
    description: "Advanced AI creates personalized learning paths tailored to your goals and experience level.",
    color: "from-purple-500/20 to-purple-600/20",
    iconColor: "text-purple-400",
  },
  {
    icon: <Map className="w-5 h-5" />,
    title: "Structured Learning Paths",
    description: "Step-by-step progression from beginner to expert with time estimates and milestones.",
    color: "from-blue-500/20 to-blue-600/20",
    iconColor: "text-blue-400",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Curated Resources",
    description: "Real YouTube videos, courses, and articles — not fake links, actual verified resources.",
    color: "from-green-500/20 to-green-600/20",
    iconColor: "text-green-400",
  },
  {
    icon: <Copy className="w-5 h-5" />,
    title: "AI Chatbot Prompts",
    description: "Ready-made professional prompts for ChatGPT, Gemini, and Claude to accelerate your learning.",
    color: "from-cyan-500/20 to-cyan-600/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: "Download as PDF",
    description: "Export your roadmap as a beautifully designed PDF with watermarks and course links.",
    color: "from-orange-500/20 to-orange-600/20",
    iconColor: "text-orange-400",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Share with Anyone",
    description: "Share your roadmap on Twitter, LinkedIn, WhatsApp, or copy the direct link.",
    color: "from-pink-500/20 to-pink-600/20",
    iconColor: "text-pink-400",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Enter Your Topic",
    description: "Type any topic you want to learn — from Web Development to UPSC, from Python to Cooking.",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    step: "2",
    title: "AI Generates Roadmap",
    description: "Our AI creates a structured learning path with phases, steps, time estimates, and curated resources.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    step: "3",
    title: "Start Learning",
    description: "Follow the roadmap, use AI prompts to accelerate learning, download PDF, or share with friends.",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "Web Developer",
    text: "I was overwhelmed by the amount of content online. This tool gave me a clear path to follow. Landed my first job in 3 months!",
    rating: 5,
  },
  {
    name: "Rahul M.",
    role: "Data Science Student",
    text: "The AI prompts for each step are genius! I just copy-paste them into ChatGPT and get instant explanations. Game changer!",
    rating: 5,
  },
  {
    name: "Anita K.",
    role: "UPSC Aspirant",
    text: "Used this for UPSC preparation. The structured approach and resource curation saved me hundreds of hours of research.",
    rating: 5,
  },
  {
    name: "Vikram T.",
    role: "Mobile Developer",
    text: "The PDF download feature is amazing. I print my roadmap and stick it on my wall. Great for tracking progress!",
    rating: 5,
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
      {/* Hero Section */}
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
              with curated resources, AI prompts, and downloadable PDFs.
            </p>

            <TopicInput />
          </div>
        </div>
      </section>

      <AdPlaceholder position="homepage-after-hero" />

      {/* Stats Section */}
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
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Everything You Need to Learn Faster
            </h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              More than just a roadmap — a complete learning ecosystem powered by AI
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group"
              >
                <div
                  className={`w-9 h-9 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
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

      {/* How It Works Section */}
      <section className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              How It Works
            </h2>
            <p className="text-sm text-gray-500">
              Three simple steps to start your learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mb-4 relative">
                    <span className="text-purple-400">{item.icon}</span>
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                    {item.description}
                  </p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="border-t border-white/5 py-12">
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

      {/* Testimonials Section */}
      <section className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Loved by Learners
            </h2>
            <p className="text-sm text-gray-500">
              See what others are saying about their learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-3">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{testimonial.name}</p>
                    <p className="text-[10px] text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
