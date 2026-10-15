import {useState,useEffect} from 'react';
import GuidedChange from '../../shared/lab-game-v2/editor/GuidedChange.jsx';
import {changedRange} from '../../shared/lab-game-v2/editor/guidedChanges.js';
import {formatJavaSource} from './javaEditorCommands.js';
import LessonOverview from "./LessonOverview.jsx";
import TaskPanel from "./TaskPanel.jsx";
import CodeEditor from "./CodeEditor.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";

export default function LessonWorkspace({ lesson, activeTask, activeFile, files, completedTasks, checkReport, runner, onTaskChange, onFileChange, onCodeChange, onDeleteFile, onCheck, onReset, onSolution }) {
  const [showChange,setShowChange]=useState(false);
  useEffect(()=>setShowChange(false),[activeTask.id]);
  const solution=()=>{onSolution?.();setShowChange(true);};
  const highlight=showChange?changedRange(formatJavaSource(activeTask.starterFiles?.[activeFile]??''),files[activeFile]??''):null;
  return (
    <div className="lesson-workspace">
      <LessonOverview lesson={lesson} />
      <TaskPanel lesson={lesson} activeTask={activeTask} completedTasks={completedTasks} onTaskChange={onTaskChange} />
      {showChange && <GuidedChange starter={activeTask.starterFiles} solution={activeTask.solutionFiles} explanation={activeTask.solutionExplanation} />}
      <section className="editor-section" aria-labelledby="editor-title">
        <div className="section-heading-row">
          <h2 id="editor-title"><span aria-hidden="true">⌨ </span>Zbuduj rozwiązanie</h2>
          <span className="language-badge">Java 21 · WebAssembly</span>
        </div>
        <CodeEditor files={files} protectedFiles={activeTask.starterFiles} activeFile={activeFile} taskId={activeTask.id} onFileChange={onFileChange} onCodeChange={onCodeChange} onDeleteFile={onDeleteFile} onCheck={onCheck} onReset={()=>{setShowChange(false);onReset?.();}} onSolution={onSolution?solution:undefined} highlight={activeTask.solutionExplanation?highlight:null} runner={runner} engine={activeTask.engine} />
      </section>
      {checkReport.total > 0 && <FeedbackPanel report={checkReport} />}
    </div>
  );
}
