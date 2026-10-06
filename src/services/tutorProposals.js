import { normalizeGameProject, validateJavaFile } from './gameProjectTransfer.js';
export function validateProposals(value){
  if(!Array.isArray(value)||value.length>10)throw new Error('Nieprawidłowa lista propozycji.');
  const paths=new Set();let total=0;
  return value.map(item=>{
    validateJavaFile(item?.path,item?.content);total+=item.content.length;
    if(item.content.length>50000||total>100000||paths.has(item.path))throw new Error('Nieprawidłowy proponowany plik.');
    paths.add(item.path);return {path:item.path,content:item.content,reason:typeof item.reason==='string'?item.reason.slice(0,2000):''};
  });
}
export function applyTutorProposal(current,snapshot,proposal){
  const [valid]=validateProposals([proposal]);
  if(current.files[valid.path]!==snapshot.files[valid.path]||Object.hasOwn(current.files,valid.path)!==Object.hasOwn(snapshot.files,valid.path))throw new Error('Plik zmienił się od wysłania pytania. Poproś o nową propozycję.');
  return normalizeGameProject({...current,files:{...current.files,[valid.path]:valid.content}});
}
