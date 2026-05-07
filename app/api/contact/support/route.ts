import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, phone, subject, description } = await req.json();

  if (!name || !email || !subject || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "Yardyman Contact <noreply@yardyman.com>",
      to: "support@yardyman.com",
      replyTo: email,
      subject: `[Provider Support] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Subject: ${subject}`,
        ``,
        `Message:`,
        description,
      ].filter(Boolean).join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Failed to send" }, { status: 500 });
  }
}
