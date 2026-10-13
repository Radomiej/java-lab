import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {readFileVersions} from '../services/fileHistory.js';

export default function FileHistory({workspace,file,onRestore}) {
  const [open,setOpen]=useState(false),[selected,setSelected]=useState(null);
  const [,refresh]=useState(0);
  const dialogRef=useRef(null),triggerRef=useRef(null);
  useEffect(()=>{if(!open)return;const dialog=dialogRef.current;if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');return()=>{dialog.close?.();triggerRef.current?.focus();};},[open]);
  useEffect(()=>{if(!open)return;const update=event=>{if(!event.detail||(event.detail.workspace===workspace&&event.detail.file===file))refresh(value=>value+1);};window.addEventListener('java-lab-history-changed',update);window.addEventListener('storage',update);return()=>{window.removeEventListener('java-lab-history-changed',update);window.removeEventListener('storage',update);};},[open,workspace,file]);
  const versions=open?readFileVersions(workspace,file):[];
  const current=versions.find(v=>v.time===selected)||versions.at(-1);
  return <>
    <button ref={triggerRef} type="button" className="button button--ghost" aria-haspopup="dialog" onClick={()=>{window.dispatchEvent(new CustomEvent('java-lab-history-flush',{detail:{workspace,file}}));setOpen(v=>!v);setSelected(null);}}>Historia pliku</button>
    {open&&createPortal(<dialog ref={dialogRef} className="file-history" aria-label={`Historia ${file}`} onCancel={event=>{event.preventDefault();setOpen(false);}}>
      <button type="button" className="button button--ghost" onClick={()=>setOpen(false)}>Zamknij historię</button>
      <h3>Historia · {file}</h3>
      <p>Historia lokalna i modyfikowalna — nie jest dowodem autorstwa. Zawiera maksymalnie 300 ostatnich wersji wszystkich plików; starsze są usuwane także przy limicie rozmiaru. Pisanie jest grupowane.</p>
      <label>Wersja <select value={current?.time||''} onChange={event=>setSelected(Number(event.target.value))}>
        {versions.map(v=><option key={v.time} value={v.time}>{new Date(v.time).toLocaleString('pl-PL')} · {({initial:'stan początkowy',typing:'edycja',paste:'duża zmiana / wklejenie',undo:'cofnięcie',redo:'ponowienie',external:'zmiana z aplikacji'})[v.kind]||v.kind}</option>)}
      </select></label>
      {current?<><pre tabIndex={0}><code>{current.content}</code></pre><button type="button" className="button button--ghost" onClick={()=>onRestore(current.content)}>Przywróć tę wersję</button></>:<p>Brak zapisanych wersji tego pliku.</p>}
      <button type="button" className="button button--ghost" onClick={()=>{
        const url=URL.createObjectURL(new Blob([JSON.stringify({workspace,file,versions},null,2)],{type:'application/json'}));
        const anchor=document.createElement('a');anchor.href=url;anchor.download=file+'.history.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),0);
      }}>Eksportuj historię JSON</button>
    </dialog>,document.body)}
  </>;
}
