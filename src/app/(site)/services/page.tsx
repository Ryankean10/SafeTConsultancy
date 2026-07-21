import type { Metadata } from "next";
import Link from "next/link";
import { DarkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "Services | Safe-T Consultancy",
  description:
    "Technical consultancy, inspection and commissioning, documentation and systems, and operational readiness support for superyacht new build and refit projects.",
};

const services = [
  {
    title: "Technical consultancy",
    hook: "Catch design and system issues before they become expensive change orders.",
    items: ["Design review", "System assessment", "Engineering input during build"],
  },
  {
    title: "Inspection and commissioning",
    hook: "Independent verification that systems perform as specified before handover, not after.",
    items: ["Pre-commissioning inspections", "FAT / SAT witnessing", "System validation"],
  },
  {
    title: "Documentation and systems",
    hook: "Leave the vessel with manuals and maintenance plans the crew will actually use.",
    items: ["O&M manual development", "Planned maintenance setup", "Spare parts strategy"],
  },
  {
    title: "Operational readiness",
    hook: "Crew and procedures ready for survey and real-world operation, not just paperwork.",
    items: ["SOP development", "Safety systems (SSOW)", "Crew technical structure"],
  },
];

export default function Services() {
  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs tracking-widest text-accent uppercase mb-4">Services</p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Targeted support across the full project lifecycle
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div key={s.title} className="rounded-lg border border-black/10 p-6">
            <h2 className="text-lg font-medium text-navy mb-2">{s.title}</h2>
            <p className="text-sm text-neutral-600 mb-4">{s.hook}</p>
            <ul className="space-y-1.5 text-sm text-neutral-700">
              {s.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-navy-light">-</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-5xl px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-widest text-navy-light uppercase mb-2">
              MGN 681 lithium-ion compliance
            </p>
            <h2 className="text-xl font-semibold text-navy">
              End-to-end support for lithium-ion battery compliance
            </h2>
            <p className="text-neutral-600 mt-2 max-w-xl">
              Hazard identification, risk assessment, design review, operational procedures, and
              onboard training.
            </p>
          </div>
          <Link
            href="/mgn-681"
            className="inline-flex items-center justify-center rounded-md bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy-light transition-colors whitespace-nowrap"
          >
            Learn more
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 text-center">
        <h2 className="text-xl font-semibold text-navy mb-3">Work with us</h2>
        <p className="text-neutral-600 max-w-xl mx-auto mb-6">
          For technical support across new build, refit, or commissioning phases.
        </p>
        <DarkButton href="/contact">Book a consultation</DarkButton>
      </section>
    </div>
  );
}
