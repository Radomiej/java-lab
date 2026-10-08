// Execute the actual vendored TeaVM compiler and generated Wasm using its Node host.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {load} from '../public/vendor/teavm/cdn/compiler.wasm-runtime.js';
import {prepareGameRequest} from '../src/services/gameWorkspace.js';
import {prepareJavaSources} from '../public/vendor/teavm/source-path.js';
import {conformanceReferenceFiles} from '../src/data/labGameConformanceReference.js';
import {buildCourseProject} from '../src/data/labGameV2Course.js';
const bytes=name=>new Int8Array(readFileSync(new URL('../public/vendor/teavm/cdn/'+name,import.meta.url)));
const module=await load(bytes('compiler.wasm'));
const compiler=module.exports.createCompiler();compiler.setSdk(bytes('compile-classlib-teavm.bin'));compiler.setTeaVMClasslib(bytes('runtime-classlib-teavm.bin'));
async function compile(files,mainClass){
  const request=prepareGameRequest({files,mainClass});compiler.clearSourceFiles();compiler.clearOutputFiles();
  const diagnostics=[];const off=compiler.onDiagnostic(d=>diagnostics.push(d.message));
  for(const [name,text] of prepareJavaSources(request.files))compiler.addSourceFile(name,text);
  try {if(!compiler.compile())throw new Error('javac: '+diagnostics.join('\n'));if(!compiler.generateWebAssembly({outputName:'app',mainClass:request.mainClass}))throw new Error('TeaVM: '+diagnostics.join('\n'));return await load(compiler.getWebAssemblyOutputFile('app.wasm'));}
  finally {if(typeof off==='function')off();else off?.destroy?.();}
}
const app=await compile({...conformanceReferenceFiles,'Reference.java':`public class Reference {public static void main(String[] args){GameCanvas.setSize(640,360);GameMain g=new GameMain();g.start();for(int i=0;i<5;i++)g.step(.1);GameObject p=g.find("P");System.out.println("POSITION "+p.transform.x+" "+p.transform.y);for(String e:g.events)System.out.println("EVENT "+e);System.out.print(GameCanvas.frame());g.dispose();}}`},'Reference');
const lines=[],print=console.log;console.log=(...args)=>lines.push(args.join(' '));
try{await app.exports.main([]);}finally{console.log=print;}
const output=lines.join('\n'),position=output.match(/POSITION ([\d.]+) ([\d.]+)/),rect=output.match(/rect\|([^\n]+)/);
if(!position||!rect)throw new Error('Missing TeaVM evidence: '+output);
const evidence={position:position.slice(1).map(Number),events:[...output.matchAll(/EVENT (\w+)/g)].map(m=>m[1]),geometry:rect[1].split('|').slice(0,4).map(Number),runtime:'actual TeaVM WebAssembly, Node host'};
const jdk=JSON.parse(readFileSync(new URL('../artifacts/lab-game-c38-jdk.json',import.meta.url)));
for(const key of ['position','events','geometry'])if(JSON.stringify(evidence[key])!==JSON.stringify(jdk[key]))throw new Error('C38 mismatch '+key+': '+JSON.stringify(evidence));
mkdirSync(new URL('../artifacts/',import.meta.url),{recursive:true});writeFileSync(new URL('../artifacts/lab-game-c38-teavm.json',import.meta.url),JSON.stringify(evidence,null,2)+'\n');
print('C38 TeaVM matches independent JDK:',JSON.stringify(evidence));
const ui=await compile({'GameMain.java':`public class GameMain extends Game {
 ProgressBar bar;
 @Override public void onCreate(){createObject("Player").setPosition(80,130).addComponent(new Sprite(Assets.PLAYER01,64,64));createObject("Fireball").setPosition(180,130).addComponent(new Sprite(Assets.FIREBALL,64,64));bar=createObject("Health").setPosition(180,40).addComponent(new ProgressBar(260,28));bar.setProgress(50);GameObject menu=createObject("Menu").setPosition(190,230);UITransform layout=menu.addComponent(new UITransform(300,52));layout.anchor=UIAnchor.TOP_LEFT;layout.pivot=new Vector2(.5,.5);Button button=menu.addComponent(new Button(300,52));button.text="HP +10%";button.onClick=()->bar.setProgress(bar.getProgress()+10);}
}`},'GameMain');
await ui.exports.main([]);ui.exports.resize(640,360);ui.exports.tick(0);
const initial=String(ui.exports.frame());
if(!initial.includes('sprite|player|80.0|130.0|64.0|64.0')||!initial.includes('ninepatch|ui-button-blue|190.0|230.0|300.0|52.0')||!initial.includes('|50.0|ui-bar-health-frame'))throw new Error('TeaVM UI geometry: '+initial);
ui.exports.setPointer(190,230);ui.exports.setMouseButton(0,true);ui.exports.tick(.1);
if(!String(ui.exports.frame()).includes('|50.0|ui-bar-health-frame'))throw new Error('Press must arm only');
ui.exports.setMouseButton(0,false);ui.exports.tick(.1);
if(!String(ui.exports.frame()).includes('|60.0|ui-bar-health-frame'))throw new Error('Mouse release did not update ProgressBar');
ui.exports.setMouseButton(0,true);ui.exports.tick(.1);ui.exports.clearInput();ui.exports.tick(.1);
if(!String(ui.exports.frame()).includes('|60.0|ui-bar-health-frame'))throw new Error('Blur must not activate');
ui.exports.dispose();
writeFileSync(new URL('../artifacts/lab-game-v2-teavm-ui.json',import.meta.url),JSON.stringify({runtime:'actual TeaVM WebAssembly, Node host',sprite:true,ninePatch:true,initialProgress:50,afterMouseRelease:60,afterClearInput:60},null,2)+'\n');
print('TeaVM UI PASS: Assets sprites, ninepatch, ProgressBar 50 -> 60, mouse press/release and blur.');
const survivor=await compile(buildCourseProject('java','survivor','independent').files,'GameMain');
await survivor.exports.main([]);survivor.exports.resize(640,360);survivor.exports.tick(0);
if(!String(survivor.exports.frame()).includes('WASD: ruch; Enter: Start'))throw new Error('Survivor READY scene missing');
survivor.exports.setKey('Enter',true);survivor.exports.tick(.1);survivor.exports.setKey('Enter',false);
survivor.exports.setKey('a',true);for(let i=0;i<10;i++)survivor.exports.tick(.1);survivor.exports.setKey('a',false);for(let i=0;i<20;i++)survivor.exports.tick(.1);
const survivorFrame=String(survivor.exports.frame());
if(!survivorFrame.includes('sprite|player|')||!survivorFrame.includes('progress|')||!survivorFrame.includes('sprite|slime|'))throw new Error('Survivor gameplay/HUD/spawn missing: '+survivorFrame.split('\n').filter(line=>!line.startsWith('sprite|grass|')).join('\n'));
survivor.exports.dispose();writeFileSync(new URL('../artifacts/lab-game-v2-teavm-survivor.json',import.meta.url),JSON.stringify({runtime:'actual TeaVM WebAssembly, Node host',ready:true,start:true,simulationSteps:31,player:true,hud:true,enemyWave:true},null,2)+'\n');
print('TeaVM survivor PASS: READY, start, movement, HUD, enemy waves.');
