import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { javaConceptPages } from '../data/javaConceptPages.js';
import JavaLessonExplanation, { conceptPages, ConceptPreview } from './JavaLessonExplanation.jsx';
import { gameExplanationPages } from '../../shared/lab-game-v2/editor/lessonVisuals.js';
import { renderToStaticMarkup } from 'react-dom/server';
import { allLessons } from '../data/curriculum.js';

describe('concrete Java teaching illustrations', () => {
  it('covers all Java concept lessons without abstract concept maps', () => {
    expect(Object.keys(javaConceptPages)).toHaveLength(32);
    for (const pages of Object.values(javaConceptPages)) for (const page of pages) {
      expect(page.code).toBeTruthy();
      expect(page.result).toBeTruthy();
      expect(page.actors.length).toBeGreaterThan(0);
      expect(page.title).not.toMatch(/Czego się nauczysz|Zapamiętaj/);
    }
  });
  it('shows runtime dispatch with two actual heroes and different outcomes', () => {
    render(<JavaLessonExplanation lesson={{ id: 'inheritance-11' }} />);
    expect(screen.getByRole('img', { name: 'Jedna komenda, dwa różne ataki' })).toBeInTheDocument();
    expect(screen.getByText(/Miecz\s*Czar/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Następny krok' }));
    expect(screen.getByText('Typ zmiennej to dostępne przyciski')).toBeInTheDocument();
    expect(screen.getByText('Typ zmiennej: Character')).toBeInTheDocument();
    expect(screen.getByText('Obiekt: Mage')).toBeInTheDocument();
  });
  it('replaces every generic game keyword chain with a concrete scene', () => {
    for (const chapter of Object.keys(gameExplanationPages)) {
      for (const page of conceptPages({ id: `g2d.${chapter}` })) {
        expect(page.actors?.length || page.visual?.kind || page.introDiagram).toBeTruthy();
        expect(page.visual?.kind).not.toBe('flow');
      }
    }
  });
  it('renders every page of all 56 course lessons with concrete, valid illustrations', () => {
    const lessons = allLessons.filter(l => l.id !== 'playground-game');
    expect(lessons).toHaveLength(56);
    let count = 0;
    for (const lesson of lessons) for (const page of conceptPages(lesson)) {
      const markup = renderToStaticMarkup(<ConceptPreview page={page} />);
      expect(markup).not.toMatch(/undefined|NaN|Mapa pojęć|Przykład zasady • diagram relacji/);
      expect(markup).toContain('<svg');
      count++;
    }
    expect(count).toBeGreaterThan(90);
  });
});
