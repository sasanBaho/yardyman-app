import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const subscriptionId = req.nextUrl.searchParams.get("subscriptionId");
  if (!subscriptionId) {
    return NextResponse.json({ error: "Missing subscriptionId" }, { status: 400 });
  }
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    // In Stripe SDK v17+, current_period_end lives on the subscription item, not the subscription root
    const currentPeriodEnd = sub.items.data[0]?.current_period_end ?? null;
    return NextResponse.json({
      status: sub.status,
      created: sub.created,
      trialEnd: sub.trial_end ?? null,
      currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Stripe error" }, { status: 500 });
  }
}
