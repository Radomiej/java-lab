export default function RuntimeConsole({ runner }) {
  return (
    <section className="runtime-console" aria-labelledby="console-title">
      <div className="preview-heading"><div><p className="eyebrow">JDK 17</p><h2 id="console-title">Konsola i diagnostyka</h2></div><span className={`runtime-pill runtime-pill--${runner.status}`}>{runner.status === "compiling" ? "Kompiluję" : runner.status === "error" ? "Błąd" : runner.status === "ready" ? "Gotowe" : runner.status === "jar-ready" ? "JAR gotowy" : "Czeka"}</span></div>
      <pre className="console-output">{runner.error || runner.output || "Uruchom kod, aby zobaczyć wynik programu lub komunikat kompilatora."}</pre>
    </section>
  );
}
