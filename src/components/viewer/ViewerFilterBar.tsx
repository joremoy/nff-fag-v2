"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LEAGUES, SITUATION_TYPES } from "@/lib/constants";

export function ViewerFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const typeValue = searchParams.get("type") ?? "";
  const leagueValue = searchParams.get("league") ?? "";

  const params = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function updateParam(name: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) {
      next.delete(name);
    } else {
      next.set(name, value);
    }

    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="panel filters">
      <div>
        <label htmlFor="type">Situasjonstype</label>
        <select id="type" value={typeValue} onChange={(event) => updateParam("type", event.target.value)}>
          <option value="">Alle</option>
          {SITUATION_TYPES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="league">Liga</label>
        <select id="league" value={leagueValue} onChange={(event) => updateParam("league", event.target.value)}>
          <option value="">Alle</option>
          {LEAGUES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
