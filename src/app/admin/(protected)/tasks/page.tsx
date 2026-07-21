import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import TaskStatusToggle from "@/components/admin/TaskStatusToggle";
import type { TaskStatus } from "@/lib/types";

const FILTERS: { value: string; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "done", label: "Done" },
  { value: "all", label: "All" },
];

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = FILTERS.some((f) => f.value === status) ? status! : "open";

  const supabase = await createClient();
  let query = supabase
    .from("tasks")
    .select(
      "*, opportunity:opportunities(id, title), assignee_profile:profiles!tasks_assignee_fkey(full_name)"
    )
    .order("due_date", { ascending: true, nullsFirst: false });

  if (filter === "open" || filter === "done") {
    query = query.eq("status", filter);
  } else {
    query = query.neq("status", "cancelled");
  }

  const { data } = await query;
  const tasks = data ?? [];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Tasks</h1>
          <p className="mt-1 text-sm text-neutral-500">Across all opportunities</p>
        </div>
        <div className="flex rounded-md border border-black/15 text-sm overflow-hidden">
          {FILTERS.map((f) => (
            <Link
              key={f.value}
              href={`/admin/tasks?status=${f.value}`}
              className={`px-3 py-1.5 ${
                filter === f.value ? "bg-navy text-white" : "text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-black/20 bg-white p-10 text-center text-sm text-neutral-500">
          No {filter === "all" ? "" : filter} tasks.
        </div>
      ) : (
        <ul className="space-y-1.5">
          {tasks.map((t) => {
            const done = t.status === "done";
            const overdue = !done && t.due_date && t.due_date < today;
            const opportunity = t.opportunity as { id: string; title: string } | null;
            const assignee = (t.assignee_profile as { full_name: string | null } | null)?.full_name;
            return (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-md border border-black/10 bg-white px-4 py-2.5"
              >
                <TaskStatusToggle taskId={t.id} status={t.status as TaskStatus} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${done ? "text-neutral-400 line-through" : "text-neutral-800"}`}>
                    {t.title}
                  </p>
                  {opportunity && (
                    <Link
                      href={`/admin/leads/${opportunity.id}`}
                      className="text-[11px] text-navy-light hover:underline"
                    >
                      {opportunity.title}
                    </Link>
                  )}
                </div>
                {assignee && (
                  <span className="text-[11px] text-neutral-400 hidden sm:block">{assignee}</span>
                )}
                {t.due_date && (
                  <span
                    className={`text-[11px] ${overdue ? "font-medium text-red-600" : "text-neutral-400"}`}
                  >
                    {formatDate(t.due_date)}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
