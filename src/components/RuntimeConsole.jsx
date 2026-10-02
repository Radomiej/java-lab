export default function RuntimeConsole({ runner }) {
  const statusLabel = runner.status === "compiling" ? "Kompiluję" : runner.status === "error" ? "Błąd" : runner.status === "ready" ? "Gotowe" : "Czeka";
  return (
    <section className="runtime-console" aria-labelledby="console-title">
      <div className="console-heading"><h2 id="console-title">Konsola</h2><span className={`runtime-pill runtime-pill--${runner.status}`} role="status">{statusLabel}</span></div>
      <pre className="console-output" tabIndex={0} aria-label="Wynik programu i komunikaty kompilatora">{runner.error || runner.output || runner.stage || "Uruchom kod, aby zobaczyć wynik programu lub komunikat kompilatora."}</pre>
    </section>
  );
}
