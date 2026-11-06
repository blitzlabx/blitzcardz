"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import CardTile from "@/components/CardTile";
import { TIER_ORDER } from "@/lib/rarity";

function Browse() {
  const sp = useSearchParams();
  const [name, setName] = useState("");
  const [series, setSeries] = useState(sp.get("series") || "");
  const [tier, setTier] = useState("");
  const [eventsOnly, setEventsOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seriesNames, setSeriesNames] = useState([]);
  const gridRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetch("/api/series")
      .then((r) => r.json())
      .then((j) => Array.isArray(j.data) && setSeriesNames(j.data.slice(0, 400)))
      .catch(() => {});
  }, []);

  const fetchCards = useCallback(async (params) => {
    setLoading(true);
    const q = new URLSearchParams();
    if (params.name) q.set("name", params.name);
    if (params.series) q.set("series", params.series);
    if (params.tier) q.set("tier", params.tier);
    if (params.eventsOnly) q.set("event", "1");
    q.set("limit", "24");
    q.set("page", String(params.page));
    try {
      const res = await fetch(`/api/cards?${q.toString()}`, { cache: "no-store" });
      const json = await res.json();
      setData(json);
    } catch {
      setData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCards({ name, series, tier, eventsOnly, page });
  }, [name, series, tier, eventsOnly, page, fetchCards]);

  function onSearch(fn, value) {
    fn(value);
    setPage(1);
  }

  function debouncedName(value) {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(setName, value), 350);
  }

  function goto(p) {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const total = data?.total ?? null;
  const pages = data?.pages ?? 1;

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>Browse</h1>
        <p className="page-sub">
          {loading && total === null ? "loading" : `${total === null ? "—" : total.toLocaleString("en-US")} cards match`}
          {series ? ` · ${series}` : ""}
          {tier ? ` · tier ${tier}` : ""}
        </p>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search character…"
          aria-label="Search character"
          onChange={(e) => debouncedName(e.target.value)}
          spellCheck="false"
        />
        <input
          className="input"
          placeholder="Series…"
          aria-label="Filter by series"
          defaultValue={sp.get("series") || ""}
          list="series-list"
          onChange={(e) => onSearch(setSeries, e.target.value.trim())}
          spellCheck="false"
        />
        <datalist id="series-list">
          {seriesNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <label className="check">
          <input type="checkbox" checked={eventsOnly} onChange={(e) => onSearch(setEventsOnly, e.target.checked)} />
          event cards only
        </label>
      </div>

      <div className="tier-row" role="group" aria-label="Filter by tier">
        <button className={`chip${tier === "" ? " on" : ""}`} onClick={() => onSearch(setTier, "")}>
          all tiers
        </button>
        {TIER_ORDER.map((t) => (
          <button key={t} className={`chip mono${tier === t ? " on" : ""}`} onClick={() => onSearch(setTier, t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid-tiles" ref={gridRef}>
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div className="tile-skel" key={`sk-${i}`}>
                <span className="tile-frame skel" />
                <span className="skel skel-line" />
                <span className="skel skel-line short" />
              </div>
            ))
          : data?.data?.map((c) => <CardTile key={c.id} card={c} />)}
      </div>

      {!loading && data && data.data.length === 0 && (
        <p className="empty">No cards match these filters. Clear one and try again.</p>
      )}

      {data && data.pages > 1 && (
        <div className="pager">
          <button className="btn" disabled={page <= 1 || loading} onClick={() => goto(page - 1)}>
            ← prev
          </button>
          <span className="mono dim">
            page {data.page} of {data.pages}
          </span>
          <button className="btn" disabled={page >= data.pages || loading} onClick={() => goto(page + 1)}>
            next →
          </button>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="wrap page"><p className="dim">loading…</p></div>}>
      <Browse />
    </Suspense>
  );
}
