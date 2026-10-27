import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readdirSync,existsSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {homedir,tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {javaBasicsVariants,assembleBasicsTask} from '../shared/assignments/javaBasicsTasks.js';
import {javaGameDevVariants,assembleGameDevTask} from '../shared/assignments/javaGameDevTasks.js';
import {gameEngineRuntimeFiles} from '../src/data/gameEngineRuntime.js';
const jdks=process.env.JAVA_HOME?[process.env.JAVA_HOME]:readdirSync(join(homedir(),'.jdks')).map(p=>join(homedir(),'.jdks',p));
const javaBin=name=>jdks.map(p=>join(p,'bin',name+(process.platform==='win32'?'.exe':''))).find(existsSync)||name;
// Deterministic ctx mirroring the generator's {int, pick, level} interface.
const ctx=(seed,level)=>{let state=seed*2654435761>>>0;const next=()=>{state=(state+0x9e3779b9)>>>0;return state/4294967296;};return{level,int:(min,max)=>min+Math.floor(next()*(max-min+1)),pick:list=>list[Math.floor(next()*list.length)]};};
const write=(dir,files)=>Object.entries(files).map(([name,source])=>{const path=join(dir,name);writeFileSync(path,source);return path;});

test('all 20 java-basics variants pass their hidden JavaTest harness and their starters compile',()=>{
  const root=mkdtempSync(join(tmpdir(),'basics-tasks-'));
  try{
    for(const [i,variant] of javaBasicsVariants.entries()){
      for(const level of [0,1]){
        const task=assembleBasicsTask(variant,ctx(i+1,level)),dir=join(root,`${variant.id}-${level}`);
        mkdirSync(dir,{recursive:true});
        const paths=[...write(dir,task.referenceFiles),...write(dir,{'JavaTest.java':task.params.javaTest})];
        execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',dir,...paths],{timeout:30000,stdio:'pipe'});
        const out=execFileSync(javaBin('java'),['-cp',dir,'JavaTest'],{encoding:'utf8',timeout:20000});
        assert.match(out,/TESTY ZALICZONE/,`${variant.id}@${level}`);assert.doesNotMatch(out,/FAIL:/);
      }
      // Starter code (easy = scene minus TODO wiring, standard = skeleton) must compile.
      for(const level of [0,1]){
        const task=assembleBasicsTask(variant,ctx(i+1,level)),dir=join(root,`${variant.id}-starter-${level}`);
        mkdirSync(dir,{recursive:true});
        execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',dir,...write(dir,task.starterFiles)],{timeout:30000,stdio:'pipe'});
      }
    }
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('all 20 java-gamedev variants pass their scenario harness on the real engine and their starters compile',()=>{
  const root=mkdtempSync(join(tmpdir(),'gamedev-tasks-'));
  try{
    const engine=join(root,'engine');mkdirSync(engine);
    const enginePaths=write(engine,gameEngineRuntimeFiles);
    execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',engine,...enginePaths],{timeout:120000,stdio:'pipe'});
    const lab=files=>Object.fromEntries(Object.entries(files).map(([name,source])=>[name,`package lab;\nimport engine.*;\n${source}`]));
    for(const [i,variant] of javaGameDevVariants.entries()){
      const task=assembleGameDevTask(variant,ctx(i+1,1)),dir=join(root,variant.id);
      mkdirSync(dir,{recursive:true});
      const paths=write(dir,lab({...task.referenceFiles,'JavaTest.java':task.params.javaTest}));
      execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-cp',engine,'-d',dir,...paths],{timeout:30000,stdio:'pipe'});
      const out=execFileSync(javaBin('java'),['-cp',dir+(process.platform==='win32'?';':':')+engine,'lab.JavaTest'],{encoding:'utf8',timeout:20000});
      assert.match(out,/TESTY ZALICZONE/,variant.id);assert.doesNotMatch(out,/FAIL:/);
      for(const level of [0,1]){
        const starter=assembleGameDevTask(variant,ctx(i+1,level)),starterDir=join(root,`${variant.id}-starter-${level}`);
        mkdirSync(starterDir,{recursive:true});
        execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-cp',engine,'-d',starterDir,...write(starterDir,lab(starter.starterFiles))],{timeout:30000,stdio:'pipe'});
      }
    }
  }finally{rmSync(root,{recursive:true,force:true});}
});
