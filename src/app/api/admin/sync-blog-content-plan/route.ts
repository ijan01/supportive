import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { sql, ensureInitialized } from "@/lib/db";

const UPDATES = [
  {
    old_slug: "how-to-become-psychologist-australia",
    article_number: 2,
    title: "How to Become a Psychologist in Australia",
    slug: "how-to-become-psychologist-australia",
    content_type: "PILLAR",
    target_role: "psychologist",
  },
  {
    old_slug: "what-is-peer-support-worker-australia",
    article_number: 44,
    title: "What is a Peer Support Worker? A Guide to Peer Work in Australia",
    slug: "what-is-peer-support-worker-australia",
    content_type: "CLUSTER",
    target_role: "peer-support-worker",
  },
  {
    old_slug: "mental-health-salary-guide-australia-2026",
    article_number: 72,
    title: "Mental Health Salary Guide Australia 2026: All Roles Compared",
    slug: "mental-health-salary-guide-australia-2026",
    content_type: "PILLAR",
    target_role: null,
  },
  {
    old_slug: "understanding-ndis-mental-health-workers",
    article_number: 32,
    title: "Understanding the NDIS for Mental Health Workers",
    slug: "understanding-ndis-mental-health-workers",
    content_type: "CLUSTER",
    target_role: "behaviour-support-practitioner",
  },
  {
    old_slug: "how-to-write-mental-health-job-application",
    article_number: 90,
    title: "How to Write a Stand-Out Mental Health Job Application",
    slug: "how-to-write-mental-health-job-application",
    content_type: "CONVERSION",
    target_role: null,
  },
  {
    old_slug: "working-rural-remote-mental-health-australia",
    article_number: 79,
    title: "Working in Rural and Remote Mental Health: What to Expect",
    slug: "working-rural-remote-mental-health-australia",
    content_type: "CONVERSION",
    target_role: null,
  },
];

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureInitialized();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://supportive.com.au";
  const results = [];

  for (const u of UPDATES) {
    // Update the blog post title to match content plan
    const blogResult = await sql`
      UPDATE blog_posts SET title = ${u.title}
      WHERE slug = ${u.old_slug}
      RETURNING id
    `;

    // Update the content plan entry to Published with correct slug and URL
    const cpResult = await sql`
      UPDATE content_plan SET
        status = 'Published',
        slug = ${u.slug},
        published_url = ${siteUrl + "/blog/" + u.slug},
        published_at = NOW(),
        updated_at = NOW()
      WHERE article_number = ${u.article_number}
    `;

    results.push({
      article_number: u.article_number,
      title: u.title,
      blog_updated: blogResult.rowCount > 0,
      content_plan_updated: cpResult.rowCount > 0,
    });
  }

  return NextResponse.json({ ok: true, results });
}
