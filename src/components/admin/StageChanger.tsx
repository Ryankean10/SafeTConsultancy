"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateStage } from "@/lib/actions/opportunities";
import StageBadge from "@/components/admin/StageBadge";
import { STAGE_LABELS, STAGE_TRANSITIONS, type OpportunityStage } from "@/lib/types";

export default function StageChanger({
  opportunityId,
  stage,
}: {
  opportunityId: string;
  stage: OpportunityStage;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const next = STAGE_TRANSITIONS[stage] ?? [];

  function move(to: OpportunityStage) {
    setError(null);
    startTransition(async () => {
      try {
        await updateStage(opportunityId, to);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to change stage");
      }
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-neutral-500">Stage</span>
        <StageBadge stage={stage} />
      </div>

      {next.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {next.map((s) => (
            <button
              key={s}
              onClick={() => move(s)}
              disabled={pending}
              className="inline-flex items-center rounded-md border border-navy/20 px-3 py-1.5 text-xs font-medium text-navy hover:bg-navy hover:text-white transition-colors disabled:opacity-50"
            >
              Move to {STAGE_LABELS[s]}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-xs text-neutral-500">Closed — no further stages.</p>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
