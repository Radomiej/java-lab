import {expect,test} from 'vitest';
import {allLessons} from '../data/curriculum.js';
import {buildTaskCheckRequest,evaluateTaskCheck} from './taskExecution.js';

test('inheritance requires executable object assertions in addition to console output',()=>{
  const task=allLessons.find(l=>l.order===301).tasks[0];
  const request=buildTaskCheckRequest(task,{'Main.java':'public class Main {}'});
  expect(request.mainClass).toBe('CourseJavaTest');
  expect(request.files['CourseJavaTest.java']).toBeTruthy();
  const report=evaluateTaskCheck(task,{}, {ok:true,output:'Luna',assertionResults:[{id:'base-type',passed:false,label:'Mage jest Character',detail:'Brak dziedziczenia'}]});
  expect(report.passed).toBe(false);
  expect(report.results.some(r=>r.label==='Mage jest Character'&&!r.passed)).toBe(true);
});

test('missing assertion results cannot silently award a task with valid console output',()=>{
  const task=allLessons.find(l=>l.order===301).tasks[0];
  expect(evaluateTaskCheck(task,{}, {ok:true,output:'Luna'}).passed).toBe(false);
});
