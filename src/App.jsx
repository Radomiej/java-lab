import { useEffect, useMemo, useState } from "react";
import { allLessons, getLessonById, getLessonsForTrack, trackOrder, tracks } from "./data/curriculum.js";
import { useCourseProgress } from "./hooks/useCourseProgress.js";
import { checkSource } from "./services/lessonChecker.js";
import { compileAndRun } from "./services/javaApi.js";
import AppShell from "./components/AppShell.jsx";
import Sidebar from "./components/Sidebar.jsx";
import LessonWorkspace from "./components/LessonWorkspace.jsx";
import RuntimeConsole from "./components/RuntimeConsole.jsx";
import CheerpJPreview from "./components/CheerpJPreview.jsx";

const emptyReport = { passed: false, score: 0, total: 0, results: [], summary: "Uruchom sprawdzanie, aby zobaczyć wyniki." };

export default function App() {
  const progress = useCourseProgress(allLessons);
  const selectedLesson = getLessonById(progress.selectedLessonId);
  const [activeTaskId, setActiveTaskId] = useState(selectedLesson.tasks[0]?.id);
  const [activeFile, setActiveFile] = useState("Main.java");
  const [checkReport, setCheckReport] = useState(emptyReport);
  const [runner, setRunner] = useState({ status: "idle", output: "", error: null, jarUrl: null });

  useEffect(() => {
    if (!selectedLesson.tasks.some((task) => task.id === activeTaskId)) {
      setActiveTaskId(selectedLesson.tasks[0]?.id);
      setActiveFile("Main.java");
      setCheckReport(emptyReport);
      setRunner({ status: "idle", output: "", error: null, jarUrl: null });
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
    setRunner({ status: "idle", output: "", error: null, jarUrl: null });
  };

  const changeTask = (taskId) => {
    setActiveTaskId(taskId);
    setActiveFile("Main.java");
    setCheckReport(emptyReport);
    setRunner({ status: "idle", output: "", error: null, jarUrl: null });
  };

  const handleCheck = () => {
    const report = checkSource(files, activeTask.checks);
    setCheckReport(report);
    progress.markTaskComplete(activeTask.id, report.passed);
  };

  const handleCompile = async (mode) => {
    setRunner({ status: "compiling", output: "Kompiluję kod przez lokalny JDK…", error: null, jarUrl: null });
    try {
      const result = await compileAndRun({ files, mainClass: activeTask.mainClass, mode });
      setRunner({
        status: result.ok === false ? "error" : mode === "swing" ? "jar-ready" : "ready",
        output: result.output || "",
        error: result.ok === false ? result.output : null,
        jarUrl: result.jarUrl || null,
      });
    } catch (error) {
      setRunner({ status: "error", output: "", error: error.message, jarUrl: null });
    }
  };

  const handleSolution = () => {
    progress.updateFiles(activeTask.id, activeTask.solutionFiles);
    setActiveFile(Object.keys(activeTask.solutionFiles)[0] || "Main.java");
    setCheckReport(emptyReport);
    setRunner({ status: "idle", output: "", error: null, jarUrl: null });
  };

  const handleReset = () => {
    progress.resetTask(activeTask.id);
    setActiveFile("Main.java");
    setCheckReport(emptyReport);
    setRunner({ status: "idle", output: "", error: null, jarUrl: null });
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
      onCompile={() => handleCompile(activeTask.runMode || "console")}
      onCompileCheerpJ={() => handleCompile("swing")}
      onReset={handleReset}
      onSolution={activeTask.mode === "guided" ? handleSolution : undefined}
    />
  );

  const inspector = (
    <>
      <CheerpJPreview
        jarUrl={runner.jarUrl}
        mainClass={activeTask.mainClass}
        status={runner.status}
        onRun={() => handleCompile("swing")}
      />
      <RuntimeConsole runner={runner} />
    </>
  );

  return <AppShell sidebar={sidebar} main={main} inspector={inspector} />;
}
