import {gameCoreRuntimeFiles,gameCoreApiDescription} from './gameCoreRuntime.js';
import {gameExtrasRuntimeFiles} from './gameExtrasRuntime.js';
import {gamePhysicsRuntimeFiles} from './gamePhysicsRuntime.js';
import {gameControllersRuntimeFiles} from './gameControllersRuntime.js';
import {gameInputRuntimeFiles} from './gameInputRuntime.js';
import {assetsJavaSource} from '../../shared/lab-game-v2/assets/AssetsJava.js';
import {gameUiRuntimeFiles} from './gameUiRuntime.js';
import {gameSpatialRuntimeFiles} from './gameSpatialRuntime.js';
export const gameEngineRuntimeFiles={...gameCoreRuntimeFiles,...gameExtrasRuntimeFiles,...gamePhysicsRuntimeFiles,...gameControllersRuntimeFiles,...gameInputRuntimeFiles,...gameUiRuntimeFiles,...gameSpatialRuntimeFiles,'Assets.java':assetsJavaSource};
export const gameEngineApiDescription=[...gameCoreApiDescription,
  ...Object.keys({...gameExtrasRuntimeFiles,...gameControllersRuntimeFiles,...gameInputRuntimeFiles,...gameUiRuntimeFiles,...gameSpatialRuntimeFiles,'Assets.java':assetsJavaSource}).map(file=>({name:file.replace('.java',''),methods:file==='InputManager.java'?'getPointerPosition(), isMouseDown(button), isMousePressed(button), isMouseReleased(button)':'Ctrl+klik / F12',description:file==='InputManager.java'?'Klawiatura i mysz danej sceny. MOUSE_LEFT, MOUSE_MIDDLE, MOUSE_RIGHT. Pozycja w pikselach CSS canvas; przejścia przycisków trwają jedną klatkę.':'Biblioteka wspólnego API gry; dokumentacja pod ikoną książki.'}))];
