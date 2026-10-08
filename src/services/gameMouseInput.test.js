import { createGameInterop } from './gameInterop.js';

test('TeaVM bridge sends CSS pointer coordinates, mouse transitions and clear on blur', () => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = () => ({setTransform(){},fillRect(){},fillText(){}});
  const canvas=document.createElement('canvas');canvas.getBoundingClientRect=()=>({left:10,top:20,width:400,height:300});
  const messages=[];const listener=event=>messages.push(event.detail);window.addEventListener('java-lab-game-input',listener);
  const bridge=createGameInterop(canvas);
  try {
    canvas.dispatchEvent(new MouseEvent('pointerdown',{clientX:110,clientY:70,button:2}));
    expect(messages).toContainEqual({kind:'pointer',x:100,y:50});
    expect(messages).toContainEqual({kind:'mouse',button:2,pressed:true});
    canvas.dispatchEvent(new MouseEvent('pointerup',{clientX:110,clientY:70,button:2}));
    expect(messages).toContainEqual({kind:'mouse',button:2,pressed:false});
    canvas.dispatchEvent(new Event('blur'));expect(messages.at(-1)).toEqual({kind:'clear'});
    bridge.dispose();messages.length=0;
    canvas.dispatchEvent(new MouseEvent('pointerdown',{clientX:110,clientY:70,button:0}));
    expect(messages).toHaveLength(0);
  } finally {bridge.dispose();window.removeEventListener('java-lab-game-input',listener);HTMLCanvasElement.prototype.getContext=original;}
});
import { test, expect } from 'vitest';
