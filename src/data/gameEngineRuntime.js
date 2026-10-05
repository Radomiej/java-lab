import {gameCoreRuntimeFiles,gameCoreApiDescription} from './gameCoreRuntime.js';
import {gameExtrasRuntimeFiles} from './gameExtrasRuntime.js';
import {gamePhysicsRuntimeFiles} from './gamePhysicsRuntime.js';
import {gameControllersRuntimeFiles} from './gameControllersRuntime.js';
import {gameInputRuntimeFiles} from './gameInputRuntime.js';
export const gameEngineRuntimeFiles={...gameCoreRuntimeFiles,...gameExtrasRuntimeFiles,...gamePhysicsRuntimeFiles,...gameControllersRuntimeFiles,...gameInputRuntimeFiles};
export const gameEngineApiDescription=[...gameCoreApiDescription,
  ...Object.keys({...gameExtrasRuntimeFiles,...gameControllersRuntimeFiles,...gameInputRuntimeFiles}).map(file=>({name:file.replace('.java',''),methods:'Ctrl+klik / F12',description:'Komponent biblioteki gry; dokumentacja pod ikoną książki.'}))];
