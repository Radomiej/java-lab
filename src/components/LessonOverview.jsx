export default function LessonOverview({ lesson }) {
  return (
    <section className="lesson-overview" aria-labelledby="lesson-title">
      <div className="breadcrumb"><span>Kurs Java · {lesson.track === "game-dev" ? "Game Dev" : lesson.track === "inheritance" ? "OOP II" : lesson.track === "objects" ? "OOP I" : "Fundamenty"} · Lekcja {lesson.order}</span></div>
      <div className="lesson-heading-row"><h1 id="lesson-title"><span aria-hidden="true">▤ </span>{lesson.title}</h1></div>
      <div className="theory-list">
        {lesson.theory.map((block) => (
          <article className="theory-block" key={block.title}><h2>{block.title}</h2><p>{block.text}</p><pre><code>{block.code}</code></pre></article>
        ))}
      </div>
      <div className="tips-row"><strong>Zapamiętaj</strong>{lesson.tips.map((tip) => <span key={tip}>{tip}</span>)}</div>
    </section>
  );
}
