import {gameCoreRuntimeFiles,gameCoreApiDescription} from './gameCoreRuntime.js';
import {gameExtrasRuntimeFiles} from './gameExtrasRuntime.js';
import {gamePhysicsRuntimeFiles} from './gamePhysicsRuntime.js';
export const gameEngineRuntimeFiles={...gameCoreRuntimeFiles,...gameExtrasRuntimeFiles,...gamePhysicsRuntimeFiles};
export const gameEngineApiDescription=[...gameCoreApiDescription,
  ...Object.keys(gameExtrasRuntimeFiles).map(file=>({name:file.replace('.java',''),methods:'Ctrl+klik / F12',description:'Komponent biblioteki gry; dokumentacja w docs/game-engine.md.'}))];
