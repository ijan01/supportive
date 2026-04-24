import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAllSavedSearches } from "@/lib/saved-searches";
import { sendJobAlertEmail } from "@/lib/email";
import { requireCronAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authError = requireCronAuth(request);
  if (authError) return authError;

  const searches = await getAllSavedSearches();
  let emailsSent = 0;

  for (const saved of searches) {
    const searchParam = saved.search ? `%${saved.search}%` : null;
    const result = await sql`
      SELECT id, title, company, location FROM jobs
      WHERE status = 'active'
        AND created_at >= NOW() - INTERVAL '7 days'
        AND (${searchParam}::text IS NULL OR title ILIKE ${searchParam} OR company ILIKE ${searchParam})
        AND (${saved.location}::text IS NULL OR location = ${saved.location})
        AND (${saved.category}::text IS NULL OR category = ${saved.category})
        AND (${saved.job_type}::text IS NULL OR job_type = ${saved.job_type})
      ORDER BY created_at DESC
      LIMIT 10
    `;

    if (result.rows.length > 0) {
      try {
        await sendJobAlertEmail({
          to: saved.email,
          userName: saved.user_name,
          searchName: saved.name,
          jobs: result.rows as Array<{ id: number; title: string; company: string; location: string }>,
        });
        emailsSent++;
      } catch (err) {
        console.error(`[job-alerts] failed to email ${saved.email}:`, err);
      }
    }
  }

  return NextResponse.json({ ok: true, searchesChecked: searches.length, emailsSent });
}
