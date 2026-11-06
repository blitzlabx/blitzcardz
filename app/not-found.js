import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page center">
      <h1>404</h1>
      <p className="muted">Page not found.</p>
      <Link href="/" className="btn">
        Home
      </Link>
    </div>
  );
}
