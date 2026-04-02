import { LEAGUES } from "@/lib/constants";
import type { MatchLookupResult } from "@/lib/types";

export interface MatchLookupProvider {
  lookup(matchNumber: string): Promise<MatchLookupResult>;
}

export class MockOrManualProvider implements MatchLookupProvider {
  async lookup(matchNumber: string): Promise<MatchLookupResult> {
    if (matchNumber.length < 4) {
      return {
        found: false,
        source: "mock",
        message: "Fant ikke kampdata automatisk. Velg liga og runde manuelt.",
      };
    }

    const numberValue = Number.parseInt(matchNumber.replace(/\D/g, ""), 10);
    if (Number.isNaN(numberValue)) {
      return {
        found: false,
        source: "mock",
        message: "Ugyldig kampnummer. Velg liga og runde manuelt.",
      };
    }

    const league = LEAGUES[numberValue % LEAGUES.length];
    const round = (numberValue % 30) + 1;

    return {
      found: true,
      league,
      round,
      source: "mock",
      message: "Midlertidig treff fra mock-provider. Verifiser før publisering.",
    };
  }
}

export class NffApiProvider implements MatchLookupProvider {
  async lookup(matchNumber: string): Promise<MatchLookupResult> {
    const endpoint = process.env.NFF_API_ENDPOINT;
    const apiKey = process.env.NFF_API_KEY;

    if (!endpoint || !apiKey) {
      return {
        found: false,
        source: "nff_api",
        message: "NFF API er ikke konfigurert. Velg liga og runde manuelt.",
      };
    }

    try {
      const response = await fetch(`${endpoint}?matchNumber=${encodeURIComponent(matchNumber)}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return {
          found: false,
          source: "nff_api",
          message: "Fant ikke kamp i NFF API. Velg liga og runde manuelt.",
        };
      }

      const data = (await response.json()) as { league?: string; round?: number };
      if (!data.league || typeof data.round !== "number") {
        return {
          found: false,
          source: "nff_api",
          message: "Ufullstendig svar fra NFF API. Velg liga og runde manuelt.",
        };
      }

      if (!LEAGUES.includes(data.league as (typeof LEAGUES)[number])) {
        return {
          found: false,
          source: "nff_api",
          message: "Liga fra NFF API støttes ikke i MVP ennå.",
        };
      }

      return {
        found: true,
        league: data.league as (typeof LEAGUES)[number],
        round: data.round,
        source: "nff_api",
        message: "Kampdata hentet fra NFF API.",
      };
    } catch {
      return {
        found: false,
        source: "nff_api",
        message: "Feil ved oppslag mot NFF API. Velg liga og runde manuelt.",
      };
    }
  }
}

export function getMatchLookupProvider(): MatchLookupProvider {
  const provider = process.env.MATCH_LOOKUP_PROVIDER || "mock";
  if (provider === "nff_api") {
    return new NffApiProvider();
  }
  return new MockOrManualProvider();
}
