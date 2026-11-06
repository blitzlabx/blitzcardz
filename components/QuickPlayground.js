"use client";

import Link from "next/link";
import { useState } from "react";
import { ENDPOINTS } from "@/lib/endpoints";
import CopyButton from "./CopyButton";

export default function QuickPlayground() {
  const [path, setPath] = useState("/api/latest");
  const [query, setQuery] = useState("limit=3");
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(e) {
    e.preventDefault();
    setBusy(true);
    const t0 = performance.now();
    try {
      const res = await fetch(`${path}${query ? `?${query}` : ""}`, { cache: "no-store" });
      const json = await res.json();
      setOut({
        status: res.status,
        ms: Math.round(performance.now() - t0),
        body: JSON.stringify(json, null, 2)
      });
    } catch (err) {
      setOut({ status: 0, ms: 0, body: String(err) });
    }
    setBusy(false);
  }

  return (
    <div className="quick">
      <form className="quick-bar" onSubmit={run}>
        <select className="input" value={path} onChange={(e) => setPath(e.target.value)} aria-label="Endpoint">
          {ENDPOINTS.map((ep) => (
            <option key={ep.id} value={ep.path}>
              {ep.path}
            </option>
          ))}
        </select>
        <input
          className="input mono"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="tier=3&limit=2"
          aria-label="Query string"
          spellCheck="false"
        />
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "running" : "run"}
        </button>
      </form>
      {out && (
        <div className="code-block quick-out">
          <div className="code-head">
            <span className="mono dim">
              {out.status ? `${out.status} · ${out.ms} ms` : "request failed"}
            </span>
            <CopyButton text={out.body} label="Copy response" />
          </div>
          <pre className="json">{out.body}</pre>
        </div>
      )}
      <p className="quick-foot">
        this is the quick version —{" "}
        <Link
          className="link"
          href={`/playground?endpoint=${encodeURIComponent(path)}&query=${encodeURIComponent(query)}`}
        >
          open the full playground →
        </Link>
      </p>
    </div>
  );
}
