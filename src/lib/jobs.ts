import { sql, ensureInitialized } from "./db";
import { Job, JobFilters, CreateJobInput, JobWithApplicationCount } from "./types";

const PAGE_SIZE = 20;

export async function getJobs(filters?: JobFilters): Promise<Job[]> {
  await ensureInitialized();
  const search = filters?.search ? `%${filters.search}%` : null;
  const location = filters?.location || null;
  const category = filters?.category || null;
  const jobType = filters?.job_type || null;
  const limit = filters?.limit ?? PAGE_SIZE;
  const offset = ((filters?.page ?? 1) - 1) * limit;

  const result = await sql`
    SELECT * FROM jobs
    WHERE status = 'active'
      AND (${search}::text IS NULL OR title ILIKE ${search} OR company ILIKE ${search})
      AND (${location}::text IS NULL OR location = ${location})
      AND (${category}::text IS NULL OR category = ${category})
      AND (${jobType}::text IS NULL OR job_type = ${jobType})
    ORDER BY is_featured DESC, posted_date DESC NULLS LAST, created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return result.rows as Job[];
}

export async function getJobCount(filters?: Omit<JobFilters, "page" | "limit">): Promise<number> {
  await ensureInitialized();
  const search = filters?.search ? `%${filters.search}%` : null;
  const location = filters?.location || null;
  const category = filters?.category || null;
  const jobType = filters?.job_type || null;

  const result = await sql`
    SELECT COUNT(*)::integer AS count FROM jobs
    WHERE status = 'active'
      AND (${search}::text IS NULL OR title ILIKE ${search} OR company ILIKE ${search})
      AND (${location}::text IS NULL OR location = ${location})
      AND (${category}::text IS NULL OR category = ${category})
      AND (${jobType}::text IS NULL OR job_type = ${jobType})
  `;
  return result.rows[0].count as number;
}

export async function getJobById(id: number): Promise<Job | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM jobs WHERE id = ${id} AND status = 'active'`;
  return result.rows[0] as Job | undefined;
}

export async function getFeaturedJobs(limit = 6): Promise<Job[]> {
  await ensureInitialized();
  const result = await sql`
    SELECT * FROM jobs WHERE status = 'active'
    ORDER BY is_featured DESC, posted_date DESC NULLS LAST, created_at DESC
    LIMIT ${limit}
  `;
  return result.rows as Job[];
}

export async function getJobsByRoleAndLocation(
  roleName: string,
  locationName: string,
  limit = 20
): Promise<Job[]> {
  await ensureInitialized();
  const result = await sql`
    SELECT * FROM jobs
    WHERE status = 'active'
      AND category = ${roleName}
      AND location = ${locationName}
    ORDER BY posted_date DESC NULLS LAST, created_at DESC
    LIMIT ${limit}
  `;
  return result.rows as Job[];
}

export async function getJobsByUserId(userId: number): Promise<JobWithApplicationCount[]> {
  await ensureInitialized();
  const result = await sql`
    SELECT j.*, COALESCE(COUNT(a.id), 0)::integer as application_count
    FROM jobs j
    LEFT JOIN applications a ON a.job_id = j.id
    WHERE j.user_id = ${userId}
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `;
  return result.rows as JobWithApplicationCount[];
}

export async function createJob(userId: number, input: CreateJobInput): Promise<Job> {
  await ensureInitialized();
  const result = await sql`
    INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, source, status, employer_name, posted_date, valid_through)
    VALUES (${userId}, ${input.title}, ${input.company}, ${input.location}, ${input.category}, ${input.job_type},
            ${input.salary_min || null}, ${input.salary_max || null}, ${input.description}, ${input.requirements},
            ${input.apply_url || null}, 'manual', 'active', ${input.company}, NOW(), NOW() + INTERVAL '30 days')
    RETURNING *
  `;
  return result.rows[0] as Job;
}

export async function updateJob(id: number, userId: number, input: CreateJobInput): Promise<Job | null> {
  await ensureInitialized();
  const result = await sql`
    UPDATE jobs SET
      title = ${input.title},
      company = ${input.company},
      location = ${input.location},
      category = ${input.category},
      job_type = ${input.job_type},
      salary_min = ${input.salary_min || null},
      salary_max = ${input.salary_max || null},
      description = ${input.description},
      requirements = ${input.requirements},
      apply_url = ${input.apply_url || null},
      employer_name = ${input.company},
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `;
  return (result.rows[0] as Job) || null;
}

export async function deleteJob(id: number, userId: number): Promise<boolean> {
  await ensureInitialized();
  const result = await sql`DELETE FROM jobs WHERE id = ${id} AND user_id = ${userId}`;
  return (result.rowCount ?? 0) > 0;
}

export async function getRecentJobs(limit = 10): Promise<Job[]> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC LIMIT ${limit}`;
  return result.rows as Job[];
}

export async function getAllJobIds(): Promise<number[]> {
  await ensureInitialized();
  const result = await sql`SELECT id FROM jobs WHERE status = 'active'`;
  return result.rows.map((r) => r.id as number);
}

export async function getJobCountByRoleAndLocation(
  roleName: string,
  locationName: string
): Promise<number> {
  await ensureInitialized();
  const result = await sql`
    SELECT COUNT(*)::integer as count FROM jobs
    WHERE category = ${roleName} AND location = ${locationName} AND status = 'active'
  `;
  return (result.rows[0]?.count as number) ?? 0;
}
