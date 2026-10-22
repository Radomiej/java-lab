// @vitest-environment node
import {test,expect} from 'vitest';
import {existsSync,mkdtempSync,mkdirSync,readdirSync,writeFileSync,rmSync} from 'node:fs';
import {homedir,tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {gameEngineRuntimeFiles} from './gameEngineRuntime.js';
function javaBin(name) {
  if (process.env.JAVA_HOME) return join(process.env.JAVA_HOME,'bin',name);
  const jdks = join(homedir(),'.jdks');
  if (existsSync(jdks)) for (const dir of readdirSync(jdks)) {
    const candidate=join(jdks,dir,'bin',`${name}${process.platform==='win32'?'.exe':''}`);
    if (existsSync(candidate)) return candidate;
  }
  return name;
}
test('Java circle emits centered geometry while legacy rectangles and collider sizes stay independent',()=>{
 const dir=mkdtempSync(join(tmpdir(),'lab-circle-'));try{
 const files={...gameEngineRuntimeFiles,'CircleTest.java':`import engine.*;
public class CircleTest {public static void main(String[] args){
 CharacterController2D directionTest=new CharacterController2D();directionTest.move(3,4,120);directionTest.move(0,0,120);Vector2 direction=directionTest.getDirection();if(Math.abs(direction.x-.6)>1e-9||Math.abs(direction.y-.8)>1e-9)throw new AssertionError("Direction");direction.x=99;if(directionTest.getDirection().x!=.6)throw new AssertionError("Direction copy");
 Game g=new Game();GameCanvas.setSize(640,360);
 GameObject p=g.createObject("Circle").setPosition(100,80);p.addComponent(ShapeRenderer.circle(12,"#f00"));p.addComponent(new CircleCollider2D(7));p.transform.scale.set(2,3);
 g.createObject("Box").setPosition(40,30).addComponent(new ShapeRenderer(40,20,"#fff"));
 Camera2D camera=g.createObject("Camera").addComponent(new Camera2D());camera.offsetX=20;camera.offsetY=10;
 g.start();g.step(0);String frame=GameCanvas.frame();
 if(!frame.contains("circle|80.0|70.0|12.0|#f00|0.0|2.0|3.0"))throw new AssertionError(frame);
 if(!frame.contains("rect|20.0|20.0|40.0|20.0|#fff"))throw new AssertionError(frame);
 if(p.getComponent(CircleCollider2D.class).radius!=7)throw new AssertionError("Collider changed");
 for(double r:new double[]{-1,Double.NaN,Double.POSITIVE_INFINITY}){try{ShapeRenderer.circle(r,"#fff");throw new AssertionError("Accepted radius");}catch(IllegalArgumentException expected){}}
 g.dispose();System.out.print("CIRCLE PASS");}}
`};
 const paths=Object.entries(files).map(([name,source])=>{const pkg=source.match(/package\s+([\w.]+);/)?.[1];const folder=pkg?join(dir,...pkg.split('.')):dir;mkdirSync(folder,{recursive:true});const p=join(folder,name);writeFileSync(p,source);return p;});
 execFileSync(javaBin('javac'),['--release','21','-d',dir,...paths],{timeout:120000});
 expect(execFileSync(javaBin('java'),['-cp',dir,'CircleTest'],{encoding:'utf8'})).toContain('CIRCLE PASS');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
