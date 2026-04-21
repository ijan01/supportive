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

  await ensureInitialized();

  // --- Boost: one-time payment completed ---
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.mode === "payment") {
      const jobId = Number(session.metadata?.job_id);
      if (jobId) {
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
    // Subscription checkout sessions are handled by customer.subscription.created below
  }

  // --- Featured subscription: created ---
  if (event.type === "customer.subscription.created") {
    const sub = event.data.object;
    const employerId = Number(sub.metadata?.employer_id);
    if (employerId) {
      const periodEnd = new Date(((sub as unknown as { current_period_end: number }).current_period_end) * 1000).toISOString();
      await sql`
        UPDATE employers SET
          featured = TRUE,
          featured_until = ${periodEnd},
          stripe_subscription_id = ${sub.id},
          updated_at = NOW()
        WHERE id = ${employerId}
      `;
    }
  }

  // --- Featured subscription: updated (renewal, status change) ---
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object;
    const subStatus = sub.status;
    const periodEnd = new Date(((sub as unknown as { current_period_end: number }).current_period_end) * 1000).toISOString();

    const isFeatured = subStatus === "active" || subStatus === "trialing";

    await sql`
      UPDATE employers SET
        featured = ${isFeatured},
        featured_until = ${periodEnd},
        updated_at = NOW()
      WHERE stripe_subscription_id = ${sub.id}
    `;
  }

  // --- Featured subscription: deleted (cancelled) ---
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;

    const empResult = await sql`
      SELECT id, name FROM employers WHERE stripe_subscription_id = ${sub.id}
    `;
    const emp = empResult.rows[0] as { id: number; name: string } | undefined;

    if (emp) {
      await sql`
        UPDATE employers SET
          featured = FALSE,
          featured_until = NULL,
          stripe_subscription_id = NULL,
          updated_at = NOW()
        WHERE id = ${emp.id}
      `;

      // Send cancellation email
      try {
        const userResult = await sql`SELECT email, name FROM users u JOIN employers e ON e.user_id = u.id WHERE e.id = ${emp.id}`;
        const user = userResult.rows[0] as { email: string; name: string } | undefined;
        if (user) {
          const { sendFeaturedCancellationEmail } = await import("@/lib/email");
          await sendFeaturedCancellationEmail(user.email, user.name, emp.name);
        }
      } catch (err) {
        console.error("[webhook] Failed to send cancellation email:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
