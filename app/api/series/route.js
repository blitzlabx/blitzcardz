import { seriesList } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const detailed = searchParams.get("detailed") === "1";
  const data = seriesList(detailed);
  return Response.json({ success: true, count: data.length, data });
}
