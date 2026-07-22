// Shared discovery logic used by both feeds:
//  - scripts/discovery/scout.mjs (scheduled/on-demand web-search scout)
//  - src/app/api/discovery/inbound-email/route.ts (newsletter/Boardy email ingest)
// Plain ESM JS so it can be imported from both a Node script and Next (TS, allowJs).

const VESSEL_TYPES = ["new_build", "refit", "bess", "shore_side"];

// Seeded on first run if the discovery_queries table is empty. Editable in Supabase.
export const DEFAULT_THEMES = [
  {
    label: "New builds & major refits",
    theme:
      "Newly announced superyacht new builds or major refit projects (40m+), especially any needing technical, safety, commissioning or project-management support.",
  },
  {
    label: "MGN 681 / lithium-ion compliance",
    theme:
      "News, regulation changes, incidents or guidance on MGN 681 and lithium-ion battery compliance for yachts and vessels, and vessels adding lithium-ion systems.",
  },
  {
    label: "BESS & grid-scale energy projects",
    theme:
      "Battery energy storage system (BESS) and grid-scale energy projects in the UK (especially Scotland) at design, procurement, build or commissioning stage.",
  },
  {
    label: "Yacht management & shipyard activity",
    theme:
      "Yacht management companies, shipyards or owners' representatives expanding, winning contracts, or announcing projects that may need independent technical/safety consultancy.",
  },
];

const CANDIDATE_INSTRUCTIONS = `Safe-T Consultancy is a yacht safety, technical and project-management consultancy led by an MCA Chief Engineer and BESS Professional Engineer. Services: design review, inspection & commissioning (FAT/SAT), MGN 681 lithium-ion compliance, O&M documentation, operational readiness, and grid-scale BESS delivery.

Identify concrete, recent sales opportunities relevant to those services. For each, capture the organisation and any named decision-maker. Ignore anything vague, old, or irrelevant.

Return ONLY a JSON object in a \`\`\`json code block, no prose after it, in exactly this shape:
\`\`\`json
{
  "opportunities": [
    {
      "title": "short title of the opportunity",
      "summary": "1-3 sentences on what it is and why it fits Safe-T",
      "organisation": "company/owner name or null",
      "contact_name": "named decision-maker or null",
      "contact_role": "their role or null",
      "source_url": "the source link or null",
      "vessel_type": "one of new_build, refit, bess, shore_side, or null",
      "confidence": 0.0,
      "rationale": "why this is worth pursuing for Safe-T"
    }
  ]
}
\`\`\`
Even if some web searches fail or are rate-limited, you MUST still end your response with the JSON object, based on whatever you managed to gather. Use an empty array only if you genuinely found nothing relevant. Do not invent opportunities or contact details.`;

export function buildScoutPrompt(theme) {
  return `Search the web for opportunities matching this theme:\n\n"${theme}"\n\nFocus on items from roughly the last 3 months. ${CANDIDATE_INSTRUCTIONS}`;
}

export function buildEmailPrompt(subject, body) {
  return `The following is a newsletter/alert email that may contain sales leads. Extract any relevant opportunities from it.\n\nSubject: ${subject || "(none)"}\n\n---\n${body}\n---\n\n${CANDIDATE_INSTRUCTIONS}`;
}

/** Concatenate all text blocks from an Anthropic message response. */
export function extractText(message) {
  return (message?.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

/** Tolerant parse: prefer the last ```json fence, fall back to the first {...} span. */
export function parseCandidates(text) {
  if (!text) return [];
  const tryParse = (s) => {
    try {
      const obj = JSON.parse(s);
      if (Array.isArray(obj)) return obj;
      if (Array.isArray(obj?.opportunities)) return obj.opportunities;
      return null;
    } catch {
      return null;
    }
  };

  const fences = [...text.matchAll(/```json\s*([\s\S]*?)```/gi)].map((m) => m[1].trim());
  for (const f of fences.reverse()) {
    const parsed = tryParse(f);
    if (parsed) return parsed;
  }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    const parsed = tryParse(text.slice(start, end + 1));
    if (parsed) return parsed;
  }
  return [];
}

function clean(v) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length && s.toLowerCase() !== "null" ? s : null;
}

function normalise(raw) {
  const vt = clean(raw?.vessel_type);
  let confidence = Number(raw?.confidence);
  if (!Number.isFinite(confidence)) confidence = null;
  else confidence = Math.max(0, Math.min(1, confidence));
  return {
    title: clean(raw?.title),
    summary: clean(raw?.summary),
    organisation: clean(raw?.organisation),
    contact_name: clean(raw?.contact_name),
    contact_role: clean(raw?.contact_role),
    source_url: clean(raw?.source_url),
    vessel_type: vt && VESSEL_TYPES.includes(vt) ? vt : null,
    confidence,
    rationale: clean(raw?.rationale),
  };
}

/**
 * Insert candidates as AI-flagged opportunities (stage 'identified', ai_status
 * 'pending'), deduping against existing opportunities by source_url then title.
 * `supabase` must be a service-role client (bypasses RLS — the runner has no user).
 */
export async function insertCandidates(supabase, candidates, { runId }) {
  let inserted = 0;
  let skipped = 0;

  for (const rawCandidate of candidates) {
    const c = normalise(rawCandidate);
    if (!c.title) {
      skipped++;
      continue;
    }

    let existing = null;
    if (c.source_url) {
      const { data } = await supabase
        .from("opportunities")
        .select("id")
        .eq("source_url", c.source_url)
        .limit(1);
      if (data?.length) existing = data[0];
    }
    if (!existing) {
      const { data } = await supabase
        .from("opportunities")
        .select("id")
        .eq("title", c.title)
        .limit(1);
      if (data?.length) existing = data[0];
    }
    if (existing) {
      skipped++;
      continue;
    }

    let contactId = null;
    if (c.contact_name) {
      const { data: contact } = await supabase
        .from("contacts")
        .insert({
          full_name: c.contact_name,
          organisation: c.organisation,
          role_title: c.contact_role,
          source: "ai_discovery",
        })
        .select("id")
        .single();
      contactId = contact?.id ?? null;
    }

    const { error } = await supabase.from("opportunities").insert({
      title: c.title,
      description: c.summary,
      source: "ai_discovery",
      source_url: c.source_url,
      vessel_type: c.vessel_type,
      stage: "identified",
      contact_id: contactId,
      ai_generated: true,
      ai_status: "pending",
      ai_confidence: c.confidence,
      ai_rationale: c.rationale,
      discovery_run_id: runId,
    });
    if (error) skipped++;
    else inserted++;
  }

  return { inserted, skipped };
}
