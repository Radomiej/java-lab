import LessonOverview from "./LessonOverview.jsx";
import TaskPanel from "./TaskPanel.jsx";
import CodeEditor from "./CodeEditor.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";

export default function LessonWorkspace({ lesson, activeTask, activeFile, files, completedTasks, checkReport, runner, onTaskChange, onFileChange, onCodeChange, onDeleteFile, onCheck, onReset, onSolution }) {
  return (
    <div className="lesson-workspace">
      <LessonOverview lesson={lesson} />
      <TaskPanel lesson={lesson} activeTask={activeTask} completedTasks={completedTasks} onTaskChange={onTaskChange} />
      <section className="editor-section" aria-labelledby="editor-title">
        <div className="section-heading-row">
          <h2 id="editor-title"><span aria-hidden="true">⌨ </span>Zbuduj rozwiązanie</h2>
          <span className="language-badge">Java 21 · WebAssembly</span>
        </div>
        <CodeEditor files={files} protectedFiles={activeTask.starterFiles} activeFile={activeFile} taskId={activeTask.id} onFileChange={onFileChange} onCodeChange={onCodeChange} onDeleteFile={onDeleteFile} onCheck={onCheck} onReset={onReset} onSolution={onSolution} runner={runner} engine={activeTask.engine} />
      </section>
      {checkReport.total > 0 && <FeedbackPanel report={checkReport} />}
    </div>
  );
}
