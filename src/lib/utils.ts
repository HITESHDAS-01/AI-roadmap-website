import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSearchQueries(
  stepTitle: string,
  stepDescription: string,
  topic: string
): string[] {
  const queries = [
    `${topic} ${stepTitle} tutorial for beginners`,
    `${topic} ${stepTitle} best course free`,
    `${stepTitle} ${topic} YouTube tutorial 2024`,
    `learn ${stepTitle} ${topic} documentation`,
  ];
  return queries;
}

export function extractSourceFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    const sourceMap: Record<string, string> = {
      "youtube.com": "YouTube",
      "youtu.be": "YouTube",
      "udemy.com": "Udemy",
      "coursera.org": "Coursera",
      "edx.org": "edX",
      "freecodecamp.org": "freeCodeCamp",
      "medium.com": "Medium",
      "dev.to": "Dev.to",
      "github.com": "GitHub",
      "docs.python.org": "Python Docs",
      "mozilla.org": "MDN Web Docs",
      "w3schools.com": "W3Schools",
      "khanacademy.org": "Khan Academy",
      "codecademy.com": "Codecademy",
      "scrimba.com": "Scrimba",
      "leetcode.com": "LeetCode",
      "hackerrank.com": "HackerRank",
    };

    for (const [domain, source] of Object.entries(sourceMap)) {
      if (hostname.includes(domain)) return source;
    }

    return hostname.split(".")[0].charAt(0).toUpperCase() + hostname.split(".")[0].slice(1);
  } catch {
    return "Web";
  }
}
