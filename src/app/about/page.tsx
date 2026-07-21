import type { Metadata } from "next";
import { DarkButton } from "@/components/Button";

export const metadata: Metadata = {
  title: "About | Safe-T Consultancy",
  description:
    "MCA Chief Engineer and BESS Professional Engineer background, applied to superyacht new build, refit, and lithium-ion compliance projects.",
};

const credentials = [
  "MCA Chief Engineer",
  "BESS Professional Engineer",
  "MGN 681 Trainer",
  "Class 1 Marine Engineer",
];

export default function About() {
  return (
    <div>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs tracking-widest text-accent uppercase mb-4">About</p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Formal qualification, applied through hands-on delivery
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-lg text-neutral-700 leading-relaxed">
          Safe-T Consultancy is led by a Class 1 Marine Engineer with an MCA Chief Engineer
          qualification and a BESS Professional Engineer background - grounding that spans
          seafaring, shore-based engineering, and energy and marine consultancy. That combination
          of formal qualification and hands-on delivery is what the practice is built on: not a
          generic yacht consultant, but someone who has stood in front of both a battery energy
          storage system and a superyacht engine room and answered for the same kind of question -
          is this safe, is this compliant, and will it actually work in service.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-3">
          {credentials.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-md border border-black/10 px-4 py-3 text-sm text-neutral-700">
              <span className="h-1.5 w-1.5 rounded-full bg-navy-light shrink-0" />
              {c}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-medium text-navy mt-14 mb-3">Project exposure</h2>
        <ul className="space-y-2 text-neutral-700">
          <li>Large-scale energy infrastructure - BESS projects and HV systems</li>
          <li>Yacht construction and refit environments</li>
          <li>Complex mechanical and electrical systems</li>
          <li>Commissioning and testing environments</li>
        </ul>

        <h2 className="text-xl font-medium text-navy mt-14 mb-3">How this works in practice</h2>
        <p className="text-neutral-700 leading-relaxed">
          Structured, practical delivery - systems reviewed and documented in a way that is not
          only compliant, but maintainable and ready for the crew who inherit them. That means
          clear scopes, independent verification at the points that matter (design review, FAT/SAT,
          pre-commissioning), and documentation built for handover, not just for the file.
        </p>

        <div className="mt-12">
          <DarkButton href="/contact">Book a consultation</DarkButton>
        </div>
      </section>
    </div>
  );
}
