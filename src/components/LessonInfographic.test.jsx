import { test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LessonInfographic, { lessonDiagrams } from '../../shared/lab-game-v2/editor/LessonInfographic.jsx';
import { assetManifest } from '../../shared/lab-game-v2/assets/Assets.js';

test('all 24 game lessons have diagrams with existing sprite assets', () => {
  expect(Object.keys(lessonDiagrams)).toHaveLength(24);
  for (const [asset, title, rule, code, effect] of Object.values(lessonDiagrams)) {
    expect(assetManifest.assets.some(item => item.key === asset)).toBe(true);
    for (const value of [title, rule, code, effect]) expect(value.length).toBeGreaterThan(5);
  }
});

test('reference illustration expands and explains time-based movement', () => {
  render(<LessonInfographic lesson={{ id: 'fundamentals-03', order: 3, title: 'Warunki', objective: 'Warunek steruje ruchem' }} />);
  const image = screen.getByRole('img');
  expect(image).toHaveAttribute('src', '/lesson-illustrations/conditions.png');
  fireEvent.click(screen.getByRole('button', { name: 'Infografika: Warunki' }));
  expect(image).toHaveClass('is-expanded');
  expect(screen.getByText(/1 × 120 × 0.5 = 60 px/)).toBeInTheDocument();
});
