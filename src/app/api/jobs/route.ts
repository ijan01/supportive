import { NextRequest, NextResponse } from "next/server";
import { getJobs, createJob } from "@/lib/jobs";
import { getSessionFromRequest } from "@/lib/session";
import { getEmployerByUserId } from "@/lib/employers";
import { JobFilters } from "@/lib/types";
import { LISTING_TIERS } from "@/constants";
import { SITE_URL } from "@/lib/config";

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
    const { title, company, location, category, job_type, salary_min, salary_max, description, requirements, apply_url, apply_method, listing_tier } = body;

    if (!title || !company || !location || !category || !job_type || !description || !requirements) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tier = listing_tier || "basic";
    const tierDef = LISTING_TIERS.find((t) => t.value === tier);

    // For paid tiers, create a Stripe Checkout session
    if (tierDef && tierDef.price > 0) {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
      }

      const employer = await getEmployerByUserId(Number(session.user.id));

      // Create the job first in a "pending" state (will be activated by webhook)
      const job = await createJob(Number(session.user.id), {
        title, company, location, category, job_type,
        salary_min: salary_min ? Number(salary_min) : undefined,
        salary_max: salary_max ? Number(salary_max) : undefined,
        description, requirements,
        apply_url: apply_method === "internal" ? undefined : apply_url,
        apply_method: apply_method === "internal" ? "internal" : "external",
        listing_tier: tier,
      });

      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(stripeKey);

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        currency: "aud",
        line_items: [
          {
            price_data: {
              currency: "aud",
              unit_amount: tierDef.price,
              product_data: {
                name: `${tierDef.label} listing — ${tierDef.duration} days`,
                description: tierDef.description,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          job_id: String(job.id),
          employer_id: employer ? String(employer.id) : "",
          listing_tier: tier,
        },
        success_url: `${SITE_URL}/dashboard/company?posted=1&tier=${tier}`,
        cancel_url: `${SITE_URL}/dashboard/company?cancelled=1`,
      });

      // Store the session ID on the job for webhook matching
      const { sql } = await import("@/lib/db");
      await sql`UPDATE jobs SET stripe_session_id = ${checkoutSession.id} WHERE id = ${job.id}`;

      return NextResponse.json({ job, checkoutUrl: checkoutSession.url }, { status: 201 });
    }

    // Free tier — just create the job
    const job = await createJob(Number(session.user.id), {
      title, company, location, category, job_type,
      salary_min: salary_min ? Number(salary_min) : undefined,
      salary_max: salary_max ? Number(salary_max) : undefined,
      description, requirements,
      apply_url: apply_method === "internal" ? undefined : apply_url,
      apply_method: apply_method === "internal" ? "internal" : "external",
      listing_tier: "basic",
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
