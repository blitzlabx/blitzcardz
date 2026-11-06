import fs from "fs";
import seed from "@/data/cards.json";

const STORE = "/tmp/blitzcardz-store.json";

let state = null;

function index(cards) {
  const byId = new Map();
  const series = new Map();
  const events = new Map();
  const tiers = {};
  const latest = [];
  for (const c of cards) {
    byId.set(c.id, c);
    tiers[c.tier] = (tiers[c.tier] || 0) + 1;
    series.set(c.series, (series.get(c.series) || 0) + 1);
    if (c.event) events.set(c.event, (events.get(c.event) || 0) + 1);
    if (c.addedAt) latest.push(c);
  }
  latest.sort((a, b) => b.addedAt - a.addedAt);
  return { byId, series, events, tiers, latest };
}

export function load() {
  if (state) return state;
  let cards = seed;
  let meta = { lastSync: null, lastRun: null, history: [], running: false, source: "seed" };
  try {
    const raw = JSON.parse(fs.readFileSync(STORE, "utf8"));
    if (Array.isArray(raw.cards) && raw.cards.length) {
      cards = raw.cards;
      meta = { ...meta, ...raw.meta };
    }
  } catch {}
  state = { cards, meta, ...index(cards) };
  return state;
}

export function reindex(cards) {
  const s = load();
  s.cards = cards;
  Object.assign(s, index(cards));
}

export function persist() {
  const s = load();
  try {
    fs.writeFileSync(STORE, JSON.stringify({ cards: s.cards, meta: s.meta }));
  } catch {}
}

export function filterCards(q = {}) {
  const s = load();
  const tier = q.tier ? String(q.tier).toLowerCase() : null;
  const name = q.name ? q.name.toLowerCase().trim() : null;
  const seriesQ = q.series ? q.series.toLowerCase().trim() : null;
  const animeQ = q.anime ? q.anime.toLowerCase().trim() : null;
  const event = q.event ? String(q.event).trim() : null;
  const id = q.id || null;

  if (id) {
    const c = s.byId.get(id);
    return { total: c ? 1 : 0, matches: c ? [c] : [] };
  }

  const active = tier || name || seriesQ || animeQ || event;
  if (!active) return { total: s.cards.length, matches: s.cards };

  const matches = s.cards.filter((c) => {
    if (tier && c.tier.toLowerCase() !== tier) return false;
    if (event) {
      if (event === "1") {
        if (!c.event) return false;
      } else if (c.event !== event) return false;
    }
    if (name && !c.title.toLowerCase().includes(name)) return false;
    if (seriesQ && c.series.toLowerCase() !== seriesQ) return false;
    if (animeQ && !(c.series.toLowerCase().includes(animeQ) || c.title.toLowerCase().includes(animeQ))) return false;
    return true;
  });
  return { total: matches.length, matches };
}

export function latestCards(limit) {
  return load().latest.slice(0, limit);
}

export function randomCards({ tier = null, count = 1 } = {}) {
  const { total, matches } = filterCards({ tier });
  if (!total) return [];
  const pool = [...matches];
  const out = [];
  const n = Math.min(count, pool.length, 50);
  for (let i = 0; i < n; i++) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

export function seriesList(detailed = false) {
  const s = load();
  const entries = [...s.series.entries()].map(([name, count]) => ({ name, count }));
  if (!detailed) return entries.map((e) => e.name).sort((a, b) => a.localeCompare(b));
  entries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return entries;
}

export function eventTypes() {
  const s = load();
  return [...s.events.keys()].sort((a, b) => a.localeCompare(b));
}

export function collectionStats() {
  const s = load();
  const dayAgo = Date.now() - 86400_000;
  return {
    cards: s.cards.length,
    series: s.series.size,
    eventTypes: s.events.size,
    eventCards: [...s.events.values()].reduce((a, b) => a + b, 0),
    tiers: s.tiers,
    addedLast24h: s.cards.reduce((a, c) => a + (c.addedAt > dayAgo ? 1 : 0), 0),
    lastSync: s.meta.lastSync || null
  };
}

export function syncStatus() {
  const s = load();
  return {
    running: !!s.meta.running,
    totalCards: s.cards.length,
    lastSync: s.meta.lastSync || null,
    lastRun: s.meta.lastRun || null,
    history: s.meta.history || [],
    source: s.meta.source || "seed"
  };
}
