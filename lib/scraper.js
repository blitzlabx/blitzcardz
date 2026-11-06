import { load, reindex, persist } from "@/lib/db";

const SOURCE_URL = "https://api.shoob.gg/site/api/cardlist";

const EVENTS = ["Birthday", "Christmas", "Festival", "Gala", "Holiday", "New Year", "Special Event", "Spring", "Summer", "Valentine's", "Winter"];
const EVENT_LOW = EVENTS.map((e) => e.toLowerCase().replace("'", ""));

function detectEvent(text) {
  const s = (text || "").toLowerCase().replace("'", "");
  for (let i = 0; i < EVENTS.length; i++) {
    if (s.includes(EVENT_LOW[i])) return EVENTS[i];
  }
  return null;
}

function normalize(records) {
  const out = [];
  for (const r of records) {
    const tier = String(r.tier || "").trim();
    const file = r.file || "";
    if (!tier || !file) continue;
    const cats = Array.isArray(r.category) ? r.category : [];
    out.push({
      id: r._id,
      title: r.name || cats[1] || "Unknown",
      series: cats[0] || "Unknown",
      tier,
      url: `https://cdn.shoob.gg/images/cards/${tier}/${file}`,
      event: detectEvent(r.slugged || r.name),
      claims: Number(r.claim_count) || 0,
      addedAt: 0
    });
  }
  return out;
}

export async function sync({ maxMs = 50000, source = "manual" } = {}) {
  const s = load();
  if (s.meta.running) return { ok: false, reason: "already_running" };

  s.meta.running = true;
  const started = Date.now();
  const before = s.cards.length;

  try {
    const res = await fetch(SOURCE_URL, {
      headers: { "User-Agent": "blitzcardz/1.0", Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(maxMs)
    });
    if (!res.ok) throw new Error(`upstream responded ${res.status}`);
    const records = await res.json();
    if (!Array.isArray(records)) throw new Error("unexpected upstream payload");

    const incoming = normalize(records);
    const prevById = new Map(s.cards.map((c) => [c.id, c]));
    const now = Date.now();
    let added = 0;
    const next = incoming.map((c) => {
      const prev = prevById.get(c.id);
      if (prev) return { ...c, addedAt: prev.addedAt || now };
      added++;
      return { ...c, addedAt: now };
    });

    reindex(next);
    const removed = Math.max(0, before + added - next.length);
    const durationMs = Date.now() - started;
    const run = {
      startedAt: new Date(started).toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs,
      source,
      status: "ok",
      total: next.length,
      added,
      removed
    };

    s.meta.lastSync = Date.now();
    s.meta.lastRun = run;
    s.meta.history = [run, ...(s.meta.history || [])].slice(0, 50);
    s.meta.source = "sync";
    persist();
    return { ok: true, ...run };
  } catch (err) {
    const run = {
      startedAt: new Date(started).toISOString(),
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - started,
      source,
      status: "error",
      error: String(err && err.message ? err.message : err)
    };
    s.meta.history = [run, ...(s.meta.history || [])].slice(0, 50);
    persist();
    return { ok: false, error: run.error };
  } finally {
    s.meta.running = false;
  }
}
