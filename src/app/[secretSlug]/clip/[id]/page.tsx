import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipPlayer } from "@/components/viewer/ClipPlayer";
import { getClipById, getPublicVideoUrl } from "@/lib/data";
import { isViewerSecretSlug } from "@/lib/viewer";

interface Props {
  params: Promise<{ secretSlug: string; id: string }>;
}

export default async function ClipDetailPage({ params }: Props) {
  const { secretSlug, id } = await params;

  if (!isViewerSecretSlug(secretSlug)) {
    notFound();
  }

  const { clip, error } = await getClipById(id);
  if (!clip || !clip.published) {
    notFound();
  }

  const videoUrl = await getPublicVideoUrl(clip.video_path);

  return (
    <main className="appShell">
      <Link href={`/${secretSlug}/clip`} className="backBtn">
        ← Tilbake til klipp
      </Link>

      {error ? <p className="formMessage error">{error}</p> : null}

      {videoUrl ? (
        <ClipPlayer title={clip.title} videoUrl={videoUrl} conclusionText={clip.conclusion_text} />
      ) : (
        <p className="formMessage error">Fant ikke videofil for klippet.</p>
      )}
    </main>
  );
}
