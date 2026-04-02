import { describe, expect, it } from "vitest";
import { filterAndSortClips } from "./clip-filter";
import type { Clip } from "@/lib/types";

const base: Clip = {
  id: "1",
  title: "A",
  video_path: "a.mp4",
  situation_type: "Taklinger",
  league: "Eliteserien",
  round: 1,
  match_number: "100",
  conclusion_text: "ok",
  uploaded_at: "2026-04-01T10:00:00.000Z",
  created_by: "u",
  published: true,
};

describe("filterAndSortClips", () => {
  it("sorts newest first", () => {
    const clips: Clip[] = [
      base,
      { ...base, id: "2", uploaded_at: "2026-04-03T10:00:00.000Z", title: "B" },
    ];

    const result = filterAndSortClips(clips, {});
    expect(result.map((clip) => clip.id)).toEqual(["2", "1"]);
  });

  it("filters by type and league", () => {
    const clips: Clip[] = [
      base,
      { ...base, id: "2", situation_type: "Offside" },
      { ...base, id: "3", league: "OBOS-ligaen" },
    ];

    const result = filterAndSortClips(clips, {
      type: "Offside",
      league: "Eliteserien",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("2");
  });

  it("excludes unpublished clips", () => {
    const clips: Clip[] = [base, { ...base, id: "2", published: false }];
    const result = filterAndSortClips(clips, {});
    expect(result).toHaveLength(1);
  });
});
