import CourseSubmission from './CourseSubmission.jsx';
import LessonQuiz from './LessonQuiz.jsx';
import './LearningModule.css';
import CopyLessonLink from './CopyLessonLink.jsx';
import {useState,useEffect} from 'react';
import GuidedChange from '../../shared/lab-game-v2/editor/GuidedChange.jsx';
import {changedRange} from '../../shared/lab-game-v2/editor/guidedChanges.js';
import {formatJavaSource} from './javaEditorCommands.js';
import LessonOverview from "./LessonOverview.jsx";
import TaskPanel from "./TaskPanel.jsx";
import CodeEditor from "./CodeEditor.jsx";
import FeedbackPanel from "./FeedbackPanel.jsx";

export default function LessonWorkspace({ lesson, onNextLesson, onStageChange, previewOpen, onPreviewToggle, activeTask, activeFile, files, completedTasks, checkReport, runner, onTaskChange, onFileChange, onCodeChange, onDeleteFile, onCheck, onReset, onSolution }) {
  const [stage,setStage]=useState('learn');
  useEffect(()=>{onStageChange?.(stage);},[stage,onStageChange]);
  const [visited,setVisited]=useState({learn:true});
  useEffect(()=>{setStage('learn');setVisited({learn:true});},[lesson.id]);
  const selectStage=next=>{setVisited(current=>({...current,[next]:true}));setStage(next);};
  const [showChange,setShowChange]=useState(false);
  useEffect(()=>setShowChange(false),[activeTask.id]);
  const solution=()=>{onSolution?.();setShowChange(true);};
  const highlight=showChange?changedRange(formatJavaSource(activeTask.starterFiles?.[activeFile]??''),files[activeFile]??''):null;
  return (
    <div className="lesson-workspace">
      <LessonOverview lesson={lesson} headingOnly />
      <nav className="java-learning-nav" aria-label="Etapy lekcji">
        {[['learn','1. Nauka'],['quiz','2. Quiz'],['task','3. Zadanie']].map(([id,label])=><button type="button" key={id} aria-current={stage===id?'step':undefined} onClick={()=>selectStage(id)}>{label}</button>)}
      </nav>
      <div hidden={stage!=='learn'}><LessonOverview lesson={lesson} learningOnly /><button className="java-learning-next" type="button" onClick={()=>selectStage('quiz')}>Przejdź do quizu →</button></div>
      {visited.quiz&&<div hidden={stage!=='quiz'}><LessonQuiz key={lesson.id} lesson={lesson} onContinue={()=>selectStage('task')}/></div>}
      {visited.task&&<div hidden={stage!=='task'}>
      <CopyLessonLink />
      {activeTask.engine&&<button className="java-learning-next" type="button" aria-expanded={Boolean(previewOpen)} onClick={onPreviewToggle}>{previewOpen?'Schowaj podgląd':'Pokaż podgląd'}</button>}
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
      <CourseSubmission key={activeTask.id} lesson={lesson} task={activeTask} files={files} />
      {lesson.tasks.findIndex(task=>task.id===activeTask.id)<lesson.tasks.length-1&&<button className="java-learning-next" type="button" onClick={()=>onTaskChange(lesson.tasks[lesson.tasks.findIndex(task=>task.id===activeTask.id)+1].id)}>Następne zadanie →</button>}
      {lesson.tasks.at(-1)?.id===activeTask.id&&onNextLesson&&<button className="java-learning-next" type="button" onClick={onNextLesson}>Następna lekcja →</button>}
      </div>}
    </div>
  );
}
