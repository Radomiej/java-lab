import {render,cleanup} from '@testing-library/react';
import {test,expect,vi,afterEach} from 'vitest';
import App from './App.jsx';
import {allLessons} from './data/curriculum.js';
const observed=vi.hoisted(()=>({snapshot:null}));
vi.mock('./hooks/useSessionTelemetry.js',()=>({useSessionTelemetry:snapshot=>{
 observed.snapshot=snapshot;
 return {machineId:'test',status:'disabled',capture:()=>{},studentName:'',setStudentName:()=>{}};
}}));
vi.mock('./services/teavmRunner.js',()=>({createTeaVMRunner:()=>({dispose(){},stopGame(){}})}));
afterEach(()=>{cleanup();localStorage.clear();});
test('sends saved course progress with the current lesson number and task title',()=>{
 const lesson=allLessons.find(item=>item.id==='fundamentals-01');
 localStorage.setItem('java-lab-progress-v1',JSON.stringify({selectedTrack:lesson.track,selectedLessonId:lesson.id,filesByTask:{},completedTasks:[lesson.tasks[0].id]}));
 render(<App/>);
 expect(observed.snapshot).toMatchObject({lessonNumber:lesson.order,taskTitle:lesson.tasks[0].title,progress:{completed:1}});
 expect(observed.snapshot.progress.total).toBeGreaterThan(1);
});
