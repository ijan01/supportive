import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { sql } from "@/lib/db";
import { SITE_URL } from "@/lib/config";

// Full metadata for every blog post that exists in the DB.
// Each entry either matches an existing content_plan row (by article_number)
// or creates a new one if no content_plan row has that slug yet.
const BLOG_POST_METADATA = [
  {
    slug: "how-to-become-psychologist-australia",
    article_number: 2,
    title: "How to Become a Psychologist in Australia",
    content_type: "PILLAR",
    target_role: "psychologist",
    target_keyword: "how to become a psychologist in Australia",
    secondary_keywords: "psychologist registration Australia, AHPRA psychologist, psychology degree Australia",
    target_word_count_min: 2000,
    target_word_count_max: 4000,
  },
  {
    slug: "what-is-peer-support-worker-australia",
    article_number: 44,
    title: "What is a Peer Support Worker? A Guide to Peer Work in Australia",
    content_type: "CLUSTER",
    target_role: "peer-support-worker",
    target_keyword: "what is a peer support worker",
    secondary_keywords: "peer work Australia, lived experience worker, Certificate IV peer work",
    target_word_count_min: 800,
    target_word_count_max: 1500,
  },
  {
    slug: "peer-work-australia-what-it-is-why-it-matters",
    article_number: null, // seed post — no content_plan entry yet
    title: "Peer Work in Australia: What It Is and Why It Matters",
    content_type: "CLUSTER",
    target_role: "peer-support-worker",
    target_keyword: "peer work Australia",
    secondary_keywords: "peer support worker, lived experience, mental health peer work",
    target_word_count_min: 800,
    target_word_count_max: 1500,
  },
  {
    slug: "mental-health-salary-guide-australia-2026",
    article_number: 72,
    title: "Mental Health Salary Guide Australia 2026: All Roles Compared",
    content_type: "PILLAR",
    target_role: null,
    target_keyword: "mental health salary Australia 2026",
    secondary_keywords: "psychologist salary Australia, social worker salary, mental health nurse salary",
    target_word_count_min: 2000,
    target_word_count_max: 4000,
  },
  {
    slug: "salary-benchmarks-mental-health-australia-2026",
    article_number: null, // seed post — no content_plan entry yet
    title: "Salary Benchmarks for Mental Health Roles in Australia (2026)",
    content_type: "PILLAR",
    target_role: null,
    target_keyword: "mental health salaries Australia 2026",
    secondary_keywords: "SCHADS Award, salary packaging, allied health salary Australia",
    target_word_count_min: 2000,
    target_word_count_max: 4000,
  },
  {
    slug: "understanding-ndis-mental-health-workers",
    article_number: 32,
    title: "Understanding the NDIS for Mental Health Workers",
    content_type: "CLUSTER",
    target_role: "behaviour-support-practitioner",
    target_keyword: "NDIS for mental health workers",
    secondary_keywords: "psychosocial disability NDIS, NDIS mental health funding, NDIS support categories",
    target_word_count_min: 800,
    target_word_count_max: 1500,
  },
  {
    slug: "how-to-write-mental-health-job-application",
    article_number: 90,
    title: "How to Write a Stand-Out Mental Health Job Application",
    content_type: "CONVERSION",
    target_role: null,
    target_keyword: "mental health job application",
    secondary_keywords: "mental health cover letter, selection criteria mental health, mental health resume",
    target_word_count_min: 600,
    target_word_count_max: 1200,
  },
  {
    slug: "working-rural-remote-mental-health-australia",
    article_number: 79,
    title: "Working in Rural and Remote Mental Health: What to Expect",
    content_type: "CONVERSION",
    target_role: null,
    target_keyword: "rural remote mental health jobs Australia",
    secondary_keywords: "rural mental health Australia, remote area mental health, MMM classification",
    target_word_count_min: 600,
    target_word_count_max: 1200,
  },
];
export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const results = [];

  for (const u of BLOG_POST_METADATA) {
    // Check if this blog post exists
    const blogRow = await sql`SELECT id, title FROM blog_posts WHERE slug = ${u.slug}`;
    const blogExists = blogRow.rows.length > 0;

    if (!blogExists) {
      results.push({ slug: u.slug, skipped: true, reason: "blog post not found in DB" });
      continue;
    }

    // Update blog post title to canonical title
    await sql`UPDATE blog_posts SET title = ${u.title} WHERE slug = ${u.slug}`;

    let cpUpdated = false;

    if (u.article_number !== null) {
      // Update existing content_plan row matched by article_number
      const cpResult = await sql`
        UPDATE content_plan SET
          slug = ${u.slug},
          title = ${u.title},
          content_type = ${u.content_type},
          target_role = ${u.target_role},
          target_keyword = ${u.target_keyword},
          secondary_keywords = ${u.secondary_keywords},
          target_word_count_min = ${u.target_word_count_min},
          target_word_count_max = ${u.target_word_count_max},
          status = 'Published',
          published_url = ${SITE_URL + "/blog/" + u.slug},
          published_at = COALESCE(published_at, NOW()),
          updated_at = NOW()
        WHERE article_number = ${u.article_number}
        RETURNING id
      `;
      cpUpdated = cpResult.rowCount > 0;
    } else {
      // No article_number — upsert by slug
      const existing = await sql`SELECT id FROM content_plan WHERE slug = ${u.slug}`;
      if (existing.rows.length > 0) {
        await sql`
          UPDATE content_plan SET
            title = ${u.title},
            content_type = ${u.content_type},
            target_role = ${u.target_role},
            target_keyword = ${u.target_keyword},
            secondary_keywords = ${u.secondary_keywords},
            target_word_count_min = ${u.target_word_count_min},
            target_word_count_max = ${u.target_word_count_max},
            status = 'Published',
            published_url = ${SITE_URL + "/blog/" + u.slug},
            published_at = COALESCE(published_at, NOW()),
            updated_at = NOW()
          WHERE slug = ${u.slug}
        `;
        cpUpdated = true;
      } else {
        // Insert new content_plan row
        const maxNum = await sql`SELECT COALESCE(MAX(article_number), 100) + 1 AS next FROM content_plan`;
        const nextNum = maxNum.rows[0].next as number;
        await sql`
          INSERT INTO content_plan (
            article_number, title, slug, content_type, target_role, target_keyword,
            secondary_keywords, target_word_count_min, target_word_count_max,
            status, published_url, published_at
          ) VALUES (
            ${nextNum}, ${u.title}, ${u.slug}, ${u.content_type},
            ${u.target_role}, ${u.target_keyword}, ${u.secondary_keywords},
            ${u.target_word_count_min}, ${u.target_word_count_max},
            'Published', ${SITE_URL + "/blog/" + u.slug}, NOW()
          )
        `;
        cpUpdated = true;
      }
    }

    results.push({
      slug: u.slug,
      title: u.title,
      article_number: u.article_number,
      blog_exists: blogExists,
      content_plan_updated: cpUpdated,
    });
  }

  // Repair pass: find blog posts with no content_plan match and link them by title
  const orphans = await sql`
    SELECT bp.id, bp.slug, bp.title, bp.published_at
    FROM blog_posts bp
    LEFT JOIN content_plan cp ON cp.slug = bp.slug
    WHERE cp.id IS NULL
  `;

  const repaired = [];
  for (const row of orphans.rows) {
    const bp = row as { id: number; slug: string; title: string; published_at: string | null };

    // Extract the first 4+ meaningful words from the title for a fuzzy match
    const words = bp.title
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 4);

    if (words.length === 0) continue;

    // Build an ILIKE pattern using the first significant words
    const pattern = `%${words.join("%")}%`;
    const match = await sql`
      SELECT id, article_number, content_type, target_role, target_keyword, secondary_keywords,
             target_word_count_min, target_word_count_max
      FROM content_plan
      WHERE title ILIKE ${pattern}
      ORDER BY article_number ASC
      LIMIT 1
    `;

    if (match.rows.length === 0) {
      repaired.push({ slug: bp.slug, title: bp.title, matched: false });
      continue;
    }

    const cp = match.rows[0] as {
      id: number;
      article_number: number;
      content_type: string;
      target_role: string | null;
      target_keyword: string | null;
      secondary_keywords: string | null;
      target_word_count_min: number | null;
      target_word_count_max: number | null;
    };

    await sql`
      UPDATE content_plan SET
        slug = ${bp.slug},
        status = CASE WHEN ${bp.published_at} IS NOT NULL THEN 'Published' ELSE status END,
        published_url = CASE WHEN ${bp.published_at} IS NOT NULL THEN ${SITE_URL + "/blog/" + bp.slug} ELSE published_url END,
        published_at = CASE WHEN ${bp.published_at} IS NOT NULL THEN COALESCE(published_at, NOW()) ELSE published_at END,
        updated_at = NOW()
      WHERE id = ${cp.id}
    `;

    repaired.push({
      slug: bp.slug,
      title: bp.title,
      matched: true,
      linked_article_number: cp.article_number,
      content_type: cp.content_type,
    });
  }

  return NextResponse.json({ ok: true, results, repaired });
}
