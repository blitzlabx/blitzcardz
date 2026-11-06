"use client";

import { useEffect, useRef, useState } from "react";
import CardTile from "./CardTile";

export default function AutoLatest({ initial }) {
  const [cards, setCards] = useState(initial);
  const [flash, setFlash] = useState(false);
  const [syncedAt, setSyncedAt] = useState(null);
  const prevRef = useRef("");

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const res = await fetch("/api/latest?limit=24", { cache: "no-store" });
        const json = await res.json();
        if (!alive || !Array.isArray(json.data)) return;
        const next = JSON.stringify(json.data);
        if (next !== prevRef.current) {
          prevRef.current = next;
          setCards(json.data);
          setSyncedAt(new Date().toLocaleTimeString("en-US", { hour12: false }));
          setFlash(true);
          setTimeout(() => alive && setFlash(false), 700);
        }
      } catch {}
    }
    const id = setInterval(poll, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      <div className={`latest-board${flash ? " flash" : ""}`}>
        <div className="grid-tiles">
          {cards.map((c) => (
            <CardTile key={c.id} card={c} />
          ))}
        </div>
      </div>
      <p className="latest-note">auto-refreshes every 10s{syncedAt ? ` · last update ${syncedAt}` : ""}</p>
    </div>
  );
}
