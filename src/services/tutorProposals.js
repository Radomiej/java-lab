import { editMetadata, changesMetadata } from '../../shared/lab-game-v2/tutorLineEdits.js';
import { normalizeGameProject, validateJavaFile } from './gameProjectTransfer.js';
export function validateProposals(value){
  if(!Array.isArray(value)||value.length>10)throw new Error('Nieprawidłowa lista propozycji.');
  const paths=new Set();let total=0;
  return value.map(item=>{
    const operation=item?.operation??'write';
    if(!['write','delete'].includes(operation))throw new Error('Nieprawidłowa operacja pliku.');
    const content=operation==='delete'?'':item?.content;
    validateJavaFile(item?.path,content);total+=content.length;
    if(operation==='delete'&&item.path==='GameMain.java')throw new Error('Nie można usunąć pliku startowego GameMain.java.');
    if(content.length>50000||total>100000||paths.has(item.path))throw new Error('Nieprawidłowy proponowany plik.');
    paths.add(item.path);return {...editMetadata(item.edit),...changesMetadata(item.changes),operation,path:item.path,content,reason:typeof item.reason==='string'?item.reason.slice(0,2000):''};
  });
}
export function applyTutorProposal(current,snapshot,proposal){
  const [valid]=validateProposals([proposal]);
  if(current.files[valid.path]!==snapshot.files[valid.path]||Object.hasOwn(current.files,valid.path)!==Object.hasOwn(snapshot.files,valid.path))throw new Error('Plik zmienił się od wysłania pytania. Poproś o nową propozycję.');
  const files={...current.files};
  if(valid.operation==='delete'){
    if(!Object.hasOwn(files,valid.path))throw new Error('Plik do usunięcia nie istnieje.');
    delete files[valid.path];
  }else files[valid.path]=valid.content;
  return normalizeGameProject({...current,files});
}
