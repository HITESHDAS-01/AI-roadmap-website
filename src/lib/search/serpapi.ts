interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

let lastRequestTime = 0;
const MIN_DELAY = 1500;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY) {
    await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed));
  }
  lastRequestTime = Date.now();
  return fetch(url);
}

export async function searchResources(
  query: string,
  numResults: number = 5
): Promise<SearchResult[]> {
  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return getFallbackResults(query);
  }

  try {
    const params = new URLSearchParams({
      q: query,
      api_key: apiKey,
      num: (numResults + 3).toString(),
      engine: "google",
    });

    const response = await rateLimitedFetch(
      `https://serpapi.com/search.json?${params.toString()}`
    );

    if (!response.ok) {
      console.error(`SerpAPI error: ${response.status}`);
      return getFallbackResults(query);
    }

    const data = await response.json();

    const results: SearchResult[] = (data.organic_results || [])
      .slice(0, numResults + 3)
      .map((r: { title: string; link: string; snippet?: string }) => ({
        title: r.title,
        url: resolveUrl(r.link),
        snippet: r.snippet || "",
      }));

    return results.length > 0 ? results : getFallbackResults(query);
  } catch (error) {
    console.error("SerpAPI error:", error);
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

  try {
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

    if (!response.ok) {
      console.error(`SerpAPI YouTube error: ${response.status}`);
      return getFallbackYouTubeResults(query);
    }

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

    if (results.length === 0) {
      return getFallbackYouTubeResults(query);
    }

    return results;
  } catch (error) {
    console.error("YouTube search error:", error);
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
  return [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/Special:Search?search=${encoded}`,
      snippet: `Wikipedia articles about ${query}`,
    },
    {
      title: `${query} - MDN Web Docs`,
      url: `https://developer.mozilla.org/en-US/search?q=${encoded}`,
      snippet: `Documentation for ${query}`,
    },
    {
      title: `${query} on freeCodeCamp`,
      url: `https://www.freecodecamp.org/news/search/?query=${encoded}`,
      snippet: `Tutorials on ${query} from freeCodeCamp`,
    },
    {
      title: `${query} on Dev.to`,
      url: `https://dev.to/search?q=${encoded}`,
      snippet: `Community articles about ${query}`,
    },
    {
      title: `${query} on GeeksforGeeks`,
      url: `https://www.geeksforgeeks.org/search/?q=${encoded}`,
      snippet: `Programming tutorials on ${query}`,
    },
  ];
}

function getFallbackYouTubeResults(query: string): SearchResult[] {
  const encoded = encodeURIComponent(query + " tutorial for beginners");
  return [
    {
      title: `${query} Tutorial for Beginners - YouTube`,
      url: `https://www.youtube.com/results?search_query=${encoded}`,
      snippet: `Best YouTube tutorials for learning ${query} from scratch`,
    },
    {
      title: `${query} Full Course - YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " full course 2024")}`,
      snippet: `Complete ${query} course on YouTube`,
    },
    {
      title: `${query} Crash Course - YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " crash course")}`,
      snippet: `Quick crash course on ${query}`,
    },
  ];
}
