import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NewOpportunityForm from "@/components/admin/NewOpportunityForm";

export default async function NewOpportunityPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, full_name, organisation")
    .order("full_name", { ascending: true });

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/leads" className="text-sm text-navy-light hover:underline">
          ← Back to board
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-navy">New opportunity</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Log a lead you&apos;ve spotted — link an existing contact or add a new one.
        </p>
      </div>

      <NewOpportunityForm contacts={contacts ?? []} />
    </div>
  );
}
