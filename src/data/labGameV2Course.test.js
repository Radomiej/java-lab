// @vitest-environment node
import { expect, test } from 'vitest';
import { mkdtempSync,mkdirSync,writeFileSync,rmSync,existsSync,readdirSync } from 'node:fs';
import { tmpdir,homedir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import {gameDevLessons} from './lessons/gameDevCourse.js';
import {gameEngineRuntimeFiles} from './gameEngineRuntime.js';
import {courseManifest} from '../../shared/lab-game-v2/course/manifest.js';
function javac() {
 if(process.env.JAVA_HOME)return join(process.env.JAVA_HOME,'bin','javac');
 const folder=join(homedir(),'.jdks');if(existsSync(folder))for(const dir of readdirSync(folder)){const path=join(folder,dir,'bin','javac.exe');if(existsSync(path))return path;}
 return 'javac';
}
const scenarios={
 'g2d.scene.modified':'check(game.find("PlatformA").transform.x==120,"PlatformA");check(game.find("PlatformB").transform.x==340,"PlatformB");',
 'g2d.time.independent':'for(int i=0;i<10;i++)game.step(.1);GameObject object=game.find("MoverObject");check(Math.abs(object.transform.x-160)<1e-6,"normalized X");check(Math.abs(object.transform.y-160)<1e-6,"normalized Y");object.getComponent(DirectionMover.class).direction.set(0,0);for(int i=0;i<10;i++)game.step(.1);check(Math.abs(object.transform.x-160)<1e-6,"zero direction");',
 'g2d.health.modified':'Health hp=game.find("Player").getComponent(Health.class);int[] deaths={0};hp.onDeath(()->deaths[0]++);check(hp.damage(1),"first hit");check(!hp.damage(1),"protection");for(int i=0;i<8;i++)game.step(.1);check(hp.damage(99),"lethal");check(!hp.damage(1)&&deaths[0]==1,"single death");check(game.find("Player")!=null,"Health does not destroy owner");',
 'g2d.projectiles.independent':'game.step(.1);check(game.find("Enemy").getComponent(Health.class).currentHealth==2,"first enemy hit");check(game.find("EnemyB").getComponent(Health.class).currentHealth==3,"one hit");check(game.find("Ally").getComponent(Health.class).currentHealth==3,"ally ignored");',
 'g2d.waves.modified':'for(int i=0;i<80;i++)game.step(.1);check(game.getObjects().stream().filter(o->o.name.equals("Slime")).count()==7,"seven scheduled spawns");',
 'g2d.performance.guided':'for(int i=0;i<211;i++)game.step(.1);check(game.find("LoadFixture").getComponent(LoadFixture.class).shots==100,"100 shots");check(game.getObjects().stream().noneMatch(o->o.name.equals("Projectile")),"projectile cleanup");',
 'g2d.performance.independent':'for(int i=0;i<600;i++)game.step(.1);Experience xp=game.find("Player").getComponent(Experience.class);int remaining=0;for(GameObject o:game.getObjects()) {XpOrb orb=o.getComponent(XpOrb.class);if(orb!=null)remaining+=orb.value;}check(xp.totalXp+remaining==game.find("LoadFixture").getComponent(LoadFixture.class).reward,"XP conservation");check(game.getObjects().stream().filter(o->o.name.equals("Enemy")).count()<=200,"enemy cap");check(game.getObjects().stream().filter(o->o.name.equals("Projectile")).count()<=300,"projectile cap");check(game.getObjects().stream().filter(o->o.hasComponent(XpOrb.class)).count()<=200,"XP cap");',
 'g2d.ui-flow.independent':'game.step(.1);GameObject player=game.find("Player");Experience xp=player.getComponent(Experience.class);Weapon weapon=player.getComponent(Weapon.class);xp.pendingChoices=2;game.input.setPointer(320,180);game.input.setMouseButton(0,true);game.step(.1);check(weapon.damage==1,"press arms only");game.input.setMouseButton(0,false);game.step(.1);check(weapon.damage==2&&xp.pendingChoices==1,"pointer release chooses once");game.input.setKey("Enter",true);game.step(.1);check(weapon.damage==2,"Enter press arms");game.input.setKey("Enter",false);game.step(.1);check(weapon.damage==3&&xp.pendingChoices==0,"Enter release chooses once");',
 'g2d.run-state.independent':'RunController run=game.find("Run").getComponent(RunController.class);check(run.state.equals("READY"),"ready");run.start();game.step(0);GameObject old=run.player;old.getComponent(RunClock.class).elapsed=120;old.getComponent(Health.class).damage(99);game.step(0);check(run.state.equals("LOST"),"death priority");run.start();game.step(0);check(run.state.equals("RUNNING")&&run.player!=old,"fresh run");',
};
test('all source contracts are exact and each ready Java example compiles against v2',()=>{
 expect(gameDevLessons).toHaveLength(24);
 const dir=mkdtempSync(join(tmpdir(),'lab-course-v2-'));
 const visibility=[];
 try{
  const engine=join(dir,'engine-runtime');mkdirSync(engine,{recursive:true});
  const runtimePaths=Object.entries(gameEngineRuntimeFiles).map(([name,source])=>{const path=join(engine,name);writeFileSync(path,source);return path;});
  execFileSync(javac(),['--release','21','-encoding','UTF-8','-d',engine,...runtimePaths],{encoding:'utf8',timeout:30000});
  for(const [index,lesson] of gameDevLessons.entries()) {
   expect(lesson.id).toBe(courseManifest.chapters[index].id);
   for(const [taskIndex,task] of lesson.tasks.entries()) {
    const source=courseManifest.chapters[index].tasks[taskIndex];for(const key of ['id','title','mode','prompt','objective','criteria'])expect(task[key]).toEqual(source[key]);
    if(!task.solutionReady)continue;
    const folder=join(dir,task.id);mkdirSync(folder,{recursive:true});
    const files={...Object.fromEntries(Object.entries(task.solutionFiles).map(([name,text])=>[name,'import engine.*;\n'+text])),...task.javaTestFiles};
    files['CourseChecks.java']=`import engine.*;public class CourseChecks {static void check(boolean value,String label) {if(!value)throw new AssertionError(label);}public static void main(String[] args) {GameMain game=new GameMain();try {GameCanvas.setSize(640,360);game.start();game.step(0);${scenarios[task.id]??'game.step(.01);'} }finally {game.dispose();}}}`;
    if(task.solutionFiles['PlayerController.java'] && !['run-state','survivor','portability','pause','ui-flow','upgrades'].some(chapter=>task.id.includes('.'+chapter+'.'))){
     files['MovementAudit.java']=`import engine.*;public class MovementAudit {public static void main(String[] args){GameMain game=new GameMain();try{game.start();game.step(0);GameObject p=game.find("Player");if(p!=null&&!game.isPaused()&&p.getComponent(PlayerController.class)!=null&&p.getComponent(PlayerController.class).enabled){double x=p.transform.x;game.input.setKey("d",true);game.step(.1);game.input.setKey("d",false);if(p.transform.x<=x)throw new AssertionError("${task.id}: D does not move Player");double stopped=p.transform.x;game.step(.1);if(Math.abs(p.transform.x-stopped)>1e-6)throw new AssertionError("${task.id}: Player keeps moving after release");}}finally{game.dispose();}}}`;
    }
    files['VisibilityAudit.java']=`import engine.*;public class VisibilityAudit {public static void main(String[] args)throws Exception{GameMain game=new GameMain();try{GameCanvas.setSize(640,360);game.start();game.step(0);GameObject run=game.find("Run");if(run!=null)for(Component c:run.getComponents())if(c.getClass().getSimpleName().equals("RunController"))c.getClass().getMethod("start").invoke(c);game.step(0);int visible=0;for(String line:GameCanvas.frame().split("\\n")){String[] p=line.split("[|]");String op=p[0];if(!op.equals("sprite")&&!op.equals("rect")&&!op.equals("text")&&!op.equals("ninepatch")&&!op.equals("progress"))continue;int offset=op.equals("rect")?1:2;double x=Double.parseDouble(p[offset]),y=Double.parseDouble(p[offset+1]);if(x>=0&&x<=640&&y>=0&&y<=360)visible++;}System.out.println(visible);}finally{game.dispose();}}}`;
    const paths=Object.entries(files).filter(([name])=>name.endsWith('.java')).map(([name,text])=>{const path=join(folder,name);writeFileSync(path,text);return path;});
    execFileSync(javac(),['--release','21','-encoding','UTF-8','-cp',engine,'-sourcepath',folder,'-d',folder,...paths],{encoding:'utf8',timeout:30000});
    const classpath=folder+(process.platform==='win32'?';':':')+engine;
    execFileSync(javac().replace(/javac(\.exe)?$/,'java$1'),['-cp',classpath,'CourseChecks'],{encoding:'utf8',timeout:15000});
    execFileSync(javac().replace(/javac(\.exe)?$/,'java$1'),['-cp',classpath,'JavaTest'],{encoding:'utf8',timeout:15000});
    if(files['MovementAudit.java'])execFileSync(javac().replace(/javac(\.exe)?$/,'java$1'),['-cp',classpath,'MovementAudit'],{encoding:'utf8',timeout:15000});
    const visible=Number(execFileSync(javac().replace(/javac(\.exe)?$/,'java$1'),['-cp',classpath,'VisibilityAudit'],{encoding:'utf8',timeout:15000}).trim());
    visibility.push({lesson:401+index,task:task.id,visibleCommands:visible});
   }
  }
  mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/course-visibility-audit.json',JSON.stringify(visibility,null,2));
 }finally{rmSync(dir,{recursive:true,force:true});}
},180000);





