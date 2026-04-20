import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getSavedSearches, createSavedSearch, deleteSavedSearch } from "@/lib/saved-searches";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const searches = await getSavedSearches(Number(session.user.id));
  return NextResponse.json({ searches });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  if (body.action === "delete") {
    await deleteSavedSearch(body.id, Number(session.user.id));
    return NextResponse.json({ ok: true });
  }

  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const search = await createSavedSearch(Number(session.user.id), {
    name: body.name,
    search: body.search,
    location: body.location,
    category: body.category,
    job_type: body.job_type,
  });

  return NextResponse.json({ ok: true, search });
}
