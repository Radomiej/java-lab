import { javaConceptPages } from './javaConceptPages.js';
import { gameExplanationPages } from '../../shared/lab-game-v2/editor/lessonVisuals.js';

export function lessonQuizPages(lesson) {
  return javaConceptPages[lesson.id] || gameExplanationPages[lesson.id.replace(/^g2d\./, '')] || [];
}
export function createLessonQuiz(lesson) {
  const pages = lessonQuizPages(lesson);
  return pages.slice(0, 3).map((page, index) => {
    const answer = page.result || page.text;
    const other = Object.values({...javaConceptPages, ...gameExplanationPages}).flat()
      .map(item => item.result || item.text).filter(text => text && text !== answer);
    const distractors = [...new Set(other)].filter(text => text.length < 220).slice(index * 2, index * 2 + 2);
    const options = [answer, ...distractors];
    const rotation = (index + lesson.order) % options.length;
    const choices = options.slice(rotation).concat(options.slice(0, rotation));
    return {id: `${lesson.id}-quiz-${index + 1}`, title: page.title,
      prompt: page.result ? 'Jaki jest efekt opisanego przykładu?' : 'Które wyjaśnienie pasuje do tego kroku lekcji?',
      code: page.result ? (typeof page.code === 'object' ? page.code.java : page.code) : '',
      choices, correct: choices.indexOf(answer), explanation: page.text};
  });
}
