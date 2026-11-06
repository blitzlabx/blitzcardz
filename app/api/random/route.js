import { randomCards } from "@/lib/db";
import { publicCard } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier");
  const count = Math.min(50, Math.max(1, parseInt(searchParams.get("count"), 10) || 1));

  const picked = randomCards({ tier: tier || null, count });
  if (!picked.length) {
    return Response.json({ success: false, error: "no cards match this tier" }, { status: 404 });
  }

  if (count === 1) {
    return Response.json({ success: true, data: publicCard(picked[0]) });
  }
  return Response.json({ success: true, count: picked.length, data: picked.map(publicCard) });
}
