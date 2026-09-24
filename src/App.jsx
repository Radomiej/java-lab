import { useEffect, useMemo, useState } from "react";
import { allLessons, getLessonById, getLessonsForTrack, trackOrder, tracks } from "./data/curriculum.js";
import { useCourseProgress } from "./hooks/useCourseProgress.js";
import { checkSource } from "./services/lessonChecker.js";
import { createTeaVMRunner } from "./services/teavmRunner.js";
import AppShell from "./components/AppShell.jsx";
import Sidebar from "./components/Sidebar.jsx";
import LessonWorkspace from "./components/LessonWorkspace.jsx";
import RuntimeConsole from "./components/RuntimeConsole.jsx";
import TeaVMPreview from "./components/TeaVMPreview.jsx";

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
  const progress = useCourseProgress(allLessons);
  const selectedLesson = getLessonById(progress.selectedLessonId);
  const [activeTaskId, setActiveTaskId] = useState(selectedLesson.tasks[0]?.id);
  const [activeFile, setActiveFile] = useState("Main.java");
  const [checkReport, setCheckReport] = useState(emptyReport);
  const [runner, setRunner] = useState(emptyRunner);
  const teavmRunner = useMemo(() => createTeaVMRunner(), []);

  useEffect(() => () => teavmRunner.dispose(), [teavmRunner]);

  useEffect(() => {
    if (!selectedLesson.tasks.some((task) => task.id === activeTaskId)) {
      setActiveTaskId(selectedLesson.tasks[0]?.id);
      setActiveFile("Main.java");
      setCheckReport(emptyReport);
      setRunner(emptyRunner);
    }
  }, [activeTaskId, selectedLesson]);

  const activeTask = selectedLesson.tasks.find((task) => task.id === activeTaskId) || selectedLesson.tasks[0];
  const files = useMemo(
    () => ({ ...activeTask.starterFiles, ...(progress.filesByTask[activeTask.id] || {}) }),
    [activeTask, progress.filesByTask],
  );
  const completedCount = progress.completedTasks.length;

  const changeTrack = (trackId) => {
    const firstLesson = getLessonsForTrack(trackId)[0];
    progress.selectTrack(trackId);
    if (firstLesson) progress.selectLesson(firstLesson.id);
  };

  const changeLesson = (lessonId) => {
    progress.selectLesson(lessonId);
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const changeTask = (taskId) => {
    setActiveTaskId(taskId);
    setActiveFile("Main.java");
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const handleCheck = () => {
    const report = checkSource(files, activeTask.checks);
    setCheckReport(report);
    progress.markTaskComplete(activeTask.id, report.passed);
  };

  const handleCompile = async () => {
    setRunner({ ...emptyRunner, status: "compiling", stage: "Łączę z kompilatorem TeaVM w przeglądarce…" });
    try {
      const result = await teavmRunner.run(
        { files, mainClass: activeTask.mainClass, mode: activeTask.runMode || "console" },
        { onStage: (stage) => setRunner((current) => ({ ...current, stage })) },
      );
      setRunner({
        status: result.ok === false ? "error" : "ready",
        output: result.output || "",
        error: result.ok === false ? result.error || diagnosticsText(result.diagnostics) : result.error || null,
        stage: result.phase || "",
        diagnostics: result.diagnostics || [],
        classVersions: result.classVersions || [],
      });
    } catch (error) {
      setRunner({ ...emptyRunner, status: "error", error: error.message });
    }
  };

  const handleSolution = () => {
    progress.updateFiles(activeTask.id, activeTask.solutionFiles);
    setActiveFile(Object.keys(activeTask.solutionFiles)[0] || "Main.java");
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const handleReset = () => {
    progress.resetTask(activeTask.id);
    setActiveFile("Main.java");
    setCheckReport(emptyReport);
    setRunner(emptyRunner);
  };

  const sidebar = (
    <Sidebar
      tracks={tracks}
      trackOrder={trackOrder}
      lessons={allLessons}
      selectedTrack={progress.selectedTrack}
      selectedLessonId={selectedLesson.id}
      completedTasks={progress.completedTasks}
      completedCount={completedCount}
      onTrackChange={changeTrack}
      onLessonChange={changeLesson}
      onOpenSettings={() => progress.hardReset()}
    />
  );

  const main = (
    <LessonWorkspace
      lesson={selectedLesson}
      activeTask={activeTask}
      activeFile={activeFile}
      files={files}
      completedTasks={progress.completedTasks}
      checkReport={checkReport}
      runner={runner}
      onTaskChange={changeTask}
      onFileChange={setActiveFile}
      onCodeChange={(fileName, value) => progress.updateFiles(activeTask.id, { [fileName]: value })}
      onCheck={handleCheck}
      onCompile={handleCompile}
      onReset={handleReset}
      onSolution={activeTask.mode === "guided" ? handleSolution : undefined}
    />
  );

  const inspector = (
    <>
      <TeaVMPreview
        mainClass={activeTask.mainClass}
        runner={runner}
        onRun={handleCompile}
      />
      <RuntimeConsole runner={runner} />
    </>
  );

  return <AppShell sidebar={sidebar} main={main} inspector={inspector} />;
}
