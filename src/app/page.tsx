import Link from "next/link";
import { getViewerSecretSlug } from "@/lib/viewer";

export default function Home() {
  const viewerSlug = getViewerSecretSlug();

  return (
    <main className="centeredPage">
      <section className="panel hero">
        <p className="eyebrow">Norges Fotballforbund</p>
        <h1>NFF Fag V2</h1>
        <p>Portal for opplasting, sortering og visning av dommerfaglige klipp.</p>

        <div className="buttonRow">
          <Link href="/admin/login">Admin innlogging</Link>
          <Link href={`/${viewerSlug}`}>Åpne dommerportal</Link>
        </div>
      </section>
    </main>
  );
}
