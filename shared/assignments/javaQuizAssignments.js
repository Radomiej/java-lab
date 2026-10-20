import {javaQuizLessons} from './javaQuizCatalog.js';
import {createLessonQuiz} from '../../src/data/lessonQuiz.js';
export function generateJavaQuiz(descriptor) {
  const lesson=javaQuizLessons.find(item=>'java-quiz-'+item.id===descriptor.templateId);
  if(!lesson)throw Error('Nieznana lekcja quizu.');
  const questions=createLessonQuiz(lesson,{revision:descriptor.index});
  const key=Object.fromEntries(questions.map(question=>[question.id,String(question.correct)]));
  const publicQuestions=questions.map(({correct,explanation,choices,...question})=>({...question,prompt:question.title+': '+question.prompt,options:choices.map((text,index)=>({id:String(index),text}))}));
  return {...descriptor,id:`${descriptor.templateId}-${descriptor.seed}-${descriptor.index}`,title:`Quiz · ${lesson.title}`,
    prompt:'Zaznacz odpowiedzi do przykładów z lekcji.',criteria:['Odpowiedzi dotyczą przykładów z tej lekcji.'],
    starterFiles:{'answer.json':JSON.stringify({answers:{}},null,2)},referenceFiles:{'answer.json':JSON.stringify({answers:key},null,2)},
    params:{kind:'quiz',lessonId:lesson.id,questions:publicQuestions}};
}
