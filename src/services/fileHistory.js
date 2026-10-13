const KEY='java-lab-file-history-v1';
function read() {
  try {const value=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(value)?value.filter(v=>v&&typeof v.content==='string'&&typeof v.workspace==='string'&&typeof v.file==='string'):[];}
  catch {return [];}
}
export function readFileVersions(workspace,file) {return read().filter(v=>v.workspace===workspace&&v.file===file);}
export function recordFileVersion(workspace,file,content,kind='typing',time=Date.now()) {
  const versions=read(),last=versions.findLast(v=>v.workspace===workspace&&v.file===file);
  if(last?.content===content)return;
  time=Math.max(time,(last?.time||0)+1);
  const entry={workspace,file,content,kind,time};
  if(JSON.stringify(entry).length>750000)throw Error('Wersja jest zbyt duża dla historii. Poprzednia historia pozostaje bez zmian.');
  if(kind==='typing'&&last?.kind==='typing'&&time-last.time<1500)versions.splice(versions.indexOf(last),1);
  versions.push(entry);
  while(versions.length>300||JSON.stringify(versions).length>750000)versions.shift();
  try {localStorage.setItem(KEY,JSON.stringify(versions));}catch {throw Error('Nie można zapisać historii edycji: brak miejsca w pamięci przeglądarki. Kod pozostaje zapisany osobno.');}
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('java-lab-history-changed',{detail:{workspace,file}}));
}
export function syncModelSource(model,source) {
  if(model.getValue()===source)return;
  model.pushStackElement();
  model.pushEditOperations(null,[{range:model.getFullModelRange(),text:source,forceMoveMarkers:true}],()=>null);
  model.pushStackElement();
}
