import { sql, ensureInitialized } from "./db";
import { Employer, EmployerWithJobCount } from "./types";

export async function getEmployerByUserId(userId: number): Promise<Employer | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM employers WHERE user_id = ${userId}`;
  if (!result.rows[0]) return undefined;
  return parseEmployerRow(result.rows[0] as Record<string, unknown>);
}

export async function getEmployerBySlug(slug: string): Promise<Employer | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM employers WHERE slug = ${slug}`;
  if (!result.rows[0]) return undefined;
  return parseEmployerRow(result.rows[0] as Record<string, unknown>);
}

export async function getEmployerById(id: number): Promise<Employer | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM employers WHERE id = ${id}`;
  if (!result.rows[0]) return undefined;
  return parseEmployerRow(result.rows[0] as Record<string, unknown>);
}

export async function upsertEmployer(
  userId: number,
  data: {
    name: string;
    slug?: string;
    logo_url?: string | null;
    website?: string | null;
    description?: string | null;
    why_work_with_us?: string | null;
    organisation_type?: string | null;
    benefits?: string[];
  }
): Promise<Employer> {
  await ensureInitialized();

  const slug =
    data.slug ||
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const benefitsJson = JSON.stringify(data.benefits || []);

  const existing = await getEmployerByUserId(userId);
  let result;

  if (existing) {
    result = await sql`
      UPDATE employers SET
        name = ${data.name},
        logo_url = COALESCE(${data.logo_url ?? null}, logo_url),
        website = ${data.website ?? null},
        description = ${data.description ?? null},
        why_work_with_us = ${data.why_work_with_us ?? null},
        organisation_type = ${data.organisation_type ?? null},
        benefits = ${benefitsJson}::jsonb,
        updated_at = NOW()
      WHERE user_id = ${userId}
      RETURNING *
    `;
  } else {
    result = await sql`
      INSERT INTO employers (user_id, name, slug, logo_url, website, description, why_work_with_us, organisation_type, benefits)
      VALUES (${userId}, ${data.name}, ${slug}, ${data.logo_url ?? null}, ${data.website ?? null},
              ${data.description ?? null}, ${data.why_work_with_us ?? null},
              ${data.organisation_type ?? null}, ${benefitsJson}::jsonb)
      RETURNING *
    `;
  }

  const row = result.rows[0] as Omit<Employer, "benefits"> & { benefits: string | string[] };
  return { ...row, benefits: parseBenefits(row.benefits) };
}

export async function updateEmployerLogo(userId: number, logoUrl: string): Promise<void> {
  await ensureInitialized();
  await sql`UPDATE employers SET logo_url = ${logoUrl}, updated_at = NOW() WHERE user_id = ${userId}`;
}

export async function getAllEmployers(): Promise<Employer[]> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM employers ORDER BY name ASC`;
  return result.rows.map(parseEmployerRow);
}

export async function getDirectoryEmployers(): Promise<EmployerWithJobCount[]> {
  await ensureInitialized();
  const result = await sql`
    SELECT e.*,
      COALESCE(j.cnt, 0)::integer AS active_job_count
    FROM employers e
    LEFT JOIN (
      SELECT employer_id, COUNT(*)::integer AS cnt FROM jobs
      WHERE status = 'active' GROUP BY employer_id
    ) j ON j.employer_id = e.id
    WHERE e.directory_visible = TRUE
    ORDER BY
      (e.featured = TRUE AND (e.featured_until IS NULL OR e.featured_until > NOW())) DESC,
      COALESCE(j.cnt, 0) DESC,
      e.name ASC
  `;
  return result.rows.map((row) => {
    const e = parseEmployerRow(row);
    return { ...e, active_job_count: (row as Record<string, unknown>).active_job_count as number };
  });
}

export async function getFeaturedEmployers(limit = 8): Promise<EmployerWithJobCount[]> {
  await ensureInitialized();
  const result = await sql`
    SELECT e.*,
      COALESCE(j.cnt, 0)::integer AS active_job_count
    FROM employers e
    LEFT JOIN (
      SELECT employer_id, COUNT(*)::integer AS cnt FROM jobs
      WHERE status = 'active' GROUP BY employer_id
    ) j ON j.employer_id = e.id
    WHERE e.featured = TRUE
      AND e.directory_visible = TRUE
      AND (e.featured_until IS NULL OR e.featured_until > NOW())
    ORDER BY COALESCE(j.cnt, 0) DESC, e.name ASC
    LIMIT ${limit}
  `;
  return result.rows.map((row) => {
    const e = parseEmployerRow(row);
    return { ...e, active_job_count: (row as Record<string, unknown>).active_job_count as number };
  });
}

export async function getAllEmployersAdmin(): Promise<EmployerWithJobCount[]> {
  await ensureInitialized();
  const result = await sql`
    SELECT e.*,
      COALESCE(j.cnt, 0)::integer AS active_job_count
    FROM employers e
    LEFT JOIN (
      SELECT employer_id, COUNT(*)::integer AS cnt FROM jobs
      WHERE status = 'active' GROUP BY employer_id
    ) j ON j.employer_id = e.id
    ORDER BY e.name ASC
  `;
  return result.rows.map((row) => {
    const e = parseEmployerRow(row);
    return { ...e, active_job_count: (row as Record<string, unknown>).active_job_count as number };
  });
}

export async function toggleFeatured(employerId: number, featured: boolean, days?: number): Promise<void> {
  await ensureInitialized();
  if (featured && days) {
    await sql`
      UPDATE employers SET
        featured = TRUE,
        featured_until = NOW() + (${days} || ' days')::interval,
        updated_at = NOW()
      WHERE id = ${employerId}
    `;
  } else if (featured) {
    await sql`UPDATE employers SET featured = TRUE, updated_at = NOW() WHERE id = ${employerId}`;
  } else {
    await sql`UPDATE employers SET featured = FALSE, featured_until = NULL, updated_at = NOW() WHERE id = ${employerId}`;
  }
}

function parseEmployerRow(row: Record<string, unknown>): Employer {
  const r = row as Omit<Employer, "benefits"> & { benefits: string | string[] };
  return { ...r, benefits: parseBenefits(r.benefits) };
}

function parseBenefits(raw: string | string[] | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}
