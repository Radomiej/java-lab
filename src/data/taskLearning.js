import { gameDevTaskLearning } from './gameDevTaskLearning.js';
import { algorithmsTaskLearning } from './algorithmsTaskLearning.js';

const taskLearning = { ...gameDevTaskLearning, ...algorithmsTaskLearning };

export function taskLearningFor(taskId) {
  return taskLearning[taskId];
}
