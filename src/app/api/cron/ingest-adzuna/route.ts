import { NextRequest, NextResponse } from "next/server";
import { ingestAdzuna } from "@/lib/feeds/ingest";
import { ADZUNA_QUERIES } from "@/lib/feeds/queries";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dry") === "1";

  try {
    const stats = await ingestAdzuna({
      dryRun,
      queries: ADZUNA_QUERIES,
    });

    return NextResponse.json({
      ok: true,
      dryRun,
      stats,
    });
  } catch (err) {
    console.error("[cron/ingest-adzuna] failed:", err);
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}
