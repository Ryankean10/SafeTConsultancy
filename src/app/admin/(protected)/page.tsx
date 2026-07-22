import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_STAGES } from "@/lib/types";

const comingSoon = [
  {
    title: "Traffic",
    body: "First-party visitor analytics, with each lead's journey before they enquired.",
    status: "Milestone 3",
  },
  {
    title: "Lead scoring",
    body: "Automatic ranking of leads by fit and intent so the hottest surface first.",
    status: "Milestone 4",
  },
];

export default async function AdminDashboard() {
  const supabase = await createClient();

  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().slice(0, 10);

  const [{ count: openOpps }, { count: tasksDue }] = await Promise.all([
    supabase
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .in("stage", ACTIVE_STAGES)
      .or("ai_status.is.null,ai_status.eq.accepted"),
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "open")
      .lte("due_date", weekEndStr),
  ]);

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Welcome to the Safe-T Consultancy management area.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/leads"
          className="rounded-lg border border-black/10 bg-white p-5 hover:border-navy-light hover:shadow-sm transition-all"
        >
          <p className="text-sm font-medium text-neutral-500">Open opportunities</p>
          <p className="mt-1 text-3xl font-semibold text-navy">{openOpps ?? 0}</p>
          <p className="mt-1 text-xs text-neutral-400">In the active pipeline</p>
        </Link>
        <Link
          href="/admin/tasks"
          className="rounded-lg border border-black/10 bg-white p-5 hover:border-navy-light hover:shadow-sm transition-all"
        >
          <p className="text-sm font-medium text-neutral-500">Tasks due this week</p>
          <p className="mt-1 text-3xl font-semibold text-navy">{tasksDue ?? 0}</p>
          <p className="mt-1 text-xs text-neutral-400">Open, due within 7 days</p>
        </Link>
      </div>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        Coming soon
      </h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {comingSoon.map((c) => (
          <div key={c.title} className="rounded-lg border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-navy">{c.title}</h3>
              <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-medium text-navy-light">
                {c.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
