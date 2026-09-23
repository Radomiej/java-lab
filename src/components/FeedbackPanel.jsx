export default function FeedbackPanel({ report }) {
  return (
    <section className="feedback-panel" aria-labelledby="feedback-title">
      <div className="section-heading-row"><div><p className="eyebrow">Walidator kursu</p><h2 id="feedback-title">Wyniki testów</h2></div><span className={`score-badge${report.passed ? " is-complete" : ""}`}>{report.total ? `${report.score}/${report.total}` : "—"}</span></div>
      <p className={`feedback-summary${report.passed ? " is-success" : ""}`}>{report.summary}</p>
      {report.results.length > 0 && <ul className="feedback-list">{report.results.map((result) => <li className={result.passed ? "" : "is-failed"} key={result.label}><span className="feedback-icon">{result.passed ? "✓" : "!"}</span><span><strong>{result.label}</strong><small>{result.detail}</small></span></li>)}</ul>}
    </section>
  );
}
