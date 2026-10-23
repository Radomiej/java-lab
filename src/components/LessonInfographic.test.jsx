import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LessonInfographic from '../../shared/lab-game-v2/editor/LessonInfographic.jsx';

test('renders rule, code and observation cards from the current page', () => {
  render(<LessonInfographic lesson={{ id: 'js-fetch', order: 3, title: 'Pobieranie danych', objective: 'Żądanie → odpowiedź → UI', theory: [{ title: 'fetch()', text: 'fetch zwraca odpowiedź serwera.', code: 'const res = await fetch(url);' }] }} />);
  expect(screen.getByRole('heading', { name: 'Reguła' })).toBeInTheDocument();
  expect(screen.getByText('fetch zwraca odpowiedź serwera.')).toBeInTheDocument();
  expect(screen.getByText(/const res = await fetch/)).toBeInTheDocument();
});

test('falls back to lesson fields when the page has no theory code', () => {
  const view = render(<LessonInfographic lesson={{ id: 'js-error-handling', order: 5, title: 'Błędy', objective: 'Obsłuż awarie żądań', tips: ['try/catch łapie wyjątek'] }} language="javascript" />);
  expect(screen.getByText('Obsłuż awarie żądań')).toBeInTheDocument();
  expect(screen.getByText('try/catch łapie wyjątek')).toBeInTheDocument();
  view.rerender(<LessonInfographic lesson={{ id: 'js-error-handling', order: 5, title: 'Błędy', objective: 'Obsłuż awarie żądań' }} language="javascript" />);
  expect(screen.getAllByText('Obsłuż awarie żądań')).toHaveLength(2);
});
