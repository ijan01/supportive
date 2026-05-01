import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/blog";
import { sql } from "@/lib/db";
import { SITE_URL } from "@/lib/config";
async function syncContentPlanPublished(slug: string, published: boolean) {
  if (published) {
    await sql`
      UPDATE content_plan SET
        status = 'Published',
        slug = ${slug},
        published_url = ${SITE_URL + "/blog/" + slug},
        published_at = COALESCE(published_at, NOW()),
        updated_at = NOW()
      WHERE slug = ${slug}
        AND status != 'Published'
    `;
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "create") {
    const post = await createBlogPost(body);
    await syncContentPlanPublished(post.slug, body.published);
    return NextResponse.json({ ok: true, post });
  }

  if (action === "update") {
    const post = await updateBlogPost(body.id, body);
    await syncContentPlanPublished(post.slug, body.published);
    return NextResponse.json({ ok: true, post });
  }

  if (action === "publish") {
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const result = await sql`
      UPDATE blog_posts SET published_at = COALESCE(published_at, NOW())
      WHERE id = ${id}
      RETURNING slug
    `;
    if (result.rows[0]) {
      await syncContentPlanPublished(result.rows[0].slug as string, true);
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    await deleteBlogPost(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
