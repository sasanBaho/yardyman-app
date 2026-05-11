import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { providerId } = await req.json();
    if (!providerId) {
      return NextResponse.json({ error: "Missing providerId" }, { status: 400 });
    }

    const monthKey = new Date().toISOString().slice(0, 7);

    await getAdminDb().collection("providers").doc(providerId).update({
      profileViewCount: FieldValue.increment(1),
      [`viewsByMonth.${monthKey}`]: FieldValue.increment(1),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[record-view] error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Failed" }, { status: 500 });
  }
}
