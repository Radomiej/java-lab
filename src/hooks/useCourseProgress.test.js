import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { allLessons } from "../data/curriculum.js";
import { useCourseProgress } from "./useCourseProgress.js";

describe("useCourseProgress", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("restores the selected lesson and stores edited files", () => {
    const { result } = renderHook(() => useCourseProgress(allLessons));
    const firstTask = allLessons[0].tasks[0];

    act(() => {
      result.current.selectLesson("fundamentals-03");
      result.current.updateFiles(firstTask.id, { "Main.java": "class Main {}" });
    });

    expect(result.current.selectedLessonId).toBe("fundamentals-03");
    expect(result.current.filesByTask[firstTask.id]["Main.java"]).toBe("class Main {}");

    const second = renderHook(() => useCourseProgress(allLessons));
    expect(second.result.current.selectedLessonId).toBe("fundamentals-03");
    expect(second.result.current.filesByTask[firstTask.id]["Main.java"]).toBe("class Main {}");
  });

  it("marks and resets a task without losing other lessons", () => {
    const { result } = renderHook(() => useCourseProgress(allLessons));
    const taskId = allLessons[0].tasks[0].id;

    act(() => result.current.markTaskComplete(taskId));
    expect(result.current.completedTasks).toContain(taskId);

    act(() => result.current.resetTask(taskId));
    expect(result.current.completedTasks).not.toContain(taskId);
    expect(result.current.filesByTask[taskId]).toBeUndefined();
  });

  it("migrates a saved selection from a removed track", () => {
    window.localStorage.setItem("java-lab-progress-v1", JSON.stringify({
      selectedTrack: "swing",
      selectedLessonId: "swing-13",
      filesByTask: {},
      completedTasks: ["swing-13-independent-1"],
    }));

    const { result } = renderHook(() => useCourseProgress(allLessons));

    expect(result.current.selectedTrack).toBe("fundamentals");
    expect(result.current.selectedLessonId).toBe(allLessons[0].id);
    expect(result.current.completedTasks).toEqual([]);
  });
});
