export const reviewEngineContract = `import engine.*;
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
