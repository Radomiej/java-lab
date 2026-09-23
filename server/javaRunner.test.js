import { describe, expect, it } from "vitest";
import { MAX_SOURCE_BYTES, normalizeFiles, runtimePolicy } from "./javaRunner.js";

describe("local Java runner boundaries", () => {
  it("accepts relative Java files and rejects path traversal", () => {
    expect(normalizeFiles({ "Main.java": "class Main {}" })).toEqual({
      "Main.java": "class Main {}",
    });
    expect(() => normalizeFiles({ "../secret.java": "class Secret {}" })).toThrow(
      /bezpieczną ścieżką/i,
    );
  });

  it("defines bounded source, output, and process limits", () => {
    expect(MAX_SOURCE_BYTES).toBeGreaterThan(10_000);
    expect(runtimePolicy.timeoutMs).toBeLessThanOrEqual(10_000);
    expect(runtimePolicy.maxOutputBytes).toBeLessThanOrEqual(100_000);
  });
});
