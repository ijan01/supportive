import { sql } from "./db";
import { SavedSearch } from "./types";

export async function getSavedSearches(userId: number): Promise<SavedSearch[]> {
  const result = await sql`
    SELECT * FROM saved_searches WHERE user_id = ${userId} ORDER BY created_at DESC
  `;
  return result.rows as SavedSearch[];
}

export async function createSavedSearch(
  userId: number,
  data: { name: string; search?: string; location?: string; category?: string; job_type?: string }
): Promise<SavedSearch> {
  const result = await sql`
    INSERT INTO saved_searches (user_id, name, search, location, category, job_type)
    VALUES (${userId}, ${data.name}, ${data.search || null}, ${data.location || null}, ${data.category || null}, ${data.job_type || null})
    RETURNING *
  `;
  return result.rows[0] as SavedSearch;
}

export async function deleteSavedSearch(id: number, userId: number): Promise<void> {
  await sql`DELETE FROM saved_searches WHERE id = ${id} AND user_id = ${userId}`;
}

export async function getAllSavedSearches(): Promise<(SavedSearch & { email: string; user_name: string })[]> {
  const result = await sql`
    SELECT ss.*, u.email, u.name AS user_name
    FROM saved_searches ss
    JOIN users u ON ss.user_id = u.id
    ORDER BY ss.id
  `;
  return result.rows as (SavedSearch & { email: string; user_name: string })[];
}
