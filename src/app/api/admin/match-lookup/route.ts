import { NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getMatchLookupProvider } from "@/lib/match-lookup/provider";

export async function GET(request: Request) {
  const auth = await getAdminFromRequest();
  if (!auth.user) {
    return NextResponse.json({ message: "Ikke autorisert." }, { status: 401 });
  }

  const url = new URL(request.url);
  const matchNumber = url.searchParams.get("matchNumber")?.trim() ?? "";

  if (!matchNumber) {
    return NextResponse.json({ found: false, source: "mock", message: "Kampnummer mangler." }, { status: 400 });
  }

  const provider = getMatchLookupProvider();
  const result = await provider.lookup(matchNumber);
  return NextResponse.json(result);
}
