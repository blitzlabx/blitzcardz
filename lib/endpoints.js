export const API_INFO = {
  name: "blitzcardz",
  version: "1.0.0",
  author: "Blitz",
  description: "Anime card data API. 36,000+ cards across 1,900+ series, synced hourly."
};

export const ENDPOINTS = [
  {
    id: "root",
    path: "/api",
    group: "Overview",
    summary: "API information",
    description: "API metadata, collection size and the full endpoint directory.",
    params: [],
    defaults: {},
    example: ""
  },
  {
    id: "cards",
    path: "/api/cards",
    group: "Cards",
    summary: "Browse all cards",
    description:
      "Cards from the collection. Filter by tier, series, anime or name, paginate with limit and page, or pass all=1 for every matching record at once.",
    params: [
      { name: "tier", type: "select", options: ["", "1", "2", "3", "4", "5", "6", "S"], description: "Tier 1-6, or S for special cards" },
      { name: "series", type: "text", description: "Exact series name, case-insensitive" },
      { name: "anime", type: "text", description: "Matches series or character name" },
      { name: "name", type: "text", description: "Matches character title" },
      { name: "event", type: "text", description: "1 for any event card, or an event name such as Summer" },
      { name: "limit", type: "number", description: "Records per page, default 100, max 500" },
      { name: "page", type: "number", description: "Page number, default 1" },
      { name: "all", type: "select", options: ["", "1"], description: "Set to 1 to return every matching record" }
    ],
    defaults: { limit: "6" },
    example: "tier=3&limit=6",
    sample: {
      success: true,
      count: 6,
      total: 6892,
      page: 1,
      pages: 1149,
      data: [
        {
          id: "5d1e825ba5f79d12c938c108",
          tier: "1",
          title: "AE3803",
          url: "https://cdn.shoob.gg/images/cards/1/6525dc8b112c35d32c154ee163a4d41245e6ab3e5ec9be180543064594561bd8.png",
          series: "Cells at Work!"
        }
      ]
    }
  },
  {
    id: "random",
    path: "/api/random",
    group: "Cards",
    summary: "Random card",
    description: "A random card from the collection, optionally locked to one tier. Pass count for multiple distinct cards.",
    params: [
      { name: "tier", type: "select", options: ["", "1", "2", "3", "4", "5", "6", "S"], description: "Draw from one tier only" },
      { name: "count", type: "number", description: "Number of cards, 1-50, default 1" }
    ],
    defaults: {},
    example: "count=3",
    sample: {
      success: true,
      data: {
        id: "5d1e825ba5f79d12c938c108",
        tier: "1",
        title: "AE3803",
        url: "https://cdn.shoob.gg/images/cards/1/6525dc8b112c35d32c154ee163a4d41245e6ab3e5ec9be180543064594561bd8.png",
        series: "Cells at Work!"
      }
    }
  },
  {
    id: "latest",
    path: "/api/latest",
    group: "Cards",
    summary: "Latest additions",
    description: "Cards picked up by the most recent syncs, newest first. Default 50 records, max 200.",
    params: [{ name: "limit", type: "number", description: "1-200, default 50" }],
    defaults: { limit: "12" },
    example: "limit=12"
  },
  {
    id: "series",
    path: "/api/series",
    group: "Cards",
    summary: "Series index",
    description: "Every series in the collection, alphabetical. Pass detailed=1 to include card counts, ordered by size.",
    params: [{ name: "detailed", type: "select", options: ["", "1"], description: "Include per-series card counts" }],
    defaults: { detailed: "1" },
    example: "detailed=1"
  },
  {
    id: "events",
    path: "/api/events",
    group: "Cards",
    summary: "Event cards",
    description: "Event cards with the list of event types present in the collection. Narrow to one event with name.",
    params: [
      { name: "name", type: "select", options: ["", "Birthday", "Christmas", "Festival", "Gala", "Holiday", "New Year", "Special Event", "Spring", "Summer", "Valentine's", "Winter"], description: "One event type" },
      { name: "limit", type: "number", description: "Records per page, default 100, max 500" },
      { name: "page", type: "number", description: "Page number" }
    ],
    defaults: { limit: "6" },
    example: "name=Summer&limit=6"
  },
  {
    id: "stats",
    path: "/api/stats",
    group: "Stats",
    summary: "Collection stats",
    description: "Totals for cards, series and event types, per-tier counts, additions in the last 24 hours and the time of the last sync.",
    params: [],
    defaults: {},
    example: ""
  },
  {
    id: "stats-recent",
    path: "/api/stats/recent",
    group: "Stats",
    summary: "Recent sync runs",
    description: "Results of the most recent sync runs: duration, source and how many cards were added or removed.",
    params: [{ name: "limit", type: "number", description: "1-50, default 10" }],
    defaults: {},
    example: ""
  },
  {
    id: "scraper-status",
    path: "/api/scraper/status",
    group: "Scraper",
    summary: "Sync status",
    description: "Whether a sync is running, when the collection was last synced, and the result of that run. Pass history=1 for the run log.",
    params: [{ name: "history", type: "select", options: ["", "1"], description: "Include the recent run log" }],
    defaults: {},
    example: "history=1"
  },
  {
    id: "scraper-run",
    path: "/api/scraper/run",
    group: "Scraper",
    summary: "Trigger a sync",
    description: "Runs a full sync right now and returns the result. On Vercel this also runs on an hourly schedule through Vercel Cron.",
    params: [],
    defaults: {},
    example: "",
    note: "This performs a real sync against the upstream card source and can take up to a minute."
  }
];

export const ENDPOINT_DIR = [
  { path: "/api", method: "GET", description: "API info, endpoint directory and live collection size" },
  { path: "/api/cards", method: "GET", description: "Get all anime cards" },
  { path: "/api/cards?tier={tier}", method: "GET", description: "Filter by tier (1-6 or S)" },
  { path: "/api/cards?series={name}", method: "GET", description: "Get all cards from a specific series" },
  { path: "/api/cards?anime={name}", method: "GET", description: "Search by series or character name" },
  { path: "/api/cards?name={name}", method: "GET", description: "Search by character title" },
  { path: "/api/cards?event={name|1}", method: "GET", description: "Event cards only, all events or one event" },
  { path: "/api/random", method: "GET", description: "Random card from the full collection" },
  { path: "/api/random?tier={tier}", method: "GET", description: "Random card from a specific tier" },
  { path: "/api/latest", method: "GET", description: "Most recently added cards (default 50, max 200)" },
  { path: "/api/series", method: "GET", description: "Full list of every series in the collection" },
  { path: "/api/events", method: "GET", description: "All event cards with available event types" },
  { path: "/api/events?name={event}", method: "GET", description: "Cards for a specific event (e.g. Christmas, Gala)" },
  { path: "/api/stats", method: "GET", description: "Collection stats: totals, tiers, last sync" },
  { path: "/api/stats/recent", method: "GET", description: "Results of the most recent sync runs" },
  { path: "/api/scraper/status", method: "GET", description: "Live sync status and run log (history=1)" },
  { path: "/api/scraper/run", method: "GET", description: "Manually trigger an immediate sync" }
];

export function endpointByPath(path) {
  return ENDPOINTS.find((e) => e.path === path);
}
