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

  it('deletes a student file persistently without losing other files',()=>{
    const {result}=renderHook(()=>useCourseProgress(allLessons));
    const id=allLessons[12].tasks[0].id;
    act(()=>result.current.updateFiles(id,{'Enemy.java':'class Enemy {}','Other.java':'class Other {}'}));
    act(()=>result.current.deleteFile(id,'Enemy.java'));
    expect(result.current.filesByTask[id]['Enemy.java']).toBeUndefined();
    expect(result.current.filesByTask[id]['Other.java']).toBe('class Other {}');
    const again=renderHook(()=>useCourseProgress(allLessons));
    expect(again.result.current.filesByTask[id]['Enemy.java']).toBeUndefined();
  });

  it('drops a removed game selection and completion while preserving saved source files',()=>{
    localStorage.setItem('java-lab-progress-v1',JSON.stringify({selectedTrack:'game-dev',selectedLessonId:'game-dev-14',filesByTask:{old:{'Main.java':'saved'}},completedTasks:['game-dev-14-task']}));
    const {result}=renderHook(()=>useCourseProgress(allLessons));
    expect(result.current.selectedLessonId).toBe(allLessons[0].id);
    expect(result.current.completedTasks).toEqual([]);
    expect(result.current.filesByTask.old['Main.java']).toBe('saved');
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
