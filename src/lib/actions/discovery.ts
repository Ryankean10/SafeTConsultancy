"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AiStatus } from "@/lib/types";

async function setAiStatus(id: string, status: AiStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("opportunities")
    .update({ ai_status: status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads/review");
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

/** Promote an AI-found opportunity into the live pipeline. */
export async function acceptOpportunity(id: string) {
  await setAiStatus(id, "accepted");
}

/** Reject an AI-found opportunity; it drops out of the review queue and board. */
export async function dismissOpportunity(id: string) {
  await setAiStatus(id, "dismissed");
}
