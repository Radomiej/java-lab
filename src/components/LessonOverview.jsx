import GameCoursePdf from './GameCoursePdf.jsx';
import LessonExplanation from './JavaLessonExplanation.jsx';
import { tracks } from '../data/curriculum.js';
import './LessonOverview.css';

const pdfInformation = 'Materiały zawierają przykłady Java zgodne z silnikiem Java Lab: klasy, komponenty, kamerę, HUD i animacje.';

export default function LessonOverview({ lesson, headingOnly = false, learningOnly = false }) {
  return (
    <section className="lesson-overview" aria-label={learningOnly ? "Materiał lekcji" : undefined} aria-labelledby={learningOnly ? undefined : "lesson-title"}>
      {!learningOnly && <><div className="breadcrumb"><span>Kurs Java · {tracks[lesson.track]?.shortLabel || "Kurs"} · Lekcja {lesson.order}</span></div>
      <div className="lesson-heading-row"><h1 id="lesson-title"><span aria-hidden="true">▤ </span>{lesson.title}</h1></div>
      </>}
      {!headingOnly && <>{lesson.track === 'game-dev' && <div className="course-material-actions"><GameCoursePdf /><details className="course-material-note" onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary').focus(); } }}><summary aria-label="O materiałach PDF" title={pdfInformation}>?</summary><p>{pdfInformation}</p></details></div>}
      <LessonExplanation lesson={lesson} language="java" /></>}
    </section>
  );
}
