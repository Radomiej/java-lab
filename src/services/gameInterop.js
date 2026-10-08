import { createRenderer } from '../../shared/lab-game-v2/renderer.js';
import { assetManifest } from '../../shared/lab-game-v2/assets/Assets.js';
const CONTROL_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", " "]); 
const normalizeKey = (key) => key === " " ? "Space" : key.length === 1 ? key.toLowerCase() : key;
let activeAssetsReady=Promise.resolve();
export function getGameAssetsReady(){return activeAssetsReady;}

export function drawAtlasSprite(context, image, frame, command) {
  const rotation = command.rotation ?? 0;
  const scaleX = command.scaleX ?? 1, scaleY = command.scaleY ?? 1;
  if (rotation === 0 && scaleX === 1 && scaleY === 1) {
    context.drawImage(image, frame.x, frame.y, frame.w, frame.h,
      command.x - command.width / 2, command.y - command.height / 2, command.width, command.height);
    return;
  }
  context.save();
  try {
    context.translate(command.x, command.y);
    context.rotate(rotation);
    context.scale(scaleX, scaleY);
    context.drawImage(image, frame.x, frame.y, frame.w, frame.h,
      -command.width / 2, -command.height / 2, command.width, command.height);
  } finally { context.restore(); }
}

export function createGameInterop(canvas) {
  const context = canvas.getContext("2d");
  const keys = new Set();
  let frameId = 0;
  let running = false;
  let lastTime = 0;
  let lastFrame;
  let disposed = false;
  let debugColliders = false;
  const renderer=createRenderer(assetManifest);
  const assetsReady=renderer.load(window).then(()=>{if(!disposed&&lastFrame)onGameDraw({detail:lastFrame});});
  activeAssetsReady=assetsReady;
  assetsReady.catch(error=>{if(!disposed)window.dispatchEvent(new CustomEvent('java-lab-game-render-error',{detail:error.message}));});
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width * ratio));
    const height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    window.dispatchEvent(new CustomEvent("java-lab-game-resize", { detail: { width: rect.width, height: rect.height } }));
    if (lastFrame) onGameDraw({ detail: lastFrame });
  };
  const emitInput = (key, pressed) => window.dispatchEvent(new CustomEvent("java-lab-game-input", { detail: { key, pressed } }));
  const mouseButtons=new Set();
  const onPointerMove=event=>{const rect=canvas.getBoundingClientRect();window.dispatchEvent(new CustomEvent('java-lab-game-input',{detail:{kind:'pointer',x:event.clientX-rect.left,y:event.clientY-rect.top}}));};
  const onPointerDown=event=>{canvas.focus();onPointerMove(event);mouseButtons.add(event.button);canvas.setPointerCapture?.(event.pointerId);window.dispatchEvent(new CustomEvent('java-lab-game-input',{detail:{kind:'mouse',button:event.button,pressed:true}}));};
  const onPointerUp=event=>{onPointerMove(event);mouseButtons.delete(event.button);window.dispatchEvent(new CustomEvent('java-lab-game-input',{detail:{kind:'mouse',button:event.button,pressed:false}}));};
  const onKeyDown = (event) => {
    if (CONTROL_KEYS.has(event.key) || CONTROL_KEYS.has(event.key.toLowerCase())) event.preventDefault();
    const key = normalizeKey(event.key);
    keys.add(key);
    emitInput(key, true);
  };
  const onKeyUp = (event) => {
    const key = normalizeKey(event.key);
    keys.delete(key);
    emitInput(key, false);
  };
  const onBlur = () => { keys.forEach((key) => emitInput(key, false)); keys.clear();mouseButtons.clear();window.dispatchEvent(new CustomEvent('java-lab-game-input',{detail:{kind:'clear'}})); };
  const onGameDraw = (event) => {
    const command = event.detail;
    if (command.op === "frame") {
      lastFrame = command;
      for (const item of command.commands || []) onGameDraw({ detail: item });
      return;
    }
    if (command.op === "clear") api.clear(command.color);
    if (command.op === 'debug') {
      if(debugColliders!==Boolean(command.enabled)) {
        debugColliders=Boolean(command.enabled);
        window.dispatchEvent(new CustomEvent('java-lab-game-debug-state',{detail:{enabled:debugColliders}}));
      }
    }
    if (command.op === 'collider' && debugColliders) {
      context.save();
      try {
        context.strokeStyle=command.trigger?'#64e9ff':'#ffe38a';
        context.lineWidth=1.5;
        context.setLineDash(command.trigger?[4,3]:[]);
        if(command.shape==='circle') {
          context.beginPath();context.arc(command.x,command.y,command.width/2,0,Math.PI*2);context.stroke();
        } else context.strokeRect(command.x-command.width/2,command.y-command.height/2,command.width,command.height);
      } finally {context.restore();}
    }
    if (['rect','text','sprite','ninepatch','progress'].includes(command.op)) renderer.draw(context,command);

  };
  canvas.tabIndex = 0;
  canvas.addEventListener('pointermove',onPointerMove);canvas.addEventListener('pointerdown',onPointerDown);canvas.addEventListener('pointerup',onPointerUp);canvas.addEventListener('pointercancel',onBlur);
  canvas.addEventListener("keydown", onKeyDown);
  canvas.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("blur", onBlur);
  const api = {
    canvas,
    context,
    assetsReady,
    isKeyDown: (key) => keys.has(key) || keys.has(key.toLowerCase()),
    getKeys: () => [...keys],
    setDebugColliders(value) {
      debugColliders=Boolean(value);
      window.dispatchEvent(new CustomEvent('java-lab-game-debug',{detail:{enabled:debugColliders}}));
      if(lastFrame) {
        lastFrame={...lastFrame,commands:(lastFrame.commands || []).map(item=>item.op==='debug'?{...item,enabled:debugColliders}:item)};
        onGameDraw({detail:lastFrame});
      }
    },
    resize,
    clear: (color = "#0b2033") => { context.fillStyle = color; context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); },
    drawObject: (name, x, y, color = "#76b9f2", size = 25) => {
      context.fillStyle = color;
      context.fillRect(x - size / 2, y - size / 2, size, size);
      context.fillStyle = "#d9eff0";
      context.font = "11px monospace";
      context.fillText(name, x - size / 2, y + size);
    },
    start: (update) => {
      if (running) return;
      running = true;
      const tick = (time) => {
        if (!running) return;
        const delta = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 0;
        lastTime = time;
        update?.(delta, api);
        frameId = requestAnimationFrame(tick);
      };
      resize();
      frameId = requestAnimationFrame(tick);
    },
    stop: () => { running = false; cancelAnimationFrame(frameId); lastTime = 0; },
    dispose: () => {
      api.stop();
      canvas.removeEventListener("keydown", onKeyDown);
      canvas.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("blur", onBlur);
      canvas.removeEventListener('pointermove',onPointerMove);canvas.removeEventListener('pointerdown',onPointerDown);canvas.removeEventListener('pointerup',onPointerUp);canvas.removeEventListener('pointercancel',onBlur);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("java-lab-game-draw", onGameDraw);
    },
  };
  window.__javaLabGameBridge = api;
  window.addEventListener("resize", resize);
  const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(canvas);
  window.addEventListener("blur", onBlur);
  window.addEventListener("java-lab-game-draw", onGameDraw);
  const dispose = api.dispose;
  api.dispose = () => {
    if(activeAssetsReady===assetsReady)activeAssetsReady=Promise.resolve();
    disposed = true;
    resizeObserver?.disconnect();
    onBlur();
    dispose();
    if (window.__javaLabGameBridge === api) delete window.__javaLabGameBridge;
  };
  return api;
}

