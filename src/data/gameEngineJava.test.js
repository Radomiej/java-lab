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

it('compiles and runs all 18 game solutions and their Java behavior assertions',()=>{
  const files={...gameEngineRuntimeFiles};const calls=[];
  const tasks=allLessons.filter(lesson=>lesson.track==='game-dev').flatMap(lesson=>lesson.tasks);
  for(const [index,task] of tasks.entries()) {
    const pkg=`testcase${index}`;
    for(const [name,source] of Object.entries({...task.solutionFiles,...task.javaTestFiles}))
      files[`${pkg}/${name}`]=`package ${pkg};\nimport engine.*;\n${source}`;
    calls.push(`${pkg}.JavaTest.main(args);`);
  }
  files['AllSolutions.java']=`public class AllSolutions { public static void main(String[] args) { ${calls.join('\n')} System.out.println("PASS 18 solutions"); } }`;
  expect(runJava(files,'AllSolutions')).toContain('PASS 18 solutions');
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
  expect(output.match(/^PASS game-/gm)).toHaveLength(18);
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
