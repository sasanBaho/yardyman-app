import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { name, email, subject, message, rating } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_your_api_key_here") {
    console.error("[feedback] RESEND_API_KEY is not configured");
    return NextResponse.json({ error: "Email service is not configured. Please contact us at hi@yardyman.com." }, { status: 503 });
  }

  const resend = new Resend(apiKey);

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    rating ? `Rating: ${rating}/5` : null,
    `Subject: ${subject}`,
    ``,
    `Message:`,
    message,
  ].filter(Boolean).join("\n");

  try {
    const { error } = await resend.emails.send({
      from: "Yardyman Feedback <noreply@yardyman.com>",
      to: "hi@yardyman.com",
      replyTo: email,
      subject: `[Feedback] ${subject}`,
      text: lines,
    });

    if (error) {
      console.error("[feedback] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[feedback] Unexpected error:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to send" }, { status: 500 });
  }
}
