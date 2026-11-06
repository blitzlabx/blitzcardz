import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { load } from "@/lib/db";
import { rarityOf } from "@/lib/rarity";
import { relTime } from "@/lib/format";
import CopyButton from "@/components/CopyButton";
import JsonView from "@/components/JsonView";
import CardTile from "@/components/CardTile";
import CardImage from "@/components/CardImage";

export const revalidate = 0;

export function generateMetadata({ params }) {
  const card = load().byId.get(params.id);
  return { title: card ? `${card.title} — ${card.series}` : "Card not found" };
}

export default function CardPage({ params }) {
  const s = load();
  const card = s.byId.get(params.id);
  if (!card) notFound();

  const r = rarityOf(card.tier);
  const related = s.cards.filter((c) => c.series === card.series && c.id !== card.id).slice(0, 8);

  const h = headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host") || "localhost:3000";
  const base = `${proto}://${host}`;

  const json = {
    id: card.id,
    tier: card.tier,
    title: card.title,
    url: card.url,
    series: card.series,
    ...(card.event ? { event: card.event } : {})
  };

  return (
    <div className="wrap page card-page">
      <p className="crumb">
        <Link className="link" href="/browse">
          ← browse
        </Link>
        <span className="dim"> / {card.series}</span>
      </p>

      <div className="card-layout">
        <div className="card-visual">
          <CardImage src={card.url} alt={card.title} className="card-frame" loading="eager" />
          <div className="card-tags">
            <span className="tag" style={{ "--tag": r.color }}>
              tier {card.tier}
            </span>
            <span className="tag" style={{ "--tag": r.color }}>
              {r.label}
            </span>
            {card.event ? <span className="tag tag-event">{card.event}</span> : null}
          </div>
        </div>

        <div className="card-info">
          <p className="card-series-line">{card.series}</p>
          <h1>{card.title}</h1>

          <dl className="card-meta">
            <div>
              <dt>id</dt>
              <dd className="mono card-id">
                {card.id}
                <CopyButton text={card.id} label="Copy card ID" />
              </dd>
            </div>
            <div>
              <dt>series</dt>
              <dd>
                <Link className="link" href={`/browse?series=${encodeURIComponent(card.series)}`}>
                  {card.series}
                </Link>
              </dd>
            </div>
            <div>
              <dt>rarity</dt>
              <dd>
                tier {card.tier} — {r.label}
              </dd>
            </div>
            {card.event ? (
              <div>
                <dt>event</dt>
                <dd>
                  <Link className="link" href={`/playground?endpoint=/api/events&query=${encodeURIComponent(`name=${card.event}`)}`}>
                    {card.event}
                  </Link>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>claims</dt>
              <dd>{(card.claims || 0).toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt>added</dt>
              <dd>{relTime(card.addedAt)}</dd>
            </div>
            <div>
              <dt>asset</dt>
              <dd>
                <a className="link" href={card.url} target="_blank" rel="noreferrer">
                  open image →
                </a>
              </dd>
            </div>
          </dl>

          <div className="card-actions">
            <Link
              className="btn btn-primary"
              href={`/playground?endpoint=/api/cards&query=${encodeURIComponent(`id=${card.id}`)}`}
            >
              Open in playground
            </Link>
            <a className="btn" href={`${base}/api/cards?id=${card.id}`} target="_blank" rel="noreferrer">
              Raw JSON
            </a>
          </div>

          <div className="code-block">
            <div className="code-head">
              <span className="mono dim">card object</span>
              <CopyButton text={JSON.stringify(json, null, 2)} label="Copy card JSON" />
            </div>
            <JsonView data={json} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>More from {card.series}</h2>
            <Link className="link section-hint" href={`/browse?series=${encodeURIComponent(card.series)}`}>
              browse series →
            </Link>
          </div>
          <div className="grid-tiles">
            {related.map((c) => (
              <CardTile key={c.id} card={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
