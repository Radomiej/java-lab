// @vitest-environment node
import { describe, expect, it } from 'vitest';
import manifest from '../../shared/lab-game-v2/course/manifest.json';
import { taskLearningFor } from './taskLearning.js';
import { gameDevTaskLearning } from './gameDevTaskLearning.js';

const taskIds = manifest.chapters.flatMap((chapter) => chapter.tasks.map((task) => task.id));

// Kinds PageDiagram (shared/lab-game-v2/editor/PageDiagram.jsx) can render, plus
// 'flow' (nodes + note) and 'array' handled directly in LessonPilot.
const supportedKinds = new Set([
  'flow', 'array', 'scene-map', 'sprint-distance', 'flee-range', 'chase-motion',
  'component-appearance', 'direction', 'combat-health', 'enemy-tactics',
  'floating-text', 'position', 'flip', 'motion', 'camera', 'contact', 'bars',
  'timeline', 'instances', 'pickup', 'projectile', 'layers', 'rectangle',
  'input', 'focus', 'ninepatch', 'spatial', 'run',
]);

describe('Game Dev pilot notes', () => {
  it('covers all 72 task ids from the course manifest', () => {
    expect(taskIds).toHaveLength(72);
    for (const id of taskIds) {
      expect(gameDevTaskLearning[id], id).toBeTruthy();
      expect(taskLearningFor(id), id).toBeTruthy();
    }
  });

  it('has a complete note for every task', () => {
    for (const id of taskIds) {
      const note = taskLearningFor(id);
      for (const field of ['title', 'text', 'code', 'question', 'trial', 'answer']) {
        expect(note[field], `${id}.${field}`).toBeTruthy();
      }
      expect(supportedKinds.has(note.visual?.kind), `${id} visual.kind=${note.visual?.kind}`).toBe(true);
      if (note.visual.kind === 'flow') {
        expect(note.visual.nodes?.length, `${id} flow nodes`).toBeGreaterThan(1);
      } else {
        expect(Number.isInteger(note.visual.variant), `${id} visual.variant`).toBe(true);
      }
      expect(note.prediction?.context, `${id} prediction.context`).toBeTruthy();
      expect(note.prediction?.code, `${id} prediction.code`).toBeTruthy();
      if (note.board) {
        expect(['chase', 'coordinates', 'components', 'keypress'], `${id} board.kind=${note.board.kind}`).toContain(note.board.kind);
      }
    }
  });

  it('has no notes for unknown task ids', () => {
    for (const id of Object.keys(gameDevTaskLearning)) {
      expect(taskIds, id).toContain(id);
    }
  });
});
