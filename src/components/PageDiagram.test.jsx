import { test, expect } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import LessonExplanation, { explanationPages } from '../../shared/lab-game-v2/editor/LessonExplanation.jsx';
import PageDiagram from '../../shared/lab-game-v2/editor/PageDiagram.jsx';
import { gameExplanationPages } from '../../shared/lab-game-v2/editor/lessonVisuals.js';
import { allLessons as javaLessons } from '../data/curriculum.js';
import { allLessons as webLessons } from '../../../web-learning-lab/src/data/curriculum.js';

test('every teaching page has a diagram and consecutive pages change the illustration', () => {
  for (const lesson of [...javaLessons, ...webLessons].filter(l => l.id !== 'playground-game')) {
    const pages = explanationPages(lesson);
    let previous;
    for (const page of pages) {
      expect(page.visual, `${lesson.id}: ${page.title}`).toBeTruthy();
      const drawing = renderToStaticMarkup(<PageDiagram page={page} />);
      expect(drawing).not.toMatch(/undefined|NaN/);
      const visual = JSON.stringify(page.visual);
      expect(visual, `${lesson.id}: ${page.title}`).not.toBe(previous);
      previous = visual;
    }
  }
});
test('all 72 game pages have separate concepts and examples with valid crops', () => {
  expect(Object.keys(gameExplanationPages)).toHaveLength(24);
  for (const pages of Object.values(gameExplanationPages)) {
    expect(pages).toHaveLength(3);
    expect(new Set(pages.map(p => p.title)).size).toBe(3);
  }
  const markup = renderToStaticMarkup(<PageDiagram page={gameExplanationPages.graphics[1]} />);
  expect(markup).toContain('viewBox="256 0 128 128"');
  expect(markup).toContain('scale(-1 1)');
});
test('scene pagination switches architecture, coordinates and collider diagrams', () => {
  render(<LessonExplanation lesson={{ id:'g2d.scene' }} />);
  expect(screen.getByText('Transform + Sprite')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name:'Następny krok'}));
  expect(screen.getByRole('img')).toHaveAccessibleName(/Gdzie znajduje się obiekt/);
  expect(screen.getByText('100 | 150')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name:'Następny krok'}));
  expect(screen.getByText('Collider')).toBeInTheDocument();
  expect(screen.getByRole('button', {name:'Następny krok'})).toBeDisabled();
  cleanup();
});
test('web lessons use programming diagrams instead of game sprites', () => {
  for (const id of ['html-document','react-state-events','php-echo']) {
    const pages = explanationPages(webLessons.find(l => l.id === id));
    for (const page of pages) expect(renderToStaticMarkup(<PageDiagram page={page} />)).not.toContain('game-assets');
  }
});
