import { useEffect, useRef, useState } from 'react';
import CodeExample from '../../shared/lab-game-v2/editor/CodeExample.jsx';
import PageDiagram from '../../shared/lab-game-v2/editor/PageDiagram.jsx';
import CopyLessonLink from './CopyLessonLink.jsx';
import GameDevTerms from './GameDevTerms.jsx';
import ChaseVectorBoard from './ChaseVectorBoard.jsx';
import CoordinateBoard from './CoordinateBoard.jsx';
import ComponentToggleBoard from './ComponentToggleBoard.jsx';
import KeyPressBoard from './KeyPressBoard.jsx';
import StepTrial from './StepTrial.jsx';
import { RowIcon } from './algoIcons.jsx';
import './LessonPilot.css';

function PlatformTrial() {
  const [played, setPlayed] = useState(false);
  return <div className="pilot-platform-trial">
    <svg viewBox="0 70 440 155" role="img" aria-label={played ? 'Platforma A: x = 120. Platforma B: x = 340.' : 'Położenie początkowe platform A i B.'}>
      <rect x="0" y="70" width="440" height="155" rx="10" fill="#10263a" />
      <rect x="70" y="170" width="100" height="20" rx="3" fill="#70c994" />
      <text x="120" y="209" textAnchor="middle" fill="#fff">PlatformA</text>
      <g className="pilot-trial-moving" transform={played ? 'translate(40 0)' : undefined}>
        <rect x="260" y="110" width="80" height="20" rx="3" fill="#ffd166" />
        <text x="300" y="150" textAnchor="middle" fill="#fff">PlatformB</text>
      </g>
    </svg>
    <button className={played ? 'java-learning-next' : 'button button--primary pilot-trial-play'}
      type="button" onClick={() => setPlayed(current => !current)}>
      {!played && <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 2.5v11L13 8Z" fill="currentColor" />
      </svg>}
      {played ? 'Przywróć położenie startowe' : 'Odtwórz próbę'}
    </button>
    <p role="status">{played ? 'PlatformA stoi na x = 120. PlatformB przesunęła się z x = 300 na x = 340.' : 'Stan początkowy'}</p>
  </div>;
}

function TheoryVisual({ learning }) {
  if (learning.board?.kind === 'chase') {
    return <ChaseVectorBoard mode={learning.board.mode} />;
  }
  if (learning.board?.kind === 'coordinates') return <CoordinateBoard {...learning.board} />;
  if (learning.board?.kind === 'components') return <ComponentToggleBoard {...learning.board} />;
  if (learning.board?.kind === 'keypress') return <KeyPressBoard {...learning.board} />;
  if (learning.visual?.kind === 'array') {
    return <figure className="page-diagram pilot-array-visual">
      <figcaption>{learning.title}</figcaption>
      <RowIcon values={learning.visual.values} at={learning.visual.highlight ?? -1} sortedFrom={learning.visual.sortedFrom} />
    </figure>;
  }
  return <PageDiagram page={learning} />;
}

function AnswerDetails({ answer }) {
  return <details className="pilot-observation">
    <summary>Porównaj z oczekiwanym wynikiem</summary>
    <p><GameDevTerms text={answer} /></p>
    <p>Jeśli wynik różni się od przewidywania, znajdź w kodzie instrukcję lub warunek, który o nim decyduje.</p>
  </details>;
}

export default function LessonPilot({
  lesson, activeTask, learning, completedTasks, onTaskChange, onNextLesson, editor, preview, feedback, submission,
}) {
  const heading = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lesson.id]);
  const taskIndex = lesson.tasks.findIndex(task => task.id === activeTask.id);
  const nextTask = lesson.tasks[taskIndex + 1];
  const focusTask = () => {
    heading.current?.focus();
  };
  const goNext = () => {
    if (nextTask) {
      onTaskChange(nextTask.id);
      focusTask();
    } else {
      onNextLesson?.();
    }
  };
  const cheatsheet = learning.cheatsheet;

  return <>
    <nav className="pilot-task-picker" aria-label="Wybierz zadanie">
      {lesson.tasks.map((task, index) => (
        <button className="pilot-task-choice" key={task.id} type="button" aria-current={task.id === activeTask.id ? 'step' : undefined} onClick={() => { if (task.id !== activeTask.id) onTaskChange(task.id); }}>
          <span aria-hidden="true">{completedTasks.includes(task.id) ? '✓' : index + 1}</span>
          {task.title}
          {completedTasks.includes(task.id) && <span className="sr-only">, ukończone</span>}
        </button>
      ))}
    </nav>

    <div className="pilot-learning">
      <details className="pilot-disclosure" key={lesson.id} open>
        <summary><strong>Teoria pod ręką</strong><span>{learning.title}</span></summary>
        <div className="pilot-disclosure-body">
          <h2>{learning.title}</h2>
          <p><GameDevTerms text={learning.text} /></p>
          <div className="pilot-theory-grid">
            <TheoryVisual key={activeTask.id} learning={learning} />
            <div><h3>Zapis w Javie</h3><CodeExample key={activeTask.id} code={learning.code} /></div>
          </div>
          <button type="button" className="pilot-return" onClick={focusTask}>Wróć do edytora ↓</button>
        </div>
      </details>
      <details className="pilot-disclosure" key={activeTask.id}>
        <summary><strong>Przewidź i sprawdź</strong><span>{learning.question}</span><small>Opcjonalnie</small></summary>
        <div className="pilot-disclosure-body">
          <p><GameDevTerms text={learning.prediction.context} /></p>
          <div className="pilot-prediction-code">
            <CodeExample label="Kod próby" code={learning.prediction.code} />
          </div>
          {learning.trace ? <>
            {learning.trial && <p><strong>Sprawdź.</strong> <GameDevTerms text={learning.trial} /></p>}
            <StepTrial trace={learning.trace} />
            <AnswerDetails answer={learning.answer} />
          </> : learning.trialWidget === 'platform' ? <PlatformTrial /> : <>
            <p><strong>Sprawdź.</strong> <GameDevTerms text={learning.trial} /></p>
            <AnswerDetails answer={learning.answer} />
          </>}
        </div>
      </details>
    </div>

    <section className="pilot-task" aria-labelledby="pilot-task-title">
      <div className="pilot-task-heading">
        <span className="pilot-start-label">Zacznij tutaj</span>
        <CopyLessonLink />
      </div>
      <h2 id="pilot-task-title" tabIndex={-1} ref={heading}>Zadanie {taskIndex + 1} · {activeTask.title}</h2>
      <p className="pilot-prompt"><GameDevTerms text={activeTask.prompt} /></p>
      {activeTask.criteria?.length > 0 && <details className="pilot-criteria" key={`criteria-${activeTask.id}`}>
        <summary>Kryteria zaliczenia</summary>
        <ul>{activeTask.criteria.map(criterion => <li key={criterion}><GameDevTerms text={criterion} /></li>)}</ul>
      </details>}
      {activeTask.steps?.length > 0 && <details className="pilot-criteria" key={`steps-${activeTask.id}`}>
        <summary>Kroki</summary>
        <ol>{activeTask.steps.map(step => <li key={step}><GameDevTerms text={step} /></li>)}</ol>
      </details>}
      {activeTask.hints?.length > 0 && <details className="pilot-criteria" key={`hints-${activeTask.id}`}>
        <summary>Wskazówki</summary>
        <ul>{activeTask.hints.map(hint => <li key={hint}><GameDevTerms text={hint} /></li>)}</ul>
      </details>}
      {cheatsheet && <details className="pilot-disclosure pilot-cheatsheet">
        <summary><strong>Ściąga do zadania</strong><span>{cheatsheet.title}</span></summary>
        <div className="pilot-disclosure-body">
          <p><GameDevTerms text={cheatsheet.intro} /></p>
          <CodeExample {...cheatsheet.examples[0]} />
          {cheatsheet.examples.length > 1 && <details className="pilot-cheatsheet-alternatives">
            <summary>Pokaż inne sposoby</summary>
            {cheatsheet.examples.slice(1).map(example => <CodeExample key={example.label} {...example} />)}
          </details>}
        </div>
      </details>}
      <div className="pilot-workbench">
        {editor}
        {preview}
      </div>
      {feedback}
      {submission}
      {(nextTask || onNextLesson) && <div className="pilot-next">
        <button className="java-learning-next" type="button" onClick={goNext}>{nextTask ? 'Następne zadanie →' : 'Następna lekcja →'}</button>
      </div>}
    </section>
  </>;
}
