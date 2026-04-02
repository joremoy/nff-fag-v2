import { z } from "zod";
import { LEAGUES, SITUATION_TYPES } from "./constants";

export const clipSchema = z.object({
  title: z.string().min(2, "Tittel må ha minst 2 tegn."),
  situationType: z.enum(SITUATION_TYPES),
  league: z.enum(LEAGUES),
  round: z.number().int().min(1).max(60).nullable(),
  matchNumber: z.string().trim().max(40).nullable(),
  conclusionText: z.string().min(3, "Konklusjon må ha minst 3 tegn."),
  published: z.boolean(),
});

export function isAllowedMp4(file: File) {
  const allowedMime = file.type === "video/mp4";
  const allowedExt = file.name.toLowerCase().endsWith(".mp4");
  return allowedMime || allowedExt;
}
