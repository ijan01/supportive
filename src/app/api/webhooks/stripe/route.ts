import { NextRequest, NextResponse } from "next/server";
import { sql, ensureInitialized } from "@/lib/db";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook verification failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const jobId = Number(session.metadata?.job_id);
    const employerId = Number(session.metadata?.employer_id);

    if (jobId && employerId) {
      await ensureInitialized();

      await sql`
        UPDATE boosts SET
          status = 'active',
          stripe_payment_intent_id = ${session.payment_intent as string},
          started_at = NOW(),
          expires_at = NOW() + INTERVAL '14 days'
        WHERE stripe_session_id = ${session.id}
      `;

      await sql`
        UPDATE jobs SET
          is_boosted = TRUE,
          boosted_until = NOW() + INTERVAL '14 days',
          is_featured = 1,
          updated_at = NOW()
        WHERE id = ${jobId}
      `;
    }
  }

  return NextResponse.json({ received: true });
}
