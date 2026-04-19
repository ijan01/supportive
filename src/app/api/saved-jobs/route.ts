import { NextRequest, NextResponse } from "next/server";
import { saveJob, unsaveJob, getSavedJobs, isJobSaved } from "@/lib/saved-jobs";
import { auth } from "../../../../auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await getSavedJobs(Number(session.user.id));
  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { job_id } = body;

  if (!job_id) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  const saved = await isJobSaved(Number(session.user.id), Number(job_id));

  if (saved) {
    await unsaveJob(Number(session.user.id), Number(job_id));
    return NextResponse.json({ saved: false });
  } else {
    await saveJob(Number(session.user.id), Number(job_id));
    return NextResponse.json({ saved: true });
  }
}
