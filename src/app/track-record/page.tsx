import type { Metadata } from "next";
import { DarkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "Track Record | Safe-T Consultancy",
  description:
    "Illustrative project examples across BESS commissioning, superyacht refit, and MGN 681 lithium-ion compliance.",
};

const projects = [
  {
    tag: "Energy infrastructure",
    title: "Battery energy storage commissioning",
    body: "Commissioning oversight for a multi-megawatt battery energy storage installation, including FAT/SAT witnessing and system validation.",
  },
  {
    tag: "Refit",
    title: "Superyacht refit technical scope",
    body: "Technical scope development and engineering input for a superyacht refit, covering mechanical and electrical systems.",
  },
  {
    tag: "Compliance",
    title: "MGN 681 lithium-ion compliance review",
    body: "MGN 681 compliance review for a lithium-ion installation, including HASID facilitation and accredited crew training.",
  },
];

export default function TrackRecord() {
  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs tracking-widest text-accent uppercase mb-4">Track record</p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Project experience, vessel-anonymous by design
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Yacht confidentiality is standard practice. These examples describe scope and outcome
            without naming vessels or owners.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 space-y-6">
        {projects.map((p) => (
          <div key={p.title} className="rounded-lg border border-black/10 p-6">
            <p className="text-xs tracking-widest text-navy-light uppercase mb-2">{p.tag}</p>
            <h2 className="text-lg font-medium text-navy mb-2">{p.title}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{p.body}</p>
          </div>
        ))}

        <div className="rounded-lg border border-dashed border-black/20 p-6 bg-sand">
          <p className="text-sm text-neutral-600">
            These entries are illustrative placeholders. Swap in real project types, scope, and
            outcomes (vessel size or system kW rating, your role, and result) to replace this text
            before launch.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <DarkButton href="/contact">Discuss your project</DarkButton>
      </section>
    </div>
  );
}
