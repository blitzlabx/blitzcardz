import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page notfound">
      <p className="mono dim">404</p>
      <h1>Nothing here</h1>
      <p className="page-sub">This page or card does not exist.</p>
      <Link className="btn btn-primary" href="/">
        Back home
      </Link>
    </div>
  );
}
