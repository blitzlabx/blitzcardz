import Link from "next/link";
import { headers } from "next/headers";
import { load } from "@/lib/db";
import { ENDPOINTS } from "@/lib/endpoints";
import { publicCard } from "@/lib/serialize";
import { relTime } from "@/lib/format";
import CardTile from "@/components/CardTile";
import AutoLatest from "@/components/AutoLatest";
import QuickPlayground from "@/components/QuickPlayground";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

export default function Home() {
  const s = load();
  const latest = s.latest.slice(0, 24).map(publicCard);
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host") || "localhost:3000";
  const base = `${proto}://${host}`;
  const sampleCurl = `curl ${base}/api/latest?limit=1`;

  const stats = [
    ["cards", s.cards.length.toLocaleString("en-US")],
    ["series", s.series.size.toLocaleString("en-US")],
    ["event types", s.events.size.toLocaleString("en-US")],
    ["last sync", s.meta.lastSync ? relTime(s.meta.lastSync) : "awaiting first sync"]
  ];

  return (
    <>
      <section className="wrap hero">
        <p className="hero-kicker mono">anime card data api</p>
        <h1 className="hero-title">
          <em>blitz</em>cardz
        </h1>
        <p className="hero-sub">
          {s.cards.length.toLocaleString("en-US")} anime cards across {s.series.size.toLocaleString("en-US")} series,
          served over a free JSON API with {ENDPOINTS.length} endpoints and an hourly sync. Built by{" "}
          <span className="grad-strong">Blitz</span>.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" href="/docs">
            Read the docs
          </Link>
          <Link className="btn" href="/playground">
            Open playground
          </Link>
        </div>
        <div className="hero-curl">
          <code className="mono">{sampleCurl}</code>
          <CopyButton text={sampleCurl} label="Copy curl command" />
        </div>
      </section>

      <section className="wrap strip" aria-label="Collection stats">
        {stats.map(([label, value]) => (
          <div className="strip-cell" key={label}>
            <span className="strip-value mono">{value}</span>
            <span className="strip-label">{label}</span>
          </div>
        ))}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Latest additions</h2>
          <span className="section-hint">newest cards from the most recent sync</span>
        </div>
        <AutoLatest initial={latest} />
        <p className="more-line">
          <Link className="link" href="/browse">
            Browse all {s.cards.length.toLocaleString("en-US")} cards →
          </Link>
        </p>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Quick playground</h2>
          <span className="section-hint">fire a request without leaving the page</span>
        </div>
        <QuickPlayground />
      </section>
    </>
  );
}
