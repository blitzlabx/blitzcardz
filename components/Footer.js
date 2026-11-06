import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-col footer-brand">
          <Logo />
          <p>Anime card data API. Free, open, no key required.</p>
        </div>
        <nav className="footer-col footer-links" aria-label="Footer">
          <Link href="/browse">Browse</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/playground">Playground</Link>
          <a href="/api" target="_blank" rel="noreferrer">API</a>
        </nav>
        <div className="footer-col footer-credit">
          <p className="credit-line">
            created by <span className="grad-strong">Blitz</span>
          </p>
          <p className="credit-sub">© {year} blitzcardz</p>
        </div>
      </div>
    </footer>
  );
}
