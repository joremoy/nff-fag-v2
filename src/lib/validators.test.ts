import { describe, expect, it } from "vitest";
import { isAllowedMp4 } from "./validators";

describe("isAllowedMp4", () => {
  it("accepts mp4 extension", () => {
    const file = new File(["video"], "clip.mp4", { type: "application/octet-stream" });
    expect(isAllowedMp4(file)).toBe(true);
  });

  it("rejects non-mp4 file", () => {
    const file = new File(["video"], "clip.mov", { type: "video/quicktime" });
    expect(isAllowedMp4(file)).toBe(false);
  });
});
