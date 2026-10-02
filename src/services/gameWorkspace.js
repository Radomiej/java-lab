import {gameEngineRuntimeFiles} from '../data/gameEngineRuntime.js';

export function gameEditorFiles(files) {
  return Object.fromEntries(Object.entries(files).filter(([name]) =>
    name !== 'Main.java' && name !== 'GameLauncher.java' && !Object.hasOwn(gameEngineRuntimeFiles,name)
      && !(name === 'StudentGame.java' && Object.hasOwn(files,'GameMain.java'))
  ).map(([name,source]) => [name === 'StudentGame.java' ? 'GameMain.java' : name,
    source.replace(/\bStudentGame\b/g,'GameMain').replace(/^\s*import engine\.[\w*]+;\s*$/gm,'').trimStart()]));
}

const launcher = `package lab;
import engine.*;
import org.teavm.jso.JSExport;
public class GameLauncher {
    private static GameMain game;
    public static void main(String[] args) { game = new GameMain(); game.start(); }
    @JSExport public static void tick(double delta) { game.step(delta); }
    @JSExport public static String frame() { return GameCanvas.frame(); }
    @JSExport public static void setKey(String key, boolean pressed) { Input.setKey(key, pressed); }
    @JSExport public static void resize(double width, double height) { GameCanvas.setSize(width, height); }
    @JSExport public static void dispose() { game.dispose(); }
}
`;

export function prepareGameRequest(request) {
  if (!request.files?.['GameMain.java']) return request;
  const files = {...gameEngineRuntimeFiles};
  for (const [name, source] of Object.entries(gameEditorFiles(request.files))) {
    // All student files share a namespace; engine remains a separate library.
    const declaration = /^\s*package\s+([\w.]+)\s*;/m.exec(source);
    if (declaration && declaration[1] !== 'lab') throw new Error('Pliki gry używają wspólnego pakietu lab. Usuń własną deklarację package.');
    files[name] = `package lab;\nimport engine.*;\n${source.replace(/^\s*package\s+lab\s*;/m,'')}`;
  }
  files['GameLauncher.java'] = launcher;
  const entry = request.mainClass === 'Main' || request.mainClass === 'GameMain' || request.mainClass === 'lab.GameLauncher'
    ? 'GameLauncher' : request.mainClass.replace(/^lab\./,'');
  return {...request,files,mainClass:`lab.${entry}`};
}
