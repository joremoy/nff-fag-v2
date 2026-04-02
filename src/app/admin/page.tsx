import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminClipTable } from "@/components/admin/AdminClipTable";
import { requireAdminUser } from "@/lib/auth";
import { listAllClipsForAdmin } from "@/lib/data";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const auth = await requireAdminUser();
  if (auth.reason) {
    return (
      <main className="appShell">
        <section className="panel">
          <h1>Admin</h1>
          <p>{auth.reason}</p>
        </section>
      </main>
    );
  }

  const { clips, error } = await listAllClipsForAdmin();

  async function logout() {
    "use server";
    const supabase = await getServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    redirect("/admin/login");
  }

  return (
    <main className="appShell">
      <section className="panel toolbar">
        <div>
          <p className="eyebrow">Innlogget admin</p>
          <h1>Administrasjon</h1>
        </div>

        <div className="buttonRow">
          <Link href="/admin/upload">Last opp klipp</Link>
          <form action={logout}>
            <button type="submit">Logg ut</button>
          </form>
        </div>
      </section>

      {error ? (
        <section className="panel">
          <p className="formMessage error">Kunne ikke hente klipp: {error}</p>
        </section>
      ) : null}

      <AdminClipTable clips={clips} />
    </main>
  );
}
