import { sql, ensureInitialized } from "./db";
import { Application, ApplicationWithJob } from "./types";

export async function createApplication(
  jobId: number,
  userId: number,
  name: string,
  email: string,
  resumeUrl?: string,
  coverLetter?: string,
  phone?: string,
  ahpraNumber?: string
): Promise<Application> {
  await ensureInitialized();
  const result = await sql`
    INSERT INTO applications (job_id, user_id, name, email, resume_url, cover_letter, phone, ahpra_number)
    VALUES (${jobId}, ${userId}, ${name}, ${email}, ${resumeUrl || null}, ${coverLetter || null}, ${phone || null}, ${ahpraNumber || null})
    RETURNING *
  `;
  return result.rows[0] as Application;
}

export async function getApplicationsByUserId(userId: number): Promise<ApplicationWithJob[]> {
  await ensureInitialized();
  const result = await sql`
    SELECT a.*, j.title as job_title, j.company as job_company
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE a.user_id = ${userId}
    ORDER BY a.created_at DESC
  `;
  return result.rows as ApplicationWithJob[];
}

export async function getApplicationsByJobId(jobId: number): Promise<Application[]> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM applications WHERE job_id = ${jobId} ORDER BY created_at DESC`;
  return result.rows as Application[];
}

export async function hasUserApplied(userId: number, jobId: number): Promise<boolean> {
  await ensureInitialized();
  const result = await sql`SELECT id FROM applications WHERE user_id = ${userId} AND job_id = ${jobId} LIMIT 1`;
  return result.rows.length > 0;
}
