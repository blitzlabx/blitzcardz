import { filterCards } from "@/lib/db";
import { publicCard } from "@/lib/serialize";

export const dynamic = "force-dynamic";

function int(v, fallback) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1";
  const limit = clamp(int(searchParams.get("limit"), 100), 1, 500);
  const page = Math.max(1, int(searchParams.get("page"), 1));

  const { total, matches } = filterCards({
    tier: searchParams.get("tier"),
    series: searchParams.get("series"),
    anime: searchParams.get("anime"),
    name: searchParams.get("name"),
    event: searchParams.get("event")
  });

  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);
  const slice = all ? matches : matches.slice((safePage - 1) * limit, safePage * limit);

  return Response.json({
    success: true,
    count: slice.length,
    total,
    page: all ? 1 : safePage,
    pages: all ? 1 : pages,
    data: slice.map(publicCard)
  });
}
