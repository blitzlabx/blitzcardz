"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ENDPOINTS, endpointByPath } from "@/lib/endpoints";
import CopyButton from "@/components/CopyButton";
import { formatBytes } from "@/lib/format";

function buildQuery(ep, params) {
  const q = new URLSearchParams();
  for (const p of ep.params) {
    const v = (params[p.name] || "").trim();
    if (v) q.set(p.name, v);
  }
  return q.toString();
}

function Playground() {
  const sp = useSearchParams();
  const initialPath = endpointByPath(sp.get("endpoint") || "") ? sp.get("endpoint") : "/api/latest";
  const [path, setPath] = useState(initialPath);
  const ep = endpointByPath(path) || ENDPOINTS[0];
  const [params, setParams] = useState(() => {
    const base = { ...(endpointByPath(initialPath)?.defaults || {}) };
    const q = sp.get("query");
    if (q) {
      for (const [k, v] of new URLSearchParams(q)) base[k] = v;
    }
    return base;
  });
  const [resp, setResp] = useState(null);
  const [busy, setBusy] = useState(false);
  const ranOnce = useRef(false);

  function selectPath(p) {
    setPath(p);
    setParams({ ...(endpointByPath(p)?.defaults || {}) });
    setResp(null);
  }

  async function send() {
    setBusy(true);
    const qs = buildQuery(ep, params);
    const fullPath = `${ep.path}${qs ? `?${qs}` : ""}`;
    const t0 = performance.now();
    try {
      const res = await fetch(fullPath, { cache: "no-store" });
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {}
      setResp({
        status: res.status,
        ok: res.ok,
        ms: Math.round(performance.now() - t0),
        size: new Blob([text]).size,
        path: fullPath,
        body: pretty
      });
      const usp = new URLSearchParams();
      usp.set("endpoint", ep.path);
      if (qs) usp.set("query", qs);
      history.replaceState(null, "", `/playground?${usp.toString()}`);
    } catch (err) {
      setResp({ status: 0, ok: false, ms: 0, size: 0, path: fullPath, body: String(err) });
    }
    setBusy(false);
  }

  useEffect(() => {
    if (!ranOnce.current && sp.get("endpoint")) {
      ranOnce.current = true;
      send();
    }
  }, []);

  const groups = [...new Set(ENDPOINTS.map((e) => e.group))];

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>Playground</h1>
        <p className="page-sub">Hit the live API. Every request runs against this deployment.</p>
      </div>

      <div className="pg-layout">
        <aside className="pg-side">
          {groups.map((g) => (
            <div className="pg-group" key={g}>
              <p className="pg-group-label">{g}</p>
              {ENDPOINTS.filter((e) => e.group === g).map((e) => (
                <button
                  key={e.id}
                  className={`pg-endpoint mono${e.path === path ? " on" : ""}`}
                  onClick={() => selectPath(e.path)}
                >
                  {e.path}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <div className="pg-main">
          <div className="pg-panel">
            <div className="pg-panel-head">
              <span className="method">GET</span>
              <code className="mono">{ep.path}</code>
            </div>
            <p className="pg-desc">{ep.description}</p>

            {ep.params.length > 0 && (
              <div className="pg-params">
                {ep.params.map((p) => (
                  <label className="pg-param" key={p.name}>
                    <span className="mono">{p.name}</span>
                    {p.type === "select" ? (
                      <select
                        className="input"
                        value={params[p.name] || ""}
                        onChange={(e) => setParams((s) => ({ ...s, [p.name]: e.target.value }))}
                      >
                        {p.options.map((o) => (
                          <option key={o} value={o}>
                            {o || "—"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="input mono"
                        type={p.type === "number" ? "number" : "text"}
                        value={params[p.name] || ""}
                        placeholder={p.description}
                        onChange={(e) => setParams((s) => ({ ...s, [p.name]: e.target.value }))}
                        spellCheck="false"
                      />
                    )}
                  </label>
                ))}
              </div>
            )}

            <div className="pg-actions">
              <button className="btn btn-primary" onClick={send} disabled={busy}>
                {busy ? "sending…" : "send request"}
              </button>
              {ep.note && <p className="endpoint-note">{ep.note}</p>}
            </div>
          </div>

          {resp && (
            <div className="code-block pg-resp">
              <div className="code-head">
                <span className={`pg-status${resp.ok ? " ok" : " bad"}`}>
                  {resp.status ? resp.status : "err"} · {resp.ms} ms · {formatBytes(resp.size)}
                </span>
                <code className="mono dim pg-path">{resp.path}</code>
                <CopyButton text={resp.body} label="Copy response" />
              </div>
              <pre className="json">{resp.body}</pre>
            </div>
          )}

          {resp && (
            <div className="code-block">
              <div className="code-head">
                <span className="mono dim">cURL</span>
                <CopyButton text={`curl ${typeof location !== "undefined" ? location.origin : ""}${resp.path}`} label="Copy cURL" />
              </div>
              <pre className="mono code-line">curl {typeof location !== "undefined" ? location.origin : ""}{resp.path}</pre>
            </div>
          )}

          {!resp && !busy && <p className="empty">Send a request to see the response here.</p>}
        </div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="wrap page"><p className="dim">loading…</p></div>}>
      <Playground />
    </Suspense>
  );
}
