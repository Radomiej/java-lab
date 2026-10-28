import { useEffect, useRef, useState } from "react";
import { createGameInterop } from "../services/gameInterop.js";

const PAD_ACTIONS = [
  { id: 'a', label: 'A', codes: ['ACTION_A', 'Space'] },
  { id: 'b', label: 'B', codes: ['ACTION_B', 'z'] },
  { id: 'x', label: 'X', codes: ['ACTION_X', 'x'] },
  { id: 'y', label: 'Y', codes: ['ACTION_Y', 'y'] },
];
const PAD_SYS = [
  { id: 'select', label: 'SELECT', codes: ['ACTION_SELECT', 'Shift'] },
  { id: 'start', label: 'START', codes: ['ACTION_START', 'Enter'] },
];
const PAD_DIRS = [
  { id: 'up', label: '▲', arrow: 'ArrowUp', wasd: 'w', aria: 'W górę' },
  { id: 'left', label: '◀', arrow: 'ArrowLeft', wasd: 'a', aria: 'W lewo' },
  { id: 'right', label: '▶', arrow: 'ArrowRight', wasd: 'd', aria: 'W prawo' },
  { id: 'down', label: '▼', arrow: 'ArrowDown', wasd: 's', aria: 'W dół' },
];
const KEY_LABELS = { ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', ACTION_A: 'A', ACTION_B: 'B', ACTION_X: 'X', ACTION_Y: 'Y', ACTION_START: 'START', ACTION_SELECT: 'SELECT' };
const ACTION_TWINS = { ACTION_A: 'Space', ACTION_B: 'z', ACTION_X: 'x', ACTION_Y: 'y', ACTION_START: 'Enter', ACTION_SELECT: 'Shift' };

const emitGameInput = (key, pressed) => window.dispatchEvent(new CustomEvent('java-lab-game-input', { detail: { key, pressed } }));

export default function GamePreview({ runner }) {
  const isReady = runner.status === "ready";
  const [keys, setKeys] = useState([]);
  const [padKeys, setPadKeys] = useState([]);
  const [stats, setStats] = useState(null);
  const [wasd, setWasd] = useState(false);
  const wasdRef = useRef(false);
  const heldRef = useRef(new Map());
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const [fullscreen,setFullscreen] = useState(false);
  const [debugColliders,setDebugColliders] = useState(false);
  const [viewOverlay,setViewOverlay] = useState(false);
  const [cameraView,setCameraView] = useState({x:0,y:0});
  const [settingsOpen,setSettingsOpen] = useState(false);
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
    const onStats=event=>setStats(event.detail);
    const onView=event=>setCameraView(event.detail);
    window.addEventListener('java-lab-game-debug-state',update);
    window.addEventListener('java-lab-game-stats',onStats);
    window.addEventListener('java-lab-game-view',onView);
    return ()=>{window.removeEventListener('java-lab-game-debug-state',update);window.removeEventListener('java-lab-game-stats',onStats);window.removeEventListener('java-lab-game-view',onView);};
  },[]);
  const padDown = (event, entry) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    heldRef.current.set(event.pointerId, entry);
    entry.codes.forEach(code => emitGameInput(code, true));
    setPadKeys(current => [...new Set([...current, ...entry.codes])]);
  };
  const padUp = event => {
    const entry = heldRef.current.get(event.pointerId);
    if (!entry) return;
    heldRef.current.delete(event.pointerId);
    entry.codes.forEach(code => emitGameInput(code, false));
    setPadKeys(current => current.filter(key => !entry.codes.includes(key)));
  };
  const toggleWasd = () => {
    const next = !wasdRef.current;
    wasdRef.current = next;
    setWasd(next);
    for (const [pointerId, entry] of [...heldRef.current]) {
      if (!entry.dir) continue;
      entry.codes.forEach(code => emitGameInput(code, false));
      const dir = PAD_DIRS.find(d => d.id === entry.dir);
      const codes = [next ? dir.wasd : dir.arrow];
      heldRef.current.set(pointerId, { ...entry, codes });
      codes.forEach(code => emitGameInput(code, true));
      setPadKeys(current => [...new Set([...current.filter(key => !entry.codes.includes(key)), ...codes])]);
    }
  };
  const down = new Set([...keys, ...padKeys]);
  const hidden = new Set(Object.entries(ACTION_TWINS).filter(([action]) => down.has(action)).map(([, twin]) => twin));
  const displayKeys = [...down].filter(key => !hidden.has(key)).map(key => KEY_LABELS[key] ?? key);
  const lit = codes => codes.some(code => down.has(code));
  const padEvents = entry => ({ onPointerDown: event => padDown(event, entry), onPointerUp: padUp, onPointerCancel: padUp, onLostPointerCapture: padUp });
  return (
    <section ref={panelRef} className={`preview-card game-preview${fullscreen ? ' game-preview--fullscreen' : ''}`} role={fullscreen ? 'dialog' : undefined} aria-modal={fullscreen ? true : undefined} aria-labelledby="game-preview-title">
      <div className="preview-heading">
        <div><h2 id="game-preview-title" className="preview-title--game">Podgląd gry</h2></div>
        <div className="game-preview-actions">
          <div className="preview-settings">
            <button className="button button--ghost game-settings-button" type="button" aria-label="Ustawienia podglądu" aria-expanded={settingsOpen} onClick={()=>setSettingsOpen(value=>!value)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm9 3.5-.9 3.2-2.3-.7a7.4 7.4 0 0 1-1.4 1.4l.7 2.3-3.2.9a7.4 7.4 0 0 1-1.9-1.9L9.8 19l-.9-3.2 2.3-.7a7.4 7.4 0 0 1 0-2.8l-2.3-.7.9-3.2 3.2-.9a7.4 7.4 0 0 1 1.4-1.4l-.7-2.3 3.2-.9a7.4 7.4 0 0 1 1.9 1.9Z"/></svg></button>
            {settingsOpen && <div className="preview-settings-menu" role="group" aria-label="Ustawienia podglądu">
              <label className="preview-switch" title="Rogi ekranu pokazują zakres świata widziany przez kamerę">
                <input type="checkbox" role="switch" checked={viewOverlay} onChange={event=>setViewOverlay(event.target.checked)} />
                <span className="preview-switch-track" aria-hidden="true"><span className="preview-switch-thumb" /></span>
                <span>Współrzędne widoku</span>
              </label>
              <label className="preview-switch" title="Żółty kontur to collider, niebieski przerywany to trigger">
                <input type="checkbox" role="switch" checked={debugColliders} onChange={event=>{const value=event.target.checked;setDebugColliders(value);interopRef.current?.setDebugColliders(value);}} />
                <span className="preview-switch-track" aria-hidden="true"><span className="preview-switch-thumb" /></span>
                <span>Bounding boxy</span>
              </label>
            </div>}
          </div>
          <span className={`runtime-pill runtime-pill--${runner.status}`}>{runner.status === "compiling" ? "Budowanie" : isReady ? "Gra gotowa" : "Czeka"}</span>
          <button ref={fullscreenButtonRef} className="button button--ghost" type="button" onClick={() => setFullscreen(value => !value)} aria-label={fullscreen ? 'Zamknij pełny ekran gry' : 'Pełny ekran gry'}>{fullscreen ? '✕ Zamknij' : '⛶'}</button>
        </div>
      </div>
      <p className="game-control-hint">Kliknij planszę, aby przechwycić klawiaturę. Sterowanie: strzałki lub WASD, przyciski A/B/X/Y, Select, Start — z konsoli ekranowej lub klawiatury (Spacja, Z, X, Y, Shift, Enter).</p>
      <div className="lab-console">
        <div className="lab-console-shell">
          <div className="game-stage" ref={stageRef} role="application" aria-label="Plansza gry. Kliknij, aby przechwycić klawisze.">
            <canvas ref={canvasRef} className="game-canvas" aria-label="Canvas gry" />
            <div className={`lab-view${viewOverlay ? ' on' : ''}`} aria-hidden="true"><span className="lab-view-tl">{Math.round(cameraView.x)}, {Math.round(cameraView.y)}</span><span className="lab-view-tr">x: {Math.round(cameraView.x + 600)}</span><span className="lab-view-br">y: {Math.round(cameraView.y + 600)}</span></div>
            {!isReady && <div className="lab-boot"><span className="lab-boot-logo">LAB·BOY</span><span className="lab-boot-bar"><i /></span><small>{runner.stage || "Uruchom program, aby zobaczyć scenę."}</small></div>}
          </div>
          <div className="lab-console-stats">
            <span data-stat="fps"><b>{stats ? Math.round(stats.fps) : 0}</b> fps</span>
            <span data-stat="avg"><b>{stats ? stats.avgMs.toFixed(1) : '0.0'}</b> ms śr.</span>
            <span data-stat="max"><b>{stats ? stats.maxMs.toFixed(0) : 0}</b> ms max</span>
            <span className="lab-console-keys" data-stat="keys">{displayKeys.join(' ')}</span>
          </div>
          <div className="lab-console-pad">
            <div className="lab-sys">
              <button type="button" className={`lab-pill${wasd ? ' down' : ''}`} aria-pressed={wasd} title="Krzyżak steruje W A S D" onClick={toggleWasd}>WASD</button>
              {PAD_SYS.map(action => (
                <button key={action.id} type="button" className={`lab-pill${lit(action.codes) ? ' down' : ''}`} {...padEvents({ codes: action.codes })}>{action.label}</button>
              ))}
            </div>
            <div className="lab-pad-row">
              <div className="lab-dpad">
                {PAD_DIRS.map(dir => (
                  <button key={dir.id} type="button" data-dir={dir.id} aria-label={dir.aria} className={lit([dir.arrow, dir.wasd]) ? 'down' : ''}
                    {...padEvents({ dir: dir.id, codes: [wasd ? dir.wasd : dir.arrow] })}
                  >{dir.label}</button>
                ))}
                <span className="lab-dpad-hub" aria-hidden="true" />
              </div>
              <div className="lab-actions">
                {[PAD_ACTIONS[2], PAD_ACTIONS[0], PAD_ACTIONS[3], PAD_ACTIONS[1]].map(action => (
                  <button key={action.id} type="button" data-action={action.id} className={lit(action.codes) ? 'down' : ''} {...padEvents({ codes: action.codes })}><span>{action.label}</span></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
