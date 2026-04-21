import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { toggleFeatured } from "@/lib/employers";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { employer_id, featured, days } = body;

  if (!employer_id || typeof featured !== "boolean") {
    return NextResponse.json({ error: "employer_id and featured are required" }, { status: 400 });
  }

  await toggleFeatured(employer_id, featured, featured ? (days || 30) : undefined);

  return NextResponse.json({ ok: true });
}
