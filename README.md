# blitzcardz

Anime card data API by **Blitz**. 36,000+ cards across 1,900+ series over a free JSON API, synced hourly.

- Every endpoint is `GET`, no key, no auth
- Interactive docs at `/docs`, live request runner at `/playground`
- Installable PWA with offline shell

## Stack

- Next.js (App Router) — pages, API and cron in one deployment, no CORS issues
- No database required — a normalized snapshot ships in `data/cards.json`, the hourly sync keeps the running instance warm (`/tmp` + memory)
- Hand-rolled CSS, zero UI dependencies

## Quick start

```bash
npm install
npm run dev
# http://localhost:3000
```

A fresh instance serves the bundled snapshot immediately. Trigger a live sync at [`/api/scraper/run`](http://localhost:3000/api/scraper/run) or let the cron do it hourly in production.

## API

| Endpoint | Description |
| --- | --- |
| `GET /api` | API info, endpoint directory, live collection size |
| `GET /api/cards` | All cards. Filters: `tier` (1–6, S), `series`, `anime`, `name`, `event`. Pagination: `limit`, `page`, or `all=1` |
| `GET /api/random` | Random card. Params: `tier`, `count` (1–50) |
| `GET /api/latest` | Newest additions. Params: `limit` (1–200, default 50) |
| `GET /api/series` | Series index. `detailed=1` adds card counts |
| `GET /api/events` | Event cards + available event types. Param: `name` |
| `GET /api/stats` | Collection stats: totals, per-tier counts, last sync |
| `GET /api/stats/recent` | Recent sync runs. Param: `limit` |
| `GET /api/scraper/status` | Sync status. `history=1` includes the run log |
| `GET /api/scraper/run` | Trigger a sync now |

## Data pipeline

1. `data/cards.json` — seed snapshot so a fresh deployment is never empty
2. `lib/scraper.js` — pulls the full catalog from the upstream card source, normalizes it (tier from the CDN path, event detection from the card text) and diffs it against the current set
3. New cards get fresh timestamps, which is exactly what `/api/latest` and the landing page feed on
4. Every run is logged and visible through `/api/scraper/status?history=1` and `/api/stats/recent`

## Deploy on Vercel

1. Push this repo to GitHub
2. Import it on Vercel — no environment variables required
3. `vercel.json` schedules the hourly sync. Note: on the Hobby plan crons run once per day; change the schedule to `0 0 * * *` or upgrade to Pro for hourly

## PWA

- `public/manifest.webmanifest` — name, theme, icons, app shortcuts
- `public/sw.js` — offline app shell + static caching; API traffic always hits the network
- `public/icons/` — SVG mark plus 192/512, maskable and apple-touch PNGs
- `public/thumbnail.png` — Open Graph / Twitter card image

## Author

Built by **Blitz**. MIT licensed.
