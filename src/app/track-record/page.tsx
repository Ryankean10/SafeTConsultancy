import type { Metadata } from "next";
import { DarkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "Track Record | Safe-T Consultancy",
  description:
    "Project examples across grid-scale battery energy storage delivery, superyacht refit management, new build assurance, and operational readiness.",
};

const projects = [
  {
    tag: "Energy infrastructure",
    title: "End-to-end BESS delivery, Scotland",
    body: "Engineering-to-PM delivery of battery energy storage systems across numerous grid-connected projects in Scotland, covering design, procurement, and delivery through to energisation.",
  },
  {
    tag: "Refit",
    title: "Military-specification vessel refit",
    body: "Refit management for a multi-million dollar vessel to military specification, including helicopter operations infrastructure and a complete overhaul of the main machinery and propulsion in the engine room.",
  },
  {
    tag: "New build",
    title: "New build assurance and independent snagging",
    body: "Independent assurance and snagging across the full build specification, verifying the delivered vessel matches what was contracted and paid for.",
  },
  {
    tag: "Operations",
    title: "Operational readiness and vessel management systems",
    body: "Development of bespoke, class-compliant vessel operational systems - covering stock management and future-proofing - to support long-term operational readiness.",
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
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 text-center">
        <DarkButton href="/contact">Discuss your project</DarkButton>
      </section>
    </div>
  );
}
