import { fundamentalsLessons } from "./lessons/fundamentals.js";
import { objectLessons } from "./lessons/objects.js";
import { inheritanceLessons } from "./lessons/inheritance.js";
import { gameDevLessons } from "./lessons/gameDev.js";
import { addIndependentTasks } from "./lessonTasks.js";
import { withConsoleExpectations } from "./consoleExpectations.js";
import { trackOrder, tracks } from "./tracks.js";

export { trackOrder, tracks };

export const allLessons = [
  ...fundamentalsLessons,
  ...objectLessons,
  ...inheritanceLessons,
  ...gameDevLessons,
].map(addIndependentTasks).map(withConsoleExpectations).sort((left, right) => left.order - right.order);

export function getLessonById(lessonId) {
  return allLessons.find((lesson) => lesson.id === lessonId) || allLessons[0];
}

export function getLessonsForTrack(trackId) {
  return allLessons.filter((lesson) => lesson.track === trackId);
}
