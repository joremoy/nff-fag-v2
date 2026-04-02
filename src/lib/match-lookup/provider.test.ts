import { describe, expect, it } from "vitest";
import { MockOrManualProvider } from "./provider";

describe("MockOrManualProvider", () => {
  it("returns fallback when match number is too short", async () => {
    const provider = new MockOrManualProvider();
    const result = await provider.lookup("12");

    expect(result.found).toBe(false);
    expect(result.message).toContain("Velg liga og runde manuelt");
  });

  it("returns deterministic league and round when parse succeeds", async () => {
    const provider = new MockOrManualProvider();
    const result = await provider.lookup("123456");

    expect(result.found).toBe(true);
    expect(typeof result.round).toBe("number");
    expect(result.round).toBeGreaterThanOrEqual(1);
  });
});
