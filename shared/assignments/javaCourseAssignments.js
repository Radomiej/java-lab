// SERVER ONLY: lesson solution files must never enter a client catalog.
import {allLessons} from '../../src/data/curriculum.js';
export function generateJavaCourseTask(descriptor){
  const lesson=allLessons.find(item=>'java-course-'+item.id===descriptor.templateId);
  const task=lesson?.tasks[descriptor.index];
  if(!task||lesson.track==='playground')throw Error('Nieznane zadanie lekcji.');
  return {...descriptor,id:`${descriptor.templateId}-${descriptor.index}-${descriptor.seed}`,title:task.title,prompt:task.prompt,
    criteria:task.criteria||task.steps||['Wykonaj polecenie i sprawdź działanie programu.'],starterFiles:task.starterFiles,
    referenceFiles:task.solutionFiles,params:{kind:'course-task',lessonId:lesson.id,taskId:task.id,engine:task.engine||null}};
}
