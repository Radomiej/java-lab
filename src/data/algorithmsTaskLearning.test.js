import { describe, expect, it } from "vitest";
import { allLessons } from "./curriculum.js";
import { algorithmsTaskLearning } from "./algorithmsTaskLearning.js";

const pilotLessons = allLessons.filter((lesson) => lesson.track === "algorithms" && lesson.order <= 412);
const taskIds = pilotLessons.flatMap((lesson) => lesson.tasks.map((task) => task.id));
const entries = Object.entries(algorithmsTaskLearning);

const swapped = (values, [i, j]) => {
  const next = [...values];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
const monotonic = (values) =>
  values.every((v, i) => i === 0 || values[i - 1] <= v) ||
  values.every((v, i) => i === 0 || values[i - 1] >= v);

describe("algorithmsTaskLearning", () => {
  it("covers exactly the 36 tasks of lessons 01–12", () => {
    expect(taskIds).toHaveLength(36);
    expect(entries.map(([id]) => id).sort()).toEqual([...taskIds].sort());
  });

  it("has non-empty theory and prediction fields", () => {
    for (const [id, entry] of entries) {
      for (const field of ["title", "text", "code", "question", "answer"]) {
        expect(entry[field], `${id}.${field}`).toBeTruthy();
      }
      expect(entry.prediction.context, `${id}.prediction.context`).toBeTruthy();
      expect(entry.prediction.code, `${id}.prediction.code`).toBeTruthy();
      expect(entry.visual?.kind, `${id}.visual.kind`).toBeTruthy();
      expect(entry.trace?.steps?.length, `${id}.trace.steps`).toBeGreaterThan(0);
      for (const step of entry.trace.steps) {
        expect(step.caption, `${id} step caption`).toBeTruthy();
      }
    }
  });

  it("keeps every shown array consistent with the previous step", () => {
    for (const [id, entry] of entries) {
      if (!entry.trace.values) continue;
      let previous = entry.trace.values;
      for (const step of entry.trace.steps) {
        if (!step.values) continue;
        expect(step.values, `${id}`).toHaveLength(entry.trace.values.length);
        if (step.swap) {
          expect(step.values, `${id} swap ${step.swap}`).toEqual(swapped(previous, step.swap));
        }
        previous = step.values;
      }
    }
  });

  it("ends sorting traces on a sorted row", () => {
    for (const [id, entry] of entries) {
      const last = entry.trace.steps.at(-1);
      if (!last.values || last.values.length < 3 || !last.values.every((v) => typeof v === "number")) continue;
      expect(monotonic(last.values), `${id} last values ${last.values}`).toBe(true);
    }
  });
});
