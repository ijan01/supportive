import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { expireStaleQueueJobs } from "@/lib/feed-jobs";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const count = await expireStaleQueueJobs();
  return NextResponse.json({ ok: true, count });
}
