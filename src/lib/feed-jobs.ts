import { sql } from "./db";
import { Job, JobStatus, FeedRun } from "./types";
import { MH_ROLES } from "@/constants";

export async function getJobsByStatus(status: JobStatus, limit = 200): Promise<Job[]> {
  const result = await sql`
    SELECT * FROM jobs WHERE status = ${status} ORDER BY created_at DESC LIMIT ${limit}
  `;
  return result.rows as Job[];
}

export async function countJobsByStatus(status: JobStatus): Promise<number> {
  const result = await sql`SELECT COUNT(*)::int AS count FROM jobs WHERE status = ${status}`;
  return result.rows[0].count as number;
}

export async function expireStaleQueueJobs(): Promise<number> {
  const result = await sql`
    UPDATE jobs SET status = 'expired', updated_at = NOW()
    WHERE status = 'review_queue'
      AND valid_through IS NOT NULL
      AND valid_through < NOW()
  `;
  return result.rowCount ?? 0;
}

export async function updateJobStatus(id: number, status: JobStatus): Promise<void> {
  await sql`UPDATE jobs SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
}

export async function remapJobRole(id: number, roleSlug: string): Promise<void> {
  const role = MH_ROLES.find((r) => r.slug === roleSlug);
  if (!role) throw new Error(`Unknown role slug: ${roleSlug}`);
  await sql`
    UPDATE jobs SET
      role_slug = ${roleSlug},
      category = ${role.name},
      role_confidence = ${1.0},
      status = 'active',
      updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function getRecentFeedRuns(limit = 30): Promise<FeedRun[]> {
  const result = await sql`
    SELECT * FROM feed_runs ORDER BY started_at DESC LIMIT ${limit}
  `;
  return result.rows as FeedRun[];
}
