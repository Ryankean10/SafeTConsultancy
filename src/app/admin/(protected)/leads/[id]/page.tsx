import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatMoney, formatDate } from "@/lib/format";
import StageChanger from "@/components/admin/StageChanger";
import TaskStatusToggle from "@/components/admin/TaskStatusToggle";
import { addActivity } from "@/lib/actions/opportunities";
import { createTask } from "@/lib/actions/tasks";
import type { ActivityType, OpportunityStage } from "@/lib/types";

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  note: "Note",
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  stage_change: "Stage change",
};

function labelFor(v: string | null) {
  if (!v) return null;
  return v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function OpportunityDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: opp } = await supabase
    .from("opportunities")
    .select(
      "*, contact:contacts(*), owner_profile:profiles!opportunities_owner_fkey(full_name)"
    )
    .eq("id", id)
    .single();

  if (!opp) notFound();

  const { data: activities } = await supabase
    .from("opportunity_activities")
    .select("*, author:profiles!opportunity_activities_created_by_fkey(full_name)")
    .eq("opportunity_id", id)
    .order("created_at", { ascending: false });

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*, assignee_profile:profiles!tasks_assignee_fkey(full_name)")
    .eq("opportunity_id", id)
    .order("due_date", { ascending: true, nullsFirst: false });

  const contact = opp.contact as {
    full_name: string;
    organisation: string | null;
    role_title: string | null;
    email: string | null;
    phone: string | null;
    linkedin_url: string | null;
  } | null;

  const money = formatMoney(opp.estimated_value, opp.currency);
  const inputCls =
    "w-full rounded-md border border-black/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-light";

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/admin/leads" className="text-sm text-navy-light hover:underline">
        ← Back to board
      </Link>

      <div className="mt-3 mb-6">
        <h1 className="text-2xl font-semibold text-navy">{opp.title}</h1>
        {opp.description && (
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed max-w-2xl">
            {opp.description}
          </p>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main column */}
        <div className="md:col-span-2 space-y-8">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <StageChanger opportunityId={opp.id} stage={opp.stage as OpportunityStage} />
          </div>

          {/* Activity timeline */}
          <div>
            <h2 className="text-sm font-medium text-navy mb-3">Activity</h2>
            <form action={addActivity} className="rounded-lg border border-black/10 bg-white p-4 mb-4">
              <input type="hidden" name="opportunity_id" value={opp.id} />
              <div className="flex gap-2 mb-2">
                <select name="type" className="rounded-md border border-black/15 px-2 py-1.5 text-sm" defaultValue="note">
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <textarea
                name="body"
                required
                rows={2}
                className={inputCls}
                placeholder="Log a note, call, email or meeting…"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy-light transition-colors"
                >
                  Add
                </button>
              </div>
            </form>

            <ul className="space-y-3">
              {(activities ?? []).map((a) => {
                const author = (a.author as { full_name: string | null } | null)?.full_name;
                const isStage = a.type === "stage_change";
                return (
                  <li key={a.id} className="flex gap-3">
                    <div
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        isStage ? "bg-gold" : "bg-navy-light"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-700">
                        <span className="font-medium text-navy">
                          {ACTIVITY_LABEL[a.type as ActivityType]}
                        </span>
                        {a.body ? <>: {a.body}</> : null}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        {author ? `${author} · ` : ""}
                        {formatDate(a.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
              {(activities ?? []).length === 0 && (
                <li className="text-sm text-neutral-400">No activity yet.</li>
              )}
            </ul>
          </div>

          {/* Tasks */}
          <div>
            <h2 className="text-sm font-medium text-navy mb-3">Tasks</h2>
            <form action={createTask} className="flex gap-2 mb-3">
              <input type="hidden" name="opportunity_id" value={opp.id} />
              <input name="title" required placeholder="Add a task…" className={inputCls} />
              <input name="due_date" type="date" className="rounded-md border border-black/15 px-2 py-2 text-sm" />
              <button
                type="submit"
                className="shrink-0 inline-flex items-center rounded-md bg-navy px-4 py-2 text-xs font-medium text-white hover:bg-navy-light transition-colors"
              >
                Add
              </button>
            </form>

            <ul className="space-y-1.5">
              {(tasks ?? []).map((t) => {
                const done = t.status === "done";
                return (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 rounded-md border border-black/10 bg-white px-3 py-2"
                  >
                    <TaskStatusToggle taskId={t.id} status={t.status} />
                    <span className={`flex-1 text-sm ${done ? "text-neutral-400 line-through" : "text-neutral-700"}`}>
                      {t.title}
                    </span>
                    {t.due_date && (
                      <span className="text-[11px] text-neutral-400">{formatDate(t.due_date)}</span>
                    )}
                  </li>
                );
              })}
              {(tasks ?? []).length === 0 && (
                <li className="text-sm text-neutral-400">No tasks.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
              Contact
            </h2>
            {contact ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-navy">{contact.full_name}</p>
                {contact.role_title && <p className="text-neutral-600">{contact.role_title}</p>}
                {contact.organisation && <p className="text-neutral-600">{contact.organisation}</p>}
                {contact.email && (
                  <p>
                    <a href={`mailto:${contact.email}`} className="text-navy-light hover:underline">
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact.phone && (
                  <p>
                    <a href={`tel:${contact.phone}`} className="text-navy-light hover:underline">
                      {contact.phone}
                    </a>
                  </p>
                )}
                {contact.linkedin_url && (
                  <p>
                    <a
                      href={contact.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-light hover:underline"
                    >
                      LinkedIn
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No contact linked.</p>
            )}
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-3">
              Details
            </h2>
            <dl className="space-y-2 text-sm">
              <Row label="Value" value={money} />
              <Row label="Vessel / project" value={labelFor(opp.vessel_type)} />
              <Row label="Size" value={labelFor(opp.project_size)} />
              <Row label="Source" value={labelFor(opp.source)} />
              <Row
                label="Owner"
                value={(opp.owner_profile as { full_name: string | null } | null)?.full_name ?? null}
              />
              <Row label="Created" value={formatDate(opp.created_at)} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-neutral-800 text-right">{value ?? "—"}</dd>
    </div>
  );
}
