import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminFromRequest } from "@/lib/auth";

const patchSchema = z.object({
  published: z.boolean().optional(),
  title: z.string().min(2).optional(),
  conclusion_text: z.string().min(3).optional(),
  round: z.number().int().min(1).max(60).nullable().optional(),
  match_number: z.string().max(40).nullable().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  const auth = await getAdminFromRequest();
  if (!auth.user || !auth.supabase) {
    return NextResponse.json({ message: "Ikke autorisert." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Ugyldig oppdatering." }, { status: 400 });
  }

  const { data, error } = await auth.supabase.from("clips").update(parsed.data).eq("id", id).select("*").single();

  if (error) {
    return NextResponse.json({ message: `Kunne ikke oppdatere klipp: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ message: "Klipp oppdatert.", clip: data });
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;

  const auth = await getAdminFromRequest();
  if (!auth.user || !auth.supabase) {
    return NextResponse.json({ message: "Ikke autorisert." }, { status: 401 });
  }

  const { data: clip, error: getError } = await auth.supabase
    .from("clips")
    .select("video_path")
    .eq("id", id)
    .single();

  if (getError || !clip) {
    return NextResponse.json({ message: "Finner ikke klippet." }, { status: 404 });
  }

  const { error: deleteDbError } = await auth.supabase.from("clips").delete().eq("id", id);
  if (deleteDbError) {
    return NextResponse.json({ message: `Kunne ikke slette klipp: ${deleteDbError.message}` }, { status: 500 });
  }

  await auth.supabase.storage.from("clips").remove([clip.video_path]);

  return NextResponse.json({ message: "Klipp slettet." });
}
