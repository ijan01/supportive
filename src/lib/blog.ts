import { sql, ensureInitialized } from "./db";
import { BlogPost } from "./types";

export async function getBlogPosts(): Promise<BlogPost[]> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM blog_posts WHERE published_at IS NOT NULL ORDER BY published_at DESC`;
  return result.rows as BlogPost[];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} AND published_at IS NOT NULL`;
  return result.rows[0] as BlogPost | undefined;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  await ensureInitialized();
  const result = await sql`SELECT slug FROM blog_posts WHERE published_at IS NOT NULL`;
  return result.rows.map((r) => r.slug as string);
}
