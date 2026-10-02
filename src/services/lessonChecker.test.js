import { describe, expect, it } from "vitest";
import { checkSource, mergeCompilationResult } from "./lessonChecker.js";

describe("lesson source checker", () => {
  it("wymaga jawnego potwierdzenia kompilacji i uruchomienia", () => {
    const report = checkSource({ "Main.java": "class Main {}" }, [{ kind: "contains", value: "class Main" }]);
    expect(mergeCompilationResult(report, undefined).passed).toBe(false);
    expect(mergeCompilationResult(report, {}).passed).toBe(false);
    expect(mergeCompilationResult(report, { ok: true }).passed).toBe(true);
  });
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

  it("can validate the program result instead of exact source text", () => {
    const result = checkSource(
      { "Main.java": "class Main { /* implementation may vary */ }" },
      [{ kind: "outputLines", values: ["Witaj", "Wynik: 42"], label: "Wynik programu" }],
      "Witaj\nWynik: 42\n",
    );

    expect(result.passed).toBe(true);
    expect(result.results[0].detail).toContain("linie");
  });

  it("rejects an incomplete if when TeaVM reports a compilation error", () => {
    const sourceReport = checkSource(
      { "Main.java": "public class Main { public static void main(String[] args) { if (); } }" },
      [{ kind: "contains", file: "Main.java", value: "if (", label: "Instrukcja if" }],
    );
    const result = mergeCompilationResult(sourceReport, {
      ok: false,
      error: "Main.java: if wymaga wyrażenia boolean",
    });

    expect(result.passed).toBe(false);
    expect(result.results[0]).toMatchObject({ passed: false, label: "Kompilacja programu" });
  });
});
