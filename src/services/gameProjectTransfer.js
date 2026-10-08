import { gameEngineRuntimeFiles } from '../data/gameEngineRuntime.js';
export const MAX_GAME_PROJECT_BYTES=262144;
export const ENGINE_API_VERSION='2.0.0';
export function validateJavaFile(name,content) {
  if(['README.md','CHECKPOINT.md','REPORT.md'].includes(name)&&typeof content==='string')return;
  if(typeof name!=='string'||!/^[A-Za-z][A-Za-z0-9_]*\.java$/.test(name)||['Main.java','StudentGame.java','GameLauncher.java'].includes(name)||Object.hasOwn(gameEngineRuntimeFiles,name)||typeof content!=='string') throw new Error('Niedozwolony plik Java lub nazwa zarezerwowana przez silnik.');
}
export function normalizeGameProject(value) {
  if(!value||value.version!==1||value.mainClass!=='GameMain'||!value.files||typeof value.files!=='object'||Array.isArray(value.files)||!Object.hasOwn(value.files,'GameMain.java')||Object.keys(value.files).length>100)throw new Error('Nieprawidłowy projekt. Wymagany format 1 i GameMain.java.');
  for(const [name,code] of Object.entries(value.files))validateJavaFile(name,code);
  if(value.engineApiVersion!==undefined&&value.engineApiVersion!==ENGINE_API_VERSION)throw new Error('Nieobsługiwana wersja API silnika.');
  const result={version:1,engineApiVersion:ENGINE_API_VERSION,mainClass:'GameMain',files:{...value.files}};
  if(new TextEncoder().encode(JSON.stringify(result)).length>MAX_GAME_PROJECT_BYTES)throw new Error('Projekt jest zbyt duży (maksymalnie 256 KiB).');
  return result;
}
export function serializeGameProject(project){return JSON.stringify(normalizeGameProject(project));}
// JSON.parse discards duplicate members. Scan valid JSON before accepting it.
function rejectDuplicateMembers(text) {
  let index = 0;
  const whitespace = () => { while (/\s/.test(text[index] ?? '') && index < text.length) index++; };
  const string = () => {
    const start = index++;
    while (index < text.length) {
      if (text[index] === '\\') { index += 2; continue; }
      if (text[index++] === '"') return JSON.parse(text.slice(start, index));
    }
  };
  const value = (depth = 0) => {
    if (depth > 100) throw new Error('Projekt JSON jest zbyt głęboko zagnieżdżony.');
    whitespace();
    if (text[index] === '"') { string(); return; }
    if (text[index] === '{') {
      index++; whitespace(); const keys = new Set();
      while (text[index] !== '}') {
        const key = string();
        if (keys.has(key)) throw new Error(`Powtórzony klucz JSON: ${key}`);
        keys.add(key); whitespace(); index++; value(depth + 1); whitespace();
        if (text[index] !== ',') break;
        index++; whitespace();
      }
      index++; return;
    }
    if (text[index] === '[') {
      index++; whitespace();
      while (text[index] !== ']') {
        value(depth + 1); whitespace(); if (text[index] !== ',') break; index++;
      }
      index++; return;
    }
    while (index < text.length && !/[\s,}\]]/.test(text[index])) index++;
  };
  value();
}
export function parseGameProject(text) {
  if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_GAME_PROJECT_BYTES)throw new Error('Projekt jest zbyt duży.');
  const parsed = JSON.parse(text);
  rejectDuplicateMembers(text);
  if(parsed.engineApiVersion!==ENGINE_API_VERSION)throw new Error('Projekt wymaga engineApiVersion 2.0.0. Starsze API nie jest obsługiwane.');
  return normalizeGameProject(parsed);
}
