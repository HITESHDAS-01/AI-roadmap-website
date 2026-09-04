import { MetadataRoute } from "next";

const SITE_URL = "https://roadmapai.dev";

const popularTopics = [
  "Web Development",
  "Machine Learning",
  "Data Science",
  "Mobile App Development",
  "DevOps",
  "Cyber Security",
  "Blockchain",
  "Game Development",
  "Cloud Computing",
  "UI-UX Design",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "Docker",
  "Kubernetes",
  "AWS",
  "Flutter",
  "Swift",
  "Rust",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const topicPages = popularTopics.map((topic) => ({
    url: `${SITE_URL}/roadmap?topic=${encodeURIComponent(topic)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...topicPages];
}
