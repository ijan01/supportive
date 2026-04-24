import { sql } from "./db";
import { Job } from "./types";

export async function saveJob(userId: number, jobId: number): Promise<void> {
  await sql`INSERT INTO saved_jobs (user_id, job_id) VALUES (${userId}, ${jobId}) ON CONFLICT (user_id, job_id) DO NOTHING`;
}

export async function unsaveJob(userId: number, jobId: number): Promise<void> {
  await sql`DELETE FROM saved_jobs WHERE user_id = ${userId} AND job_id = ${jobId}`;
}

export async function isJobSaved(userId: number, jobId: number): Promise<boolean> {
  const result = await sql`SELECT id FROM saved_jobs WHERE user_id = ${userId} AND job_id = ${jobId} LIMIT 1`;
  return result.rows.length > 0;
}

export async function getSavedJobs(userId: number): Promise<Job[]> {
  const result = await sql`
    SELECT j.* FROM jobs j
    JOIN saved_jobs sj ON sj.job_id = j.id
    WHERE sj.user_id = ${userId}
    ORDER BY sj.created_at DESC
  `;
  return result.rows as Job[];
}
