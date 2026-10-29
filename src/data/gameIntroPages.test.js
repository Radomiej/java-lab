import {test,expect} from 'vitest';
import {gameIntroPages} from '../../shared/lab-game-v2/editor/gameIntroPages.js';
import {createLessonQuiz,lessonQuizRevision} from './lessonQuiz.js';
import legacy from './gameIntroQuizLegacy.fixture.json';
import {generateAssignment} from '../../shared/assignments/generator.js';
test('introduces one visual concept at a time before asking for movement code',()=>{
 expect(gameIntroPages['g2d.scene'].map(page=>page.introDiagram)).toEqual(['loop','game','object','position','position-change','renderer','renderer-types','scale','rotation','component','instances']);
 expect(gameIntroPages['g2d.input']).toHaveLength(5);
 for(const pages of Object.values(gameIntroPages))for(const page of pages){expect(page.title).toBeTruthy();expect(page.text).toBeTruthy();expect(page.introDiagram).toBeTruthy();expect(page.result).toBeTruthy();if(page.code)expect(page.codeContext).toBeTruthy();}
});
test('pending old quizzes keep their old questions and keys; new quizzes match the new introduction',()=>{
 for(const [id,questions] of Object.entries(legacy)){
  const lesson={id,order:id==='g2d.scene'?501:502};
  expect(createLessonQuiz(lesson,{revision:0})).toEqual(questions);
  expect(lessonQuizRevision(lesson)).toBe(3);
  const current=createLessonQuiz(lesson);
  const assignment=generateAssignment({templateId:'java-quiz-'+id,seed:'INTRO',index:1});
  const key=JSON.parse(assignment.referenceFiles['answer.json']).answers;
  expect(assignment.params.questions.map(q=>q.code)).toEqual(current.map(q=>q.code));
  for(const question of current)expect(key[question.id]).toBe(String(question.correct));
  const old=generateAssignment({templateId:'java-quiz-'+id,seed:'INTRO',index:0});
  expect(old.params.questions.map(q=>q.title)).toEqual(questions.map(q=>q.title));
 }
});
