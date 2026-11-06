import { latestCards } from "@/lib/db";
import { publicCard } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit"), 10) || 50));
  const cards = latestCards(limit).map(publicCard);
  return Response.json({ success: true, count: cards.length, data: cards });
}
