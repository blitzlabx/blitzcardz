"use client";

import { useId } from "react";

export default function LightningLoader({ className = "", label = "Loading cards" }) {
  const uid = useId().replace(/:/g, "");
  return (
    <span className={`lightning-loader ${className}`.trim()} role="status" aria-label={label}>
      <svg viewBox="0 0 48 48" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-bolt-fill`} x1="9" y1="5" x2="38" y2="43" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#a5f3fc" />
            <stop offset="0.48" stopColor="#4cc2ff" />
            <stop offset="1" stopColor="#34d399" />
          </linearGradient>
          <radialGradient id={`${uid}-core-glow`}>
            <stop offset="0" stopColor="#4cc2ff" stopOpacity=".28" />
            <stop offset="1" stopColor="#4cc2ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle className="lightning-aura" cx="24" cy="24" r="22" fill={`url(#${uid}-core-glow)`} />
        <circle className="lightning-orbit lightning-orbit-outer" cx="24" cy="24" r="19" />
        <circle className="lightning-orbit lightning-orbit-inner" cx="24" cy="24" r="15" />
        <path
          className="lightning-bolt"
          d="M27.4 3.8 11.2 25.1h10.1l-1.1 19.1 16.6-25.3H26.4l1-15.1Z"
          fill={`url(#${uid}-bolt-fill)`}
        />
        <path
          className="lightning-bolt-highlight"
          d="m27.4 3.8-7.1 20.1"
          fill="none"
          stroke="#e0fbff"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      </svg>
    </span>
  );
}
