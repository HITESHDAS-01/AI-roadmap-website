interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

let lastRequestTime = 0;
const MIN_DELAY = 2000;

async function rateLimitedFetch(url: string): Promise<Response | null> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY) {
    await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed));
  }
  lastRequestTime = Date.now();

  try {
    const response = await fetch(url);
    if (response.status === 429) {
      console.warn("SerpAPI rate limited, using fallback");
      return null;
    }
    return response;
  } catch {
    return null;
  }
}

export async function searchResources(
  query: string,
  numResults: number = 5
): Promise<SearchResult[]> {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return getFallbackResults(query);
  }

  const params = new URLSearchParams({
    q: query,
    api_key: apiKey,
    num: (numResults + 3).toString(),
    engine: "google",
  });

  const response = await rateLimitedFetch(
    `https://serpapi.com/search.json?${params.toString()}`
  );

  if (!response) return getFallbackResults(query);

  try {
    const data = await response.json();
    const results: SearchResult[] = (data.organic_results || [])
      .slice(0, numResults + 3)
      .map((r: { title: string; link: string; snippet?: string }) => ({
        title: r.title,
        url: resolveUrl(r.link),
        snippet: r.snippet || "",
      }));

    return results.length > 0 ? results : getFallbackResults(query);
  } catch {
    return getFallbackResults(query);
  }
}

export async function searchYouTubeResources(
  query: string,
  numResults: number = 5
): Promise<SearchResult[]> {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return getFallbackYouTubeResults(query);
  }

  const ytQuery = `${query} youtube.com`;
  const params = new URLSearchParams({
    q: ytQuery,
    api_key: apiKey,
    num: (numResults + 8).toString(),
    engine: "google",
  });

  const response = await rateLimitedFetch(
    `https://serpapi.com/search.json?${params.toString()}`
  );

  if (!response) return getFallbackYouTubeResults(query);

  try {
    const data = await response.json();
    const results: SearchResult[] = (data.organic_results || [])
      .filter((r: { link: string }) => {
        const url = resolveUrl(r.link);
        return url.includes("youtube.com/watch") || url.includes("youtube.com/playlist") || url.includes("youtu.be");
      })
      .slice(0, numResults)
      .map((r: { title: string; link: string; snippet?: string }) => ({
        title: r.title.replace(/ - YouTube$/i, "").trim(),
        url: resolveUrl(r.link),
        snippet: r.snippet || "",
      }));

    return results.length > 0 ? results : getFallbackYouTubeResults(query);
  } catch {
    return getFallbackYouTubeResults(query);
  }
}

function resolveUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("google.com") && parsed.pathname.includes("/url")) {
      return parsed.searchParams.get("q") || parsed.searchParams.get("url") || url;
    }
    return url;
  } catch {
    return url;
  }
}

function getFallbackResults(query: string): SearchResult[] {
  const encoded = encodeURIComponent(query);
  const topic = query.replace(/tutorial|course|learn|guide|basics|advanced|beginners/gi, "").trim();

  const curated = [
    { title: `${topic} - freeCodeCamp`, url: `https://www.freecodecamp.org/news/search/?query=${encoded}`, snippet: `Free ${topic} tutorials and courses from freeCodeCamp` },
    { title: `${topic} - MDN Web Docs`, url: `https://developer.mozilla.org/en-US/search?q=${encoded}`, snippet: `Official documentation and guides for ${topic}` },
    { title: `${topic} - GeeksforGeeks`, url: `https://www.geeksforgeeks.org/search/?q=${encoded}`, snippet: `Programming articles and tutorials on ${topic}` },
    { title: `${topic} - Dev.to`, url: `https://dev.to/search?q=${encoded}`, snippet: `Community articles about ${topic}` },
    { title: `${topic} - W3Schools`, url: `https://www.w3schools.com/search/search_result.asp?${encoded}`, snippet: `Web development tutorials for ${topic}` },
    { title: `${topic} - Tutorialspoint`, url: `https://www.tutorialspoint.com/search.htm?search=${encoded}`, snippet: `Simple and easy learning for ${topic}` },
    { title: `${topic} - HackerRank`, url: `https://www.hackerrank.com/domains/${topic.toLowerCase().replace(/\s+/g, "-")}`, snippet: `Practice ${topic} problems on HackerRank` },
    { title: `${topic} - LeetCode`, url: `https://leetcode.com/problemset/`, snippet: `Coding practice and challenges` },
    { title: `${topic} - Coursera`, url: `https://www.coursera.org/search?query=${encoded}`, snippet: `University courses on ${topic}` },
    { title: `${topic} - edX`, url: `https://www.edx.org/search?q=${encoded}`, snippet: `Online courses from top universities on ${topic}` },
  ];

  return curated.slice(0, 5);
}

function getFallbackYouTubeResults(query: string): SearchResult[] {
  const topic = query.replace(/youtube|tutorial|course|learn|guide|basics|advanced|beginners/gi, "").trim();
  const encoded = encodeURIComponent(topic + " tutorial");

  const curated = [
    { title: `${topic} Tutorial for Beginners - YouTube`, url: `https://www.youtube.com/results?search_query=${encoded}`, snippet: `Best YouTube tutorials for ${topic}` },
    { title: `${topic} Full Course - YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " full course 2024")}`, snippet: `Complete ${topic} course on YouTube` },
    { title: `${topic} Crash Course - YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " crash course")}`, snippet: `Quick crash course on ${topic}` },
    { title: `${topic} Projects - YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " projects for beginners")}`, snippet: `Build projects to learn ${topic}` },
    { title: `${topic} Roadmap - YouTube`, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " roadmap 2024")}`, snippet: `Learning path for ${topic}` },
  ];

  return curated;
}
