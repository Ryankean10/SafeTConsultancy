// AI opportunity scout — runs Claude Opus 4.8 with web search over your
// discovery themes and files new opportunities into the CRM for review.
//
// Run:  npm run discovery
// (loads .env.local via --env-file; needs ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL,
//  SUPABASE_SECRET_KEY)

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import {
  DEFAULT_THEMES,
  buildScoutPrompt,
  extractText,
  parseCandidates,
  insertCandidates,
} from "../../src/lib/discovery/core.mjs";

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ANTHROPIC_API_KEY } = process.env;
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SECRET_KEY || !ANTHROPIC_API_KEY) {
  console.error("Missing env. Run via: npm run discovery (loads .env.local)");
  process.exit(1);
}

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY);
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

const WEB_SEARCH = { type: "web_search_20260209", name: "web_search", max_uses: 4 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchTheme(theme) {
  const messages = [{ role: "user", content: buildScoutPrompt(theme) }];
  let message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4000,
    tools: [WEB_SEARCH],
    messages,
  });
  // Server tool loop may pause at 10 iterations — resume a few times.
  let guard = 0;
  while (message.stop_reason === "pause_turn" && guard++ < 3) {
    messages.push({ role: "assistant", content: message.content });
    message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      tools: [WEB_SEARCH],
      messages,
    });
  }
  return message;
}

async function main() {
  // Load enabled themes; seed defaults on first run.
  let { data: themes } = await supabase.from("discovery_queries").select("*").eq("enabled", true);
  if (!themes?.length) {
    await supabase
      .from("discovery_queries")
      .insert(DEFAULT_THEMES.map((t) => ({ label: t.label, theme: t.theme })));
    ({ data: themes } = await supabase.from("discovery_queries").select("*").eq("enabled", true));
    console.log(`Seeded ${themes?.length ?? 0} default themes.`);
  }

  const { data: run } = await supabase
    .from("discovery_runs")
    .insert({ kind: "scout", status: "running" })
    .select("id")
    .single();

  let totalInserted = 0;
  let totalSkipped = 0;
  try {
    for (let i = 0; i < themes.length; i++) {
      const t = themes[i];
      process.stdout.write(`\nTheme: ${t.label} ... `);
      const message = await searchTheme(t.theme);
      const candidates = parseCandidates(extractText(message));
      const { inserted, skipped } = await insertCandidates(supabase, candidates, { runId: run.id });
      totalInserted += inserted;
      totalSkipped += skipped;
      console.log(`found ${candidates.length}, added ${inserted}, skipped ${skipped}`);
      // Ease web-search rate limits between themes.
      if (i < themes.length - 1) await sleep(20000);
    }

    await supabase
      .from("discovery_runs")
      .update({
        status: "done",
        finished_at: new Date().toISOString(),
        stats: { themes: themes.length, inserted: totalInserted, skipped: totalSkipped },
      })
      .eq("id", run.id);

    console.log(`\nDone. Added ${totalInserted} new opportunities for review (skipped ${totalSkipped}).`);
  } catch (e) {
    await supabase
      .from("discovery_runs")
      .update({
        status: "error",
        finished_at: new Date().toISOString(),
        error: String(e?.message ?? e).slice(0, 500),
      })
      .eq("id", run.id);
    console.error("\nDiscovery run failed:", e);
    process.exit(1);
  }
}

main();
