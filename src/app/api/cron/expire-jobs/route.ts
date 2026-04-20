import { NextRequest, NextResponse } from "next/server";
import { sql, ensureInitialized } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  await ensureInitialized();

  const result = await sql`
    UPDATE jobs SET status = 'expired', updated_at = NOW()
    WHERE status = 'active'
      AND valid_through IS NOT NULL
      AND valid_through < NOW()
  `;

  console.log(`[cron/expire-jobs] expired ${result.rowCount} jobs`);

  return NextResponse.json({ ok: true, expired: result.rowCount });
}
