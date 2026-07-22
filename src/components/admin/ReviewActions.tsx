"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { acceptOpportunity, dismissOpportunity } from "@/lib/actions/discovery";

export default function ReviewActions({ opportunityId }: { opportunityId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: (id: string) => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action(opportunityId);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => run(acceptOpportunity)}
        disabled={pending}
        className="inline-flex items-center rounded-md bg-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-light transition-colors disabled:opacity-50"
      >
        Accept
      </button>
      <button
        onClick={() => run(dismissOpportunity)}
        disabled={pending}
        className="inline-flex items-center rounded-md border border-black/15 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
      >
        Dismiss
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
