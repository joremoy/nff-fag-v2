import Link from "next/link";
import { notFound } from "next/navigation";
import { listPublishedClips, getPublicVideoUrl } from "@/lib/data";
import type { SituationType } from "@/lib/types";
import { isViewerSecretSlug } from "@/lib/viewer";

interface Props {
  params: Promise<{ secretSlug: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function ClipGridPage({ params, searchParams }: Props) {
  const { secretSlug } = await params;
  if (!isViewerSecretSlug(secretSlug)) {
    notFound();
  }

  const { type } = await searchParams;
  const { clips, error } = await listPublishedClips();

  const filtered = type
    ? clips.filter((c) => c.situation_type === type)
    : clips;

  const heading = type ?? "Nylig opplastede klipp";

  const clipsWithUrls = await Promise.all(
    filtered.map(async (clip) => {
      const videoUrl = await getPublicVideoUrl(clip.video_path);
      return { ...clip, videoUrl };
    }),
  );

  return (
    <main className="appShell">
      <Link href={`/${secretSlug}`} className="backBtn">
        ← Tilbake til meny
      </Link>

      <h1 className="clipGridTitle">{heading}</h1>

      {error ? (
        <p className="formMessage error">{error}</p>
      ) : null}

      {clipsWithUrls.length > 0 ? (
        <section className="clipGrid">
          {clipsWithUrls.map((clip) => (
            <Link key={clip.id} href={`/${secretSlug}/clip/${clip.id}`} className="clipCard">
              <div className="clipThumb">
                {clip.videoUrl ? (
                  <video src={clip.videoUrl} preload="metadata" muted />
                ) : null}
              </div>
              <div className="clipLabel">
                <div>{clip.title}</div>
                <div>{clip.situation_type}</div>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <p className="emptyState">
          {type
            ? `Ingen klipp i kategorien «${type}» ennå.`
            : "Ingen klipp er publisert ennå."}
        </p>
      )}
    </main>
  );
}
