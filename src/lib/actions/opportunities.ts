"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cleanField } from "@/lib/form";
import { canTransition, type ActivityType, type OpportunityStage } from "@/lib/types";

/**
 * Create an opportunity, optionally creating a contact inline first.
 * Authorisation is enforced by RLS (is_staff_or_admin); a signed-in
 * client-role user's inserts are rejected at the database.
 */
export async function createOpportunity(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Resolve contact: an existing one, or a new one entered inline.
  let contactId = cleanField(formData.get("contact_id"));
  const newContactName = cleanField(formData.get("new_contact_name"));
  if (!contactId && newContactName) {
    const { data: contact, error } = await supabase
      .from("contacts")
      .insert({
        full_name: newContactName,
        organisation: cleanField(formData.get("new_contact_org")),
        role_title: cleanField(formData.get("new_contact_role")),
        email: cleanField(formData.get("new_contact_email")),
        phone: cleanField(formData.get("new_contact_phone")),
        linkedin_url: cleanField(formData.get("new_contact_linkedin")),
        source: cleanField(formData.get("source")),
        created_by: user.id,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    contactId = contact.id;
  }

  const estValue = cleanField(formData.get("estimated_value"));

  const { data: opp, error } = await supabase
    .from("opportunities")
    .insert({
      title: cleanField(formData.get("title")) ?? "Untitled opportunity",
      description: cleanField(formData.get("description")),
      source: cleanField(formData.get("source")),
      source_url: cleanField(formData.get("source_url")),
      estimated_value: estValue ? Number(estValue) : null,
      currency: cleanField(formData.get("currency")) ?? "GBP",
      vessel_type: cleanField(formData.get("vessel_type")),
      project_size: cleanField(formData.get("project_size")),
      contact_id: contactId,
      owner: user.id,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  redirect(`/admin/leads/${opp.id}`);
}

/**
 * Move an opportunity to a new stage. The fork rule (won/lost off proposal,
 * invoiced/paid only after won, no lost→invoiced) is enforced here as well as
 * in the UI. A stage_change activity is auto-logged by a database trigger.
 */
export async function updateStage(opportunityId: string, newStage: OpportunityStage) {
  const supabase = await createClient();

  const { data: current, error: fetchErr } = await supabase
    .from("opportunities")
    .select("stage")
    .eq("id", opportunityId)
    .single();
  if (fetchErr) throw new Error(fetchErr.message);

  const from = current.stage as OpportunityStage;
  if (!canTransition(from, newStage)) {
    throw new Error(`Illegal stage change: ${from} → ${newStage}`);
  }

  const { error } = await supabase
    .from("opportunities")
    .update({ stage: newStage })
    .eq("id", opportunityId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${opportunityId}`);
  revalidatePath("/admin");
}

/** Add a manual activity (note/call/email/meeting) to an opportunity timeline. */
export async function addActivity(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const opportunityId = String(formData.get("opportunity_id"));
  const body = cleanField(formData.get("body"));
  const type = (cleanField(formData.get("type")) ?? "note") as ActivityType;
  if (!opportunityId || !body) return;

  const { error } = await supabase.from("opportunity_activities").insert({
    opportunity_id: opportunityId,
    type,
    body,
    created_by: user.id,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/leads/${opportunityId}`);
}
