import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getEmployerByUserId, upsertEmployer } from "@/lib/employers";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employer = await getEmployerByUserId(Number(session.user.id));
  return NextResponse.json({ employer: employer || null });
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, website, description, why_work_with_us, organisation_type, benefits } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Organisation name is required" }, { status: 400 });
  }

  if (why_work_with_us && typeof why_work_with_us === "string" && why_work_with_us.length > 3000) {
    return NextResponse.json({ error: "Why work with us must be under 3000 characters" }, { status: 400 });
  }

  const employer = await upsertEmployer(Number(session.user.id), {
    name: name.trim(),
    website: website?.trim() || null,
    description: description?.trim() || null,
    why_work_with_us: why_work_with_us?.trim() || null,
    organisation_type: organisation_type || null,
    benefits: Array.isArray(benefits) ? benefits : [],
  });

  return NextResponse.json({ ok: true, employer });
}
