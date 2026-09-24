import LessonOverview from "./LessonOverview.jsx";
import TaskPanel from "./TaskPanel.jsx";
import CodeEditor from "./CodeEditor.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";

export default function LessonWorkspace({ lesson, activeTask, activeFile, files, completedTasks, checkReport, runner, onTaskChange, onFileChange, onCodeChange, onCheck, onCompile, onReset, onSolution }) {
  return (
    <div className="lesson-workspace">
      <LessonOverview lesson={lesson} />
      <TaskPanel lesson={lesson} activeTask={activeTask} completedTasks={completedTasks} onTaskChange={onTaskChange} />
      <section className="editor-section" aria-labelledby="editor-title">
        <div className="section-heading-row">
          <div><p className="eyebrow">Laboratorium kodu</p><h2 id="editor-title">Zbuduj rozwiązanie</h2></div>
          <span className="language-badge">Java 21 · WebAssembly</span>
        </div>
        <CodeEditor files={files} activeFile={activeFile} taskId={activeTask.id} onFileChange={onFileChange} onCodeChange={onCodeChange} onCheck={onCheck} onCompile={onCompile} onReset={onReset} onSolution={onSolution} runner={runner} />
      </section>
      <FeedbackPanel report={checkReport} />
    </div>
  );
}
