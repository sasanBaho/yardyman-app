import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  if (session.status !== "complete") {
    return NextResponse.json({ ok: false, error: "Session not complete" });
  }

  const subscription = session.subscription as Stripe.Subscription | null;

  return NextResponse.json({
    ok: true,
    customerId: session.customer as string,
    subscriptionId: subscription?.id ?? null,
    subscriptionStatus: subscription?.status ?? null,
  });
}
