import { db } from "./db";
import { BlogPost } from "./types";

export function getBlogPosts(): BlogPost[] {
  return db()
    .prepare("SELECT * FROM blog_posts WHERE published_at IS NOT NULL ORDER BY published_at DESC")
    .all() as BlogPost[];
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return db()
    .prepare("SELECT * FROM blog_posts WHERE slug = ? AND published_at IS NOT NULL")
    .get(slug) as BlogPost | undefined;
}

export function getAllBlogSlugs(): string[] {
  const rows = db()
    .prepare("SELECT slug FROM blog_posts WHERE published_at IS NOT NULL")
    .all() as { slug: string }[];
  return rows.map((r) => r.slug);
}
