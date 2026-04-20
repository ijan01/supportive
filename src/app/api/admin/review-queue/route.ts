import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { updateJobStatus, remapJobRole } from "@/lib/feed-jobs";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await request.json();
  const { jobId, action, roleSlug } = body as {
    jobId: number;
    action: "approve" | "reject" | "remap";
    roleSlug?: string;
  };

  if (!jobId || !action) {
    return NextResponse.json({ error: "Missing jobId or action" }, { status: 400 });
  }

  if (action === "approve") {
    await updateJobStatus(jobId, "active");
  } else if (action === "reject") {
    await updateJobStatus(jobId, "rejected");
  } else if (action === "remap") {
    if (!roleSlug) return NextResponse.json({ error: "Missing roleSlug for remap" }, { status: 400 });
    await remapJobRole(jobId, roleSlug);
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
