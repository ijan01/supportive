import { db } from "./db";
import { Job, JobFilters, CreateJobInput, JobWithApplicationCount } from "./types";

export function getJobs(filters?: JobFilters): Job[] {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.search) {
    conditions.push("(title LIKE ? OR company LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }
  if (filters?.location) {
    conditions.push("location = ?");
    params.push(filters.location);
  }
  if (filters?.category) {
    conditions.push("category = ?");
    params.push(filters.category);
  }
  if (filters?.job_type) {
    conditions.push("job_type = ?");
    params.push(filters.job_type);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `SELECT * FROM jobs ${whereClause} ORDER BY is_featured DESC, created_at DESC`;

  return db().prepare(sql).all(...params) as Job[];
}

export function getJobById(id: number): Job | undefined {
  return db().prepare("SELECT * FROM jobs WHERE id = ?").get(id) as Job | undefined;
}

export function getFeaturedJobs(limit = 6): Job[] {
  return db()
    .prepare("SELECT * FROM jobs WHERE is_featured = 1 ORDER BY created_at DESC LIMIT ?")
    .all(limit) as Job[];
}

export function getJobsByUserId(userId: number): JobWithApplicationCount[] {
  return db()
    .prepare(
      `SELECT j.*, COUNT(a.id) as application_count
       FROM jobs j
       LEFT JOIN applications a ON a.job_id = j.id
       WHERE j.user_id = ?
       GROUP BY j.id
       ORDER BY j.created_at DESC`
    )
    .all(userId) as JobWithApplicationCount[];
}

export function createJob(userId: number, input: CreateJobInput): Job {
  const result = db()
    .prepare(
      `INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      userId,
      input.title,
      input.company,
      input.location,
      input.category,
      input.job_type,
      input.salary_min || null,
      input.salary_max || null,
      input.description,
      input.requirements,
      input.apply_url || null
    );

  return getJobById(Number(result.lastInsertRowid))!;
}

export function updateJob(id: number, userId: number, input: CreateJobInput): Job | null {
  const existing = getJobById(id);
  if (!existing || existing.user_id !== userId) return null;

  db()
    .prepare(
      `UPDATE jobs SET title = ?, company = ?, location = ?, category = ?, job_type = ?,
       salary_min = ?, salary_max = ?, description = ?, requirements = ?, apply_url = ?,
       updated_at = datetime('now')
       WHERE id = ? AND user_id = ?`
    )
    .run(
      input.title,
      input.company,
      input.location,
      input.category,
      input.job_type,
      input.salary_min || null,
      input.salary_max || null,
      input.description,
      input.requirements,
      input.apply_url || null,
      id,
      userId
    );

  return getJobById(id)!;
}

export function deleteJob(id: number, userId: number): boolean {
  const result = db()
    .prepare("DELETE FROM jobs WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return result.changes > 0;
}

export function getRecentJobs(limit = 10): Job[] {
  return db()
    .prepare("SELECT * FROM jobs ORDER BY created_at DESC LIMIT ?")
    .all(limit) as Job[];
}

export function getAllJobIds(): number[] {
  const rows = db().prepare("SELECT id FROM jobs").all() as { id: number }[];
  return rows.map((r) => r.id);
}
