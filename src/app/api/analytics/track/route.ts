import { NextRequest, NextResponse } from "next/server";
import { trackJobEvent, getJobByIdAny } from "@/lib/jobs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { job_id, event_type } = body;

  if (!job_id || !event_type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (event_type !== "view" && event_type !== "apply_click") {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const id = Number(job_id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid job_id" }, { status: 400 });
  }

  const job = await getJobByIdAny(id);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  await trackJobEvent(id, event_type);
  return NextResponse.json({ ok: true });
}
