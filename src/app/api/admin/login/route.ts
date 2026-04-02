import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSupabaseClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ message: "Supabase er ikke konfigurert." }, { status: 500 });
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Ugyldig e-post eller passord." }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return NextResponse.json({ message: "Innlogging feilet." }, { status: 401 });
  }

  const { data: adminRow } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return NextResponse.json({ message: "Brukeren mangler admin-tilgang." }, { status: 403 });
  }

  return NextResponse.json({ message: "Innlogget." });
}
