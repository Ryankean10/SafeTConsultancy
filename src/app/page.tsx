import { PrimaryButton, SecondaryButton, DarkButton } from "@/components/Button";
import Link from "next/link";

const trustBar = [
  "MCA Chief Engineer",
  "BESS Professional Engineer",
  "MGN 681 Trainer",
  "Global availability",
];

const pillars = [
  {
    title: "Safety",
    body: "MGN 681 lithium-ion compliance, risk assessment, and safe systems of work built to hold up at survey and in an emergency.",
    href: "/mgn-681",
  },
  {
    title: "Technical",
    body: "Design review, system assessment, and independent commissioning oversight from FAT/SAT through to handover.",
    href: "/services",
  },
  {
    title: "Project Management",
    body: "Structured, documentation-led delivery across new build and refit, so systems are compliant, maintainable, and ready for real-world use.",
    href: "/services",
  },
];

export default function Home() {
  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p className="text-xs tracking-widest text-accent uppercase mb-4">
            MCA Chief Engineer - BESS Professional Engineer
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold max-w-3xl mx-auto leading-tight">
            Engineering-led safety, technical and project management for superyachts
          </h1>
          <p className="mt-6 text-white/80 max-w-2xl mx-auto text-lg">
            Supporting new builds, refits, and MGN 681 lithium-ion compliance with structured,
            practical delivery - wherever the vessel is, from the Mediterranean to the Middle
            East to the Caribbean.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <PrimaryButton href="/contact">Book a consultation</PrimaryButton>
            <SecondaryButton href="/services">View services</SecondaryButton>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-neutral-600">
          {trustBar.map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-navy-light" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-semibold text-navy text-center mb-3">
          Built from operational experience
        </h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-12">
          Combining hands-on engineering knowledge with structured project execution across
          large-scale energy infrastructure and yacht construction and refit environments.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="rounded-lg border border-black/10 p-6 hover:border-navy-light hover:shadow-sm transition-all"
            >
              <h3 className="text-lg font-medium text-navy mb-2">{p.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{p.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs tracking-widest text-navy-light uppercase mb-3">
              MGN 681 lithium-ion compliance
            </p>
            <h2 className="text-2xl font-semibold text-navy mb-4">
              Beyond compliance on paper
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              Hazard identification, risk assessment, design compliance review and onboard
              training - built to bridge the gap between design intent, operational use, and
              real-world emergency readiness.
            </p>
            <div className="mt-6">
              <DarkButton href="/mgn-681">Learn more</DarkButton>
            </div>
          </div>
          <div className="rounded-lg bg-white border border-black/10 p-8">
            <ul className="space-y-4 text-sm text-neutral-700">
              <li className="flex gap-3"><span className="text-navy-light font-medium">01</span>HASID facilitation</li>
              <li className="flex gap-3"><span className="text-navy-light font-medium">02</span>Risk assessment</li>
              <li className="flex gap-3"><span className="text-navy-light font-medium">03</span>Design compliance review</li>
              <li className="flex gap-3"><span className="text-navy-light font-medium">04</span>Onboard training</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Discuss your project</h2>
            <p className="text-white/70 mt-2">
              For technical support across new build, refit, or commissioning phases.
            </p>
          </div>
          <PrimaryButton href="/contact">Book a consultation</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
