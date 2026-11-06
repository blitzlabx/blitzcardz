import { API_INFO, ENDPOINT_DIR } from "@/lib/endpoints";
import { load } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  const s = load();
  return Response.json({
    name: API_INFO.name,
    version: API_INFO.version,
    description: API_INFO.description,
    author: API_INFO.author,
    cards: s.cards.length,
    series: s.series.size,
    endpoints: ENDPOINT_DIR
  });
}
