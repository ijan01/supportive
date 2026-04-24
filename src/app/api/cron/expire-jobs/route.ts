import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireCronAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authError = requireCronAuth(request);
  if (authError) return authError;

  // 1. Expire listings past their valid_through date
  const expiredResult = await sql`
    UPDATE jobs SET status = 'expired', is_boosted = FALSE, updated_at = NOW()
    WHERE status = 'active'
      AND valid_through IS NOT NULL
      AND valid_through < NOW()
  `;

  // 2. Expire boosts past their expiry
  const boostExpired = await sql`
    UPDATE boosts SET status = 'expired'
    WHERE status = 'active'
      AND expires_at IS NOT NULL
      AND expires_at < NOW()
  `;

  // 2b. Expire featured employer subscriptions past their featured_until
  const featuredExpired = await sql`
    UPDATE employers SET featured = FALSE, updated_at = NOW()
    WHERE featured = TRUE
      AND featured_until IS NOT NULL
      AND featured_until < NOW()
  `;

  // 3. Clear boost flags on jobs whose boost expired
  await sql`
    UPDATE jobs SET is_boosted = FALSE, boosted_until = NULL, updated_at = NOW()
    WHERE is_boosted = TRUE
      AND boosted_until IS NOT NULL
      AND boosted_until < NOW()
  `;

  // 4. Send 7-day expiry warning emails
  const warningJobs = await sql`
    SELECT j.id, j.title, j.user_id, j.view_count, j.apply_click_count, u.email, u.name
    FROM jobs j
    JOIN users u ON u.id = j.user_id
    WHERE j.status = 'active'
      AND j.valid_through IS NOT NULL
      AND j.valid_through BETWEEN NOW() AND NOW() + INTERVAL '7 days'
      AND j.renewal_email_sent_at IS NULL
      AND j.source = 'manual'
  `;

  let emailsSent = 0;
  for (const row of warningJobs.rows) {
    const job = row as { id: number; title: string; user_id: number; view_count: number; apply_click_count: number; email: string; name: string };
    try {
      const { sendExpiryWarningEmail } = await import("@/lib/email");
      await sendExpiryWarningEmail(job.email, job.name, job.title, job.id, job.view_count, job.apply_click_count);
      await sql`UPDATE jobs SET renewal_email_sent_at = NOW() WHERE id = ${job.id}`;
      emailsSent++;
    } catch (err) {
      console.error(`[cron/expire-jobs] Failed to send warning for job ${job.id}:`, err);
    }
  }

  // 5. Send expiry notification emails (for jobs just expired in step 1)
  if ((expiredResult.rowCount ?? 0) > 0) {
    const justExpired = await sql`
      SELECT j.id, j.title, j.user_id, u.email, u.name
      FROM jobs j
      JOIN users u ON u.id = j.user_id
      WHERE j.status = 'expired'
        AND j.updated_at > NOW() - INTERVAL '5 minutes'
        AND j.source = 'manual'
    `;

    for (const row of justExpired.rows) {
      const job = row as { id: number; title: string; user_id: number; email: string; name: string };
      try {
        const { sendExpiryNotificationEmail } = await import("@/lib/email");
        await sendExpiryNotificationEmail(job.email, job.name, job.title, job.id);
      } catch (err) {
        console.error(`[cron/expire-jobs] Failed to send expiry notification for job ${job.id}:`, err);
      }
    }
  }

  console.log(`[cron/expire-jobs] expired ${expiredResult.rowCount} jobs, ${boostExpired.rowCount} boosts, ${featuredExpired.rowCount} featured, sent ${emailsSent} warning emails`);

  return NextResponse.json({
    ok: true,
    expired: expiredResult.rowCount,
    boostsExpired: boostExpired.rowCount,
    featuredExpired: featuredExpired.rowCount,
    warningEmailsSent: emailsSent,
  });
}
