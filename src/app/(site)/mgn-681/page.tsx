import type { Metadata } from "next";
import { DarkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "MGN 681 Lithium-Ion Compliance | Safe-T Consultancy",
  description:
    "MGN 681 lithium-ion compliance support for yachts: HASID facilitation, risk assessment, design compliance review, and onboard crew training.",
};

const offerings = [
  {
    title: "HASID facilitation",
    body: "Structured hazard identification workshops to identify credible failure modes, operational risks, escalation pathways, and emergency considerations associated with lithium-ion battery installations.",
  },
  {
    title: "Risk assessment",
    body: "Development or review of installation-specific risk assessments covering thermal runaway, fire, gas release, ventilation, detection, suppression, isolation, and recovery considerations.",
  },
  {
    title: "Design compliance review",
    body: "Independent review of the battery installation against applicable guidance, intended operational use, and practical vessel integration requirements, including layout, segregation, monitoring, detection, ventilation, firefighting provisions, and emergency response considerations.",
  },
  {
    title: "Onboard training",
    body: "Crew-facing training tailored to the installed system, covering lithium-ion hazards, warning signs, emergency response, isolation, escalation, firefighting considerations, and operational good practice.",
  },
];

export default function Mgn681() {
  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs tracking-widest text-accent uppercase mb-4">
            MGN 681 lithium-ion compliance
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-6">
            A practical compliance package, not a paperwork exercise
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            MGN 681 compliance is increasingly checked at survey and at insurance renewal, and
            lithium-ion incidents are a known insurer concern. This page covers what a proper
            review looks like - before it becomes a finding.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-xl font-medium text-navy mb-6">What we offer</h2>
        <div className="space-y-6">
          {offerings.map((o) => (
            <div key={o.title} className="border-b border-black/10 pb-6 last:border-0">
              <h3 className="text-base font-medium text-navy mb-2">{o.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-xl font-semibold text-navy mb-3">Beyond compliance on paper</h2>
          <p className="text-neutral-700 leading-relaxed">
            Lithium-ion systems introduce risks which require more than a standard paperwork
            exercise. Effective compliance depends on clear hazard identification, a realistic
            understanding of failure scenarios, suitable vessel integration, and crew who know how
            to respond correctly onboard. This support package is designed to bridge the gap
            between design intent, operational use, and real-world emergency readiness.
          </p>
          <div className="mt-8">
            <DarkButton href="/contact">Discuss more</DarkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
