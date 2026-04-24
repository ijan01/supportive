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
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const body = await request.json();
  const { price_id } = body;

  const monthlyPriceId = process.env.STRIPE_FEATURED_MONTHLY_PRICE_ID;
  const annualPriceId = process.env.STRIPE_FEATURED_ANNUAL_PRICE_ID;

  if (!price_id || (price_id !== monthlyPriceId && price_id !== annualPriceId)) {
    return NextResponse.json({ error: "Invalid price_id" }, { status: 400 });
  }

  const employer = await getEmployerByUserId(Number(session.user.id));
  if (!employer) {
    return NextResponse.json({ error: "Create your employer profile first" }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);

  let customerId = employer.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: employer.name,
      metadata: { employer_id: String(employer.id) },
    });
    customerId = customer.id;
    await sql`UPDATE employers SET stripe_customer_id = ${customerId} WHERE id = ${employer.id}`;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: price_id, quantity: 1 }],
    metadata: { employer_id: String(employer.id) },
    subscription_data: { metadata: { employer_id: String(employer.id) } },
    success_url: `${SITE_URL}/dashboard/company?featured=success`,
    cancel_url: `${SITE_URL}/dashboard/company?featured=cancelled`,
  });

  return NextResponse.json({ ok: true, url: checkoutSession.url });
}
