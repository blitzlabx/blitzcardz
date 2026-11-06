import { collectionStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = collectionStats();
  return Response.json({
    success: true,
    data: {
      ...s,
      lastSync: s.lastSync ? new Date(s.lastSync).toISOString() : null
    }
  });
}
