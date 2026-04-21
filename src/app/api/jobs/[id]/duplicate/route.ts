import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { duplicateJob } from "@/lib/jobs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const jobId = parseInt(id, 10);
  if (!jobId) return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });

  const job = await duplicateJob(jobId, Number(session.user.id));
  if (!job) return NextResponse.json({ error: "Job not found or not yours" }, { status: 404 });

  return NextResponse.json({ ok: true, job });
}
