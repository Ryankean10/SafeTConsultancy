import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/format";
import {
  ACTIVE_STAGES,
  CLOSED_STAGES,
  STAGE_LABELS,
  type OpportunityStage,
} from "@/lib/types";

interface BoardOpp {
  id: string;
  title: string;
  stage: OpportunityStage;
  estimated_value: number | null;
  currency: string | null;
  contact: { full_name: string; organisation: string | null } | null;
  owner_profile: { full_name: string | null } | null;
}

export default async function LeadsBoard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("opportunities")
    .select(
      "id, title, stage, estimated_value, currency, contact:contacts(full_name, organisation), owner_profile:profiles!opportunities_owner_fkey(full_name)"
    )
    // Hide AI-found opportunities still pending review (or dismissed); show human
    // opportunities (ai_status null) and accepted AI ones.
    .or("ai_status.is.null,ai_status.eq.accepted")
    .order("updated_at", { ascending: false });

  const opps = (data ?? []) as unknown as BoardOpp[];
  const inStage = (s: OpportunityStage) => opps.filter((o) => o.stage === s);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Leads</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {opps.length} opportunit{opps.length === 1 ? "y" : "ies"} in the pipeline
          </p>
        </div>
        <Link
          href="/admin/leads/new"
          className="inline-flex items-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light transition-colors"
        >
          New opportunity
        </Link>
      </div>

      {opps.length === 0 ? (
        <div className="rounded-lg border border-dashed border-black/20 bg-white p-10 text-center">
          <p className="text-sm text-neutral-600">No opportunities yet.</p>
          <Link
            href="/admin/leads/new"
            className="mt-3 inline-flex items-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light transition-colors"
          >
            Add your first opportunity
          </Link>
        </div>
      ) : (
        <>
          {/* Active pipeline — full columns */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {ACTIVE_STAGES.map((stage) => (
              <Column key={stage} stage={stage} opps={inStage(stage)} />
            ))}
          </div>

          {/* Closed / settled — slimmer columns */}
          <div className="mt-8">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
              Closed
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CLOSED_STAGES.map((stage) => (
                <Column key={stage} stage={stage} opps={inStage(stage)} slim />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Column({
  stage,
  opps,
  slim = false,
}: {
  stage: OpportunityStage;
  opps: BoardOpp[];
  slim?: boolean;
}) {
  return (
    <div className={slim ? "" : "w-72 shrink-0"}>
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {STAGE_LABELS[stage]}
        </span>
        <span className="text-xs text-neutral-400">{opps.length}</span>
      </div>
      <div className="space-y-2 rounded-lg bg-neutral-100/70 p-2 min-h-[80px]">
        {opps.map((o) => (
          <OppCard key={o.id} o={o} />
        ))}
        {opps.length === 0 && (
          <p className="px-2 py-4 text-center text-[11px] text-neutral-400">—</p>
        )}
      </div>
    </div>
  );
}

function OppCard({ o }: { o: BoardOpp }) {
  const money = formatMoney(o.estimated_value, o.currency);
  return (
    <Link
      href={`/admin/leads/${o.id}`}
      className="block rounded-lg border border-black/10 bg-white p-3 hover:border-navy-light hover:shadow-sm transition-all"
    >
      <p className="text-sm font-medium text-navy leading-snug">{o.title}</p>
      {o.contact?.organisation && (
        <p className="mt-1 text-xs text-neutral-500 truncate">{o.contact.organisation}</p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        {money ? (
          <span className="text-xs font-medium text-navy-light">{money}</span>
        ) : (
          <span />
        )}
        {o.owner_profile?.full_name && (
          <span className="text-[11px] text-neutral-400 truncate">
            {o.owner_profile.full_name.split(" ")[0]}
          </span>
        )}
      </div>
    </Link>
  );
}
