import {expect, it} from 'vitest';
import {prepareGameRequest} from './gameWorkspace.js';
import {gameDevLessons} from '../data/lessons/gameDev.js';

it('exposes only student files and starts each game with GameMain', () => {
  for (const task of gameDevLessons.flatMap(lesson => lesson.tasks)) {
    expect(task.starterFiles['GameMain.java']).toContain('class GameMain extends Game');
    expect(task.starterFiles['Main.java']).toBeUndefined();
    expect(Object.keys(task.starterFiles).length).toBeLessThanOrEqual(2);
  }
});

it('injects the package, API and launcher without changing editor sources', () => {
  const files={'GameMain.java':'public class GameMain extends Game {}','Enemy.java':'public class Enemy extends Component {}'};
  const request=prepareGameRequest({files,mainClass:'Main',mode:'game'});
  expect(request.mainClass).toBe('lab.GameLauncher');
  expect(request.files['GameMain.java']).toContain('package lab;');
  expect(request.files['Enemy.java']).toContain('import engine.*;');
  expect(request.files['GameLauncher.java']).toContain('new GameMain()');
  expect(request.files['Sprite.java']).toContain('package engine;');
  expect(files['GameMain.java']).toBe('public class GameMain extends Game {}');
});

it('packages Java object tests and leaves ordinary Java requests unchanged', () => {
  const request=prepareGameRequest({files:{'GameMain.java':'class GameMain extends Game {}','Checks.java':'class Checks {}'},mainClass:'Checks',mode:'console'});
  expect(request.mainClass).toBe('lab.Checks');
  const ordinary={files:{'Main.java':'class Main {}'},mainClass:'Main',mode:'console'};
  expect(prepareGameRequest(ordinary)).toBe(ordinary);
});
