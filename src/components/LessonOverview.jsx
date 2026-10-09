import GameCoursePdf from '../../shared/lab-game-v2/editor/GameCoursePdf.jsx';
import LessonExplanation from '../../shared/lab-game-v2/editor/LessonExplanation.jsx';

export default function LessonOverview({ lesson }) {
  return (
    <section className="lesson-overview" aria-labelledby="lesson-title">
      <div className="breadcrumb"><span>Kurs Java · {lesson.track === "game-dev" ? "Game Dev" : lesson.track === "inheritance" ? "OOP II" : lesson.track === "objects" ? "OOP I" : "Fundamenty"} · Lekcja {lesson.order}</span></div>
      <div className="lesson-heading-row"><h1 id="lesson-title"><span aria-hidden="true">▤ </span>{lesson.title}</h1></div>
      {lesson.track === 'game-dev' && <><GameCoursePdf /><details className="course-material-note"><summary>O materiałach PDF</summary><p>Materiały zawierają przykłady JavaScript. API Java poznasz w krokach lekcji i edytorze.</p></details></>}
      <LessonExplanation lesson={lesson} language="java" />
    </section>
  );
}
