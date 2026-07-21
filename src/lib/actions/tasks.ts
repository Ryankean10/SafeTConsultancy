"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cleanField } from "@/lib/form";
import type { TaskStatus } from "@/lib/types";

/** Create a task, optionally linked to an opportunity. Defaults assignee to self. */
export async function createTask(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const opportunityId = cleanField(formData.get("opportunity_id"));
  const title = cleanField(formData.get("title"));
  if (!title) return;

  const { error } = await supabase.from("tasks").insert({
    opportunity_id: opportunityId,
    title,
    due_date: cleanField(formData.get("due_date")),
    assignee: cleanField(formData.get("assignee")) ?? user.id,
    created_by: user.id,
  });
  if (error) throw new Error(error.message);

  if (opportunityId) revalidatePath(`/admin/leads/${opportunityId}`);
  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
}

/** Update a task's status (open/done/cancelled). */
export async function setTaskStatus(taskId: string, status: TaskStatus) {
  const supabase = await createClient();

  const { data: task, error: fetchErr } = await supabase
    .from("tasks")
    .select("opportunity_id")
    .eq("id", taskId)
    .single();
  if (fetchErr) throw new Error(fetchErr.message);

  const { error } = await supabase.from("tasks").update({ status }).eq("id", taskId);
  if (error) throw new Error(error.message);

  if (task.opportunity_id) revalidatePath(`/admin/leads/${task.opportunity_id}`);
  revalidatePath("/admin/tasks");
  revalidatePath("/admin");
}
