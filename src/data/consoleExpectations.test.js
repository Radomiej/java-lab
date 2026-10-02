import { describe, expect, it } from "vitest";
import { allLessons } from "./curriculum.js";
import { checkSource, mergeCompilationResult } from "../services/lessonChecker.js";

describe("console task execution contracts", () => {
  const tasks = allLessons.flatMap((lesson) => lesson.tasks).filter((task) => task.runMode === "console");
  it("covers every console task without source-pattern grading", () => {
    expect(tasks).toHaveLength(36);
    for (const task of tasks) {
      expect(task.checks).toEqual([]);
      expect(task.outputChecks[0].values.length).toBeGreaterThan(0);
    }
  });
  it("accepts equivalent source only with successful execution and correct output", () => {
    for (const task of tasks) {
      const output = task.outputChecks[0].values.join("\n");
      const report = checkSource({ "Main.java": "// different implementation" }, task.outputChecks, output);
      expect(mergeCompilationResult(report, { ok: true }).passed).toBe(true);
      expect(mergeCompilationResult(report, { ok: false, error: "Incomplete if()" }).passed).toBe(false);
      expect(checkSource(task.solutionFiles, task.outputChecks, "wrong output").passed).toBe(false);
    }
  });
});
