export default function RuntimeConsole({ runner }) {
  const statusLabel = runner.status === "compiling" ? "Kompiluję" : runner.status === "error" ? "Błąd" : runner.status === "ready" ? "Gotowe" : "Czeka";
  return (
    <section className="runtime-console" aria-labelledby="console-title">
      <div className="preview-heading"><div><p className="eyebrow">TeaVM · Java 17 API</p><h2 id="console-title">Konsola i diagnostyka</h2></div><span className={`runtime-pill runtime-pill--${runner.status}`}>{statusLabel}</span></div>
      <pre className="console-output">{runner.error || runner.output || runner.stage || "Uruchom kod, aby zobaczyć wynik programu lub komunikat kompilatora."}</pre>
    </section>
  );
}
