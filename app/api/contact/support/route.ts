import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { name, email, phone, subject, description } = await req.json();

  if (!name || !email || !subject || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_your_api_key_here") {
    console.error("[support] RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "Email service is not configured. Please contact us at support@yardyman.com." }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    `Subject: ${subject}`,
    ``,
    `Message:`,
    description,
  ].filter(Boolean).join("\n");

  try {
    const { error } = await resend.emails.send({
      from: "Yardyman Support <noreply@yardyman.com>",
      to: "support@yardyman.com",
      replyTo: email,
      subject: `[Provider Support] ${subject}`,
      text: lines,
    });

    if (error) {
      console.error("[support] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[support] Unexpected error:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to send" }, { status: 500 });
  }
}
