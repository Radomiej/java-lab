export default function LessonOverview({ lesson }) {
  return (
    <section className="lesson-overview" aria-labelledby="lesson-title">
      <div className="breadcrumb"><span>KURS JAVA</span><span>›</span><span>{lesson.track === "swing" ? "SWING" : lesson.track === "inheritance" ? "OOP II" : lesson.track === "objects" ? "OOP I" : "FUNDAMENTY"}</span></div>
      <div className="lesson-heading-row"><div><h1 id="lesson-title">{lesson.title}</h1><p className="lesson-summary">{lesson.objective}</p></div><span className="lesson-tag">Lekcja {String(lesson.order).padStart(2, "0")}</span></div>
      <div className="theory-list">
        {lesson.theory.map((block) => (
          <article className="theory-block" key={block.title}><h2>{block.title}</h2><p>{block.text}</p><pre><code>{block.code}</code></pre></article>
        ))}
      </div>
      <div className="tips-row"><strong>Zapamiętaj</strong>{lesson.tips.map((tip) => <span key={tip}>{tip}</span>)}</div>
    </section>
  );
}
