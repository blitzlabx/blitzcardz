import { syncStatus } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit"), 10) || 10));
  const s = syncStatus();
  const data = (s.history || []).slice(0, limit);
  return Response.json({ success: true, count: data.length, data });
}
