"use client";

import { rarityOf } from "@/lib/rarity";
import CardImage from "./CardImage";

export default function CardTile({ card }) {
  const r = rarityOf(card.tier);
  return (
    <a className="tile" href={`/card/${card.id}`}>
      <CardImage src={card.url} alt={card.title} className="tile-frame" />
      <span className="tile-meta">
        <span className="tile-name">{card.title}</span>
        <span className="tile-series">{card.series}</span>
        <span className="tile-tags">
          <span className="tag" style={{ "--tag": r.color }}>
            T{card.tier}
          </span>
          <span className="tag" style={{ "--tag": r.color }}>
            {r.label}
          </span>
          {card.event ? <span className="tag tag-event">{card.event}</span> : null}
        </span>
      </span>
    </a>
  );
}
