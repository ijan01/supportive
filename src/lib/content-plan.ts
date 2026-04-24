import { sql } from "./db";

export interface ContentPlanItem {
  id: number;
  article_number: number;
  title: string;
  slug: string | null;
  content_type: "PILLAR" | "CLUSTER" | "CONVERSION";
  target_keyword: string | null;
  secondary_keywords: string | null;
  target_role: string | null;
  pillar_parent_id: number | null;
  status: "Planned" | "Brief Ready" | "Draft" | "In Review" | "Published";
  target_word_count_min: number | null;
  target_word_count_max: number | null;
  target_publish_date: string | null;
  published_url: string | null;
  published_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAllContentPlanItems(): Promise<ContentPlanItem[]> {
  const result = await sql`SELECT * FROM content_plan ORDER BY article_number ASC`;
  return result.rows as ContentPlanItem[];
}

export async function getContentPlanItem(id: number): Promise<ContentPlanItem | undefined> {
  const result = await sql`SELECT * FROM content_plan WHERE id = ${id}`;
  return result.rows[0] as ContentPlanItem | undefined;
}

export async function createContentPlanItem(item: {
  article_number: number;
  title: string;
  slug?: string;
  content_type: string;
  target_keyword?: string;
  secondary_keywords?: string;
  target_role?: string;
  pillar_parent_id?: number;
  status?: string;
  target_word_count_min?: number;
  target_word_count_max?: number;
  target_publish_date?: string;
  published_url?: string;
  notes?: string;
}): Promise<ContentPlanItem> {
  const result = await sql`
    INSERT INTO content_plan (
      article_number, title, slug, content_type, target_keyword, secondary_keywords,
      target_role, pillar_parent_id, status, target_word_count_min, target_word_count_max,
      target_publish_date, published_url, notes
    ) VALUES (
      ${item.article_number}, ${item.title}, ${item.slug || null}, ${item.content_type},
      ${item.target_keyword || null}, ${item.secondary_keywords || null},
      ${item.target_role || null}, ${item.pillar_parent_id || null},
      ${item.status || "Planned"}, ${item.target_word_count_min || null},
      ${item.target_word_count_max || null}, ${item.target_publish_date || null},
      ${item.published_url || null}, ${item.notes || null}
    ) RETURNING *
  `;
  return result.rows[0] as ContentPlanItem;
}

export async function updateContentPlanItem(id: number, item: {
  title?: string;
  slug?: string;
  content_type?: string;
  target_keyword?: string;
  secondary_keywords?: string;
  target_role?: string;
  pillar_parent_id?: number | null;
  status?: string;
  target_word_count_min?: number | null;
  target_word_count_max?: number | null;
  target_publish_date?: string | null;
  published_url?: string | null;
  published_at?: string | null;
  notes?: string | null;
}): Promise<ContentPlanItem> {
  const result = await sql`
    UPDATE content_plan SET
      title = COALESCE(${item.title ?? null}, title),
      slug = ${item.slug ?? null},
      content_type = COALESCE(${item.content_type ?? null}, content_type),
      target_keyword = ${item.target_keyword ?? null},
      secondary_keywords = ${item.secondary_keywords ?? null},
      target_role = ${item.target_role ?? null},
      pillar_parent_id = ${item.pillar_parent_id ?? null},
      status = COALESCE(${item.status ?? null}, status),
      target_word_count_min = ${item.target_word_count_min ?? null},
      target_word_count_max = ${item.target_word_count_max ?? null},
      target_publish_date = ${item.target_publish_date ?? null},
      published_url = ${item.published_url ?? null},
      published_at = ${item.published_at ?? null},
      notes = ${item.notes ?? null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result.rows[0] as ContentPlanItem;
}

export async function deleteContentPlanItem(id: number): Promise<void> {
  await sql`DELETE FROM content_plan WHERE id = ${id}`;
}

export async function getContentPlanStats(): Promise<Record<string, number>> {
  const result = await sql`
    SELECT status, COUNT(*)::int AS count FROM content_plan GROUP BY status
  `;
  const stats: Record<string, number> = { Planned: 0, "Brief Ready": 0, Draft: 0, "In Review": 0, Published: 0 };
  for (const row of result.rows) {
    stats[row.status as string] = row.count as number;
  }
  return stats;
}
