// @vitest-environment node
import {it, expect} from 'vitest';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync, readdirSync, existsSync, readFileSync} from 'node:fs';
import {tmpdir, homedir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {gameEngineRuntimeFiles} from './gameEngineRuntime.js';
import {allLessons} from './curriculum.js';
import {buildGameCourseContract} from '../../tools/course-contract.js';

function javaBin(name) {
  if (process.env.JAVA_HOME) return join(process.env.JAVA_HOME,'bin',name);
  const jdks = join(homedir(),'.jdks');
  if (existsSync(jdks)) for (const dir of readdirSync(jdks)) {
    const candidate=join(jdks,dir,'bin',`${name}${process.platform==='win32'?'.exe':''}`);
    if (existsSync(candidate)) return candidate;
  }
  return name;
}
export function runJava(files, main='EngineTests') {
  const dir=mkdtempSync(join(tmpdir(),'java-lab-tests-'));
  try {
    const paths=Object.entries(files).map(([file,source])=>{
      const pkg=source.match(/package\s+([\w.]+);/)?.[1];
      const folder=pkg?join(dir,...pkg.split('.')):dir;
      mkdirSync(folder,{recursive:true});
      const path=join(folder,file.split('/').pop());writeFileSync(path,source);return path;
    });
    execFileSync(javaBin('javac'),['--release','21','-encoding','UTF-8','-d',dir,...paths],{encoding:'utf8',timeout:30000});
    return execFileSync(javaBin('java'),['-cp',dir,main],{encoding:'utf8',timeout:15000});
  } finally {rmSync(dir,{recursive:true,force:true});}
}

it('runs circle geometry, swept bullets, AI, tween and render layering in real Java',()=>{
  const tests=`import engine.*;
public class EngineTests {
  static void check(boolean ok,String label) { if(!ok) throw new AssertionError(label); }
  static void near(double a,double b,String label) { check(Math.abs(a-b)<0.001,label+": "+a); }
  static GameObject circle(Game g,String name,double x,double y,double r) {
    GameObject o=g.createObject(name).setPosition(x,y);o.addComponent(new CircleCollider2D(r));return o;
  }
  public static void main(String[] args) {
    Game g=new Game();
    GameObject a=circle(g,"a",100,100,10),b=circle(g,"b",120,100,10);
    check(Physics2D.overlaps(a,b),"circle tangent");b.transform.x=121;check(!Physics2D.overlaps(a,b),"circle gap");
    GameObject box=g.createObject("box").setPosition(150,150);box.addComponent(new Sprite("stone",20,20));box.addComponent(new Collider2D());
    a.setPosition(132,132);check(!Physics2D.overlaps(a,box),"rounded corner rejects AABB false positive");
    a.setPosition(135,145);check(Physics2D.overlaps(a,box),"circle box edge");
    boolean rejected=false;try { new CircleCollider2D(0); } catch(IllegalArgumentException e){rejected=true;}check(rejected,"invalid radius");
    g.dispose();
    Game ai=new Game();GameObject target=ai.createObject("target").setPosition(200,100);
    GameObject mob=circle(ai,"mob",100,100,10);mob.addComponent(new CharacterController2D());
    FollowTarget2D follow=mob.addComponent(new FollowTarget2D(target));follow.speed=100;follow.stopDistance=0;
    ai.start();ai.step(0.1);near(mob.transform.x,110,"follow");
    follow.enabled=false;FleeTarget2D flee=mob.addComponent(new FleeTarget2D(target));flee.speed=100;ai.step(0.1);near(mob.transform.x,100,"flee");
    flee.enabled=false;FlankTarget2D flank=mob.addComponent(new FlankTarget2D(target));flank.radius=100;ai.step(0.1);check(mob.transform.y!=100,"flank");
    target.destroy();double x=mob.transform.x,y=mob.transform.y;ai.step(0.1);near(mob.transform.x,x,"missing target x");near(mob.transform.y,y,"missing target y");ai.dispose();
    Game bullets=new Game();GameObject owner=circle(bullets,"owner",50,100,10);GameObject victim=circle(bullets,"victim",200,100,10);
    final int[] hits={0};victim.addComponent(new Component(){public void onTrigger(GameObject other){hits[0]++;}});
    GameObject shot=bullets.createObject("shot").setPosition(50,100);shot.addComponent(new Projectile2D(1,0,3000,2,owner));
    bullets.start();bullets.step(0.1);check(shot.destroyed,"swept bullet destroyed");check(hits[0]==1,"single hit ignoring owner");bullets.dispose();
    Game anim=new Game();GameObject o=anim.createObject("o").setPosition(100,100);o.addComponent(new Sprite());anim.start();
    Tweens.position(o,200,100,1);anim.step(0.1);near(o.transform.x,110,"tween time");
    Tween shake=Tweens.shake(o,5,0.2);anim.step(0.1);shake.cancel();near(o.transform.x,120,"cancel restores shake base");
    for(int i=0;i<10;i++)anim.step(0.1);near(o.transform.x,200,"tween ends");
    Tweens.scale(o,2,2,0);near(o.transform.scale.x,2,"instant tween");
    Camera2D camera=anim.createObject("camera").addComponent(new Camera2D());camera.shake(8,0.2);anim.step(0.1);
    near(o.transform.x,200,"camera does not move simulation");anim.dispose();
    Game layers=new Game();layers.createObject("ground").addComponent(new TileMap("grass",32));
    layers.createObject("player").addComponent(new Sprite());
    layers.createObject("hud").addComponent(new Component(){public void onDrawUI(){GameCanvas.drawText("HUD",10,20,"white");}});
    layers.start();layers.step(0.1);String frame=GameCanvas.frame();
    check(frame.indexOf("sprite|grass")<frame.indexOf("sprite|player"),"background first");
    check(frame.indexOf("sprite|player")<frame.indexOf("text|HUD"),"HUD last");layers.dispose();
    System.out.println("PASS engine");
  }
}`;
  expect(runJava({...gameEngineRuntimeFiles,'EngineTests.java':tests})).toContain('PASS engine');
},45000);

it('supports top-down running, platformer grounding and input bindings added during play',()=>{
  const source=`import engine.*;
public class ControllerTests {
 static void check(boolean ok,String label){if(!ok)throw new AssertionError(label);}
 public static void main(String[] args){
  Game g=new Game();GameObject p=g.createObject("player").setPosition(100,100);Sprite sprite=p.addComponent(new Sprite());
  TopDownCharacterController2D c=p.addComponent(new TopDownCharacterController2D());
  Component movement=p.addComponent(new Component(){public void onUpdate(double dt){c.move(1,1);}});
  g.start();g.step(0.1);check(c.isWalk()&&!c.isRunning(),"walking state");
  check(Math.abs(Math.hypot(c.velocity.x,c.velocity.y)-120)<0.001,"diagonal normalized");
  c.setRunning(true);g.step(0.1);check(c.isRunning()&&!c.isWalk(),"running persists in move(x,y)");
  check(Math.abs(Math.hypot(c.velocity.x,c.velocity.y)-240)<0.001,"running speed");
  movement.enabled=false;g.step(0.1);check(!c.isRunning()&&!c.isWalk(),"idle state after reset");
  c.walk(-1,0);check(sprite.flipX,"automatic flip");
  int[] single={0},doubleTap={0},idle={0},late={0};
  p.addComponent(new KeyPressed("W",()->{single[0]++;g.debug=true;}));
  p.addComponent(new KeyDoublePressed("D",()->{doubleTap[0]++;c.setRunning(true);}));
  p.addComponent(new NoneOfKeysPressed(new String[]{"W","A","S","D"},()->idle[0]++));
  Input.setKey("w",true);g.step(0.05);g.debug=false;g.step(0.05);check(single[0]==1&&!g.debug,"pressed once, uppercase key");
  Input.setKey("w",false);Input.setKey("d",true);g.step(0.05);g.step(0.05);check(doubleTap[0]==0,"holding not double press");
  Input.setKey("d",false);g.step(0.05);Input.setKey("D",true);g.step(0.05);check(doubleTap[0]==1,"double press");
  Input.setKey("d",false);g.step(0.05);Input.setKey("d",true);g.step(0.05);Input.setKey("d",false);
  for(int i=0;i<4;i++)g.step(0.1);Input.setKey("d",true);g.step(0.01);check(doubleTap[0]==1,"expired double press window");
  Input.setKey("d",false);int before=idle[0];Input.setKey("a",true);g.step(0.05);check(idle[0]==before,"idle callback blocked while key held");
  Input.setKey("a",false);g.step(0.05);check(idle[0]==before+1,"none of keys callback");
  KeyPressed binding=g.createObject("controls").addComponent(new KeyPressed("2",()->late[0]++));Input.setKey("2",true);g.step(0.05);check(late[0]==1,"late component initialized");
  Input.setKey("2",false);g.step(0.05);binding.enabled=false;Input.setKey("2",true);g.step(0.05);check(late[0]==1,"disabled binding");Input.setKey("2",false);g.dispose();
  Game platform=new Game();GameObject hero=platform.createObject("hero").setPosition(200,174);hero.addComponent(new Sprite());hero.addComponent(new Collider2D(false));
  PlatformerCharacterController2D pc=hero.addComponent(new PlatformerCharacterController2D());
  GameObject floor=platform.createObject("floor").setPosition(200,200);floor.addComponent(new Sprite("stone",200,20));floor.addComponent(new Collider2D());
  GameObject ceiling=platform.createObject("ceiling").setPosition(200,130);ceiling.addComponent(new Sprite("stone",100,20));ceiling.addComponent(new Collider2D());
  platform.start();check(pc.isGrounded(),"initial ground");check(pc.jump(),"jump from floor");check(!pc.jump(),"no double jump");
  platform.step(0.1);check(Math.abs(hero.transform.y-156)<0.01 && pc.velocity.y==0,"ceiling stops upward velocity");
  for(int i=0;i<10;i++)platform.step(0.1);check(pc.isGrounded()&&Math.abs(hero.transform.y-174)<0.01,"land on platform");
  floor.destroy();ceiling.destroy();platform.step(0.1);check(!pc.isGrounded()&&hero.transform.y>174,"gravity after floor removed");platform.dispose();
  Game debug=new Game();GameObject sensor=debug.createObject("sensor").setPosition(50,60);sensor.addComponent(new CircleCollider2D(10)).isTrigger=true;
  sensor.addComponent(new Sprite("coin"));sensor.transform.scale.x=3;debug.debug=true;debug.start();debug.step(0);
  check(GameCanvas.frame().contains("debug|true"),"Java debug flag");check(GameCanvas.frame().contains("collider|circle|50.0|60.0|20.0|20.0|true"),"physics geometry unaffected by scale");debug.dispose();
  System.out.println("PASS controllers, bindings and debug");
 }
}`;
  expect(runJava({...gameEngineRuntimeFiles,'ControllerTests.java':source},'ControllerTests')).toContain('PASS controllers, bindings and debug');
},45000);

it('compiles and runs every game solution and its Java behavior assertions',()=>{
  const files={...gameEngineRuntimeFiles};const calls=[];
  const tasks=allLessons.filter(lesson=>lesson.track==='game-dev').flatMap(lesson=>lesson.tasks);
  for(const [index,task] of tasks.entries()) {
    const pkg=`testcase${index}`;
    for(const [name,source] of Object.entries({...task.solutionFiles,...task.javaTestFiles}))
      files[`${pkg}/${name}`]=`package ${pkg};\nimport engine.*;\n${source}`;
    calls.push(`${pkg}.JavaTest.main(args);`);
  }
  files['AllSolutions.java']=`public class AllSolutions { public static void main(String[] args) { ${calls.join('\n')} System.out.println("PASS ${tasks.length} solutions"); } }`;
  expect(runJava(files,'AllSolutions')).toContain(`PASS ${tasks.length} solutions`);
},45000);

it('combines both sprite flips with scale and preserves shooting direction after stopping',()=>{
  const task=allLessons.find(l=>l.order===405).tasks[0];
  const files={...gameEngineRuntimeFiles};
  for(const [name,source] of Object.entries(task.solutionFiles)) files[name]=`import engine.*;\n${source}`;
  files['FlipTests.java']=`import engine.*;
public class FlipTests {
    static void check(boolean ok,String message){if(!ok)throw new AssertionError(message);}
    public static void main(String[] args){
        Game visual=new Game();
        GameObject object=visual.createObject("sprite").setPosition(100,100);
        Sprite sprite=object.addComponent(new Sprite());
        sprite.flipX=true; sprite.flipY=true;
        object.transform.scale.x=2; object.transform.scale.y=3;
        visual.start(); visual.step(0);
        check(GameCanvas.frame().contains("sprite|player|100.0|100.0|32.0|32.0|0.0|-2.0|-3.0"),"both flips reach renderer");
        check(object.transform.scale.x==2 && object.transform.scale.y==3,"flips leave scale unchanged");
        sprite.flipX=false; visual.step(0);
        check(GameCanvas.frame().contains("|0.0|2.0|-3.0"),"independent vertical flip"); visual.dispose();
        GameMain game=new GameMain(); game.start();
        Input.setKey("w",true); game.step(0.1); Input.setKey("w",false); game.step(0.1);
        game.player.getComponent(Sprite.class).flipY=true;
        Input.setKey("Space",true); game.step(0.1);
        Projectile2D shot=null;
        for(GameObject candidate:game.getObjects())if(candidate.hasComponent(Projectile2D.class))shot=candidate.getComponent(Projectile2D.class);
        check(shot!=null && shot.direction.x==0 && shot.direction.y==-1,"last aim survives stopping and flipY");
        check(game.player.transform.rotation.z==0 && game.enemy.transform.rotation.z==0,"upright player and enemy");
        check(game.enemy.getComponent(Sprite.class).flipX,"enemy mirrors toward player");
        Input.setKey("Space",false); game.dispose(); System.out.println("PASS flips and aim");
    }
}`;
  expect(runJava(files,'FlipTests')).toContain('PASS flips and aim');
},45000);

it('starts the first guided game as a working walking example',()=>{
  const task=allLessons.find(l=>l.order===401).tasks[0];
  const files={...gameEngineRuntimeFiles};
  for(const [file,source] of Object.entries({...task.starterFiles,...task.javaTestFiles}))files[file]=`import engine.*;\n${source}`;
  expect(runJava(files,'JavaTest')).toContain('PASS');
},45000);

it('runs the same flat-file course bundle that the TeaVM browser diagnostic consumes',()=>{
  const request=buildGameCourseContract(allLessons.filter(l=>l.track==='game-dev').flatMap(l=>l.tasks),gameEngineRuntimeFiles);
  const output=runJava(request.files,request.mainClass);
  expect(output.match(/^PASS game-/gm)).toHaveLength(allLessons.filter(l => l.track === 'game-dev').flatMap(l => l.tasks).length);
},45000);

it('preserves the existing physics contract including thin walls and paired callbacks',()=>{
  const html=readFileSync(new URL('../../tools/components-2d-check.html',import.meta.url),'utf8');
  const source=html.match(/const source = `([\s\S]*?)`;/)[1];
  expect(runJava({...gameEngineRuntimeFiles,'Main.java':source},'Main')).toContain('PASS');
},45000);

it('reports one projectile hit for both creation orders, respects rectangular sweeps and tall obstacles',()=>{
  const source=`import engine.*;
public class ReviewTests {
 static void check(boolean ok,String label){if(!ok)throw new IllegalArgumentException(label);}
 static GameObject target(Game g){GameObject o=g.createObject("target").setPosition(100,100);o.addComponent(new CircleCollider2D(10));o.addComponent(new CharacterController2D());return o;}
 static GameObject shot(Game g){GameObject o=g.createObject("shot").setPosition(100,100);o.addComponent(new Projectile2D(1,0,100,1,null));return o;}
 public static void main(String[] args){
  for(int order=0;order<2;order++){
   Game g=new Game();GameObject t,s;if(order==0){t=target(g);s=shot(g);}else{s=shot(g);t=target(g);}
   final int[] hits={0};t.addComponent(new Component(){public void onTrigger(GameObject other){hits[0]++;}});
   g.start();g.step(0.1);check(hits[0]==1,"one hit order "+order);g.dispose();
  }
  Game g=new Game();GameObject t=g.createObject("target").setPosition(200,115);t.addComponent(new CircleCollider2D(5));
  GameObject s=g.createObject("rectshot").setPosition(50,100);s.addComponent(new Sprite("projectile",4,40));s.addComponent(new Collider2D());s.addComponent(new Projectile2D(1,0,3000,1,null));
  final int[] hits={0};t.addComponent(new Component(){public void onTrigger(GameObject other){hits[0]++;}});g.start();g.step(0.1);check(hits[0]==1,"tall projectile hit");g.dispose();
  Game wide=new Game();GameObject away=wide.createObject("target").setPosition(200,115);away.addComponent(new CircleCollider2D(5));
  GameObject flat=wide.createObject("shot").setPosition(50,100);flat.addComponent(new Sprite("projectile",40,4));flat.addComponent(new Collider2D());flat.addComponent(new Projectile2D(1,0,3000,1,null));
  wide.start();wide.step(0.1);check(!flat.destroyed,"flat projectile must miss");wide.dispose();
  Game ai=new Game();GameObject goal=ai.createObject("goal").setPosition(200,100);GameObject mob=ai.createObject("mob").setPosition(100,100);
  mob.addComponent(new CircleCollider2D(10));mob.addComponent(new CharacterController2D());mob.addComponent(new FollowTarget2D(goal));mob.addComponent(new ObstacleAvoidance2D());
  GameObject wall=ai.createObject("wall").setPosition(130,150);wall.addComponent(new Sprite("stone",4,200));wall.addComponent(new Collider2D());
  ai.start();ai.step(0.1);check(mob.transform.y!=100,"avoid tall obstacle");ai.dispose();System.out.println("PASS review");
 }
}`;
  expect(runJava({...gameEngineRuntimeFiles,'ReviewTests.java':source},'ReviewTests')).toContain('PASS review');
},45000);

it('rejects a weapon without cooldown protection and a bullet with the old long lifetime',()=>{
  const tasks=allLessons.find(l=>l.order===405).tasks;
  for(const [task,mutate] of [[tasks[1],source=>source.replace(' || remaining>0','')],[tasks[2],source=>source.replace('bulletLifetime = 0.2','bulletLifetime = 2')]]){
    const files={...gameEngineRuntimeFiles};
    for(const [name,source] of Object.entries({...task.solutionFiles,...task.javaTestFiles}))files[name]=`import engine.*;\n${name==='Weapon.java'?mutate(source):source}`;
    expect(()=>runJava(files,'JavaTest')).toThrow();
  }
},45000);
