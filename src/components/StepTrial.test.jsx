import { afterEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import StepTrial from './StepTrial.jsx';

afterEach(cleanup);

const trace = {
  values: [9, 1, 5],
  steps: [
    { caption: 'Start: 9 > 1 — zamieniamy.', values: [9, 1, 5], compare: [0, 1] },
    { caption: 'Po zamianie.', values: [1, 9, 5], swap: [0, 1], vars: { i: 0 } },
    { caption: 'Koniec: posortowane.', values: [1, 5, 9], sortedFrom: 0 },
  ],
};

it('renders values inside cells, numeric indices and the caption', () => {
  render(<StepTrial trace={trace} />);
  expect(screen.getByText('9')).toBeTruthy();
  expect(screen.getByText('5')).toBeTruthy();
  expect(screen.getByText('0')).toBeTruthy();
  expect(screen.getByRole('status').textContent).toBe('Start: 9 > 1 — zamieniamy.');
  expect(screen.getByText('Krok 1 / 3')).toBeTruthy();
});

it('steps forward, back and resets with disabled ends', () => {
  render(<StepTrial trace={trace} />);
  const back = screen.getByRole('button', { name: /Wstecz/ });
  const next = screen.getByRole('button', { name: /Następny krok/ });
  const reset = screen.getByRole('button', { name: /Od początku/ });
  expect(back.disabled).toBe(true);
  expect(reset.disabled).toBe(true);
  fireEvent.click(next);
  expect(screen.getByRole('status').textContent).toBe('Po zamianie.');
  expect(screen.getByText('Krok 2 / 3')).toBeTruthy();
  expect(back.disabled).toBe(false);
  fireEvent.click(next);
  expect(screen.getByRole('status').textContent).toBe('Koniec: posortowane.');
  expect(next.disabled).toBe(true);
  fireEvent.click(reset);
  expect(screen.getByRole('status').textContent).toBe('Start: 9 > 1 — zamieniamy.');
  expect(next.disabled).toBe(false);
});

it('renders vars table and call stack', () => {
  const varsTrace = {
    steps: [
      { caption: 'Zejście.', stack: ['fib(1)', 'fib(2)'], vars: { n: 1 } },
      { caption: 'Powrót.', vars: { wynik: 13 } },
    ],
  };
  render(<StepTrial trace={varsTrace} />);
  expect(screen.getByText('fib(1)')).toBeTruthy();
  expect(screen.getByText('n')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: /Następny krok/ }));
  expect(screen.queryByText('fib(1)')).toBeNull();
  expect(screen.getByRole('status').textContent).toBe('Powrót.');
});
