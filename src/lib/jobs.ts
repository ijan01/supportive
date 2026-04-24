import { sql } from "./db";
import { Job, JobFilters, CreateJobInput, JobWithApplicationCount, JobWithEmployer } from "./types";

const PAGE_SIZE = 20;

export async function getJobs(filters?: JobFilters & { benefits?: string[] }): Promise<JobWithEmployer[]> {
  const search = filters?.search ? `%${filters.search}%` : null;
  const location = filters?.location || null;
  const category = filters?.category || null;
  const jobType = filters?.job_type || null;
  const limit = filters?.limit ?? PAGE_SIZE;
  const offset = ((filters?.page ?? 1) - 1) * limit;
  const benefitsFilter = filters?.benefits && filters.benefits.length > 0 ? JSON.stringify(filters.benefits) : null;

  const result = await sql`
    SELECT j.*,
      e.logo_url AS employer_logo_url,
      e.organisation_type AS employer_organisation_type,
      COALESCE(e.benefits, '[]'::jsonb) AS employer_benefits
    FROM jobs j
    LEFT JOIN employers e ON e.id = j.employer_id
    WHERE j.status = 'active'
      AND (${search}::text IS NULL OR j.title ILIKE ${search} OR j.company ILIKE ${search})
      AND (${location}::text IS NULL OR j.location = ${location})
      AND (${category}::text IS NULL OR j.category = ${category})
      AND (${jobType}::text IS NULL OR j.job_type = ${jobType})
      AND (${benefitsFilter}::jsonb IS NULL OR e.benefits @> ${benefitsFilter}::jsonb)
    ORDER BY (CASE j.listing_tier WHEN 'sponsored' THEN 3 WHEN 'premium' THEN 2 ELSE 1 END) DESC, j.is_boosted DESC, j.is_featured DESC, j.posted_date DESC NULLS LAST, j.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return result.rows.map(parseJobWithEmployer);
}

export async function getJobCount(filters?: Omit<JobFilters, "page" | "limit"> & { benefits?: string[] }): Promise<number> {
  const search = filters?.search ? `%${filters.search}%` : null;
  const location = filters?.location || null;
  const category = filters?.category || null;
  const jobType = filters?.job_type || null;
  const benefitsFilter = filters?.benefits && filters.benefits.length > 0 ? JSON.stringify(filters.benefits) : null;

  const result = await sql`
    SELECT COUNT(*)::integer AS count FROM jobs j
    LEFT JOIN employers e ON e.id = j.employer_id
    WHERE j.status = 'active'
      AND (${search}::text IS NULL OR j.title ILIKE ${search} OR j.company ILIKE ${search})
      AND (${location}::text IS NULL OR j.location = ${location})
      AND (${category}::text IS NULL OR j.category = ${category})
      AND (${jobType}::text IS NULL OR j.job_type = ${jobType})
      AND (${benefitsFilter}::jsonb IS NULL OR e.benefits @> ${benefitsFilter}::jsonb)
  `;
  return result.rows[0].count as number;
}

export async function getJobById(id: number): Promise<JobWithEmployer | undefined> {
  const result = await sql`
    SELECT j.*,
      e.logo_url AS employer_logo_url,
      e.organisation_type AS employer_organisation_type,
      COALESCE(e.benefits, '[]'::jsonb) AS employer_benefits
    FROM jobs j
    LEFT JOIN employers e ON e.id = j.employer_id
    WHERE j.id = ${id} AND j.status = 'active'
  `;
  if (!result.rows[0]) return undefined;
  return parseJobWithEmployer(result.rows[0]);
}

export async function getJobByIdAny(id: number): Promise<JobWithEmployer | undefined> {
  const result = await sql`
    SELECT j.*,
      e.logo_url AS employer_logo_url,
      e.organisation_type AS employer_organisation_type,
      COALESCE(e.benefits, '[]'::jsonb) AS employer_benefits
    FROM jobs j
    LEFT JOIN employers e ON e.id = j.employer_id
    WHERE j.id = ${id}
  `;
  if (!result.rows[0]) return undefined;
  return parseJobWithEmployer(result.rows[0]);
}

export async function getFeaturedJobs(limit = 6): Promise<JobWithEmployer[]> {
  const result = await sql`
    SELECT j.*,
      e.logo_url AS employer_logo_url,
      e.organisation_type AS employer_organisation_type,
      COALESCE(e.benefits, '[]'::jsonb) AS employer_benefits
    FROM jobs j
    LEFT JOIN employers e ON e.id = j.employer_id
    WHERE j.status = 'active'
    ORDER BY (CASE j.listing_tier WHEN 'sponsored' THEN 3 WHEN 'premium' THEN 2 ELSE 1 END) DESC, j.is_boosted DESC, j.is_featured DESC, j.posted_date DESC NULLS LAST, j.created_at DESC
    LIMIT ${limit}
  `;
  return result.rows.map(parseJobWithEmployer);
}

export async function getJobsByRoleAndLocation(
  roleName: string,
  locationName: string,
  limit = 20
): Promise<JobWithEmployer[]> {
  const result = await sql`
    SELECT j.*,
      e.logo_url AS employer_logo_url,
      e.organisation_type AS employer_organisation_type,
      COALESCE(e.benefits, '[]'::jsonb) AS employer_benefits
    FROM jobs j
    LEFT JOIN employers e ON e.id = j.employer_id
    WHERE j.status = 'active'
      AND j.category = ${roleName}
      AND j.location = ${locationName}
    ORDER BY (CASE j.listing_tier WHEN 'sponsored' THEN 3 WHEN 'premium' THEN 2 ELSE 1 END) DESC, j.is_boosted DESC, j.posted_date DESC NULLS LAST, j.created_at DESC
    LIMIT ${limit}
  `;
  return result.rows.map(parseJobWithEmployer);
}

export async function getJobsByUserId(userId: number): Promise<JobWithApplicationCount[]> {
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

export async function createJob(userId: number, input: CreateJobInput & { apply_method?: string; listing_tier?: string; stripe_session_id?: string }): Promise<Job> {
  const empResult = await sql`SELECT id, slug FROM employers WHERE user_id = ${userId}`;
  const employerId = empResult.rows[0]?.id as number | undefined ?? null;
  const employerSlug = empResult.rows[0]?.slug as string | undefined ?? null;

  const tier = input.listing_tier || "basic";
  const duration = tier === "sponsored" ? 14 : 28;
  const isBoosted = tier === "sponsored";
  const isFeatured = tier === "premium" || tier === "sponsored" ? 1 : 0;

  const result = await sql`
    INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, apply_method, source, status, employer_name, employer_slug, employer_id, posted_date, valid_through, listing_tier, is_boosted, is_featured, stripe_session_id, boosted_until)
    VALUES (${userId}, ${input.title}, ${input.company}, ${input.location}, ${input.category}, ${input.job_type},
            ${input.salary_min || null}, ${input.salary_max || null}, ${input.description}, ${input.requirements},
            ${input.apply_url || null}, ${input.apply_method || "external"}, 'manual', 'active', ${input.company}, ${employerSlug},
            ${employerId}, NOW(), NOW() + (${duration} || ' days')::interval, ${tier},
            ${isBoosted}, ${isFeatured}, ${input.stripe_session_id || null},
            ${isBoosted ? sql`NOW() + INTERVAL '14 days'` : null})
    RETURNING *
  `;
  return result.rows[0] as Job;
}

export async function updateJob(id: number, userId: number, input: CreateJobInput & { apply_method?: string }): Promise<Job | null> {
  const applyMethod = input.apply_method === "internal" ? "internal" : "external";
  const applyUrl = applyMethod === "internal" ? null : (input.apply_url || null);

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
      apply_url = ${applyUrl},
      apply_method = ${applyMethod},
      employer_name = ${input.company},
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `;
  return (result.rows[0] as Job) || null;
}

export async function deleteJob(id: number, userId: number): Promise<boolean> {
  const result = await sql`DELETE FROM jobs WHERE id = ${id} AND user_id = ${userId}`;
  return (result.rowCount ?? 0) > 0;
}

export async function getRecentJobs(limit = 10): Promise<Job[]> {
  const result = await sql`SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC LIMIT ${limit}`;
  return result.rows as Job[];
}

export async function getAllJobIds(): Promise<Array<{ id: number; updated_at: string }>> {
  const result = await sql`SELECT id, updated_at FROM jobs WHERE status = 'active'`;
  return result.rows as Array<{ id: number; updated_at: string }>;
}

export async function getJobCountByRoleAndLocation(
  roleName: string,
  locationName: string
): Promise<number> {
  const result = await sql`
    SELECT COUNT(*)::integer as count FROM jobs
    WHERE category = ${roleName} AND location = ${locationName} AND status = 'active'
  `;
  return (result.rows[0]?.count as number) ?? 0;
}

export async function duplicateJob(jobId: number, userId: number): Promise<Job | null> {
  const result = await sql`
    INSERT INTO jobs (user_id, title, company, location, category, job_type, salary_min, salary_max,
      description, requirements, apply_url, apply_method, source, status, employer_name, employer_slug,
      employer_id, posted_date, valid_through)
    SELECT user_id, title, company, location, category, job_type, salary_min, salary_max,
      description, requirements, apply_url, apply_method, source, 'active', employer_name, employer_slug,
      employer_id, NOW(), NOW() + INTERVAL '28 days'
    FROM jobs
    WHERE id = ${jobId} AND user_id = ${userId}
    RETURNING *
  `;
  return (result.rows[0] as Job) || null;
}

export async function renewJob(jobId: number, userId: number): Promise<Job | null> {
  const result = await sql`
    UPDATE jobs SET
      status = 'active',
      valid_through = NOW() + INTERVAL '28 days',
      renewal_email_sent_at = NULL,
      updated_at = NOW()
    WHERE id = ${jobId} AND user_id = ${userId}
    RETURNING *
  `;
  return (result.rows[0] as Job) || null;
}

export async function trackJobEvent(jobId: number, eventType: "view" | "apply_click"): Promise<void> {
  await sql`INSERT INTO job_events (job_id, event_type) VALUES (${jobId}, ${eventType})`;
  if (eventType === "view") {
    await sql`UPDATE jobs SET view_count = view_count + 1 WHERE id = ${jobId}`;
  } else {
    await sql`UPDATE jobs SET apply_click_count = apply_click_count + 1 WHERE id = ${jobId}`;
  }
}

function parseJobWithEmployer(row: Record<string, unknown>): JobWithEmployer {
  let benefits: string[] = [];
  const raw = row.employer_benefits;
  if (Array.isArray(raw)) benefits = raw as string[];
  else if (typeof raw === "string") {
    try { benefits = JSON.parse(raw); } catch { /* empty */ }
  }
  return {
    ...(row as unknown as Job),
    employer_logo_url: (row.employer_logo_url as string) ?? null,
    employer_organisation_type: (row.employer_organisation_type as JobWithEmployer["employer_organisation_type"]) ?? null,
    employer_benefits: benefits,
  };
}

export async function getRecentJobsWithEmployer(limit = 10): Promise<JobWithEmployer[]> {
  const result = await sql`
    SELECT j.*,
      e.logo_url AS employer_logo_url,
      e.organisation_type AS employer_organisation_type,
      COALESCE(e.benefits, '[]'::jsonb) AS employer_benefits
    FROM jobs j
    LEFT JOIN employers e ON e.id = j.employer_id
    WHERE j.status = 'active'
    ORDER BY (CASE j.listing_tier WHEN 'sponsored' THEN 3 WHEN 'premium' THEN 2 ELSE 1 END) DESC, j.is_boosted DESC, j.created_at DESC
    LIMIT ${limit}
  `;
  return result.rows.map(parseJobWithEmployer);
}
