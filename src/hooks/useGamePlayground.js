import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage.js';
import { playgroundProject } from '../data/playground.js';
import { normalizeGameProject } from '../services/gameProjectTransfer.js';
export function useGamePlayground(){
  const [saved,setSaved]=useLocalStorage('java-lab-game-playground-v1',playgroundProject);
  const [revision,setRevision]=useState(0);
  let project;try{project=normalizeGameProject(saved);}catch{project=playgroundProject;}
  const replaceProject=value=>{const next=normalizeGameProject(value);setSaved(next);setRevision(r=>r+1);};
  const setFiles=patch=>setSaved(normalizeGameProject({...project,files:{...project.files,...patch}}));
  const deleteFile=name=>{if(name==='GameMain.java')return;const files={...project.files};delete files[name];setSaved(normalizeGameProject({...project,files}));};
  return {project,revision,setFiles,deleteFile,replaceProject,resetProject:()=>replaceProject(playgroundProject)};
}
