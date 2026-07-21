import { STAGE_LABELS, type OpportunityStage } from "@/lib/types";

const STAGE_CLASSES: Record<OpportunityStage, string> = {
  identified: "bg-neutral-100 text-neutral-600",
  contacted: "bg-accent/10 text-accent",
  qualified: "bg-navy-light/10 text-navy-light",
  proposal: "bg-gold/15 text-gold",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-600",
  invoiced: "bg-navy/10 text-navy",
  paid: "bg-green-600 text-white",
};

export default function StageBadge({
  stage,
  className = "",
}: {
  stage: OpportunityStage;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STAGE_CLASSES[stage]} ${className}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
