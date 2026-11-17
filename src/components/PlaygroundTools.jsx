import { useEffect,useRef,useState } from 'react';
import { parseGameProject,serializeGameProject,MAX_GAME_PROJECT_BYTES } from '../services/gameProjectTransfer.js';
import mario from '../data/playground-games/platformer-mario.json';
import deadcells from '../data/playground-games/deadcells.json';
import survivor from '../data/playground-games/survivor.json';
import racing from '../data/playground-games/racing-2d.json';
const PRESETS=[
  {id:'platformer-mario',label:'Platformówka (Mario)',project:mario},
  {id:'deadcells',label:'Dead Cells (akcja)',project:deadcells},
  {id:'survivor',label:'Survivor (fale)',project:survivor},
  {id:'racing-2d',label:'Wyścigi 2D',project:racing},
];
export default function PlaygroundTools({project,onImport}){
  const input=useRef(null);const [status,setStatus]=useState('');
  const alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  const exportProject=()=>{try{const url=URL.createObjectURL(new Blob([serializeGameProject(project)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='moja-gra-java.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Wyeksportowano projekt Java.');}catch(e){setStatus(e.message);}};
  const importProject=async event=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;try{if(file.size>MAX_GAME_PROJECT_BYTES)throw new Error('Maksymalny rozmiar to 256 KiB.');const next=parseGameProject(await file.text());if(!alive.current)return;if(window.confirm('Zastąpić pliki własnej gry? Wyeksportuj wcześniej kopię projektu.')){onImport(next);setStatus('Wczytano projekt.');}}catch(e){if(alive.current)setStatus(e.message);}};
  const loadPreset=event=>{const preset=PRESETS.find(p=>p.id===event.target.value);event.target.value='';if(!preset)return;if(window.confirm(`Zastąpić pliki własnej gry przykładem „${preset.label}”?`)){onImport(preset.project);setStatus(`Wczytano przykład: ${preset.label}.`);}};
  return <div className="playground-tools"><select className="button button--ghost" aria-label="Wczytaj przykładową grę" defaultValue="" onChange={loadPreset}><option value="" disabled>Wczytaj przykład…</option>{PRESETS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select><button type="button" className="button button--secondary" onClick={exportProject}>Eksportuj JSON</button><button type="button" className="button button--ghost" onClick={()=>input.current?.click()}>Importuj JSON</button><input className="sr-only" ref={input} type="file" accept=".json,application/json" aria-label="Plik JSON projektu gry" onChange={importProject}/>{status&&<p role="status">{status}</p>}</div>;
}
