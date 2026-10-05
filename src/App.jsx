import { useEffect, useMemo, useRef, useState } from "react";
import { allLessons, getLessonById, getLessonsForTrack, trackOrder, tracks } from "./data/curriculum.js";
import { useCourseProgress } from "./hooks/useCourseProgress.js";
import { buildTaskCheckRequest, evaluateTaskCheck } from "./services/taskExecution.js";
import { createTeaVMRunner } from "./services/teavmRunner.js";
import AppShell from "./components/AppShell.jsx";
import Sidebar from "./components/Sidebar.jsx";
import LessonWorkspace from "./components/LessonWorkspace.jsx";
import GamePreview from "./components/GamePreview.jsx";
import { getFeatureFlags, isFeatureEnabled } from "./config/featureFlags.js";
import { gameEngineRuntimeFiles } from "./data/gameEngineRuntime.js";
import {gameEditorFiles} from './services/gameWorkspace.js';
import { createTaskFocusTracker, setUmamiAnalyticsEnabled, trackUmamiEvent, trackUmamiPageview } from "./services/umamiAnalytics.js";

const emptyReport = { passed: false, score: 0, total: 0, results: [], summary: "Uruchom sprawdzanie, aby zobaczyć wyniki." };
const emptyRunner = { status: "idle", output: "", error: null, stage: "", diagnostics: [], classVersions: [] };

function diagnosticsText(diagnostics = []) {
  return diagnostics.map((diagnostic) => {
    const location = diagnostic.fileName
      ? `${diagnostic.fileName}${diagnostic.lineNumber ? `:${diagnostic.lineNumber}` : ""}: `
      : "";
    return `${location}${diagnostic.message || "Nieznany błąd kompilatora."}`;
  }).join("\n");
}

export default function App() {
  const [featureFlags, setFeatureFlags] = useState(() => getFeatureFlags());
  useEffect(() => {
    const refreshFlags = () => setFeatureFlags(getFeatureFlags());
    window.addEventListener("java-lab-feature-flags-changed", refreshFlags);
    return () => window.removeEventListener("java-lab-feature-flags-changed", refreshFlags);
  }, []);

  const gameDevEnabled = isFeatureEnabled("game-dev.enabled", { __JAVA_LAB_FEATURE_FLAGS__: featureFlags });
  const analyticsEnabled = isFeatureEnabled("analytics.enabled", { __JAVA_LAB_FEATURE_FLAGS__: featureFlags });
  const visibleTrackOrder = useMemo(() => trackOrder.filter((trackId) => trackId !== "game-dev" || gameDevEnabled), [gameDevEnabled]);
  const visibleLessons = useMemo(() => allLessons.filter((lesson) => lesson.track !== "game-dev" || gameDevEnabled), [gameDevEnabled]);
  const visibleTracks = useMemo(() => Object.fromEntries(visibleTrackOrder.map((trackId) => [trackId, tracks[trackId]])), [visibleTrackOrder]);
  const progress = useCourseProgress(visibleLessons);
  const selectedLesson = getLessonById(progress.selectedLessonId);
  const [activeTaskId, setActiveTaskId] = useState(selectedLesson.tasks[0]?.id);
  const [activeFile, setActiveFile] = useState("Main.java");
  const [checkReport, setCheckReport] = useState(emptyReport);
  const [runner, setRunner] = useState(emptyRunner);
  const teavmRunner = useMemo(() => createTeaVMRunner(), []);
  const taskFocusTracker = useMemo(() => createTaskFocusTracker({ track: trackUmamiEvent }), []);
  const executionVersion = useRef(0);
  const previousGameDev = useRef({ enabled: gameDevEnabled, track: selectedLesson.track });

  useEffect(() => {
    if (previousGameDev.current.enabled && !gameDevEnabled && previousGameDev.current.track === "game-dev") {
      executionVersion.current++;
      teavmRunner.stopGame();
      setRunner(emptyRunner);
      setCheckReport(emptyReport);
    }
    previousGameDev.current = { enabled: gameDevEnabled, track: selectedLesson.track };
  }, [gameDevEnabled, selectedLesson.track, teavmRunner]);

  useEffect(() => () => teavmRunner.dispose(), [teavmRunner]);
  useEffect(() => {
    const onGameError = (event) => setRunner((current) => ({
      ...current, status: "error", error: event.detail.error, stage: "Błąd pętli gry",
    }));
    window.addEventListener("java-lab-game-error", onGameError);
    const onRenderError = (event) => {
      executionVersion.current++;
      teavmRunner.stopGame();
      setRunner((current) => ({ ...current, status: "error", error: event.detail, stage: "Błąd renderowania gry" }));
    };
    window.addEventListener("java-lab-game-render-error", onRenderError);
    const onGameOutput = (event) => setRunner((current) => ({
      ...current,
      output: [current.output, event.detail.output].filter(Boolean).join("\n").slice(-20000),
    }));
    window.addEventListener("java-lab-game-output", onGameOutput);
    return () => {
      window.removeEventListener("java-lab-game-error", onGameError);
      window.removeEventListener("java-lab-game-render-error", onRenderError);
      window.removeEventListener("java-lab-game-output", onGameOutput);
    };
  }, [teavmRunner]);

  useEffect(() => {
    if (!selectedLesson.tasks.some((task) => task.id === activeTaskId)) {
      setActiveTaskId(selectedLesson.tasks[0]?.id);
      setActiveFile(selectedLesson.track === 'game-dev' ? 'GameMain.java' : 'Main.java');
      setCheckReport(emptyReport);
      setRunner(emptyRunner);
    }
  }, [activeTaskId, selectedLesson]);

  const activeTask = selectedLesson.tasks.find((task) => task.id === activeTaskId) || selectedLesson.tasks[0];
  const files = useMemo(
    () => activeTask.engine
      ? {...activeTask.starterFiles, ...gameEditorFiles(progress.filesByTask[activeTask.id] || {})}
      : ({ ...activeTask.starterFiles, ...(progress.filesByTask[activeTask.id] || {}) }),
    [activeTask, progress.filesByTask],
  );
  const completedCount = progress.completedTasks.length;

  useEffect(() => {
    setUmamiAnalyticsEnabled(analyticsEnabled);
    if (analyticsEnabled) trackUmamiPageview();
  }, [analyticsEnabled]);

  useEffect(() => {
    taskFocusTracker.attach();
    return () => {
      taskFocusTracker.detach();
      setUmamiAnalyticsEnabled(false);
    };
  }, [taskFocusTracker]);

  useEffect(() => {
    taskFocusTracker.setTask(analyticsEnabled ? {
      trackId: selectedLesson.track,
      lessonNumber: selectedLesson.order,
      taskId: activeTask.id,
    } : null);
  }, [analyticsEnabled, taskFocusTracker, selectedLesson.track, selectedLesson.order, activeTask.id]);

  const changeTrack = (trackId) => {
    executionVersion.current++;
    teavmRunner.stopGame();
    const firstLesson = getLessonsForTrack(trackId).find((lesson) => visibleLessons.includes(lesson));
    progress.selectTrack(trackId);
    if (firstLesson) progress.selectLesson(firstLesson.id);
  };

  const changeLesson = (lessonId) => {
    executionVersion.current++;
    teavmRunner.stopGame();
    progress.selectLesson(lessonId);
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const changeTask = (taskId) => {
    executionVersion.current++;
    teavmRunner.stopGame();
    setActiveTaskId(taskId);
    setActiveFile(selectedLesson.track === 'game-dev' ? 'GameMain.java' : 'Main.java');
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const handleCheck = async () => {
    const version = ++executionVersion.current;
    const analyticsTask = {
      track_id: selectedLesson.track,
      lesson_number: selectedLesson.order,
      lesson_id: selectedLesson.id,
      task_id: activeTask.id,
      task_mode: activeTask.mode,
    };
    trackUmamiEvent("task_run_started", analyticsTask);
    setRunner({ ...emptyRunner, status: "compiling", stage: "Uruchamiam kod, aby sprawdzić wynik…" });
    try {
      let result = await teavmRunner.run(
        buildTaskCheckRequest(activeTask, files),
        { onStage: (stage) => { if (version === executionVersion.current) setRunner((current) => ({ ...current, stage })); } },
      );
      if (version !== executionVersion.current) return;
      let report = evaluateTaskCheck(activeTask, files, {
        ...result,
        error: result.error || diagnosticsText(result.diagnostics),
      });
      if (activeTask.engine && report.passed) {
        const checkOutput = result.output;
        result = await teavmRunner.run({files,mainClass:activeTask.mainClass,mode:'game'}, {
          onStage:stage => {if (version === executionVersion.current) setRunner(current => ({...current,stage}));},
        });
        if (version !== executionVersion.current) return;
        result.output = [checkOutput,result.output].filter(Boolean).join('\n');
        if (!result.ok) report = evaluateTaskCheck(activeTask,files,{...result,error:result.error || diagnosticsText(result.diagnostics)});
      }
      trackUmamiEvent("task_run_result", { ...analyticsTask, passed: report.passed });
      setCheckReport(report);
      progress.markTaskComplete(activeTask.id, report.passed);
      setRunner({
        status: result.ok === false ? "error" : "ready",
        output: result.output || "",
        error: result.ok === false ? result.error || diagnosticsText(result.diagnostics) : result.error || null,
        stage: result.phase || "",
        diagnostics: result.diagnostics || [],
        classVersions: result.classVersions || [],
      });
    } catch (error) {
      if (version !== executionVersion.current) return;
      trackUmamiEvent("task_run_result", { ...analyticsTask, passed: false, failure_stage: "runner" });
      setRunner({ ...emptyRunner, status: "error", error: error.message });
      setCheckReport({ ...emptyReport, summary: `Nie udało się uruchomić programu: ${error.message}` });
    }
  };

  const handleSolution = () => {
    executionVersion.current++;
    teavmRunner.stopGame();
    progress.updateFiles(activeTask.id, activeTask.solutionFiles);
    setActiveFile(Object.keys(activeTask.solutionFiles)[0] || "Main.java");
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const handleReset = () => {
    executionVersion.current++;
    teavmRunner.stopGame();
    progress.resetTask(activeTask.id);
    setActiveFile(activeTask.engine ? 'GameMain.java' : 'Main.java');
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const sidebar = (
    <Sidebar
      tracks={visibleTracks}
      trackOrder={visibleTrackOrder}
      lessons={visibleLessons}
      selectedTrack={progress.selectedTrack}
      selectedLessonId={selectedLesson.id}
      completedTasks={progress.completedTasks}
      completedCount={completedCount}
      onTrackChange={changeTrack}
      onLessonChange={changeLesson}
      onOpenSettings={() => { executionVersion.current++; teavmRunner.stopGame(); progress.hardReset(); }}
    />
  );

  const main = (
    <LessonWorkspace
      lesson={selectedLesson}
      activeTask={activeTask}
      activeFile={Object.hasOwn(files, activeFile) || (activeTask.engine && Object.hasOwn(gameEngineRuntimeFiles, activeFile)) ? activeFile : Object.keys(files)[0]}
      files={files}
      completedTasks={progress.completedTasks}
      checkReport={checkReport}
      runner={runner}
      onTaskChange={changeTask}
      onFileChange={setActiveFile}
      onCodeChange={(fileName, value) => {
        if (activeTask.engine && Object.hasOwn(gameEngineRuntimeFiles, fileName)) return;
        executionVersion.current++;
        teavmRunner.stopGame();
        progress.updateFiles(activeTask.id, { [fileName]: value });
        progress.markTaskComplete(activeTask.id, false);
        setCheckReport(emptyReport);
        setRunner((current) => current.status === "compiling" ? emptyRunner : current);
      }}
      onDeleteFile={fileName=>{
        if(Object.hasOwn(activeTask.starterFiles,fileName)||Object.hasOwn(gameEngineRuntimeFiles,fileName))return;
        executionVersion.current++;teavmRunner.stopGame();
        progress.deleteFile(activeTask.id,fileName);
        setActiveFile(Object.keys(activeTask.starterFiles)[0]);setCheckReport(emptyReport);setRunner(emptyRunner);
      }}
      onCheck={handleCheck}
      onReset={handleReset}
      onSolution={activeTask.mode === "guided" ? handleSolution : undefined}
    />
  );

  const inspector = activeTask.engine ? <GamePreview runner={runner} /> : null;

  return <AppShell sidebar={sidebar} main={main} inspector={inspector} />;
}
