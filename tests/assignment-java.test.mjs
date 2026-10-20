import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readdirSync,existsSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {homedir,tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {generateAssignment} from '../shared/assignments/generator.js';
const jdks=process.env.JAVA_HOME?[process.env.JAVA_HOME]:readdirSync(join(homedir(),'.jdks')).map(p=>join(homedir(),'.jdks',p));
const javaBin=name=>jdks.map(p=>join(p,'bin',name+(process.platform==='win32'?'.exe':''))).find(existsSync)||name;
test('all Java references compile and behave correctly beyond the displayed example',()=>{
  const root=mkdtempSync(join(tmpdir(),'generated-java-'));
  try{
    for(const templateId of ['java-reward','java-array'])for(const difficulty of ['easy','standard','challenge']){
      const task=generateAssignment({templateId,difficulty,seed:'JAVA-REFERENCE',index:0,generatorVersion:'1'}),dir=join(root,templateId,difficulty);
      mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'Main.java'),task.referenceFiles['Main.java']);
      const inputs=[[],[0],[-4,-2,0,1,3,6],[task.params.threshold-1,task.params.threshold,task.params.threshold+1,task.params.threshold]];
      let checks;
      if(templateId==='java-reward')checks=[-10,0,1,100].map(points=>`if(Main.reward(${points})!=${(task.params.clamp?Math.max(0,points):points)*task.params.factor+task.params.bonus})throw new AssertionError();`).join('\n');
      else checks=inputs.map(values=>`if(Main.solve(new int[]{${values}})!=${values.filter(v=>task.params.selection===0||v>=task.params.threshold&&(task.params.selection!==2||v%2===0)).reduce((a,b)=>a+b,0)})throw new AssertionError();`).join('\n');
      writeFileSync(join(dir,'Check.java'),`public class Check { public static void main(String[] args) { ${checks} System.out.print("PASS"); } }`);
      execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',dir,join(dir,'Main.java'),join(dir,'Check.java')],{timeout:15000,stdio:'pipe'});
      assert.equal(execFileSync(javaBin('java'),['-cp',dir,'Check'],{encoding:'utf8',timeout:5000}),'PASS');
    }
  }finally{rmSync(root,{recursive:true,force:true});}
});
