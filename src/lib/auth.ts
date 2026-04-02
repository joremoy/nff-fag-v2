import { redirect } from "next/navigation";
import { getServerSupabaseClient } from "./supabase/server";

export async function requireAdminUser() {
  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return { user: null, reason: "Supabase environment variables are missing." } as const;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !adminRow) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=ikke_admin");
  }

  return { user, reason: null } as const;
}

export async function getAdminFromRequest() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) return { supabase: null, user: null } as const;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null } as const;

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return { supabase, user: null } as const;
  }

  return { supabase, user } as const;
}
