import CourseSubmission from './CourseSubmission.jsx';
import LessonQuiz from './LessonQuiz.jsx';
import './LearningModule.css';
import {useState,useEffect} from 'react';
import GuidedChange from '../../shared/lab-game-v2/editor/GuidedChange.jsx';
import {changedRange} from '../../shared/lab-game-v2/editor/guidedChanges.js';
import {formatJavaSource} from './javaEditorCommands.js';
import LessonOverview from "./LessonOverview.jsx";
import TaskPanel from "./TaskPanel.jsx";
import CodeEditor from "./CodeEditor.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";
import LessonPilot from './LessonPilot.jsx';

export default function LessonWorkspace({ lesson, onNextLesson, onStageChange, previewOpen, onPreviewToggle, activeTask, activeFile, files, completedTasks, checkReport, runner, onTaskChange, onFileChange, onCodeChange, onDeleteFile, onCheck, onReset, onSolution, taskLearning, inlinePreview }) {
  useEffect(()=>{onStageChange?.('task');},[lesson.id]);
  const [showChange,setShowChange]=useState(false);
  useEffect(()=>setShowChange(false),[activeTask.id]);
  const solution=()=>{onSolution?.();setShowChange(true);};
  const highlight=showChange?changedRange(formatJavaSource(activeTask.starterFiles?.[activeFile]??''),files[activeFile]??''):null;
  const editor = <section className="editor-section" aria-labelledby="editor-title">
    <div className="section-heading-row">
      <h2 id="editor-title"><span aria-hidden="true">⌨ </span>Zbuduj rozwiązanie</h2>
      <span className="language-badge">Java 21 · WebAssembly</span>
    </div>
    <CodeEditor files={files} protectedFiles={activeTask.starterFiles} activeFile={activeFile} taskId={activeTask.id} onFileChange={onFileChange} onCodeChange={onCodeChange} onDeleteFile={onDeleteFile} onCheck={onCheck} onReset={()=>{setShowChange(false);onReset?.();}} onSolution={!taskLearning&&onSolution?solution:undefined} highlight={activeTask.solutionExplanation?highlight:null} runner={runner} engine={activeTask.engine} />
  </section>;
  const feedback = checkReport.total > 0 && <FeedbackPanel report={checkReport} />;
  const submission = <CourseSubmission key={activeTask.id} lesson={lesson} task={activeTask} files={files} />;

  if (taskLearning) return (
    <div className="lesson-workspace lesson-workspace--pilot">
      <LessonOverview lesson={lesson} headingOnly />
      <LessonPilot lesson={lesson} activeTask={activeTask} learning={taskLearning} completedTasks={completedTasks}
        onTaskChange={onTaskChange} onNextLesson={onNextLesson} editor={editor} preview={inlinePreview} feedback={feedback} submission={submission} />
    </div>
  );
  return (
    <div className="lesson-workspace">
      <LessonOverview lesson={lesson} headingOnly />
      <section className="java-learning-step java-learning-step--theory" aria-label="Teoria i przykład">
        <div className="java-learning-step-heading"><span aria-hidden="true">01</span><p>POZNAJ <span aria-hidden="true">→</span> PRZEŚLEDŹ</p></div>
        <LessonOverview lesson={lesson} learningOnly />
      </section>
      <section className="java-learning-step java-learning-step--practice" aria-label="Krótka próba">
        <div className="java-learning-step-heading"><span aria-hidden="true">02</span><p>SPRAWDŹ, CZY ROZUMIESZ</p></div>
        <LessonQuiz key={lesson.id} lesson={lesson} onContinue={()=>document.getElementById('java-task-section')?.scrollIntoView({behavior:'smooth',block:'start'})}/>
      </section>
      <section id="java-task-section" className="java-learning-step java-learning-step--task" aria-label="Zadanie do wykonania">
        <div className="java-learning-step-heading"><span aria-hidden="true">03</span><p>SPRÓBUJ SAMODZIELNIE</p></div>
      {activeTask.engine&&<button className="java-learning-next" type="button" aria-expanded={Boolean(previewOpen)} onClick={onPreviewToggle}>{previewOpen?'Schowaj podgląd':'Pokaż podgląd'}</button>}
      <TaskPanel lesson={lesson} activeTask={activeTask} completedTasks={completedTasks} onTaskChange={onTaskChange} />
      {showChange && <GuidedChange starter={activeTask.starterFiles} solution={activeTask.solutionFiles} explanation={activeTask.solutionExplanation} />}
      {editor}
      {feedback}
      {submission}
      {lesson.tasks.findIndex(task=>task.id===activeTask.id)<lesson.tasks.length-1&&<button className="java-learning-next" type="button" onClick={()=>onTaskChange(lesson.tasks[lesson.tasks.findIndex(task=>task.id===activeTask.id)+1].id)}>Następne zadanie →</button>}
      {lesson.tasks.at(-1)?.id===activeTask.id&&onNextLesson&&<button className="java-learning-next" type="button" onClick={onNextLesson}>Następna lekcja →</button>}
      </section>
    </div>
  );
}
