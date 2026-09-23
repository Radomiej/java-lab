import { describe, expect, it } from "vitest";
import { checkSource } from "./lessonChecker.js";

describe("lesson source checker", () => {
  it("passes required Java fragments and returns a score", () => {
    const result = checkSource(
      { "Main.java": "public class Main { int level = 3; }" },
      [
        { kind: "contains", file: "Main.java", value: "int level", label: "Zmienna level" },
        { kind: "regex", file: "Main.java", value: "class\\s+Main", label: "Klasa Main" },
      ],
    );

    expect(result.passed).toBe(true);
    expect(result.score).toBe(2);
    expect(result.results[0]).toMatchObject({ passed: true, label: "Zmienna level" });
  });

  it("explains a missing requirement without throwing", () => {
    const result = checkSource(
      { "Main.java": "public class Main {}" },
      [{ kind: "contains", file: "Main.java", value: "System.out.println", label: "Wypisywanie" }],
    );

    expect(result.passed).toBe(false);
    expect(result.results[0].detail).toContain("System.out.println");
  });

  it("supports forbidden fragments", () => {
    const result = checkSource(
      { "Main.java": "public class Main { int score = 4; }" },
      [{ kind: "excludes", file: "Main.java", value: "var ", label: "Jawny typ" }],
    );

    expect(result.passed).toBe(true);
  });
});
