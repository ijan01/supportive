import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getEmployerByUserId } from "@/lib/employers";
import { sql } from "@/lib/db";
import { SITE_URL } from "@/lib/config";

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.user.role !== "company") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to environment variables." }, { status: 500 });
  }

  const body = await request.json();
  const { job_id } = body;
  if (!job_id) return NextResponse.json({ error: "job_id is required" }, { status: 400 });
  const employer = await getEmployerByUserId(Number(session.user.id));
  if (!employer) return NextResponse.json({ error: "Create your employer profile first" }, { status: 400 });

  const jobResult = await sql`SELECT id, title, user_id, status, is_boosted FROM jobs WHERE id = ${job_id}`;
  const job = jobResult.rows[0] as { id: number; title: string; user_id: number; status: string; is_boosted: boolean } | undefined;
  if (!job || job.user_id !== Number(session.user.id)) {
    return NextResponse.json({ error: "Job not found or not yours" }, { status: 404 });
  }
  if (job.status !== "active") {
    return NextResponse.json({ error: "Only active listings can be sponsored" }, { status: 400 });
  }
  if (job.is_boosted) {
    return NextResponse.json({ error: "This listing is already sponsored" }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "aud",
    line_items: [
      {
        price_data: {
          currency: "aud",
          unit_amount: 7900,
          product_data: {
            name: `Sponsored listing — 14 days`,
            description: `Sponsor "${job.title}" to the top of search results for 14 days.`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { job_id: String(job_id), employer_id: String(employer.id), listing_tier: "sponsored" },
    success_url: `${SITE_URL}/dashboard/company?boost=success&job=${job_id}`,
    cancel_url: `${SITE_URL}/dashboard/company?boost=cancelled`,
  });

  await sql`
    INSERT INTO boosts (job_id, employer_id, stripe_session_id, amount_cents, status)
    VALUES (${job_id}, ${employer.id}, ${checkoutSession.id}, 7900, 'pending')
  `;

  return NextResponse.json({ ok: true, url: checkoutSession.url });
}
