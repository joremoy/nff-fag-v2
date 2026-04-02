import type { Clip, League, SituationType } from "@/lib/types";

interface FilterInput {
  type?: SituationType;
  league?: League;
}

export function filterAndSortClips(clips: Clip[], filters: FilterInput) {
  return clips
    .filter((clip) => {
      if (filters.type && clip.situation_type !== filters.type) return false;
      if (filters.league && clip.league !== filters.league) return false;
      return clip.published;
    })
    .sort((a, b) => Date.parse(b.uploaded_at) - Date.parse(a.uploaded_at));
}
