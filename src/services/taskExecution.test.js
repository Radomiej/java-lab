import { expect, it } from 'vitest';
import { buildTaskCheckRequest, evaluateTaskCheck } from './taskExecution.js';
it('shows a Java null error without WebAssembly and browser internals',()=>{
 const report=evaluateTaskCheck({engine:true,javaTestMainClass:'JavaTest'},{},{ok:false,error:'dereferencing a null pointer\n at lab.JavaTest::main (wasm://wasm/123:wasm-function[1]:0x0)\n at Object.eval (http://localhost/compiler.wasm-runtime.js:1)'});
 expect(report.results[0].detail).toContain('NullPointerException');expect(report.results[0].detail).toContain('JavaTest.java');expect(report.results[0].detail).not.toMatch(/wasm|http|Object.eval/);
});

it('reports an unmet exercise criterion without presenting it as a runtime crash', () => {
  const report = evaluateTaskCheck({engine:true,javaTestMainClass:'JavaTest'}, {}, {ok:false,validationFailure:true,error:'Player → Counter.counts: oczekiwano 6, otrzymano 0'});
  expect(report.passed).toBe(false);
  expect(report.summary).toBe('Zadanie nie spełnia jeszcze kryteriów.');
  expect(report.results[0].detail).toContain('oczekiwano 6, otrzymano 0');
});

it('checks sandbox startup without canvas probes or source patterns', () => {
  const task = {engine:true,runMode:'game',mainClass:'Main',checks:[{kind:'contains',value:'if('}],gameTests:[{expected:{x:1}}]};
  const files = {'Main.java':'student code'};
  expect(buildTaskCheckRequest(task,files)).toEqual({files,mainClass:'Main',mode:'console'});
  expect(evaluateTaskCheck(task,files,{ok:true,output:''}).passed).toBe(true);
  expect(evaluateTaskCheck(task,files,{ok:false,error:'syntax error'}).passed).toBe(false);
});

it('runs provided Java assertions as a console program rather than reading frame commands', () => {
  const task = {engine:true,runMode:'game',mainClass:'Main',javaTestFiles:{'GameTests.java':'assertions'},javaTestMainClass:'GameTests'};
  expect(buildTaskCheckRequest(task,{'Main.java':'student code'})).toEqual({
    files:{'Main.java':'student code','GameTests.java':'assertions'},mainClass:'GameTests',mode:'console',
  });
  expect(evaluateTaskCheck(task,{}, {ok:true}).passed).toBe(true);
  expect(evaluateTaskCheck(task,{}, {ok:false,error:'position assertion failed'}).passed).toBe(false);
});
