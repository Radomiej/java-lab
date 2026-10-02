import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

const STORAGE_KEY = "java-lab-progress-v1";

function initialState(lessons) {
  const firstLesson = lessons[0];
  return {
    selectedTrack: firstLesson?.track || "fundamentals",
    selectedLessonId: firstLesson?.id || "",
    filesByTask: {},
    completedTasks: [],
  };
}

function sanitizeState(value, lessons) {
  const fallback = initialState(lessons);
  if (!value || typeof value !== "object") return fallback;
  const lesson = lessons.find((candidate) => candidate.id === value.selectedLessonId)
    || lessons.find((candidate) => candidate.id === fallback.selectedLessonId)
    || lessons[0];
  const validTrack = lessons.some((candidate) => candidate.track === value.selectedTrack);
  const availableTaskIds = new Set(lessons.flatMap((candidate) => candidate.tasks.map((task) => task.id)));
  return {
    selectedTrack: validTrack ? value.selectedTrack : lesson.track || fallback.selectedTrack,
    selectedLessonId: lesson.id,
    filesByTask: value.filesByTask && typeof value.filesByTask === "object" ? value.filesByTask : {},
    completedTasks: Array.isArray(value.completedTasks)
      ? value.completedTasks.filter((taskId) => availableTaskIds.has(taskId))
      : [],
  };
}

export function useCourseProgress(lessons) {
  const [savedState, setSavedState] = useLocalStorage(STORAGE_KEY, initialState(lessons));
  const state = useMemo(() => sanitizeState(savedState, lessons), [lessons, savedState]);

  const updateState = useCallback((updater) => {
    setSavedState((current) => updater(sanitizeState(current, lessons)));
  }, [lessons, setSavedState]);

  const selectTrack = useCallback((trackId) => {
    updateState((current) => ({ ...current, selectedTrack: trackId }));
  }, [updateState]);

  const selectLesson = useCallback((lessonId) => {
    const lesson = lessons.find((candidate) => candidate.id === lessonId) || lessons[0];
    updateState((current) => ({
      ...current,
      selectedTrack: lesson.track,
      selectedLessonId: lesson.id,
    }));
  }, [updateState]);

  const updateFiles = useCallback((taskId, patch) => {
    updateState((current) => ({
      ...current,
      filesByTask: {
        ...current.filesByTask,
        [taskId]: {
          ...(current.filesByTask[taskId] || {}),
          ...patch,
        },
      },
    }));
  }, [updateState]);

  const resetTask = useCallback((taskId) => {
    updateState((current) => {
      const filesByTask = { ...current.filesByTask };
      delete filesByTask[taskId];
      return {
        ...current,
        filesByTask,
        completedTasks: current.completedTasks.filter((id) => id !== taskId),
      };
    });
  }, [updateState]);

  const markTaskComplete = useCallback((taskId, passed = true) => {
    updateState((current) => ({
      ...current,
      completedTasks: passed
        ? Array.from(new Set([...current.completedTasks, taskId]))
        : current.completedTasks.filter((id) => id !== taskId),
    }));
  }, [updateState]);

  const hardReset = useCallback(() => {
    setSavedState(initialState(lessons));
  }, [lessons, setSavedState]);

  return {
    ...state,
    selectTrack,
    selectLesson,
    updateFiles,
    resetTask,
    markTaskComplete,
    hardReset,
    storageWarning: null,
  };
}
