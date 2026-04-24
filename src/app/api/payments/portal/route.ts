import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getEmployerByUserId } from "@/lib/employers";
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

  const employer = await getEmployerByUserId(Number(session.user.id));
  if (!employer?.stripe_customer_id) {
    return NextResponse.json({ error: "No subscription found" }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(stripeKey);

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: employer.stripe_customer_id,
    return_url: `${SITE_URL}/dashboard/company`,
  });

  return NextResponse.json({ ok: true, url: portalSession.url });
}
