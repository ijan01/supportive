import { sql, ensureInitialized } from "@/lib/db";
import { UserRole } from "@/lib/types";

export interface AdminStats {
  totalUsers: number;
  totalJobs: number;
  activeJobs: number;
  pendingReview: number;
  totalApplications: number;
  companiesCount: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  await ensureInitialized();
  const [users, jobs, active, pending, apps, companies] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM users`,
    sql`SELECT COUNT(*)::int AS count FROM jobs`,
    sql`SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'active'`,
    sql`SELECT COUNT(*)::int AS count FROM jobs WHERE status = 'review_queue'`,
    sql`SELECT COUNT(*)::int AS count FROM applications`,
    sql`SELECT COUNT(*)::int AS count FROM users WHERE role = 'company'`,
  ]);
  return {
    totalUsers: users.rows[0].count,
    totalJobs: jobs.rows[0].count,
    activeJobs: active.rows[0].count,
    pendingReview: pending.rows[0].count,
    totalApplications: apps.rows[0].count,
    companiesCount: companies.rows[0].count,
  };
}

export async function getAllUsers() {
  await ensureInitialized();
  const result = await sql`
    SELECT u.id, u.email, u.name, u.role, u.company_name, u.created_at,
      (SELECT COUNT(*)::int FROM jobs WHERE user_id = u.id) AS job_count
    FROM users u
    ORDER BY u.created_at DESC
  `;
  return result.rows as Array<{
    id: number;
    email: string;
    name: string;
    role: UserRole;
    company_name: string | null;
    created_at: string;
    job_count: number;
  }>;
}

export async function updateUserRole(userId: number, role: UserRole): Promise<void> {
  await ensureInitialized();
  await sql`UPDATE users SET role = ${role} WHERE id = ${userId}`;
}

export async function getAllJobsAdmin(filters?: {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  await ensureInitialized();
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 50;
  const offset = (page - 1) * limit;
  const search = filters?.search ? `%${filters.search}%` : null;
  const status = filters?.status || null;
  const source = filters?.source || null;

  const jobsResult = await sql`
    SELECT id, title, company, location, category, job_type, status, source,
      role_slug, role_confidence, created_at, posted_date
    FROM jobs
    WHERE (${status}::text IS NULL OR status = ${status})
      AND (${source}::text IS NULL OR source = ${source})
      AND (${search}::text IS NULL OR title ILIKE ${search} OR company ILIKE ${search})
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const countResult = await sql`
    SELECT COUNT(*)::int AS count FROM jobs
    WHERE (${status}::text IS NULL OR status = ${status})
      AND (${source}::text IS NULL OR source = ${source})
      AND (${search}::text IS NULL OR title ILIKE ${search} OR company ILIKE ${search})
  `;

  return {
    jobs: jobsResult.rows,
    total: countResult.rows[0].count as number,
  };
}

export async function deleteJob(jobId: number): Promise<void> {
  await ensureInitialized();
  await sql`DELETE FROM applications WHERE job_id = ${jobId}`;
  await sql`DELETE FROM saved_jobs WHERE job_id = ${jobId}`;
  await sql`DELETE FROM jobs WHERE id = ${jobId}`;
}

export async function updateJobStatus(jobId: number, status: string): Promise<void> {
  await ensureInitialized();
  await sql`UPDATE jobs SET status = ${status}, updated_at = NOW() WHERE id = ${jobId}`;
}

export async function getCompanies() {
  await ensureInitialized();
  const result = await sql`
    SELECT u.id, u.name, u.email, u.company_name, u.created_at,
      (SELECT COUNT(*)::int FROM jobs WHERE user_id = u.id) AS job_count,
      (SELECT COUNT(*)::int FROM applications a JOIN jobs j ON a.job_id = j.id WHERE j.user_id = u.id) AS application_count
    FROM users u
    WHERE u.role = 'company'
    ORDER BY u.created_at DESC
  `;
  return result.rows as Array<{
    id: number;
    name: string;
    email: string;
    company_name: string | null;
    created_at: string;
    job_count: number;
    application_count: number;
  }>;
}
