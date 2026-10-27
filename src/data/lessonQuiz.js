import { javaConceptPages } from './javaConceptPages.js';
import { gameExplanationPages } from '../../shared/lab-game-v2/editor/lessonVisuals.js';
import {gameIntroPages} from '../../shared/lab-game-v2/editor/gameIntroPages.js';
// Index is an immutable quiz revision; bump it whenever quiz content changes so pending submissions keep their questions and keys.
export const lessonQuizRevision=()=>2;

export function lessonQuizPages(lesson,{revision=lessonQuizRevision(lesson)}={}) {
  if(revision>=1&&gameIntroPages[lesson.id])return gameIntroPages[lesson.id];
  return javaConceptPages[lesson.id] || gameExplanationPages[lesson.id.replace(/^g2d\./, '')] || [];
}
export function createLessonQuiz(lesson,{revision=lessonQuizRevision(lesson)}={}) {
  const pages = lessonQuizPages(lesson,{revision});
  const quizPages=lesson.id==='g2d.scene'&&revision>=1?[pages[2],pages[3],pages[5]]:pages.slice(0,3);
  return quizPages.map((page, index) => {
    const answer = page.result || page.text;
    let distractors;
    if (revision >= 2) {
      const field = page.result ? 'result' : 'text';
      const domainPages = lesson.id?.startsWith('g2d.')
        ? [...Object.values(gameExplanationPages), ...Object.values(gameIntroPages)].flat()
        : Object.values(javaConceptPages).flat();
      const sameLesson = [...new Set(pages.filter(item => item !== page).map(item => item[field]))]
        .filter(text => text && text !== answer && text.length < 220);
      const domain = [...new Set(domainPages.map(item => item[field]))]
        .filter(text => text && text !== answer && text.length < 220 && !sameLesson.includes(text));
      distractors = [];
      for (const pool of [sameLesson, domain]) {
        for (let step = 0; step < pool.length && distractors.length < 2; step++) {
          const candidate = pool[(index * 2 + step) % pool.length];
          if (!distractors.includes(candidate)) distractors.push(candidate);
        }
      }
    } else {
      const other = Object.values({...javaConceptPages, ...gameExplanationPages}).flat()
        .map(item => item.result || item.text).filter(text => text && text !== answer);
      distractors = [...new Set(other)].filter(text => text.length < 220).slice(index * 2, index * 2 + 2);
    }
    const options = [answer, ...distractors];
    const rotation = (index + lesson.order) % options.length;
    const choices = options.slice(rotation).concat(options.slice(0, rotation));
    return {id: `${lesson.id}-quiz-${index + 1}`, title: page.title,
      prompt: page.result ? 'Jaki jest efekt opisanego przykładu?' : 'Które wyjaśnienie pasuje do tego kroku lekcji?',
      code: page.result ? (typeof page.code === 'object' ? page.code.java : page.code) : '',
      choices, correct: choices.indexOf(answer), explanation: page.text};
  });
}
