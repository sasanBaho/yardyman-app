import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  const { providerId } = await req.json();
  if (!providerId) {
    return NextResponse.json({ error: "Missing providerId" }, { status: 400 });
  }

  const monthKey = new Date().toISOString().slice(0, 7);

  await adminDb.collection("providers").doc(providerId).update({
    profileViewCount: FieldValue.increment(1),
    [`viewsByMonth.${monthKey}`]: FieldValue.increment(1),
  });

  return NextResponse.json({ ok: true });
}
