// @vitest-environment node
import {expect,test} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync,readdirSync,existsSync} from 'node:fs';
import {tmpdir,homedir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {allLessons} from './curriculum.js';
import {parseAssertionOutput} from '../../public/vendor/teavm/assertion-output.js';
import {buildTaskCheckRequest,evaluateTaskCheck} from '../services/taskExecution.js';
import {checkClassStructure} from '../../public/vendor/teavm/class-metadata.js';

const tasks=allLessons.flatMap(l=>l.tasks).filter(t=>t.assertionChecks);
function javaBin(name) {
  const dirs=process.env.JAVA_HOME?[process.env.JAVA_HOME]:readdirSync(join(homedir(),'.jdks')).map(d=>join(homedir(),'.jdks',d));
  return dirs.map(d=>join(d,'bin',name+(process.platform==='win32'?'.exe':''))).find(existsSync)||name;
}
function compile(dir,task,files) {
  mkdirSync(dir,{recursive:true});
  const request=buildTaskCheckRequest(task,files);
  const paths=Object.entries(request.files).map(([name,source])=>{const path=join(dir,name);writeFileSync(path,source);return path;});
  execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',dir,...paths],{encoding:'utf8',timeout:15000,stdio:'pipe'});
  const result=parseAssertionOutput(execFileSync(javaBin('java'),['-Dfile.encoding=UTF-8','-Dstdout.encoding=UTF-8','-Dstderr.encoding=UTF-8','-cp',dir,request.mainClass],{encoding:'utf8',timeout:10000}).trimEnd().split(/\r?\n/));
  const classes=Object.fromEntries(readdirSync(dir).filter(n=>n.endsWith('.class')).map(n=>[n,readFileSync(join(dir,n))]));
  result.assertionResults.push(...checkClassStructure(classes,task.structureChecks));return result;
}
test('every object reference solution passes its actual Java assertions and output contract',()=>{
  const root=mkdtempSync(join(tmpdir(),'java-object-contract-'));
  try {for(const task of tasks) {
    const result=compile(join(root,task.id),task,task.solutionFiles);
    expect(evaluateTaskCheck(task,task.solutionFiles,{ok:true,...result}),task.id+JSON.stringify(result)).toMatchObject({passed:true});
  }} finally {rmSync(root,{recursive:true,force:true});}
},90000);

test('printing the expected name without a subclass fails compilation of the Java test',()=>{
  const task=tasks.find(t=>t.id==='inheritance-09-task'),root=mkdtempSync(join(tmpdir(),'java-fake-subclass-'));
  try {expect(()=>compile(root,task,{'Main.java':'public class Main {public static void main(String[] args){System.out.println("Luna");}}'})).toThrow();}
  finally {rmSync(root,{recursive:true,force:true});}
});

test('a correct console result cannot hide broken object state changes',()=>{
  const task=tasks.find(t=>t.id==='objects-06-independent-2'),root=mkdtempSync(join(tmpdir(),'java-fake-state-'));
  const files={'Main.java':'class Player { Player(int points) {} void addPoints(int value) {} int getPoints(){return 15;} } public class Main {public static void main(String[] args){System.out.println(15);}}'};
  try {const result=compile(root,task,files);expect(evaluateTaskCheck(task,files,{ok:true,...result}).passed).toBe(false);}
  finally {rmSync(root,{recursive:true,force:true});}
});

test('public state cannot pass the private instance field contract even if behavior is correct',()=>{
  const task=tasks.find(t=>t.id==='objects-06-independent-2'),root=mkdtempSync(join(tmpdir(),'java-public-state-'));
  const files={'Main.java':task.solutionFiles['Main.java'].replace('private int points','public int points')};
  try {const result=compile(root,task,files);expect(result.assertionResults.find(r=>r.id==='private-state').passed).toBe(false);expect(evaluateTaskCheck(task,files,{ok:true,...result}).passed).toBe(false);}
  finally {rmSync(root,{recursive:true,force:true});}
});
test.each(['objects-07-task','objects-07-independent-2'])('rejects a composition constructor discarding its argument: %s',id=>{
  const task=tasks.find(t=>t.id===id),root=mkdtempSync(join(tmpdir(),'java-empty-composition-'));
  const files={'Main.java':task.solutionFiles['Main.java'].replace(id==='objects-07-task'?'this.task = task;':'this.inventory = inventory;','')};
  try {const result=compile(root,task,files);expect(result.assertionResults.find(r=>r.id==='composition').passed).toBe(false);expect(evaluateTaskCheck(task,files,{ok:true,...result}).passed).toBe(false);}
  finally {rmSync(root,{recursive:true,force:true});}
});
