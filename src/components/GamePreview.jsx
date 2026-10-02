import { useEffect, useRef, useState } from "react";
import { createGameInterop } from "../services/gameInterop.js";

export default function GamePreview({ runner, mainClass, onRun }) {
  const isReady = runner.status === "ready";
  const [keys, setKeys] = useState([]);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const update = (event, pressed) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
      setKeys((current) => pressed ? [...new Set([...current, event.key === " " ? "Space" : event.key])] : current.filter((key) => key !== (event.key === " " ? "Space" : event.key)));
    };
    const onBlur = () => setKeys([]);
    const onKeyDown = (event) => update(event, true);
    const onKeyUp = (event) => update(event, false);
    stage.addEventListener("keydown", onKeyDown);
    stage.addEventListener("keyup", onKeyUp);
    stage.addEventListener("focusout", onBlur);
    window.addEventListener("blur", onBlur);
    return () => {
      stage.removeEventListener("keydown", onKeyDown);
      stage.removeEventListener("keyup", onKeyUp);
      stage.removeEventListener("focusout", onBlur);
      window.removeEventListener("blur", onBlur);
    };
  }, []);
  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const interop = createGameInterop(canvasRef.current);
    interop.resize();
    return () => interop.dispose();
  }, []);
  return (
    <section className="preview-card game-preview" aria-labelledby="game-preview-title">
      <div className="preview-heading">
        <div><p className="eyebrow">TeaVM · Game Dev</p><h2 id="game-preview-title">Podgląd gry</h2></div>
        <span className={`runtime-pill runtime-pill--${runner.status}`}>{runner.status === "compiling" ? "Budowanie" : isReady ? "Gra gotowa" : "Czeka"}</span>
      </div>
      <div className="game-stage" ref={stageRef} role="application" aria-label="Plansza gry. Kliknij, aby przechwycić klawisze.">
        <canvas ref={canvasRef} className="game-canvas" aria-label="Canvas gry" />
        {!isReady && <span>{runner.stage || "Uruchom program, aby zobaczyć scenę."}</span>}
        {keys.length > 0 && <span className="game-input-status">{keys.join(" + ")}</span>}
      </div>
      <button className="button button--teavm button--wide" type="button" onClick={onRun} disabled={runner.status === "compiling"}>
        ▶ Uruchom grę w przeglądarce
      </button>
    </section>
  );
}
