import type { Clip } from "@/lib/types";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function listPublishedClips() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return { clips: [] as Clip[], error: "Supabase er ikke konfigurert." };
  }

  const { data, error } = await supabase
    .from("clips")
    .select("*")
    .eq("published", true)
    .order("uploaded_at", { ascending: false });

  if (error) {
    return { clips: [] as Clip[], error: error.message };
  }

  return { clips: (data ?? []) as Clip[], error: null };
}

export async function listAllClipsForAdmin() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return { clips: [] as Clip[], error: "Supabase er ikke konfigurert." };
  }

  const { data, error } = await supabase.from("clips").select("*").order("uploaded_at", { ascending: false });

  if (error) {
    return { clips: [] as Clip[], error: error.message };
  }

  return { clips: (data ?? []) as Clip[], error: null };
}

export async function getClipById(id: string) {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return { clip: null as Clip | null, error: "Supabase er ikke konfigurert." };
  }

  const { data, error } = await supabase.from("clips").select("*").eq("id", id).maybeSingle();

  if (error) {
    return { clip: null as Clip | null, error: error.message };
  }

  return { clip: (data as Clip | null) ?? null, error: null };
}

export async function getPublicVideoUrl(path: string) {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return null;

  const { data } = supabase.storage.from("clips").getPublicUrl(path);
  return data.publicUrl;
}
