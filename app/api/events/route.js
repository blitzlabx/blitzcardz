import { filterCards, eventTypes } from "@/lib/db";
import { publicCard } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit"), 10) || 100));
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);

  const { total, matches } = filterCards({ event: name || "1" });
  const pages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, pages);

  return Response.json({
    success: true,
    count: total,
    availableEvents: eventTypes(),
    page: safePage,
    pages,
    data: matches.slice((safePage - 1) * limit, safePage * limit).map(publicCard)
  });
}
