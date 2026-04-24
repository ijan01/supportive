import { NextRequest, NextResponse } from "next/server";
import { ingestAdzuna } from "@/lib/feeds/ingest";
import { ADZUNA_QUERIES } from "@/lib/feeds/queries";
import { requireCronAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const authError = requireCronAuth(request);
  if (authError) return authError;

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
