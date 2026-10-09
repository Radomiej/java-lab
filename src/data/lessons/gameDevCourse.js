import { courseManifest } from '../../../shared/lab-game-v2/course/manifest.js';
import { buildCourseProject } from '../labGameV2Course.js';
import { courseJavaTest } from '../labGameV2Checks.js';
import { gameDevTeaching } from '../gameDevTeaching.js';
const pointerTheory='W komponencie Java dostęp do gry uzyskujesz przez getGame(): zapis game.input z polecenia oznacza tutaj getGame().input. getPointerPosition() zwraca pozycję ekranową albo null przed pierwszym zdarzeniem myszy nad planszą. Camera2D.screenToWorld przelicza ją na świat. Origin oznacza lewy górny punkt widoku w świecie. isMouseDown oznacza przytrzymanie przycisku, isMousePressed nowe wciśnięcie, a isMouseReleased zwolnienie. MOUSE_LEFT oznacza lewy przycisk myszy.';
export const gameDevLessons=courseManifest.chapters.map(chapter=>({
  ...chapter,track:'game-dev',order:400+chapter.order,summary:chapter.objectives.join(' '),objective:chapter.objectives.join(' '),
  theory:[...gameDevTeaching(chapter.id.slice(4)).theory,...(chapter.id==='g2d.camera'?[{title:'Wskaźnik i przyciski myszy',text:pointerTheory}]:[])],tips:gameDevTeaching(chapter.id.slice(4)).tips,
  tasks:chapter.tasks.map(task=>{
    const key=chapter.id.slice(4),starter=buildCourseProject('java',key,task.mode,false),solution=buildCourseProject('java',key,task.mode);
    return {...task,engine:true,engineApiVersion:'2.0.0',mainClass:'GameMain',runMode:'game',starterFiles:starter.files,solutionFiles:solution.files,solutionReady:solution.ready,checks:[],gameTests:[{label:'Scenariusz zachowania zadania.'}],javaTestMainClass:'JavaTest',javaTestFiles:{'JavaTest.java':courseJavaTest(key,task.mode)},steps:[`Otwórz plik z TODO: ${Object.entries(starter.files).filter(([,code])=>code.includes('TODO')).map(([name])=>name).join(', ') || 'GameMain.java'}. Uzupełnij zachowanie opisane w poleceniu.`, 'Kliknij RUN: zobaczysz scenę i oddzielny wynik testów Java. Niepełne rozwiązanie może działać, ale nie zalicza zadania.', 'Porównaj zachowanie z kryteriami poniżej. Błędy kompilacji popraw w edytorze; niespełnione kryteria znajdziesz w wynikach testów.']};
  })
}));
