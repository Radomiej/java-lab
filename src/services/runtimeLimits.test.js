import fs from 'node:fs';
import vm from 'node:vm';
import { parseAssertionOutput } from '../../public/vendor/teavm/assertion-output.js';
import { describe, it, expect } from 'vitest';
import { createOutputCapture, createFrameGate, OUTPUT_LIMIT, TRUNCATION_MESSAGE } from '../../public/vendor/teavm/runtime-limits.js';
describe('runtime resource limits', () => {
  it('bounds a huge log and repeated writes with a visible marker', () => {
    const output = createOutputCapture();
    output.push('x'.repeat(OUTPUT_LIMIT * 100));
    for(let i=0;i<10000;i++) output.push('extra');
    expect(output.text.length).toBeLessThanOrEqual(OUTPUT_LIMIT);
    expect(output.text).toContain(TRUNCATION_MESSAGE);
  });
  it('preserves normal line formatting', () => {
    const output = createOutputCapture(); output.push('one'); output.push('two');
    expect(output.text).toBe('one\ntwo');
  });
  it('permits only one in-flight frame and ignores stale acknowledgements', () => {
    const gate = createFrameGate(); expect(gate.begin()).toBe(1);
    for(let i=0;i<10000;i++) expect(gate.begin()).toBeUndefined();
    gate.acknowledge(0); expect(gate.begin()).toBeUndefined();
    gate.acknowledge(1); expect(gate.begin()).toBe(2);
    gate.acknowledge(1); expect(gate.begin()).toBeUndefined();
  });
  it('keeps independent worker gates independent', () => {
    const first=createFrameGate(),second=createFrameGate();
    expect(first.begin()).toBe(1); expect(second.begin()).toBe(1);
    second.acknowledge(1); expect(second.begin()).toBe(2); expect(first.begin()).toBeUndefined();
  });
});

const workerSource = fs.readFileSync('public/vendor/teavm/teavm.worker.js', 'utf8');
it('actual game runtime pauses ticks without ACK and coalesces 1000 logs', () => {
  let timer; const messages=[];
  const context={createOutputCapture,createFrameGate,FRAME_OUTPUT_LIMIT:4000,gameRuntime:undefined,gameSize:{width:600,height:400},performance:{now:()=>0},console:{log(){},error(){}},setInterval(fn){timer=fn;return 1},stopGameRuntime(){},formatJavaRuntimeError:String,self:{postMessage(m){messages.push(m)}}};
  vm.createContext(context);
  vm.runInContext(workerSource.slice(workerSource.indexOf('function startGameRuntime('),workerSource.indexOf('\nfunction stopGameRuntime(')),context);
  vm.runInContext('var ticks=0;startGameRuntime({exports:{tick(){ticks++;for(let i=0;i<1000;i++)console.log("line")},frame(){return "clear|black"}}},1,true)',context);
  for(let i=0;i<10000;i++) timer();
  expect(context.ticks).toBe(1);
  expect(messages.filter(m=>m.command==='game-output')).toHaveLength(1);
  expect(messages.find(m=>m.command==='game-output').output.length).toBeLessThanOrEqual(4000);
  vm.runInContext('gameRuntime.frameGate.acknowledge(0)',context);timer();expect(context.ticks).toBe(1);
  vm.runInContext('gameRuntime.frameGate.acknowledge(1)',context);timer();expect(context.ticks).toBe(2);
});
it('actual plain Java capture preserves assertion markers after truncation',async()=>{
  const context={createOutputCapture,parseAssertionOutput,prepareJavaSources:()=>[],stopGameRuntime(){},checkClassStructure:()=>[],classVersions:()=>[],console:{log(){},error(){}},self:{postMessage(){}},compilerState:{compiler:{onDiagnostic:()=>()=>{},clearSourceFiles(){},clearOutputFiles(){},compile:()=>true,listOutputFiles:()=>[],generateWebAssembly:()=>true,getWebAssemblyOutputFile:()=>[1]}}};
  vm.createContext(context);
  vm.runInContext(workerSource.slice(workerSource.indexOf('async function compileAndRun('),workerSource.indexOf('\nfunction startGameRuntime(')),context);
  // Use a realm-local function so intercepted console calls reach the worker capture.
  vm.runInContext('compilerState.load=async()=>({exports:{main(){console.log("x".repeat(200000));console.log("__JAVA_LAB_CHECK__test"+String.fromCharCode(9)+"PASS"+String.fromCharCode(9));console.error("y".repeat(200000));}}})',context);
  const result=await vm.runInContext('compileAndRun({id:1,mainClass:"Main"})',context);
  expect(result.output.length).toBeLessThanOrEqual(OUTPUT_LIMIT);
  expect(result.error.length).toBeLessThanOrEqual(OUTPUT_LIMIT);
  expect(result.assertionResults).toEqual([{id:'test',passed:true,detail:'Asercja Java zaliczona.'}]);
  vm.runInContext('compilerState.load=async()=>({exports:{main(){console.log("x".repeat(200000));console.log("LAB_CHECK_FAILED:Expected failure");throw new Error("assertion");}}})',context);
  const failed=await vm.runInContext('compileAndRun({id:2,mainClass:"MainJavaTest"})',context);
  expect(failed).toMatchObject({ok:false,validationFailure:true,error:'Expected failure'});
  expect(failed.output.length).toBeLessThanOrEqual(OUTPUT_LIMIT);
});

it('worker ignores ACKs from previous games',()=>{
  let receive;const gate=createFrameGate();gate.begin();
  const context={gameRuntime:{gameId:2,frameGate:gate},self:{addEventListener(_name,callback){receive=callback}}};
  vm.createContext(context);
  vm.runInContext(workerSource.slice(workerSource.indexOf('self.addEventListener("message"')),context);
  receive({data:{command:'game-frame-ack',gameId:1,frameId:1}});
  expect(gate.begin()).toBeUndefined();
  receive({data:{command:'game-frame-ack',gameId:2,frameId:1}});
  expect(gate.begin()).toBe(2);
});

it('legacy clients keep ticking without opting into frame acknowledgements',()=>{
  let timer;const messages=[];
  const context={createOutputCapture,createFrameGate,FRAME_OUTPUT_LIMIT:4000,gameRuntime:undefined,gameSize:{width:600,height:400},performance:{now:()=>0},console:{log(){},error(){}},setInterval(fn){timer=fn;return 1},stopGameRuntime(){},formatJavaRuntimeError:String,self:{postMessage(m){messages.push(m)}}};
  vm.createContext(context);
  vm.runInContext(workerSource.slice(workerSource.indexOf('function startGameRuntime('),workerSource.indexOf('\nfunction stopGameRuntime(')),context);
  vm.runInContext('var ticks=0;startGameRuntime({exports:{tick(){ticks++},frame(){return "clear|black"}}},1)',context);
  for(let i=0;i<10;i++)timer();
  expect(context.ticks).toBe(11);
  expect(messages.filter(m=>m.op==='frame')).toHaveLength(11);
});
