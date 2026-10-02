import { describe, expect, it } from "vitest";
import { allLessons, trackOrder, tracks } from "./curriculum.js";
import { checkSource } from "../services/lessonChecker.js";

describe("Java Lab curriculum", () => {
  it("contains four tracks and fifteen ordered lessons", () => {
    expect(trackOrder).toHaveLength(4);
    expect(Object.keys(tracks)).toHaveLength(4);
    expect(allLessons).toHaveLength(15);
    expect(allLessons.map((lesson) => lesson.order)).toEqual(
      Array.from({ length: 15 }, (_, index) => index + 1),
    );
  });

  it("gives every lesson a step-by-step starter task", () => {
    for (const lesson of allLessons) {
      expect(lesson.objective).toBeTruthy();
      expect(lesson.theory.length).toBeGreaterThanOrEqual(2);
      expect(lesson.tasks.length).toBeGreaterThanOrEqual(1);
      expect(lesson.tasks[0].starterFiles["Main.java"]).toContain("class");
      expect((lesson.tasks[0].outputChecks || lesson.tasks[0].gameTests || lesson.tasks[0].checks).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("gives every lesson one guided task and two independent tasks", () => {
    for (const lesson of allLessons) {
      expect(lesson.tasks).toHaveLength(3);
      expect(lesson.tasks.map((task) => task.mode)).toEqual(["guided", "independent", "independent"]);
      expect(lesson.tasks.slice(1).every((task) => !task.hints || task.hints.length === 0)).toBe(true);
    }
  });

  it("provides execution contracts for every task", () => {
    for (const lesson of allLessons) {
      for (const task of lesson.tasks) {
        expect(task.outputChecks?.length || task.gameTests?.length, `${lesson.id}/${task.id}`).toBeGreaterThan(0);
      }
    }
  });
});
