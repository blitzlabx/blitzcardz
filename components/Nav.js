"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const LINKS = [
  ["/browse", "Browse"],
  ["/docs", "Docs"],
  ["/playground", "Playground"]
];

const MOBILE_LINKS = [
  ["/", "Home", "home"],
  ["/browse", "Browse", "browse"],
  ["/docs", "Docs", "docs"],
  ["/playground", "Play", "play"]
];

function NavIcon({ name }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9.5V21h14V9.5M9 21v-7h6v7" />
      </svg>
    );
  }

  if (name === "browse") {
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (name === "docs") {
    return (
      <svg {...common}>
        <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" />
        <path d="M14 3.5V8h4M8.5 12h7M8.5 16h7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  );
}

export default function Nav() {
  const path = usePathname();

  function isActive(href) {
    if (href === "/") return path === "/";
    if (href === "/browse" && path.startsWith("/card/")) return true;
    return path === href || path.startsWith(href + "/");
  }

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="nav-brand" aria-label="blitzcardz home">
          <Logo />
        </Link>

        <nav className="nav-links desktop-nav" aria-label="Primary">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${isActive(href) ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <a className="nav-link mono" href="/api" target="_blank" rel="noreferrer">
            /api
          </a>
        </nav>

        <nav className="mobile-nav" aria-label="Mobile primary">
          {MOBILE_LINKS.map(([href, label, icon]) => (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive(href) ? "page" : undefined}
              className={`mobile-nav-link${isActive(href) ? " active" : ""}`}
            >
              <NavIcon name={icon} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
