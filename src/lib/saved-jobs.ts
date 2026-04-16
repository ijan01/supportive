import { db } from "./db";
import { Job } from "./types";

export function saveJob(userId: number, jobId: number): void {
  db()
    .prepare("INSERT OR IGNORE INTO saved_jobs (user_id, job_id) VALUES (?, ?)")
    .run(userId, jobId);
}

export function unsaveJob(userId: number, jobId: number): void {
  db()
    .prepare("DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?")
    .run(userId, jobId);
}

export function isJobSaved(userId: number, jobId: number): boolean {
  const row = db()
    .prepare("SELECT id FROM saved_jobs WHERE user_id = ? AND job_id = ?")
    .get(userId, jobId);
  return !!row;
}

export function getSavedJobs(userId: number): Job[] {
  return db()
    .prepare(
      `SELECT j.* FROM jobs j
       JOIN saved_jobs sj ON sj.job_id = j.id
       WHERE sj.user_id = ?
       ORDER BY sj.created_at DESC`
    )
    .all(userId) as Job[];
}
