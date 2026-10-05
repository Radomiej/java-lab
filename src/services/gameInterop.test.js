import { describe, expect, it, vi } from "vitest";
import { createGameInterop, drawAtlasSprite } from "./gameInterop.js";

describe("game interop", () => {
  it('draws collider metadata only in debug and redraws when the toggle changes',()=>{
    const context={setTransform(){},fillRect(){},save:vi.fn(),restore:vi.fn(),setLineDash:vi.fn(),beginPath:vi.fn(),arc:vi.fn(),stroke:vi.fn(),strokeRect:vi.fn()};
    HTMLCanvasElement.prototype.getContext=()=>context;
    const bridge=createGameInterop(document.createElement('canvas'));
    const frame={op:'frame',commands:[{op:'clear'},{op:'debug',enabled:false},
      {op:'collider',shape:'circle',x:50,y:60,width:20,height:20,trigger:true},
      {op:'collider',shape:'rect',x:100,y:80,width:40,height:30,trigger:false}]};
    try{
      window.dispatchEvent(new CustomEvent('java-lab-game-draw',{detail:frame}));
      expect(context.arc).not.toHaveBeenCalled();
      bridge.setDebugColliders(true);
      expect(context.arc).toHaveBeenCalledWith(50,60,10,0,Math.PI*2);
      expect(context.strokeRect).toHaveBeenCalledWith(80,65,40,30);
      expect(context.setLineDash).toHaveBeenCalledWith([4,3]);
      context.arc.mockClear();bridge.setDebugColliders(false);expect(context.arc).not.toHaveBeenCalled();
      window.dispatchEvent(new CustomEvent('java-lab-game-draw',{detail:{...frame,commands:frame.commands.map(c=>c.op==='debug'?{...c,enabled:true}:c)}}));
      expect(context.arc).toHaveBeenCalledOnce();
    }finally{bridge.dispose();}
  });
  it('waits for the terrain image and uses the per-texture source without changing other sprites',async()=>{
    const context={setTransform(){},fillRect(){},drawImage:vi.fn()};
    HTMLCanvasElement.prototype.getContext=()=>context;
    const images=[];
    vi.stubGlobal('Image',class {
      set src(value){this.source=value;images.push(this);}
    });
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({frames:{
      grass:{image:'terrain.svg',frame:{x:0,y:0,w:32,h:32}},
      player:{frame:{x:0,y:0,w:32,h:32}},
    }})}));
    const bridge=createGameInterop(document.createElement('canvas'));
    try {
      window.dispatchEvent(new CustomEvent('java-lab-game-draw',{detail:{op:'frame',commands:[
        {op:'sprite',texture:'grass',x:16,y:16,width:32,height:32},
        {op:'sprite',texture:'player',x:80,y:80,width:32,height:32},
      ]}}));
      await vi.waitFor(()=>expect(images).toHaveLength(1));
      images[0].onload();
      await vi.waitFor(()=>expect(images).toHaveLength(2));
      expect(context.drawImage).not.toHaveBeenCalled();
      expect(images[1].source).toBe('/game-assets/terrain.svg');
      images[1].onload();
      await vi.waitFor(()=>expect(context.drawImage).toHaveBeenCalledTimes(2));
      expect(context.drawImage).toHaveBeenNthCalledWith(1,images[1],0,0,32,32,0,0,32,32);
      expect(context.drawImage).toHaveBeenNthCalledWith(2,images[0],0,0,32,32,64,64,32,32);
    } finally {bridge.dispose();vi.unstubAllGlobals();}
  });
  it('obraca i odbija sprite wokół środka oraz przywraca transformację canvasu', () => {
    const calls=[];
    const context=Object.fromEntries(['save','translate','rotate','scale','drawImage','restore'].map(name=>[name,(...args)=>calls.push([name,...args])]));
    const image={};
    drawAtlasSprite(context,image,{x:0,y:0,w:32,h:32},{x:80,y:90,width:40,height:20,rotation:0.5,scaleX:-2,scaleY:3});
    expect(calls).toEqual([
      ['save'],['translate',80,90],['rotate',0.5],['scale',-2,3],
      ['drawImage',image,0,0,32,32,-20,-10,40,20],['restore'],
    ]);
  });
  it("ponawia pobranie atlasu po błędzie i rysuje kolejną klatkę", async () => {
    const context = { setTransform() {}, fillRect() {}, drawImage: vi.fn() };
    HTMLCanvasElement.prototype.getContext = () => context;
    const fetchAtlas = vi.fn()
      .mockRejectedValueOnce(new Error('temporary network failure'))
      .mockResolvedValue({ok:true,json:async()=>({frames:{player:{frame:{x:0,y:0,w:32,h:32}}}})});
    vi.stubGlobal('fetch',fetchAtlas);
    vi.stubGlobal('Image',class {
      set src(value) { queueMicrotask(()=>this.onload()); }
    });
    const bridge = createGameInterop(document.createElement('canvas'));
    let error;
    const onError = event => { error = event.detail; };
    window.addEventListener('java-lab-game-render-error',onError);
    const frame = {op:'frame',commands:[{op:'sprite',texture:'player',x:80,y:80,width:32,height:32}]};
    try {
      window.dispatchEvent(new CustomEvent('java-lab-game-draw',{detail:frame}));
      await vi.waitFor(()=>expect(error).toBe('temporary network failure'));
      window.dispatchEvent(new CustomEvent('java-lab-game-draw',{detail:frame}));
      await vi.waitFor(()=>expect(context.drawImage).toHaveBeenCalledWith(expect.anything(),0,0,32,32,64,64,32,32));
    } finally {
      bridge.dispose(); window.removeEventListener('java-lab-game-render-error',onError); vi.unstubAllGlobals();
    }
  });
  it("centruje etykietę obiektu i przywraca lewe wyrównanie zwykłego tekstu", () => {
    const alignments = [];
    const context = { setTransform() {}, fillRect() {}, fillText: vi.fn(() => alignments.push(context.textAlign)) };
    HTMLCanvasElement.prototype.getContext = () => context;
    const bridge = createGameInterop(document.createElement("canvas"));
    window.dispatchEvent(new CustomEvent("java-lab-game-draw", { detail: { op: "frame", commands: [
      { op: "text", text: "Gracz", x: 194, y: 162, align: "center" },
      { op: "text", text: "Punkty: 0", x: 10, y: 20 },
    ] } }));
    expect(alignments).toEqual(["center", "left"]);
    expect(context.fillText).toHaveBeenNthCalledWith(1, "Gracz", 194, 162);
    bridge.dispose();
  });
  it("odtwarza pełną klatkę po zmianie rozmiaru", () => {
    const context = { setTransform() {}, fillRect: vi.fn(), fillText() {} };
    HTMLCanvasElement.prototype.getContext = () => context;
    const canvas = document.createElement("canvas");
    canvas.getBoundingClientRect = () => ({ width: 500, height: 300 });
    const bridge = createGameInterop(canvas);
    window.dispatchEvent(new CustomEvent("java-lab-game-draw", {
      detail: { op: "frame", commands: [
        { op: "clear", color: "black" },
        { op: "rect", x: 12, y: 15, width: 40, height: 20, color: "red" },
      ] },
    }));
    context.fillRect.mockClear();
    bridge.resize();
    expect(context.fillRect).toHaveBeenLastCalledWith(12, 15, 40, 20);
    bridge.dispose();
  });
  it("normalizuje WASD z Shiftem i zwalnia klawisze po utracie fokusu okna", () => {
    HTMLCanvasElement.prototype.getContext = () => ({ setTransform() {}, fillRect() {}, fillText() {} });
    const canvas = document.createElement("canvas");
    const bridge = createGameInterop(canvas);
    canvas.dispatchEvent(new KeyboardEvent("keydown", { key: "W" }));
    expect(bridge.isKeyDown("w")).toBe(true);
    window.dispatchEvent(new Event("blur"));
    expect(bridge.getKeys()).toEqual([]);
    bridge.dispose();
  });
  it("rysuje prostokąt z niezależną szerokością i wysokością", () => {
    const context = { fillRect: vi.fn(), setTransform() {}, fillText() {} };
    HTMLCanvasElement.prototype.getContext = () => context;
    const bridge = createGameInterop(document.createElement("canvas"));
    window.dispatchEvent(new CustomEvent("java-lab-game-draw", {
      detail: { op: "rect", x: 10.5, y: 20, width: 80, height: 15, color: "red" },
    }));
    expect(context.fillRect).toHaveBeenCalledWith(10.5, 20, 80, 15);
    bridge.dispose();
  });
  it("przechowuje stan klawiszy i udostępnia canvas API", () => {
    const context = { setTransform() {}, fillRect() {}, fillText() {}, font: "" };
    HTMLCanvasElement.prototype.getContext = () => context;
    const canvas = document.createElement("canvas");
    const bridge = createGameInterop(canvas);
    canvas.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(bridge.isKeyDown("ArrowRight")).toBe(true);
    expect(typeof bridge.drawObject).toBe("function");
    canvas.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight" }));
    expect(bridge.isKeyDown("ArrowRight")).toBe(false);
    bridge.dispose();
  });
});
