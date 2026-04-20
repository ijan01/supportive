import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getAllJobsAdmin, deleteJob, updateJobStatus } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const result = await getAllJobsAdmin({
    status: params.get("status") || undefined,
    source: params.get("source") || undefined,
    search: params.get("search") || undefined,
    page: parseInt(params.get("page") || "1", 10),
    limit: parseInt(params.get("limit") || "50", 10),
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { jobId, action } = body;

  if (!jobId || !action) {
    return NextResponse.json({ error: "jobId and action required" }, { status: 400 });
  }

  if (action === "delete") {
    await deleteJob(jobId);
  } else if (action === "approve") {
    await updateJobStatus(jobId, "active");
  } else if (action === "reject") {
    await updateJobStatus(jobId, "rejected");
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
