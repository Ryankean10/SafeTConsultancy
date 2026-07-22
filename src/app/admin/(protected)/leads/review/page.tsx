import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import ReviewActions from "@/components/admin/ReviewActions";
import type { OpportunityStage } from "@/lib/types";

interface ReviewOpp {
  id: string;
  title: string;
  description: string | null;
  source: string | null;
  source_url: string | null;
  vessel_type: string | null;
  ai_confidence: number | null;
  ai_rationale: string | null;
  created_at: string;
  stage: OpportunityStage;
  contact: { full_name: string; organisation: string | null } | null;
}

function labelFor(v: string | null) {
  if (!v) return null;
  return v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ReviewQueue() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("opportunities")
    .select(
      "id, title, description, source, source_url, vessel_type, ai_confidence, ai_rationale, created_at, stage, contact:contacts(full_name, organisation)"
    )
    .eq("ai_status", "pending")
    .order("ai_confidence", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const opps = (data ?? []) as unknown as ReviewOpp[];

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/leads" className="text-sm text-navy-light hover:underline">
          ← Back to board
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-navy">Review queue</h1>
        <p className="mt-1 text-sm text-neutral-500">
          AI-identified opportunities awaiting your decision. Accept promotes into the pipeline;
          dismiss discards.
        </p>
      </div>

      {opps.length === 0 ? (
        <div className="rounded-lg border border-dashed border-black/20 bg-white p-10 text-center text-sm text-neutral-500">
          Nothing to review right now. New AI-found opportunities will appear here after a
          discovery run.
        </div>
      ) : (
        <ul className="space-y-4">
          {opps.map((o) => {
            const confidence =
              o.ai_confidence != null ? `${Math.round(o.ai_confidence * 100)}%` : null;
            return (
              <li key={o.id} className="rounded-lg border border-black/10 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-base font-medium text-navy">{o.title}</h2>
                    {o.contact?.organisation && (
                      <p className="mt-0.5 text-xs text-neutral-500">{o.contact.organisation}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {confidence && (
                      <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-medium text-navy-light">
                        {confidence} confident
                      </span>
                    )}
                    {labelFor(o.vessel_type) && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600">
                        {labelFor(o.vessel_type)}
                      </span>
                    )}
                  </div>
                </div>

                {o.description && (
                  <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{o.description}</p>
                )}
                {o.ai_rationale && (
                  <p className="mt-2 text-xs text-neutral-500 italic">Why: {o.ai_rationale}</p>
                )}

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span>{formatDate(o.created_at)}</span>
                    {o.source_url && (
                      <a
                        href={o.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-navy-light hover:underline"
                      >
                        Source
                      </a>
                    )}
                    <Link href={`/admin/leads/${o.id}`} className="text-navy-light hover:underline">
                      Open
                    </Link>
                  </div>
                  <ReviewActions opportunityId={o.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
