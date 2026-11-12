import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import LessonPilot from './LessonPilot.jsx';
import { gameDevTaskLearning } from '../data/gameDevTaskLearning.js';

afterEach(cleanup);

it('renders the coordinate board for g2d.scene.modified', () => {
  const lesson = {
    id: 'g2d.scene', track: 'game-dev',
    tasks: [{ id: 'g2d.scene.modified', title: 'Przesunięcie', prompt: 'Przesuń PlatformB' }],
  };
  render(
    <LessonPilot lesson={lesson} activeTask={lesson.tasks[0]} completedTasks={[]}
      learning={gameDevTaskLearning['g2d.scene.modified']}
      onTaskChange={() => {}} onNextLesson={() => {}}
      editor={<div>e</div>} preview={<div>p</div>} feedback={<div>f</div>} submission={<div>s</div>} />,
  );
  expect(screen.getByRole('group', { name: 'Plansza układu współrzędnych' })).toBeInTheDocument();
});
