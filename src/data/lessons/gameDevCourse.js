import { courseManifest } from '../../../shared/lab-game-v2/course/manifest.js';
import { buildCourseProject } from '../labGameV2Course.js';
import { courseJavaTest } from '../labGameV2Checks.js';
const pointerTheory='Pozycja wskaźnika jest ekranowa i przed pierwszym zdarzeniem może być null. Camera2D.screenToWorld przelicza ją na świat. InputManager.isMouseDown śledzi przytrzymanie, isMousePressed nowe wciśnięcie, a isMouseReleased zwolnienie. Stała MOUSE_LEFT oznacza lewy przycisk; interakcja UI powinna zużyć wejście przed akcją świata.';
export const gameDevLessons=courseManifest.chapters.map(chapter=>({
  ...chapter,track:'game-dev',order:400+chapter.order,summary:chapter.objectives.join(' '),objective:chapter.objectives.join(' '),
  theory:[{title:chapter.title,text:chapter.objectives.join(' ')},...(chapter.id==='g2d.camera'?[{title:'Wskaźnik i przyciski myszy',text:pointerTheory}]:[])],tips:['Pozycja oznacza środek grafiki; czas jest w sekundach.'],
  tasks:chapter.tasks.map(task=>{
    const key=chapter.id.slice(4),starter=buildCourseProject('java',key,task.mode,false),solution=buildCourseProject('java',key,task.mode);
    return {...task,engine:true,engineApiVersion:'2.0.0',mainClass:'GameMain',runMode:'game',starterFiles:starter.files,solutionFiles:solution.files,solutionReady:solution.ready,checks:[],gameTests:[{label:'Scenariusz zachowania zadania.'}],javaTestMainClass:'JavaTest',javaTestFiles:{'JavaTest.java':courseJavaTest(key,task.mode)},steps:['Uruchom scenę.','Zaimplementuj opis zadania.','Sprawdź każde kryterium akceptacji.']};
  })
}));
