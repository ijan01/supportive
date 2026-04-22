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

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
  return result.rows as BlogPost[];
}

export interface BlogPostAdminRow extends BlogPost {
  content_type: string | null;
  target_keyword: string | null;
  target_role: string | null;
  article_number: number | null;
  cp_status: string | null;
}

export async function getBlogPostsAdminPaginated(
  page: number,
  perPage: number
): Promise<{ posts: BlogPostAdminRow[]; total: number }> {
  await ensureInitialized();
  const offset = (page - 1) * perPage;

  const [rowsResult, countResult] = await Promise.all([
    sql`
      SELECT
        bp.*,
        cp.content_type,
        cp.target_keyword,
        cp.target_role,
        cp.article_number,
        cp.status AS cp_status
      FROM blog_posts bp
      LEFT JOIN content_plan cp ON cp.slug = bp.slug
      ORDER BY bp.created_at DESC
      LIMIT ${perPage} OFFSET ${offset}
    `,
    sql`SELECT COUNT(*)::int AS total FROM blog_posts`,
  ]);

  return {
    posts: rowsResult.rows as BlogPostAdminRow[],
    total: countResult.rows[0].total as number,
  };
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
  return result.rows[0] as BlogPost | undefined;
}

export async function getBlogPostBySlugAdmin(slug: string): Promise<BlogPost | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM blog_posts WHERE slug = ${slug}`;
  return result.rows[0] as BlogPost | undefined;
}

export async function createBlogPost(post: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  primary_keyword?: string | null;
  secondary_keywords?: string | null;
}): Promise<BlogPost> {
  await ensureInitialized();
  const publishedAt = post.published ? new Date().toISOString() : null;
  const result = await sql`
    INSERT INTO blog_posts (title, slug, content, excerpt, author, primary_keyword, secondary_keywords, published_at)
    VALUES (${post.title}, ${post.slug}, ${post.content}, ${post.excerpt}, ${post.author},
            ${post.primary_keyword || null}, ${post.secondary_keywords || null}, ${publishedAt})
    RETURNING *
  `;
  return result.rows[0] as BlogPost;
}

export async function updateBlogPost(id: number, post: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  primary_keyword?: string | null;
  secondary_keywords?: string | null;
}): Promise<BlogPost> {
  await ensureInitialized();
  const existing = await getBlogPostById(id);
  let publishedAt: string | null = null;
  if (post.published) {
    publishedAt = existing?.published_at || new Date().toISOString();
  }
  const result = await sql`
    UPDATE blog_posts SET
      title = ${post.title},
      slug = ${post.slug},
      content = ${post.content},
      excerpt = ${post.excerpt},
      author = ${post.author},
      primary_keyword = ${post.primary_keyword ?? existing?.primary_keyword ?? null},
      secondary_keywords = ${post.secondary_keywords ?? existing?.secondary_keywords ?? null},
      published_at = ${publishedAt}
    WHERE id = ${id}
    RETURNING *
  `;
  return result.rows[0] as BlogPost;
}

export async function deleteBlogPost(id: number): Promise<void> {
  await ensureInitialized();
  await sql`DELETE FROM blog_posts WHERE id = ${id}`;
}
