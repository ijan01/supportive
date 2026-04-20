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

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  await ensureInitialized();
  const result = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
  return result.rows[0] as BlogPost | undefined;
}

export async function createBlogPost(post: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
}): Promise<BlogPost> {
  await ensureInitialized();
  const publishedAt = post.published ? new Date().toISOString() : null;
  const result = await sql`
    INSERT INTO blog_posts (title, slug, content, excerpt, author, published_at)
    VALUES (${post.title}, ${post.slug}, ${post.content}, ${post.excerpt}, ${post.author}, ${publishedAt})
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
