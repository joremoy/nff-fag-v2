import type { LEAGUES, SITUATION_TYPES } from "./constants";

export type SituationType = (typeof SITUATION_TYPES)[number];
export type League = (typeof LEAGUES)[number];

export interface Clip {
  id: string;
  title: string;
  video_path: string;
  situation_type: SituationType;
  league: League;
  round: number | null;
  match_number: string | null;
  conclusion_text: string;
  uploaded_at: string;
  created_by: string;
  published: boolean;
}

export interface MatchLookupResult {
  found: boolean;
  league?: League;
  round?: number;
  source: "mock" | "nff_api";
  message: string;
}
