// @vitest-environment node
import {it, expect} from 'vitest';
import {readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync} from 'node:fs';
import {tmpdir, homedir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {gameEngineRuntimeFiles} from './gameEngineRuntime.js';
import {normalizeGameProject} from '../services/gameProjectTransfer.js';

function javaBin(name) {
  if (process.env.JAVA_HOME) return join(process.env.JAVA_HOME,'bin',name);
  const jdks = join(homedir(),'.jdks');
  if (existsSync(jdks)) for (const dir2 of readdirSync(jdks)) {
    const candidate=join(jdks,dir2,'bin',`${name}${process.platform==='win32'?'.exe':''}`);
    if (existsSync(candidate)) return candidate;
  }
  return name;
}
function runJava(files, main='EngineTests') {
  const dir2=mkdtempSync(join(tmpdir(),'java-lab-tests-'));
  try {
    const paths=Object.entries(files).filter(([file])=>file.endsWith('.java')).map(([file,source])=>{
      const pkg=source.match(/package\s+([\w.]+);/)?.[1];
      const folder=pkg?join(dir2,...pkg.split('.')):dir2;
      mkdirSync(folder,{recursive:true});
      const path=join(folder,file.split('/').pop());writeFileSync(path,source);return path;
    });
    const argFile=join(dir2,'sources.txt');writeFileSync(argFile,paths.map(path=>'"'+path.replaceAll('\\','/')+'"').join('\n'));
    execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',dir2,'@'+argFile],{encoding:'utf8',timeout:600000});
    return execFileSync(javaBin('java'),['-cp',dir2,main],{encoding:'utf8',timeout:60000});
  } finally {rmSync(dir2,{recursive:true,force:true});}
}

const dir = join(import.meta.dirname, 'playground-games');
const games = Object.fromEntries(
  readdirSync(dir).filter(f => f.endsWith('.json')).map(f => [f, JSON.parse(readFileSync(join(dir, f), 'utf8'))])
);

function bundle(project) {
  return {...gameEngineRuntimeFiles, ...Object.fromEntries(Object.entries(project.files).map(([name, source]) => [name, 'import engine.*;\n' + source]))};
}

for (const [file, project] of Object.entries(games)) {
  it(`${file} is a valid project JSON`, () => {
    expect(() => normalizeGameProject(project)).not.toThrow();
  });
}

it('platformer-mario: gravity, walk, jump, coin trigger, restart', () => {
  const files = bundle(games['platformer-mario.json']);
  expect(runJava({...files, 'Smoke.java': `import engine.*;
public class Smoke { public static void main(String[] a) {
 GameCanvas.setSize(640,360); GameMain game=new GameMain();
 try {
  game.start(); game.step(0);
  GameObject p=game.find("Player");
  for(int i=0;i<40;i++)game.step(1.0/60);
  PlatformerCharacterController2D body=p.getComponent(PlatformerCharacterController2D.class);
  if(!body.isGrounded())throw new AssertionError("gracz nie wyladowal na podlodze");
  double x0=p.transform.x;
  game.input.setKey(Keys.D,true); for(int i=0;i<30;i++)game.step(1.0/60); game.input.setKey(Keys.D,false);
  if(p.transform.x<=x0+20)throw new AssertionError("chod w prawo nie dziala");
  double yGround=p.transform.y;
  game.input.setKey(Keys.SPACE,true); game.step(1.0/60); game.input.setKey(Keys.SPACE,false);
  for(int i=0;i<10;i++)game.step(1.0/60);
  if(p.transform.y>=yGround)throw new AssertionError("skok nie uniosl gracza");
  for(int i=0;i<80;i++)game.step(1.0/60);
  GameObject coin=game.find("Coin"); if(coin==null)throw new AssertionError("brak monety");
  p.setPosition(coin.transform.x,coin.transform.y); game.step(0); game.step(1.0/60);
  if(((GameMain)game).coins<1)throw new AssertionError("moneta nie zebrana");
  game.input.setKey(Keys.R,true); game.step(1.0/60); game.input.setKey(Keys.R,false); game.step(0);
  if(((GameMain)game).coins!=0)throw new AssertionError("restart nie wyzerowal monet");
  if(game.find("Player")==null)throw new AssertionError("restart nie odbudowal sceny");
  System.out.println("PLATFORMER OK");
 } finally { game.dispose(); }
}}`}, 'Smoke')).toContain('PLATFORMER OK');
}, 120000);

it('deadcells: walk, slash hit kills enemy, dash, spike damage', () => {
  const files = bundle(games['deadcells.json']);
  expect(runJava({...files, 'Smoke.java': `import engine.*;
public class Smoke { public static void main(String[] a) {
 GameCanvas.setSize(640,360); GameMain game=new GameMain();
 try {
  game.start(); game.step(0);
  GameObject p=game.find("Player"); GameObject e=game.find("Enemy");
  for(int i=0;i<40;i++)game.step(1.0/60);
  p.setPosition(e.transform.x-40,e.transform.y); game.step(0);
  game.input.setKey(Keys.X,true); game.step(1.0/60); game.input.setKey(Keys.X,false);
  GameObject slash=game.find("Slash"); if(slash==null)throw new AssertionError("slash nie powstal");
  for(int i=0;i<10;i++)game.step(1.0/60);
  Health hp=e.getComponent(Health.class);
  if(hp.current>=hp.max)throw new AssertionError("slash nie zadal obrazen");
  int before=((GameMain)game).totalEnemies;
  p.setPosition(480,360); game.step(0); game.step(1.0/60);
  Health php=p.getComponent(Health.class);
  if(php.current>=php.max)throw new AssertionError("kolce nie zadaly obrazen");
  game.input.setKey(Keys.SHIFT,true); game.step(1.0/60); game.input.setKey(Keys.SHIFT,false);
  for(int i=0;i<15;i++)game.step(1.0/60);
  System.out.println("DEADCELLS OK kills="+((GameMain)game).kills+" enemies="+before);
 } finally { game.dispose(); }
}}`}, 'Smoke')).toContain('DEADCELLS OK');
}, 120000);

it('survivor: spawner, autoshot hits enemy, gem pickup, level up', () => {
  const files = bundle(games['survivor.json']);
  expect(runJava({...files, 'Smoke.java': `import engine.*;
public class Smoke { public static void main(String[] a) {
 GameCanvas.setSize(640,360); GameMain game=new GameMain();
 try {
  game.start(); game.step(0);
  GameObject p=game.find("Player");
  for(int i=0;i<90;i++)game.step(1.0/60);
  boolean enemy=false; for(GameObject o:game.getObjects())if(o.hasComponent(Chaser.class))enemy=true;
  if(!enemy)throw new AssertionError("spawner nie stworzyl wroga");
  for(int i=0;i<600 && ((GameMain)game).kills<1;i++)game.step(1.0/60);
  if(((GameMain)game).kills<1)throw new AssertionError("autobron nie zabila wroga w 10 s");
  boolean gem=false; for(GameObject o:game.getObjects())if(o.hasComponent(XpGem.class))gem=true;
  if(!gem)throw new AssertionError("zabity wróg nie zostawil gema");
  GameObject gemObj=null; for(GameObject o:game.getObjects())if(o.hasComponent(XpGem.class))gemObj=o;
  int xp0=((GameMain)game).xp;
  p.setPosition(gemObj.transform.x,gemObj.transform.y); game.step(0); game.step(1.0/60);
  if(((GameMain)game).xp<=xp0)throw new AssertionError("gem nie zwiekszyl XP");
  double x0=p.transform.x;
  game.input.setKey(Keys.D,true); for(int i=0;i<20;i++)game.step(1.0/60); game.input.setKey(Keys.D,false);
  if(p.transform.x<=x0)throw new AssertionError("ruch top-down nie dziala");
  System.out.println("SURVIVOR OK xp="+((GameMain)game).xp);
 } finally { game.dispose(); }
}}`}, 'Smoke')).toContain('SURVIVOR OK');
}, 120000);

it('racing-2d: throttle, steering, gates in order, terrain drag', () => {
  const files = bundle(games['racing-2d.json']);
  expect(runJava({...files, 'Smoke.java': `import engine.*;
public class Smoke { public static void main(String[] a) {
 GameCanvas.setSize(640,360); GameMain game=new GameMain();
 try {
  game.start(); game.step(0);
  GameObject p=game.find("Player");
  KartController kart=p.getComponent(KartController.class);
  LapTracker lap=p.getComponent(LapTracker.class);
  if(!game.isRoad(p.transform.x,p.transform.y))throw new AssertionError("start nie na torze");
  game.input.setKey(Keys.W,true); for(int i=0;i<60;i++)game.step(1.0/60);
  if(kart.speed<100)throw new AssertionError("gaz nie rozpędza");
  game.input.setKey(Keys.W,false);
  game.input.setKey(Keys.A,true); for(int i=0;i<30;i++)game.step(1.0/60); game.input.setKey(Keys.A,false);
  GameObject gate0=null; for(GameObject o:game.getObjects()){Gate g=o.getComponent(Gate.class);if(g!=null&&g.index==0)gate0=o;}
  p.setPosition(gate0.transform.x,gate0.transform.y); game.step(0); game.step(1.0/60);
  if(lap.next!=1)throw new AssertionError("bramka 0 nie zaliczyła w kolejności");
  double roadSpeed=0; game.input.setKey(Keys.W,true); for(int i=0;i<120;i++)game.step(1.0/60); game.input.setKey(Keys.W,false);
  roadSpeed=kart.speed;
  p.setPosition(640,60); kart.speed=200; for(int i=0;i<30;i++)game.step(1.0/60);
  if(kart.speed>=roadSpeed)throw new AssertionError("trawa nie spowalnia");
  System.out.println("RACING OK");
 } finally { game.dispose(); }
}}`}, 'Smoke')).toContain('RACING OK');
}, 120000);
