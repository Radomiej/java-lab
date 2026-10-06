import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import Sidebar from './Sidebar.jsx';
afterEach(cleanup);
it('closes each selector and restores focus after selection', () => {
  const onTrackChange=vi.fn(),onLessonChange=vi.fn();
  render(<Sidebar tracks={{a:{label:'Alpha',icon:'A'},b:{label:'Beta',icon:'B'}}} trackOrder={['a','b']} lessons={[{id:'one',track:'a',order:101,title:'One',tasks:[]},{id:'two',track:'a',order:102,title:'Two',tasks:[]}]} selectedTrack="a" selectedLessonId="one" completedTasks={[]} completedCount={0} onTrackChange={onTrackChange} onLessonChange={onLessonChange}/>);
  const track=screen.getByLabelText('Wybierz ścieżkę'); fireEvent.click(track);
  fireEvent.click(screen.getByRole('tab',{name:/Beta/}));
  expect(onTrackChange).toHaveBeenCalledWith('b'); expect(track.closest('details').open).toBe(false); expect(track).toHaveFocus();
  const lesson=screen.getByLabelText('Wybierz lekcję'); fireEvent.click(lesson);
  fireEvent.click(screen.getByRole('button',{name:/102.*Two/}));
  expect(onLessonChange).toHaveBeenCalledWith('two'); expect(lesson.closest('details').open).toBe(false); expect(lesson).toHaveFocus();
});
