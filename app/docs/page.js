import Link from "next/link";
import { headers } from "next/headers";
import { ENDPOINTS, API_INFO } from "@/lib/endpoints";
import JsonView from "@/components/JsonView";
import CopyButton from "@/components/CopyButton";

export const metadata = {
  title: "API documentation"
};

export const dynamic = "force-dynamic";

export default function DocsPage() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "http";
  const host = h.get("host") || "localhost:3000";
  const base = `${proto}://${host}`;

  const groups = [...new Set(ENDPOINTS.map((e) => e.group))];

  return (
    <div className="wrap page docs">
      <div className="page-head">
        <h1>API documentation</h1>
        <p className="page-sub">
          {API_INFO.name} v{API_INFO.version} — a read-only JSON API. Every endpoint is GET, no key, no auth.
          Lists are paginated with limit and page.
        </p>
      </div>

      <div className="code-block base-row">
        <span className="mono dim">base url</span>
        <code className="mono">{base}</code>
        <CopyButton text={base} label="Copy base URL" />
      </div>

      <div className="docs-layout">
        <aside className="docs-side">
          {groups.map((g) => (
            <div className="docs-group" key={g}>
              <p className="docs-group-label">{g}</p>
              {ENDPOINTS.filter((e) => e.group === g).map((e) => (
                <a key={e.id} href={`#endpoint-${e.id}`} className="docs-side-link mono">
                  {e.path}
                </a>
              ))}
            </div>
          ))}
        </aside>

        <div className="docs-main">
          {ENDPOINTS.map((e) => (
            <section className="endpoint" id={`endpoint-${e.id}`} key={e.id}>
              <p className="endpoint-path">
                <span className="method">GET</span>
                <code className="mono">{e.path}</code>
              </p>
              <h2>{e.summary}</h2>
              <p className="endpoint-desc">{e.description}</p>

              {e.params.length > 0 ? (
                <table className="params">
                  <thead>
                    <tr>
                      <th>parameter</th>
                      <th>type</th>
                      <th>description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.params.map((p) => (
                      <tr key={p.name}>
                        <td className="mono">{p.name}</td>
                        <td className="dim">{p.type}</td>
                        <td>{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="dim no-params">No parameters.</p>
              )}

              <div className="code-block">
                <div className="code-head">
                  <span className="mono dim">request</span>
                  <CopyButton
                    text={`curl ${base}${e.path}${e.example ? `?${e.example}` : ""}`}
                    label="Copy curl"
                  />
                </div>
                <pre className="mono code-line">curl {base}{e.path}{e.example ? `?${e.example}` : ""}</pre>
              </div>

              {e.sample && (
                <div className="code-block">
                  <div className="code-head">
                    <span className="mono dim">response</span>
                    <CopyButton text={JSON.stringify(e.sample, null, 2)} label="Copy sample" />
                  </div>
                  <JsonView data={e.sample} />
                </div>
              )}

              {e.note && <p className="endpoint-note">{e.note}</p>}

              <Link
                className="try-link"
                href={`/playground?endpoint=${encodeURIComponent(e.path)}&query=${encodeURIComponent(e.example || "")}`}
              >
                Try it out →
              </Link>
            </section>
          ))}

          <section className="endpoint">
            <h2>Sync schedule</h2>
            <p className="endpoint-desc">
              The collection syncs itself every hour through Vercel Cron, so /api/latest keeps moving on its own.
              Need fresh data right now? Hit /api/scraper/run or press Try it out on the endpoint above.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
