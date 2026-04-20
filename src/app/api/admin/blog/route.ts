import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/blog";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action } = body;

  if (action === "create") {
    const post = await createBlogPost(body);
    return NextResponse.json({ ok: true, post });
  }

  if (action === "update") {
    const post = await updateBlogPost(body.id, body);
    return NextResponse.json({ ok: true, post });
  }

  if (action === "delete") {
    await deleteBlogPost(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
