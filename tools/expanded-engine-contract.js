export const expandedEngineContract = `import engine.*;
public class EngineTests {
  static void check(boolean ok,String label) { if(!ok) throw new IllegalArgumentException(label); }
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
