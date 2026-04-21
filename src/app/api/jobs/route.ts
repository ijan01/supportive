import { NextRequest, NextResponse } from "next/server";
import { getJobs, createJob } from "@/lib/jobs";
import { getSessionFromRequest } from "@/lib/session";
import { JobFilters } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters: JobFilters = {};
  const search = searchParams.get("search");
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const jobType = searchParams.get("job_type");

  if (search) filters.search = search;
  if (location) filters.location = location;
  if (category) filters.category = category;
  if (jobType) filters.job_type = jobType;

  const jobs = await getJobs(filters);
  return NextResponse.json({ jobs });
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "company") {
    return NextResponse.json(
      { error: "Only company accounts can post jobs" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, apply_method } = body;

    if (!title || !company || !location || !category || !job_type || !description || !requirements) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await createJob(Number(session.user.id), {
      title,
      company,
      location,
      category,
      job_type,
      salary_min: salary_min ? Number(salary_min) : undefined,
      salary_max: salary_max ? Number(salary_max) : undefined,
      description,
      requirements,
      apply_url: apply_method === "internal" ? undefined : apply_url,
      apply_method: apply_method === "internal" ? "internal" : "external",
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
