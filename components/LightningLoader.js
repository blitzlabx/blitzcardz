"use client";

import { useId } from "react";

export default function LightningLoader({ className = "", label = "Loading cards" }) {
  const uid = useId().replace(/:/g, "");
  return (
    <span className={`lightning-loader ${className}`.trim()} role="status" aria-label={label}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="120" height="160" focusable="false" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dffaff" stopOpacity=".34" />
            <stop offset=".48" stopColor="#48cfff" stopOpacity=".16" />
            <stop offset="1" stopColor="#1767ff" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id={`${uid}-neon`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9ffff" />
            <stop offset=".38" stopColor="#53e5ff" />
            <stop offset=".72" stopColor="#258cff" />
            <stop offset="1" stopColor="#a8f6ff" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-70%" y="-70%" width="240%" height="240%" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="3.2" result="blur">
              <animate attributeName="stdDeviation" values="3.2;7;3.2;3.2" keyTimes="0;.045;.16;1" dur="1.8s" repeatCount="indefinite" />
            </feGaussianBlur>
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="lightning-trace"
          d="M 71 7 L 25 83 L 54 83 L 43 153 L 98 61 L 68 61 Z"
          pathLength="1000"
          fill={`url(#${uid}-glass)`}
          stroke={`url(#${uid}-neon)`}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="118 882"
          filter={`url(#${uid}-glow)`}
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-1000" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-width" values="4;6.5;4;4" keyTimes="0;.045;.16;1" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".92;1;.94;.92" keyTimes="0;.045;.16;1" dur="1.8s" repeatCount="indefinite" />
        </path>
      </svg>
    </span>
  );
}
