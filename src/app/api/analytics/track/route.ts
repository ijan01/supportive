import { NextRequest, NextResponse } from "next/server";
import { trackJobEvent } from "@/lib/jobs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { job_id, event_type } = body;

  if (!job_id || !event_type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (event_type !== "view" && event_type !== "apply_click") {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  await trackJobEvent(Number(job_id), event_type);
  return NextResponse.json({ ok: true });
}
