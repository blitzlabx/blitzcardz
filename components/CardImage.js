"use client";

import { useEffect, useRef, useState } from "react";
import LightningLoader from "./LightningLoader";

export default function CardImage({
  src,
  alt,
  className = "tile-frame",
  loading = "lazy"
}) {
  const imageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete) setLoaded(true);
  }, [src]);

  return (
    <span className={`card-image-shell ${className}`.trim()} aria-busy={!loaded}>
      {!loaded && (
        <LightningLoader
          className="card-image-loader"
          label={`Loading ${alt || "card"}`}
        />
      )}
      <img
        ref={imageRef}
        className={`card-image${loaded ? " is-loaded" : ""}`}
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </span>
  );
}
