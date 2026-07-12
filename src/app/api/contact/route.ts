import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  const webhookSecret = process.env.CONTACT_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error("CONTACT_WEBHOOK_URL or CONTACT_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Contact form is not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { name, email, project, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, project, message, secret: webhookSecret }),
  });

  const result = await upstream.json();

  if (!upstream.ok || !result.success) {
    console.error("Contact webhook error:", result);
    return NextResponse.json({ error: "Failed to send enquiry" }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
