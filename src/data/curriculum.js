import { fundamentalsLessons } from "./lessons/fundamentals.js";
import { objectLessons } from "./lessons/objects.js";
import { inheritanceLessons } from "./lessons/inheritance.js";
import { swingLessons } from "./lessons/swing.js";
import { trackOrder, tracks } from "./tracks.js";

export { trackOrder, tracks };

export const allLessons = [
  ...fundamentalsLessons,
  ...objectLessons,
  ...inheritanceLessons,
  ...swingLessons,
].sort((left, right) => left.order - right.order);

export function getLessonById(lessonId) {
  return allLessons.find((lesson) => lesson.id === lessonId) || allLessons[0];
}

export function getLessonsForTrack(trackId) {
  return allLessons.filter((lesson) => lesson.track === trackId);
}
