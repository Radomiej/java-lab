import { describe, expect, it } from "vitest";
import { getFeatureFlags, isFeatureEnabled } from "./featureFlags.js";

describe("feature flags", () => {
  it("włącza ścieżkę Game Dev domyślnie", () => {
    expect(isFeatureEnabled("game-dev.enabled", {})).toBe(true);
  });

  it("pozwala dynamicznie wyłączyć ścieżkę przez flagę runtime", () => {
    const source = { __JAVA_LAB_FEATURE_FLAGS__: { "game-dev.enabled": false } };
    expect(getFeatureFlags(source)["game-dev.enabled"]).toBe(false);
    expect(isFeatureEnabled("game-dev.enabled", source)).toBe(false);
  });
});
