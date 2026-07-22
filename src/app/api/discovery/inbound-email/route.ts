import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/supabase/service";
// Shared discovery logic (plain ESM JS — allowJs handles the types).
import {
  buildEmailPrompt,
  extractText,
  parseCandidates,
  insertCandidates,
} from "@/lib/discovery/core.mjs";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const secret = process.env.DISCOVERY_WEBHOOK_SECRET;
  if (!secret || req.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY || !process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({ error: "discovery not configured" }, { status: 500 });
  }

  const body = await req.json();
  const emailBody: string | undefined = body.emailBody;
  const subject: string = body.subject ?? "";
  if (!emailBody || emailBody.trim().length < 40) {
    return NextResponse.json({ error: "missing or too-short emailBody" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const { data: run } = await supabase
    .from("discovery_runs")
    .insert({ kind: "email", status: "running" })
    .select("id")
    .single();

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      messages: [{ role: "user", content: buildEmailPrompt(subject, emailBody) }],
    });

    const candidates = parseCandidates(extractText(message));
    const { inserted, skipped } = await insertCandidates(supabase, candidates, {
      runId: run?.id,
    });

    await supabase
      .from("discovery_runs")
      .update({
        status: "done",
        finished_at: new Date().toISOString(),
        stats: { source: "email", subject, found: candidates.length, inserted, skipped },
      })
      .eq("id", run?.id);

    return NextResponse.json({ success: true, found: candidates.length, inserted, skipped });
  } catch (e) {
    await supabase
      .from("discovery_runs")
      .update({
        status: "error",
        finished_at: new Date().toISOString(),
        error: String(e instanceof Error ? e.message : e).slice(0, 500),
      })
      .eq("id", run?.id);
    console.error("Discovery email ingest failed:", e);
    return NextResponse.json({ error: "processing failed" }, { status: 500 });
  }
}
