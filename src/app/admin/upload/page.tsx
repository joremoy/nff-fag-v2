import Link from "next/link";
import { AdminUploadForm } from "@/components/admin/AdminUploadForm";
import { requireAdminUser } from "@/lib/auth";

export default async function AdminUploadPage() {
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

  return (
    <main className="appShell">
      <section className="panel toolbar">
        <div>
          <p className="eyebrow">Administrasjon</p>
          <h1>Last opp klipp</h1>
        </div>
        <div className="buttonRow">
          <Link href="/admin">Til dashboard</Link>
        </div>
      </section>
      <AdminUploadForm />
    </main>
  );
}
