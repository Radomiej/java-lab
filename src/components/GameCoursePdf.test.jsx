import { test, expect, afterEach } from 'vitest';
import { fireEvent, render, screen, cleanup } from '@testing-library/react';
import GameCoursePdf, { gameCoursePdfUrl } from './GameCoursePdf.jsx';
import LessonOverview from './LessonOverview.jsx';
afterEach(cleanup);

test('shows PDF information behind a compact accessible question mark', () => {
  render(<LessonOverview lesson={{id:'g2d.scene',track:'game-dev',title:'Scena',order:401}} />);
  const help = screen.getByText('?');
  expect(help.tagName).toBe('SUMMARY');
  expect(help).toHaveAttribute('aria-label', 'O materiałach PDF');
  expect(help).toHaveAttribute('title', expect.stringContaining('przykłady Java'));
  expect(help.closest('details')).not.toHaveAttribute('open');
  fireEvent.click(help);
  expect(help.closest('details')).toHaveAttribute('open');
  fireEvent.keyDown(help, { key: 'Escape' });
  expect(help.closest('details')).not.toHaveAttribute('open');
  expect(help).toHaveFocus();
});

test('opens PDF preview with download and restores focus after Escape', () => {
  render(<GameCoursePdf />);
  const trigger = screen.getByRole('button', { name: 'Kurs GameDev · PDF' });
  expect(screen.getByRole('link', { name: 'Pobierz PDF' })).toHaveAttribute('download', 'kurs-gamedev-java-v3.pdf');
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Start GameDev Java — program v3' });
  expect(screen.getByRole('img')).toHaveAttribute('src', '/courses/previews/kurs-gamedev-java-v3/page-1.webp');
  expect(screen.getByRole('link', { name: 'Otwórz w nowej karcie' })).toHaveAttribute('href', gameCoursePdfUrl);
  expect(screen.getAllByRole('link', { name: 'Pobierz PDF' })).toHaveLength(2);
  fireEvent.change(screen.getByLabelText('Kurs'), { target: { value: '2' } });
  expect(screen.getByRole('img')).toHaveAttribute('src', '/courses/previews/kurs-gamedev-java-tweeny/page-1.webp');
  expect(screen.getByRole('dialog', { name: 'Tweeny, PingPong i FadeOut' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Strona 7', exact: true }));
  expect(screen.getByRole('button', { name: 'Następna strona' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Poprzednia strona' }));
  expect(screen.getByRole('button', { name: 'Strona 6', exact: true })).toHaveAttribute('aria-current', 'page');
  fireEvent.click(screen.getByRole('button', { name: 'Następna strona' }));
  expect(screen.getByRole('img')).toHaveAttribute('src', '/courses/previews/kurs-gamedev-java-tweeny/page-7.webp');
  fireEvent.change(screen.getByLabelText('Kurs'), { target: { value: '1' } });
  expect(screen.getByRole('button', { name: 'Strona 1', exact: true })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('button', { name: 'Poprzednia strona' })).toBeDisabled();
  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
