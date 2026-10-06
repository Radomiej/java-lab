import { fundamentalsLessons } from "./lessons/fundamentals.js";
import { objectLessons } from "./lessons/objects.js";
import { inheritanceLessons } from "./lessons/inheritance.js";
import { gameDevLessons } from "./lessons/gameDev.js";
import { addIndependentTasks } from "./lessonTasks.js";
import { withConsoleExpectations } from "./consoleExpectations.js";
import { trackOrder, tracks } from "./tracks.js";
import { playgroundLesson } from './playground.js';

export { trackOrder, tracks };

export function numberLessons(lessons) {
  const counts=new Map();
  return lessons.map(lesson=>{
    const trackIndex=trackOrder.indexOf(lesson.track);
    if(trackIndex<0)throw new Error('Nieznana ścieżka lekcji.');
    const position=(counts.get(lesson.track)||0)+1;counts.set(lesson.track,position);
    if(position>99)throw new Error('Ścieżka może zawierać najwyżej 99 lekcji.');
    return {...lesson,order:(trackIndex+1)*100+position};
  });
}

export const allLessons = numberLessons([
  ...fundamentalsLessons,
  ...objectLessons,
  ...inheritanceLessons,
  ...gameDevLessons,
].map(addIndependentTasks).map(withConsoleExpectations).concat(playgroundLesson)).sort((left, right) => left.order - right.order);

export function getLessonById(lessonId) {
  return allLessons.find((lesson) => lesson.id === lessonId) || allLessons[0];
}

export function getLessonsForTrack(trackId) {
  return allLessons.filter((lesson) => lesson.track === trackId);
}
