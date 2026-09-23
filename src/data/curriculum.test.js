import { describe, expect, it } from "vitest";
import { allLessons, trackOrder, tracks } from "./curriculum.js";

describe("Java Lab curriculum", () => {
  it("contains four tracks and sixteen ordered lessons", () => {
    expect(trackOrder).toHaveLength(4);
    expect(Object.keys(tracks)).toHaveLength(4);
    expect(allLessons).toHaveLength(16);
    expect(allLessons.map((lesson) => lesson.order)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
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
});
