import GameCoursePdf from './GameCoursePdf.jsx';
import LessonExplanation from './JavaLessonExplanation.jsx';

export default function LessonOverview({ lesson, headingOnly = false, learningOnly = false }) {
  return (
    <section className="lesson-overview" aria-label={learningOnly ? "Materiał lekcji" : undefined} aria-labelledby={learningOnly ? undefined : "lesson-title"}>
      {!learningOnly && <><div className="breadcrumb"><span>Kurs Java · {lesson.track === "game-dev" ? "Game Dev" : lesson.track === "inheritance" ? "OOP II" : lesson.track === "objects" ? "OOP I" : "Fundamenty"} · Lekcja {lesson.order}</span></div>
      <div className="lesson-heading-row"><h1 id="lesson-title"><span aria-hidden="true">▤ </span>{lesson.title}</h1></div>
      </>}
      {!headingOnly && <>{lesson.track === 'game-dev' && <><GameCoursePdf /><details className="course-material-note"><summary>O materiałach PDF</summary><p>Materiały zawierają przykłady Java zgodne z silnikiem Java Lab: klasy, komponenty, kamerę, HUD i animacje.</p></details></>}
      <LessonExplanation lesson={lesson} language="java" /></>}
    </section>
  );
}
