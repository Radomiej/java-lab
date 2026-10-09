import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import App from '../App.jsx';
import TaskPanel from './TaskPanel.jsx';
import LessonOverview from './LessonOverview.jsx';
import { gameDevLessons } from '../data/lessons/gameDevCourse.js';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); localStorage.clear(); });

test('RUN starts a compilable game even when exercise assertions fail, without awarding completion', async () => {
  localStorage.clear();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({setTransform(){},fillRect(){},fillText(){}});
  vi.stubGlobal('Image', class {set src(value){queueMicrotask(()=>this.onload());}});
  class WorkerFixture {
    listeners = new Map();
    addEventListener(type, callback) {if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push(callback);}
    emit(data) {this.listeners.get('message')?.forEach(callback=>callback({data}));}
    postMessage(message) {
      if(message.command==='initialize')queueMicrotask(()=>this.emit({command:'ready'}));
      if(message.command==='compile-and-run')queueMicrotask(()=>this.emit({command:'result',id:message.id,
        ok:message.mode==='game',validationFailure:message.mode!=='game',
        error:message.mode==='game'?null:'Marker.x: oczekiwano 80, otrzymano 0',output:'',diagnostics:[],classVersions:[],phase:'runtime'}));
    }
    terminate() {}
  }
  vi.stubGlobal('Worker',WorkerFixture);
  render(<App />);
  fireEvent.click(screen.getByRole('tab',{name:/Game Dev w Javie/i}));
  fireEvent.click(screen.getByRole('button',{name:/RUN/}));
  await waitFor(()=>expect(screen.getByText('Gra gotowa')).toBeInTheDocument());
  expect(screen.getAllByText(/Marker.x: oczekiwano 80/).length).toBeGreaterThan(0);
  expect(screen.getByText('0/1')).toBeInTheDocument();
});

test('independent game tasks show acceptance criteria, not hidden implementation hints', () => {
  const lesson=gameDevLessons[7],task=lesson.tasks[2];
  render(<TaskPanel lesson={lesson} activeTask={task} completedTasks={[]} onTaskChange={()=>{}} />);
  for(const criterion of task.criteria)expect(screen.getByText(criterion)).toBeInTheDocument();
  expect(screen.queryByText(/Podpowiedź:/)).not.toBeInTheDocument();
});

test('course PDFs are accessible directly from a game lesson', () => {
  render(<LessonOverview lesson={gameDevLessons[7]} />);
  fireEvent.click(screen.getByRole('button',{name:'Kurs GameDev · PDF'}));
  expect(screen.getByRole('dialog',{name:'Podstawy GameDev JS'})).toBeInTheDocument();
});
