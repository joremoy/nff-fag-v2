import { NextResponse } from "next/server";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase er ikke konfigurert." }, { status: 500 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ message: "Logget ut." });
}
