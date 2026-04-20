import { NextRequest, NextResponse } from "next/server";
import { createApplication, getApplicationsByUserId, hasUserApplied } from "@/lib/applications";
import { getJobById } from "@/lib/jobs";
import { getUserById } from "@/lib/users";
import { getSessionFromRequest } from "@/lib/session";
import { sendNewApplicationEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await getApplicationsByUserId(Number(session.user.id));
  return NextResponse.json({ applications });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { job_id, name, email, resume_url, cover_letter } = body;

    if (!job_id || !name || !email) {
      return NextResponse.json(
        { error: "Job ID, name, and email are required" },
        { status: 400 }
      );
    }

    const job = await getJobById(Number(job_id));
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (await hasUserApplied(Number(session.user.id), Number(job_id))) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }

    const application = await createApplication(
      Number(job_id),
      Number(session.user.id),
      name,
      email,
      resume_url,
      cover_letter
    );

    // Notify employer (fire-and-forget — don't block the response)
    if (job.user_id) {
      getUserById(job.user_id).then((employer) => {
        if (employer?.email) {
          sendNewApplicationEmail({
            employerEmail: employer.email,
            employerName: employer.company_name || employer.name,
            applicantName: name,
            applicantEmail: email,
            jobTitle: job.title,
            jobId: job.id,
          }).catch((err) => console.error("[email] failed to notify employer:", err));
        }
      });
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}
