import { sync } from "@/lib/scraper";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req) {
  const source = req.headers.get("x-vercel-cron") ? "cron" : "manual";
  const result = await sync({ source, maxMs: 50000 });
  if (result.ok) {
    return Response.json({ success: true, data: result });
  }
  if (result.reason === "already_running") {
    return Response.json({ success: false, data: result }, { status: 202 });
  }
  return Response.json({ success: false, data: result }, { status: 500 });
}
