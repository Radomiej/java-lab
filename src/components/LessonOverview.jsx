import GameCoursePdf from '../../shared/lab-game-v2/editor/GameCoursePdf.jsx';
import LessonExplanation from './JavaLessonExplanation.jsx';

export default function LessonOverview({ lesson }) {
  return (
    <section className="lesson-overview" aria-labelledby="lesson-title">
      <div className="breadcrumb"><span>Kurs Java · {lesson.track === "game-dev" ? "Game Dev" : lesson.track === "inheritance" ? "OOP II" : lesson.track === "objects" ? "OOP I" : "Fundamenty"} · Lekcja {lesson.order}</span></div>
      <div className="lesson-heading-row"><h1 id="lesson-title"><span aria-hidden="true">▤ </span>{lesson.title}</h1></div>
      {lesson.track === 'game-dev' && <><GameCoursePdf language="java" /><details className="course-material-note"><summary>O materiałach PDF</summary><p>Aktualny PDF startowy zawiera program 24 lekcji i materiały pierwszych pięciu w Javie. Dodatkowe PDF-y o kamerze i tweenach zawierają przykłady JavaScript; odpowiadają lekcjom 15–17 i 19.</p></details></>}
      <LessonExplanation lesson={lesson} language="java" />
    </section>
  );
}
