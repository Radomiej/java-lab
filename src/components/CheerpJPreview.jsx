import { useRef, useState } from "react";

let loaderPromise;

function loadCheerpJ() {
  if (window.cheerpjInit) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cjrtnc.leaningtech.com/4.3/loader.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Nie udało się załadować runtime'u CheerpJ. Sprawdź połączenie z internetem."));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

export default function CheerpJPreview({ jarUrl, mainClass, status, onRun }) {
  const displayRef = useRef(null);
  const [displayState, setDisplayState] = useState("idle");

  const runJar = async () => {
    if (!jarUrl) {
      onRun();
      return;
    }
    setDisplayState("loading");
    try {
      await loadCheerpJ();
      displayRef.current.innerHTML = "";
      await window.cheerpjInit();
      window.cheerpjCreateDisplay(-1, -1, displayRef.current);
      await window.cheerpjRunJar(`/app${jarUrl}`);
      setDisplayState("running");
    } catch (error) {
      setDisplayState("error");
    }
  };

  return (
    <section className="preview-card" aria-labelledby="preview-title">
      <div className="preview-heading"><div><p className="eyebrow">CheerpJ 4.3</p><h2 id="preview-title">Podgląd aplikacji</h2></div><span className="runtime-pill runtime-pill--small">{status === "jar-ready" || displayState === "running" ? "JAR gotowy" : "WebAssembly"}</span></div>
      <p className="preview-copy">Uruchom skompilowaną klasę <code>{mainClass}</code> w przeglądarkowej JVM. Swing pojawi się w tym panelu.</p>
      <div className="cheerpj-display" ref={displayRef}>{displayState === "idle" && <span>Panel uruchomi się po kliknięciu przycisku.</span>}{displayState === "loading" && <span>Ładuję CheerpJ i aplikację…</span>}{displayState === "error" && <span>CheerpJ nie wystartował. Sprawdź konsolę przeglądarki.</span>}</div>
      <button className="button button--cheerp button--wide" type="button" onClick={runJar} disabled={status === "compiling"}>{jarUrl ? "▶ Uruchom gotowy JAR" : "Przygotuj JAR przez JDK"}</button>
      <p className="preview-note">Pierwsze uruchomienie pobiera runtime CheerpJ z oficjalnego CDN.</p>
    </section>
  );
}
