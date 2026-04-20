import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { ingestAdzuna } from "@/lib/feeds/ingest";
import { ADZUNA_QUERIES } from "@/lib/feeds/queries";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dry") === "1";

  try {
    const stats = await ingestAdzuna({
      dryRun,
      queries: ADZUNA_QUERIES,
    });

    return NextResponse.json({ ok: true, dryRun, stats });
  } catch (err) {
    console.error("[admin/ingest] failed:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
