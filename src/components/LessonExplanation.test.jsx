import { test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LessonExplanation, { explanationPages } from '../../shared/lab-game-v2/editor/LessonExplanation.jsx';
const lesson = { id: 'test.time', order: 403, title: 'Czas', theory: [{ title: 'Prędkość', text: 'Prędkość 120.5 px/s. Czas odmierzamy w sekundach.', code: 'x += speed * delta;' }], tips: ['Nie pomijaj delta.'] };
test('paginates explanations, disables boundaries and resets on lesson change', () => {
  const view = render(<LessonExplanation lesson={lesson} />);
  expect(screen.getByRole('button', { name: 'Poprzedni krok' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Następny krok' }));
  expect(screen.getByRole('heading', { name: 'Zapamiętaj' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Następny krok' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Krok 2' })).toHaveAttribute('aria-current', 'step');
  view.rerender(<LessonExplanation lesson={{ ...lesson, id: 'test.input' }} />);
  expect(screen.getByRole('heading', { name: 'Prędkość' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Krok 1' })).toHaveAttribute('aria-current', 'step');
});
test('preserves decimal numbers and all explanation text across short pages', () => {
  const text = 'Prędkość wynosi 120.5 px/s. ' + 'Kolejne zdanie wyjaśnia działanie ruchu. '.repeat(20);
  const pages = explanationPages({ theory: [{ title: 'Ruch', text }] });
  expect(pages.length).toBeGreaterThan(1);
  expect(pages.map(page => page.text).join(' ')).toBe(text.trim());
});
