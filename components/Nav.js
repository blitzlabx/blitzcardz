"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const LINKS = [
  ["/browse", "Browse"],
  ["/docs", "Docs"],
  ["/playground", "Playground"]
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="nav-brand" aria-label="blitzcardz home">
          <Logo />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${path === href || path.startsWith(href + "/") ? " active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <a className="nav-link mono" href="/api" target="_blank" rel="noreferrer">
            /api
          </a>
        </nav>
      </div>
    </header>
  );
}
