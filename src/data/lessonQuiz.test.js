import {describe,it,expect} from 'vitest';
import {allLessons} from './curriculum.js';
import {createLessonQuiz,lessonQuizPages} from './lessonQuiz.js';
import {templates} from '../../shared/assignments/catalog.js';
import {generateAssignment,publicAssignment} from '../../shared/assignments/generator.js';
const lessons=allLessons.filter(lesson=>lesson.track!=='playground');
describe('complete Java learning modules',()=>{
  it('covers all 56 lessons with explanations, quizzes and independent work',()=>{
    expect(lessons).toHaveLength(56);
    for(const lesson of lessons){
      expect(lessonQuizPages(lesson).length,lesson.id).toBeGreaterThan(0);
      expect(lesson.tasks.filter(task=>task.mode!=='guided').length,lesson.id).toBeGreaterThanOrEqual(2);
      const questions=createLessonQuiz(lesson);expect(questions.length,lesson.id).toBeGreaterThanOrEqual(2);
      for(const question of questions){expect(question.choices).toHaveLength(3);expect(new Set(question.choices).size).toBe(3);expect(question.choices[question.correct]).toBeTruthy();}
    }
  });
  it('reconstructs every lesson quiz server-side without exposing keys',()=>{
    for(const lesson of lessons){
      const templateId='java-quiz-'+lesson.id;
      expect(templates.find(item=>item.id===templateId)).toBeTruthy();
      const assignment=generateAssignment({templateId,seed:'QA-JAVA',difficulty:'standard'});
      const publicTask=publicAssignment(assignment);
      expect(publicTask.referenceFiles).toBeUndefined();
      expect(JSON.stringify(publicTask.params)).not.toMatch(/"correct"|"explanation"/);
      const keys=JSON.parse(assignment.referenceFiles['answer.json']).answers;
      for(const question of assignment.params.questions)expect(question.options.some(option=>option.id===keys[question.id])).toBe(true);
    }
  });
  it('reconstructs every coding task for teacher review',()=>{
    for(const lesson of lessons)for(let index=0;index<lesson.tasks.length;index++){
      const assignment=generateAssignment({templateId:'java-course-'+lesson.id,seed:'QA-JAVA',index});
      expect(assignment.starterFiles).toEqual(lesson.tasks[index].starterFiles);
      expect(assignment.referenceFiles).toEqual(lesson.tasks[index].solutionFiles);
      expect(publicAssignment(assignment).referenceFiles).toBeUndefined();
    }
  });
});
