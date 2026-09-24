function statusLabel(status) {
  if (status === "compiling") return "TeaVM pracuje";
  if (status === "ready") return "Wynik gotowy";
  if (status === "error") return "Diagnostyka";
  return "Czeka na uruchomienie";
}

export default function TeaVMPreview({ runner, mainClass, onRun }) {
  const isReady = runner.status === "ready" && runner.output;

  return (
    <section className="preview-card" aria-labelledby="preview-title">
      <div className="preview-heading">
        <div><p className="eyebrow">TeaVM · WebAssembly</p><h2 id="preview-title">Podgląd programu</h2></div>
        <span className={`runtime-pill runtime-pill--${runner.status}`}>{statusLabel(runner.status)}</span>
      </div>
      <p className="preview-copy">Klasa <code>{mainClass}</code> jest kompilowana i uruchamiana w przeglądarce przez TeaVM. Nie używamy lokalnej Javy ani JAR-a.</p>
      <div className="teavm-display" aria-live="polite">
        {isReady ? <pre className="teavm-output">{runner.output}</pre> : <span>{runner.stage || "Wynik pojawi się po uruchomieniu programu."}</span>}
      </div>
      <button className="button button--teavm button--wide" type="button" onClick={onRun} disabled={runner.status === "compiling"}>
        ▶ Uruchom w TeaVM
      </button>
      <p className="preview-note">Oficjalne zasoby TeaVM są dołączone lokalnie, a kompilacja i uruchomienie działają w Web Workerze. Kurs używa Java 21.</p>
    </section>
  );
}
