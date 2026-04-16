import { db } from "./db";
import { Application, ApplicationWithJob } from "./types";

export function createApplication(
  jobId: number,
  userId: number,
  name: string,
  email: string,
  resumeUrl?: string,
  coverLetter?: string
): Application {
  const result = db()
    .prepare(
      `INSERT INTO applications (job_id, user_id, name, email, resume_url, cover_letter)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(jobId, userId, name, email, resumeUrl || null, coverLetter || null);

  return db()
    .prepare("SELECT * FROM applications WHERE id = ?")
    .get(Number(result.lastInsertRowid)) as Application;
}

export function getApplicationsByUserId(userId: number): ApplicationWithJob[] {
  return db()
    .prepare(
      `SELECT a.*, j.title as job_title, j.company as job_company
       FROM applications a
       JOIN jobs j ON j.id = a.job_id
       WHERE a.user_id = ?
       ORDER BY a.created_at DESC`
    )
    .all(userId) as ApplicationWithJob[];
}

export function getApplicationsByJobId(jobId: number): Application[] {
  return db()
    .prepare("SELECT * FROM applications WHERE job_id = ? ORDER BY created_at DESC")
    .all(jobId) as Application[];
}

export function hasUserApplied(userId: number, jobId: number): boolean {
  const row = db()
    .prepare("SELECT id FROM applications WHERE user_id = ? AND job_id = ?")
    .get(userId, jobId);
  return !!row;
}
