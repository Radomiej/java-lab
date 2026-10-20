import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir,homedir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {gameEngineRuntimeFiles} from '../src/data/gameEngineRuntime.js';
import {gameIntroPages} from '../src/data/gameIntroPages.js';
const jdks=process.env.JAVA_HOME?[process.env.JAVA_HOME]:readdirSync(join(homedir(),'.jdks')).map(name=>join(homedir(),'.jdks',name));
const bin=name=>jdks.map(path=>join(path,'bin',name+(process.platform==='win32'?'.exe':''))).find(existsSync)||name;
test('all introduction snippets compile against the real engine; coordinates, render size and movement agree with the lesson',()=>{
 const dir=mkdtempSync(join(tmpdir(),'java-game-intro-'));
 try{
  const engine=join(dir,'engine');mkdirSync(engine);
  const paths=Object.entries(gameEngineRuntimeFiles).map(([name,source])=>{const path=join(engine,name);writeFileSync(path,source);return path;});
  execFileSync(bin('javac'),['--release','21','-encoding','UTF-8','-d',engine,...paths],{timeout:30000,stdio:'pipe'});
  const examples=[];
  for(const [index,page] of Object.values(gameIntroPages).flat().entries()){
   if(!page.code)continue;
   let name,source=page.code;
   if(source.startsWith('public class '))name=source.match(/public class (\w+)/)[1];
   else {
    name='IntroExample'+index;
    if(source.includes('gameObject.'))source=`public class ${name} extends Component {public void onUpdate(double delta){${source}}}`;
    else {
     let context='';
     if(source.includes('player.')&&!source.includes('GameObject player ='))context+='GameObject player=createObject("Player");player.setPosition(100,150);player.addComponent(new ShapeRenderer(40,24,"#4b9483"));';
     if(source.includes('shape.addComponent'))context+='GameObject shape=createObject("Shape"),hero=createObject("Hero"),label=createObject("Label");';
     source=`public class ${name} extends Game {public void onCreate(){${context}${source}\n}}`;
    }
   }
   const path=join(dir,name+'.java');writeFileSync(path,'import engine.*;\n'+source);examples.push(path);
  }
  const check=join(dir,'IntroCheck.java');
  writeFileSync(check,`import engine.*;
public class IntroCheck {
 static void near(double a,double b){if(Math.abs(a-b)>0.00001)throw new AssertionError(a+" != "+b);}
 static Game make(Component behavior){return new Game(){public void onCreate(){GameObject p=createObject("Player");p.setPosition(100,150);p.addComponent(new ShapeRenderer(40,24,"#4b9483"));p.addComponent(behavior);}};}
 public static void main(String[] args){
  Game blank=new Game(){public void onCreate(){createObject("Player").setPosition(100,150);}};
  blank.start();blank.step(0);if(GameCanvas.frame().contains("rect|"))throw new AssertionError("Invisible object rendered");blank.dispose();
  Game g=make(new MoveRight());g.start();g.step(0.05);GameObject p=g.find("Player");near(p.transform.x,101);near(p.transform.y,150);
  if(!GameCanvas.frame().contains("rect|101.0|150.0|40.0|24.0|"))throw new AssertionError("Renderer position or size differs");
  p.transform.x=220;g.step(0);near(p.transform.x,220);near(p.transform.y,150);
  p.getComponent(ShapeRenderer.class).color="#d9973b";g.step(0);near(p.transform.x,220);if(!GameCanvas.frame().contains("#d9973b"))throw new AssertionError("Color missing");g.dispose();
  Game input=make(new MoveWithD());input.start();input.step(0.05);near(input.find("Player").transform.x,100);
  input.input.setKey("d",true);input.step(0.05);near(input.find("Player").transform.x,106);input.input.setKey("d",false);input.step(0.05);near(input.find("Player").transform.x,106);input.dispose();
  Game controlled=new Game(){public void onCreate(){GameObject p=createObject("Player");p.setPosition(100,150);p.addComponent(new CircleCollider2D(12));p.addComponent(new CharacterController2D());p.addComponent(new PlayerController());}};
  controlled.start();controlled.input.setKey("d",true);controlled.step(0.05);near(controlled.find("Player").transform.x,106);near(controlled.find("Player").transform.y,150);controlled.dispose();
  System.out.print("PASS");
 }
}`);examples.push(check);
  execFileSync(bin('javac'),['--release','21','-encoding','UTF-8','-cp',engine,'-sourcepath',dir,'-d',dir,...examples],{timeout:30000,stdio:'pipe'});
  assert.equal(execFileSync(bin('java'),['-cp',dir+(process.platform==='win32'?';':':')+engine,'IntroCheck'],{encoding:'utf8',timeout:10000}),'PASS');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
