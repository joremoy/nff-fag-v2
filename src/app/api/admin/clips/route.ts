import { NextResponse } from "next/server";
import { clipSchema, isAllowedMp4 } from "@/lib/validators";
import { getAdminFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await getAdminFromRequest();
  if (!auth.user || !auth.supabase) {
    return NextResponse.json({ message: "Ikke autorisert." }, { status: 401 });
  }

  const formData = await request.formData();

  const video = formData.get("video");
  if (!(video instanceof File)) {
    return NextResponse.json({ message: "Video mangler." }, { status: 400 });
  }

  if (!isAllowedMp4(video)) {
    return NextResponse.json({ message: "Kun .mp4 er tillatt." }, { status: 400 });
  }

  const payload = {
    title: String(formData.get("title") ?? ""),
    situationType: String(formData.get("situationType") ?? ""),
    league: String(formData.get("league") ?? ""),
    round: formData.get("round") ? Number(formData.get("round")) : null,
    matchNumber: formData.get("matchNumber") ? String(formData.get("matchNumber")) : null,
    conclusionText: String(formData.get("conclusionText") ?? ""),
    published: String(formData.get("published")) === "true",
  };

  const parsed = clipSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Ugyldige data." }, { status: 400 });
  }

  const safeTitle = parsed.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const path = `${auth.user.id}/${Date.now()}-${safeTitle || "clip"}.mp4`;

  const uploadResult = await auth.supabase.storage.from("clips").upload(path, video, {
    cacheControl: "3600",
    upsert: false,
    contentType: "video/mp4",
  });

  if (uploadResult.error) {
    return NextResponse.json({ message: `Opplasting feilet: ${uploadResult.error.message}` }, { status: 500 });
  }

  const { data, error } = await auth.supabase
    .from("clips")
    .insert({
      title: parsed.data.title,
      video_path: path,
      situation_type: parsed.data.situationType,
      league: parsed.data.league,
      round: parsed.data.round,
      match_number: parsed.data.matchNumber,
      conclusion_text: parsed.data.conclusionText,
      uploaded_at: new Date().toISOString(),
      created_by: auth.user.id,
      published: parsed.data.published,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: `Kunne ikke lagre klipp: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ message: "Klipp lagret.", clip: data });
}
