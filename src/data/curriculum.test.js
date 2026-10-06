import { describe, expect, it } from "vitest";
import { allLessons, numberLessons, trackOrder, tracks } from "./curriculum.js";
import { checkSource } from "../services/lessonChecker.js";
const courseLessons=allLessons.filter(lesson=>lesson.track!=='playground');

describe("Java Lab curriculum", () => {
  it('keeps other track numbers stable when adding a lesson and enforces 99 slots',()=>{
    const numbered=numberLessons([{id:'a',track:'fundamentals'},{id:'b',track:'fundamentals'},{id:'c',track:'objects'}]);
    expect(numbered.map(l=>l.order)).toEqual([101,102,201]);
    const full=Array.from({length:99},(_,index)=>({id:`f${index}`,track:'fundamentals'}));
    expect(numberLessons(full).at(-1).order).toBe(199);
    expect(()=>numberLessons([...full,{id:'overflow',track:'fundamentals'}])).toThrow();
  });
  it("allocates an independent hundred-number block to each track", () => {
    expect(trackOrder).toHaveLength(5);
    expect(Object.keys(tracks)).toHaveLength(5);
    expect(courseLessons).toHaveLength(20);
    expect(allLessons.map((lesson) => lesson.order)).toEqual(
      [101,102,103,104,201,202,203,204,301,302,303,304,401,402,403,404,405,406,407,408,501],
    );
  });

  it("gives every lesson a step-by-step starter task", () => {
    for (const lesson of courseLessons) {
      expect(lesson.objective).toBeTruthy();
      expect(lesson.theory.length).toBeGreaterThanOrEqual(2);
      expect(lesson.tasks.length).toBeGreaterThanOrEqual(1);
      const entry = lesson.track === 'game-dev' ? 'GameMain' : 'Main';
      expect(lesson.tasks[0].starterFiles[`${entry}.java`]).toContain(`class ${entry}`);
      expect((lesson.tasks[0].outputChecks || lesson.tasks[0].gameTests || lesson.tasks[0].checks).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("gives every lesson one guided task and two independent tasks", () => {
    for (const lesson of courseLessons) {
      expect(lesson.tasks).toHaveLength(3);
      expect(lesson.tasks.map((task) => task.mode)).toEqual(["guided", "independent", "independent"]);
      expect(lesson.tasks.slice(1).every((task) => !task.hints || task.hints.length === 0)).toBe(true);
    }
  });

  it("provides execution contracts for every task", () => {
    for (const lesson of courseLessons) {
      for (const task of lesson.tasks) {
        expect(task.outputChecks?.length || task.gameTests?.length, `${lesson.id}/${task.id}`).toBeGreaterThan(0);
      }
    }
  });
});
