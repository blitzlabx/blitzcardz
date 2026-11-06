import { syncStatus } from "@/lib/db";
import { relTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const withHistory = searchParams.get("history") === "1";
  const s = syncStatus();

  const data = {
    status: s.running ? "syncing" : "idle",
    totalCards: s.totalCards,
    dataSource: s.source,
    interval: "hourly",
    lastSync: s.lastSync ? new Date(s.lastSync).toISOString() : null,
    lastSyncAgo: s.lastSync ? relTime(s.lastSync) : null,
    lastRun: s.lastRun
  };

  if (withHistory) {
    data.historyCount = s.history.length;
    data.history = s.history;
  }

  return Response.json({ success: true, data });
}
