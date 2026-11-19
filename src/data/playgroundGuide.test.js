// @vitest-environment node
import {it, expect} from 'vitest';
import {readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync} from 'node:fs';
import {tmpdir, homedir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {gameEngineRuntimeFiles} from './gameEngineRuntime.js';
import {engineGuide} from './engineGuide.js';

function javaBin(name) {
  if (process.env.JAVA_HOME) return join(process.env.JAVA_HOME,'bin',name);
  const jdks = join(homedir(),'.jdks');
  if (existsSync(jdks)) for (const dir2 of readdirSync(jdks)) {
    const candidate=join(jdks,dir2,'bin',`${name}${process.platform==='win32'?'.exe':''}`);
    if (existsSync(candidate)) return candidate;
  }
  return name;
}
function compileJava(files) {
  const dir2=mkdtempSync(join(tmpdir(),'java-lab-guide-'));
  try {
    const paths=Object.entries(files).filter(([file])=>file.endsWith('.java')).map(([file,source])=>{
      const pkg=source.match(/package\s+([\w.]+);/)?.[1];
      const folder=pkg?join(dir2,...pkg.split('.')):dir2;
      mkdirSync(folder,{recursive:true});
      const path=join(folder,file.split('/').pop());writeFileSync(path,source);return path;
    });
    const argFile=join(dir2,'sources.txt');writeFileSync(argFile,paths.map(path=>'"'+path.replaceAll('\\','/')+'"').join('\n'));
    execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',dir2,'@'+argFile],{encoding:'utf8',timeout:600000});
  } finally {rmSync(dir2,{recursive:true,force:true});}
}

const doc = readFileSync(join(import.meta.dirname, '../../docs/playground-przewodnik.md'), 'utf8');

it('engineGuide zawiera wpisy Playground i Screen', () => {
  const names = engineGuide.map((e) => e.name);
  for (const name of ['Struktura projektu', 'Pierwsza gra', 'Presety i JSON', 'Screen']) {
    expect(names, `brak wpisu ${name}`).toContain(name);
  }
  const camera = engineGuide.find((e) => e.name === 'Camera2D');
  expect(camera.fields).toContain('followX');
  expect(camera.fields).toContain('followY');
});

it('przewodnik dokumentuje wymagane sekcje', () => {
  for (const fragment of ['GameMain.java', 'engineApiVersion', '256 KiB', 'Screen.width', 'onLateUpdate', 'Camera2D', 'TileMap', 'Presety i JSON', 'platformer-mario', 'survivor', 'racing-2d']) {
    expect(doc, `brak fragmentu ${fragment}`).toContain(fragment);
  }
});

it('przykład „Pierwsza gra" z przewodnika kompiluje się z silnikiem', () => {
  const blocks = [...doc.matchAll(/```java\r?\n([\s\S]*?)```/g)].map((m) => m[1]);
  expect(blocks.length).toBeGreaterThanOrEqual(2);
  const files = {...gameEngineRuntimeFiles};
  for (const block of blocks.slice(0, 2)) {
    const name = block.match(/public class (\w+)/)?.[1];
    expect(name, 'brak klasy publicznej w bloku').toBeTruthy();
    files[`${name}.java`] = 'import engine.*;\n' + block;
  }
  expect(() => compileJava(files)).not.toThrow();
}, 120000);
