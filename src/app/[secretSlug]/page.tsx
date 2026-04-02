import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewerFilterBar } from "@/components/viewer/ViewerFilterBar";
import { listPublishedClips } from "@/lib/data";
import type { League, SituationType } from "@/lib/types";
import { filterAndSortClips } from "@/lib/utils/clip-filter";
import { isViewerSecretSlug } from "@/lib/viewer";

interface Props {
  params: Promise<{ secretSlug: string }>;
  searchParams: Promise<{ type?: SituationType; league?: League }>;
}

export default async function ViewerIndexPage({ params, searchParams }: Props) {
  const { secretSlug } = await params;
  if (!isViewerSecretSlug(secretSlug)) {
    notFound();
  }

  const filters = await searchParams;
  const { clips, error } = await listPublishedClips();
  const filtered = filterAndSortClips(clips, {
    type: filters.type,
    league: filters.league,
  });

  return (
    <main className="appShell">
      <section className="panel toolbar">
        <div>
          <p className="eyebrow">NFF Dommerportal</p>
          <h1>Klipp fra siste runder</h1>
        </div>
      </section>

      <ViewerFilterBar />

      {error ? (
        <section className="panel">
          <p className="formMessage error">{error}</p>
        </section>
      ) : null}

      <section className="clipGrid">
        {filtered.map((clip) => (
          <Link key={clip.id} href={`/${secretSlug}/clip/${clip.id}`} className="clipCard">
            <div className="clipMeta">
              <span>{clip.league}</span>
              <span>{clip.round ? `Runde ${clip.round}` : "Runde ukjent"}</span>
            </div>
            <h2>{clip.title}</h2>
            <p>{clip.situation_type}</p>
            <span className="chip">Åpne klipp</span>
          </Link>
        ))}
      </section>

      {!filtered.length ? (
        <section className="panel">
          <p>Ingen klipp matcher filtrene.</p>
        </section>
      ) : null}
    </main>
  );
}
