// @vitest-environment node
import { it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { gameEngineRuntimeFiles } from './gameEngineRuntime.js';

function binary(name) {
  const root = join(homedir(), '.jdks');
  for (const dir of existsSync(root) ? readdirSync(root) : []) {
    const bin = join(root, dir, 'bin', `${name}.exe`); if (existsSync(bin)) return bin;
  }
  return name;
}
it('executes the v2 Asset, collider, pause and ProgressBar API in real Java', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lab-v2-'));
  try {
    const files = { ...gameEngineRuntimeFiles, 'V2Test.java': `import engine.*;
public class V2Test {
 static class Player extends Component{}static class ArmoredPlayer extends Player{}
 static void check(boolean b,String m) {if(!b)throw new AssertionError(m);}
 static void near(double a,double b){check(Math.abs(a-b)<1e-6,a+" != "+b);}
 public static void main(String[] args) {
  check(new Sprite(Assets.FIREBALL).texture.equals("fireball"),"typed sprite");
  Game indexed=new Game();check(indexed.getObjectsWith(Player.class).isEmpty(),"empty index");GameObject first=indexed.createObject("first").addTag("player");Player marker=first.addComponent(new ArmoredPlayer());first.addComponent(new CircleCollider2D(10));GameObject second=indexed.createObject("second");second.addComponent(new Player());check(indexed.getObjectsWith(Player.class).size()==2,"inheritance index");check(indexed.getObjectsWith(Player.class,Collider2D.class).get(0)==first,"component intersection");indexed.getObjectsWith(Player.class).clear();check(indexed.getObjectsWith(Player.class).size()==2,"index snapshot");first.removeComponent(marker);check(indexed.getObjectsWith(Player.class).size()==1,"remove immediate");check(indexed.getObjectsWithTag("player").get(0)==first,"tag");first.removeTag("player");check(indexed.getObjectsWithTag("player").isEmpty(),"remove tag");second.destroy();check(indexed.getObjectsWith(Player.class).isEmpty(),"destroy index");indexed.dispose();
  InputManager mouse=new InputManager();mouse.setPointer(30,40);Vector2 copy=mouse.getPointerPosition();copy.x=900;near(mouse.getPointerPosition().x,30);
  mouse.setMouseButton(InputManager.MOUSE_RIGHT,true);mouse.setMouseButton(InputManager.MOUSE_RIGHT,true);check(mouse.isMousePressed(InputManager.MOUSE_RIGHT),"right pressed");mouse.endFrame();check(!mouse.isMousePressed(InputManager.MOUSE_RIGHT)&&mouse.isMouseDown(InputManager.MOUSE_RIGHT),"one-frame pressed");mouse.setMouseButton(InputManager.MOUSE_RIGHT,false);check(mouse.isMouseReleased(InputManager.MOUSE_RIGHT),"right released");mouse.clear();check(!mouse.isMouseReleased(InputManager.MOUSE_RIGHT),"blur clears edges");
  Game game=new Game(); GameObject hero=game.createObject("hero").setPosition(100,100);
  hero.addComponent(new Sprite(Assets.PLAYER01));hero.transform.scale.x=5;
  hero.addComponent(new CircleCollider2D(12));hero.addComponent(new CharacterController2D());
  hero.addComponent(new Component(){public void onUpdate(double dt){requireComponent(CharacterController2D.class).move(1,0,600);}});
  game.createObject("wall").setPosition(140,110).addComponent(new Collider2D(2,400));
  game.start();game.step(.1);near(hero.transform.x,127);
  game.pause();game.step(.1);near(hero.transform.x,127);near(game.time.elapsed,.1);near(game.time.unscaledElapsed,.2);
  ProgressBar pb=game.createObject("hp").addComponent(new ProgressBar(200,20));
  pb.setProgress(50);near(pb.getProgress(),50);pb.setValue(3,5);near(pb.getProgress(),60);
  pb.setProgress(120);near(pb.getProgress(),100);pb.setValue(3,0);near(pb.getProgress(),0);
  check(game.physics.findNearest(100,100,40,1)==hero,"nearest");
  final int[] clicks={0};Button button=game.createObject("button").setPosition(100,50).addComponent(new Button(120,40));button.onClick=()->clicks[0]++;
  game.input.setPointer(100,50);game.input.setMouseButton(0,true);game.step(.1);
  check(game.input.isMouseDown(0),"mouse down");game.input.setMouseButton(0,false);game.step(.1);check(clicks[0]==1,"mouse activates once");game.step(.1);check(clicks[0]==1,"mouse stays once");
  UITransform layout=game.createObject("anchored").setPosition(12,12).addComponent(new UITransform(200,18));layout.anchor=UIAnchor.TOP_LEFT;near(layout.getBounds().left,12);near(layout.getBounds().bottom,30);
  Camera2D camera=game.createObject("camera").addComponent(new Camera2D());GameObject target=game.createObject("target").setPosition(600,400);camera.follow(target);GameCanvas.setSize(640,360);near(camera.worldToScreen(new Vector2(600,400)).x,320);near(camera.screenToWorld(new Vector2(320,180)).y,400);
  game.dispose();
  Game tweenGame=new Game();GameObject targetTween=tweenGame.createObject("target");tweenGame.start();final int[] finished={0};Tween tween=Tweens.position(targetTween,20,0,.2).onComplete(()->finished[0]++);tweenGame.step(.1);near(targetTween.transform.x,10);tweenGame.pause();tweenGame.step(.1);near(targetTween.transform.x,10);tweenGame.resume();tweenGame.step(.1);near(targetTween.transform.x,20);check(finished[0]==1,"natural completion once");tween.onComplete(()->finished[0]++);check(finished[0]==2,"late callback");Tweens.scale(targetTween,2,2,0).onComplete(()->finished[0]++);near(targetTween.transform.scale.x,2);check(finished[0]==3,"zero duration callback");Tween cancelled=Tweens.rotation(targetTween,3,1).onComplete(()->finished[0]++);cancelled.cancel();tweenGame.step(.1);check(finished[0]==3,"cancel ignores callback");targetTween.transform.visualOffset.set(5,7);Tween shake=Tweens.shake(targetTween,10,1);tweenGame.step(.1);shake.cancel();near(targetTween.transform.visualOffset.x,5);near(targetTween.transform.visualOffset.y,7);Tween uiTween=Tweens.position(targetTween,40,0,.1);uiTween.updateMode="UI";tweenGame.pause();tweenGame.step(.1);near(targetTween.transform.x,40);tweenGame.dispose();
  for(int count:new int[]{100,1000,5000}){Game many=new Game();for(int i=0;i<count;i++)many.createObject().setPosition((i%100)*100,(i/100)*100).addComponent(new Trigger2D(20,20));many.start();many.step(.1);check(many.physics.narrowPhaseTests<count,"spatial hash avoids all pairs: "+count);many.dispose();}
  System.out.println("V2 PASS");
  Game contacts=new Game();GameObject contactPlayer=contacts.createObject("player");contactPlayer.addComponent(new Player());contactPlayer.addComponent(new CircleCollider2D(10));Trigger2D contactSensor=contacts.createObject("sensor").addComponent(new Trigger2D(40,40));final int[] entered={0};Runnable off=contactSensor.onContactEnter(Player.class,()->entered[0]++);contacts.start();contacts.step(0);contacts.step(.1);check(entered[0]==1,"enter once");contactPlayer.setPosition(100,100);contacts.step(.1);contactPlayer.setPosition(0,0);contacts.step(.1);check(entered[0]==2,"reenter");off.run();contactPlayer.setPosition(100,100);contacts.step(.1);contactPlayer.setPosition(0,0);contacts.step(.1);check(entered[0]==2,"unsubscribe");contacts.dispose();
 }
}` };
    const paths = Object.entries(files).map(([name, source]) => {
      const pkg = source.match(/package\s+([\w.]+);/)?.[1]; const folder = pkg ? join(dir, ...pkg.split('.')) : dir;
      mkdirSync(folder, { recursive: true }); const path = join(folder, name); writeFileSync(path, source); return path;
    });
    execFileSync(binary('javac'), ['--release', '21', '-encoding', 'UTF-8', '-d', dir, ...paths], { timeout: 30000 });
    expect(execFileSync(binary('java'), ['-cp', dir, 'V2Test'], { encoding: 'utf8', timeout: 15000 })).toContain('V2 PASS');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
