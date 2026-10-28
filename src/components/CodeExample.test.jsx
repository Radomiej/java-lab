import { test, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import CodeExample from '../../shared/lab-game-v2/editor/CodeExample.jsx';
import CopyCodeButton from '../../shared/lab-game-v2/editor/CopyCodeButton.jsx';
import LessonExplanation from '../../shared/lab-game-v2/editor/LessonExplanation.jsx';
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
function clipboard(value) { Object.defineProperty(navigator, 'clipboard', { configurable: true, value }); }
afterEach(() => { cleanup(); vi.restoreAllMocks(); if(originalClipboard)Object.defineProperty(navigator,'clipboard',originalClipboard); else delete navigator.clipboard; });
test('copies the exact displayed code including line breaks', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  clipboard({ writeText });
  const code = 'const x = 1;\nconsole.log(x);';
  render(<CodeExample code={code}/>);
  fireEvent.click(screen.getByRole('button', {name:'Kopiuj kod'}));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Skopiowano kod'));
  expect(writeText).toHaveBeenCalledWith(code);
});
test('explains manual copying if clipboard access fails', async () => {
  clipboard({writeText:vi.fn().mockRejectedValue(new Error('denied'))});
  render(<CodeExample code="health.damage(1);"/>);
  fireEvent.click(screen.getByRole('button', {name:'Kopiuj kod'}));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Ctrl+C'));
});
test('shared damage explanation displays the correct language', () => {
  const codeText = re => [...document.querySelectorAll('pre code')].some(el => re.test(el.textContent ?? ''));
  const view = render(<LessonExplanation lesson={{id:'g2d.health'}} language="javascript"/>);
  const next = screen.getByRole('button', { name: 'Następny krok' });
  const findOnPages = re => { for (let i = 0; i < 8 && !codeText(re); i++) { if (next.disabled) break; fireEvent.click(next); } return codeText(re); };
  expect(findOnPages(/const health = other\.getComponent/)).toBe(true);
  expect(codeText(/Health\.class/)).toBe(false);
  view.rerender(<LessonExplanation lesson={{id:'g2d.health'}} language="java"/>);
  expect(findOnPages(/Health\.class/)).toBe(true);
});
test('editor copy follows the active file and clears stale confirmation', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  clipboard({writeText});
  const view = render(<CopyCodeButton code="class Player {}" fileName="Player.java"/>);
  fireEvent.click(screen.getByRole('button',{name:'Kopiuj kod pliku'}));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Skopiowano kod'));
  view.rerender(<CopyCodeButton code="class Enemy {}" fileName="Enemy.java"/>);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Kopiuj kod pliku'}));
  await waitFor(() => expect(writeText).toHaveBeenLastCalledWith('class Enemy {}'));
});

