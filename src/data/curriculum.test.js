import { describe, expect, it } from "vitest";
import { allLessons, trackOrder, tracks } from "./curriculum.js";
import { checkSource } from "../services/lessonChecker.js";

describe("Java Lab curriculum", () => {
  it("contains three tracks and twelve ordered lessons", () => {
    expect(trackOrder).toHaveLength(3);
    expect(Object.keys(tracks)).toHaveLength(3);
    expect(allLessons).toHaveLength(12);
    expect(allLessons.map((lesson) => lesson.order)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
  });

  it("gives every lesson a step-by-step starter task", () => {
    for (const lesson of allLessons) {
      expect(lesson.objective).toBeTruthy();
      expect(lesson.theory.length).toBeGreaterThanOrEqual(2);
      expect(lesson.tasks.length).toBeGreaterThanOrEqual(1);
      expect(lesson.tasks[0].starterFiles["Main.java"]).toContain("class");
      expect(lesson.tasks[0].checks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("gives every lesson one guided task and two independent tasks", () => {
    for (const lesson of allLessons) {
      expect(lesson.tasks).toHaveLength(3);
      expect(lesson.tasks.map((task) => task.mode)).toEqual(["guided", "independent", "independent"]);
      expect(lesson.tasks.slice(1).every((task) => !task.hints || task.hints.length === 0)).toBe(true);
    }
  });

  it("keeps every task solution aligned with its source checks", () => {
    for (const lesson of allLessons) {
      for (const task of lesson.tasks) {
        const report = checkSource(task.solutionFiles, task.checks);
        expect(report.passed, `${lesson.id}/${task.id}`).toBe(true);
      }
    }
  });
});
