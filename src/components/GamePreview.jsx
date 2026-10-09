import { useEffect, useRef, useState } from "react";
import { createGameInterop } from "../services/gameInterop.js";

export default function GamePreview({ runner }) {
  const isReady = runner.status === "ready";
  const [keys, setKeys] = useState([]);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const [fullscreen,setFullscreen] = useState(false);
  const [debugColliders,setDebugColliders] = useState(false);
  const interopRef = useRef(null);
  const panelRef = useRef(null);
  const fullscreenButtonRef = useRef(null);
  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    canvasRef.current?.focus();
    const onKey = event => {
      if (event.key === 'Escape') {event.preventDefault(); setFullscreen(false);}
      if (event.key === 'Tab') {
        const targets = [...panelRef.current.querySelectorAll('button, canvas[tabindex]')];
        const index = targets.indexOf(document.activeElement);
        event.preventDefault();
        targets[(index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length]?.focus();
      }
    };
    document.addEventListener('keydown',onKey);
    return () => {document.body.style.overflow=previousOverflow; document.removeEventListener('keydown',onKey); fullscreenButtonRef.current?.focus();};
  },[fullscreen]);
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
    interopRef.current=interop;
    interop.resize();
    return () => {interopRef.current=null;interop.dispose();};
  }, []);
  useEffect(()=>{
    const update=event=>setDebugColliders(event.detail.enabled);
    window.addEventListener('java-lab-game-debug-state',update);
    return ()=>window.removeEventListener('java-lab-game-debug-state',update);
  },[]);
  return (
    <section ref={panelRef} className={`preview-card game-preview${fullscreen ? ' game-preview--fullscreen' : ''}`} role={fullscreen ? 'dialog' : undefined} aria-modal={fullscreen ? true : undefined} aria-labelledby="game-preview-title">
      <div className="preview-heading">
        <div><p className="eyebrow">TeaVM · Game Dev</p><h2 id="game-preview-title">Podgląd gry</h2></div>
        <div className="game-preview-actions">
          <button className="button button--ghost" type="button" aria-pressed={debugColliders} title="Debug: żółty kontur to collider, niebieski przerywany to trigger" onClick={()=>{const value=!debugColliders;setDebugColliders(value);interopRef.current?.setDebugColliders(value);}}>Collidery</button>
          <span className={`runtime-pill runtime-pill--${runner.status}`}>{runner.status === "compiling" ? "Budowanie" : isReady ? "Gra gotowa" : "Czeka"}</span>
          <button ref={fullscreenButtonRef} className="button button--ghost" type="button" onClick={() => setFullscreen(value => !value)} aria-label={fullscreen ? 'Zamknij pełny ekran gry' : 'Pełny ekran gry'}>{fullscreen ? '✕ Zamknij' : '⛶'}</button>
        </div>
      </div>
      <p className="game-control-hint">Kliknij planszę, aby przechwycić klawiaturę. W zadaniach ze sterowaniem użyj WASD lub strzałek; jeśli zadanie ma TODO dotyczące ruchu, uzupełnij je.</p>
      <div className="game-stage" ref={stageRef} role="application" aria-label="Plansza gry. Kliknij, aby przechwycić klawisze.">
        <canvas ref={canvasRef} className="game-canvas" aria-label="Canvas gry" />
        {!isReady && <span>{runner.stage || "Uruchom program, aby zobaczyć scenę."}</span>}
        {keys.length > 0 && <span className="game-input-status">{keys.join(" + ")}</span>}
      </div>
    </section>
  );
}

