import Link from "next/link";
import { notFound } from "next/navigation";
import { SITUATION_TYPES } from "@/lib/constants";
import { isViewerSecretSlug } from "@/lib/viewer";

interface Props {
  params: Promise<{ secretSlug: string }>;
}

const GROUP_1 = SITUATION_TYPES.filter((t) =>
  ["Taklinger", "Straffespark", "DOGSO/SPA", "Hands", "Holding", "Offside"].includes(t),
);

const GROUP_2 = SITUATION_TYPES.filter((t) =>
  ["Management", "Samarbeid", "Laws of the Game"].includes(t),
);

export default async function MenuPage({ params }: Props) {
  const { secretSlug } = await params;
  if (!isViewerSecretSlug(secretSlug)) {
    notFound();
  }

  return (
    <main className="menuContainer">
      {/* Recent clips — standalone */}
      <div className="menuSection">
        <Link href={`/${secretSlug}/clip`} className="menuBtn">
          Nylige klipp
        </Link>
      </div>

      {/* Situation types */}
      <div className="menuSection">
        {GROUP_1.map((type) => (
          <Link
            key={type}
            href={`/${secretSlug}/clip?type=${encodeURIComponent(type)}`}
            className="menuBtn"
          >
            {type}
          </Link>
        ))}
      </div>

      {/* Other categories */}
      <div className="menuSection">
        {GROUP_2.map((type) => (
          <Link
            key={type}
            href={`/${secretSlug}/clip?type=${encodeURIComponent(type)}`}
            className="menuBtn"
          >
            {type}
          </Link>
        ))}
      </div>
    </main>
  );
}
