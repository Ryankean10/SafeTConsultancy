import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/admin/SignOutButton";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this, but re-check so we never render admin
  // chrome without a verified user, and to load their profile.
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-56 shrink-0 bg-navy text-white flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="font-semibold">Safe-T Admin</p>
          <p className="text-xs text-white/60 mt-0.5 truncate">
            {profile?.full_name ?? user.email}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <Link
            href="/admin"
            className="block rounded-md px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          {/* Built in later milestones */}
          <span className="block rounded-md px-3 py-2 text-white/35 cursor-default">
            Leads · soon
          </span>
          <span className="block rounded-md px-3 py-2 text-white/35 cursor-default">
            Traffic · soon
          </span>
          {profile?.role === "admin" && (
            <span className="block rounded-md px-3 py-2 text-white/35 cursor-default">
              Team · soon
            </span>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
