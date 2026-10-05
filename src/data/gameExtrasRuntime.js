export const gameExtrasRuntimeFiles = {
  'CircleCollider2D.java': `package engine;
/** Koło o promieniu w pikselach świata, niezależnym od skali sprite'a. */
public class CircleCollider2D extends Collider2D {
    public double radius;
    public CircleCollider2D(double radius) {
        if (!Double.isFinite(radius) || radius <= 0) throw new IllegalArgumentException("Promien musi byc dodatni i skonczony");
        this.radius = radius;
    }
}
`,
  'TileMap.java': `package engine;
/** Kafelki tła. Nie tworzy colliderów; przeszkody dodajesz osobno. */
public class TileMap extends Component {
    public String texture;
    public double tileSize;
    public TileMap(String texture, double tileSize) { this.texture = texture; this.tileSize = tileSize; }
    @Override public void onDrawBackground() {
        if (!Double.isFinite(tileSize) || tileSize < 8) throw new IllegalArgumentException("Rozmiar kafelka musi wynosic co najmniej 8");
        for (int row=0; row*tileSize<GameCanvas.getHeight(); row++)
            for (int column=0; column*tileSize<GameCanvas.getWidth(); column++) {
                int variant=(column*31+row*17+column*row*7)&3;
                boolean grass=texture.equals("grass");
                GameCanvas.drawSprite(texture,(column+0.5)*tileSize,(row+0.5)*tileSize,tileSize,tileSize,
                    0,grass&&(variant&1)!=0?-1:1,grass&&(variant&2)!=0?-1:1);
            }
    }
}
`,
  'Steering2D.java': `package engine;
/** Bazowy generator kierunku AI. Jeden aktywny na obiekt. */
public abstract class Steering2D extends Component {
    public GameObject target;
    public double speed = 100;
    protected Steering2D(GameObject target) { this.target = target; }
    protected abstract Vector2 direction(double x, double y, double distance);
    @Override public void onUpdate(double delta) {
        int generators=0;
        for (Steering2D steering : getComponents(Steering2D.class)) if (steering.enabled) generators++;
        if (generators>1) throw new IllegalArgumentException("Obiekt ma kilka aktywnych zachowan AI");
        CharacterController2D controller=requireComponent(CharacterController2D.class);
        if (target==null || target.destroyed || !target.active || target.game!=getGame()) { controller.move(0,0); return; }
        if (!Double.isFinite(speed) || speed<0) throw new IllegalArgumentException("Niepoprawna predkosc AI");
        double x=target.transform.x-gameObject.transform.x,y=target.transform.y-gameObject.transform.y;
        Vector2 d=direction(x,y,Math.sqrt(x*x+y*y));
        ObstacleAvoidance2D avoidance=getComponent(ObstacleAvoidance2D.class);
        if (avoidance!=null && avoidance.enabled) d=avoidance.steer(d.x,d.y);
        controller.move(d.x,d.y,speed);
        Sprite sprite=getComponent(Sprite.class);
        if (sprite!=null && d.x!=0) sprite.flipX=d.x<0;
    }
}
`,
  'FollowTarget2D.java': `package engine;
public class FollowTarget2D extends Steering2D {
    public double stopDistance = 32;
    public FollowTarget2D(GameObject target) { super(target); }
    @Override protected Vector2 direction(double x,double y,double distance) {
        return distance<=stopDistance ? new Vector2() : new Vector2(x,y);
    }
}
`,
  'FleeTarget2D.java': `package engine;
public class FleeTarget2D extends Steering2D {
    public double safeDistance = 200;
    public FleeTarget2D(GameObject target) { super(target); }
    @Override protected Vector2 direction(double x,double y,double distance) {
        return distance>=safeDistance ? new Vector2() : distance==0 ? new Vector2(1,0) : new Vector2(-x,-y);
    }
}
`,
  'FlankTarget2D.java': `package engine;
public class FlankTarget2D extends Steering2D {
    public double radius = 100;
    public boolean clockwise = true;
    public FlankTarget2D(GameObject target) { super(target); }
    @Override protected Vector2 direction(double x,double y,double distance) {
        if (distance==0) return new Vector2(1,0);
        double radial=(distance-radius)/Math.max(1,radius),side=clockwise?1:-1;
        return new Vector2(x/distance*radial-y/distance*side,y/distance*radial+x/distance*side);
    }
}
`,
  'ObstacleAvoidance2D.java': `package engine;
/** Lokalne omijanie colliderów. Nie wyszukuje drogi w labiryncie. */
public class ObstacleAvoidance2D extends Component {
    public double lookAhead = 80;
    public double weight = 2;
    public Vector2 steer(double x,double y) {
        if (!Double.isFinite(lookAhead) || lookAhead<=0 || !Double.isFinite(weight) || weight<0)
            throw new IllegalArgumentException("Niepoprawne parametry omijania");
        double length=Math.sqrt(x*x+y*y); if(length==0) return new Vector2();
        double dx=x/length,dy=y/length;
        for(GameObject other:getGame().getObjects()) {
            Collider2D collider=other.getComponent(Collider2D.class);
            if(other==gameObject || !other.active || other.destroyed || collider==null || !collider.enabled || collider.isTrigger || collider instanceof Trigger2D) continue;
            double ox=other.transform.x-gameObject.transform.x,oy=other.transform.y-gameObject.transform.y;
            double ahead=ox*dx+oy*dy,side=ox*(-dy)+oy*dx;
            double clearance=Math.abs(dy)*(Physics2D.extent(other,true)+Physics2D.extent(gameObject,true))
                +Math.abs(dx)*(Physics2D.extent(other,false)+Physics2D.extent(gameObject,false))+8;
            double forward=Math.abs(dx)*Physics2D.extent(other,true)+Math.abs(dy)*Physics2D.extent(other,false);
            if(ahead>=0 && ahead<lookAhead+forward && Math.abs(side)<clearance) {
                double sign=side>=0?-1:1;
                return new Vector2(dx-dy*sign*weight,dy+dx*sign*weight);
            }
        }
        return new Vector2(dx,dy);
    }
}
`,
  'Projectile2D.java': `package engine;
/** Lot i czas życia; skutki trafienia piszesz w onTrigger swojej klasy. */
public class Projectile2D extends Component {
    public final Vector2 direction;
    public double speed, lifetime;
    public final GameObject owner;
    public Projectile2D(double x,double y,double speed,double lifetime,GameObject owner) {
        if(!Double.isFinite(x)||!Double.isFinite(y)||!Double.isFinite(speed)||speed<0||!Double.isFinite(lifetime)||lifetime<0)
            throw new IllegalArgumentException("Niepoprawne parametry pocisku");
        direction=new Vector2(x,y);this.speed=speed;this.lifetime=lifetime;this.owner=owner;
    }
    @Override public void onCreate() {
        if(!hasComponent(CharacterController2D.class)) gameObject.addComponent(new CharacterController2D());
        requireComponent(CharacterController2D.class).collideWorldBounds=false;
        if(!hasComponent(Collider2D.class)) { CircleCollider2D collider=gameObject.addComponent(new CircleCollider2D(4));collider.isTrigger=true; }
    }
    @Override public void onUpdate(double delta) {
        if(!Double.isFinite(speed)||speed<0||!Double.isFinite(lifetime)||lifetime<0) throw new IllegalArgumentException("Niepoprawny pocisk");
        if(lifetime==0) {gameObject.destroy();return;}
        // A final fractional frame travels only for the remaining lifetime.
        requireComponent(CharacterController2D.class).move(direction.x,direction.y,delta==0?speed:speed*Math.min(delta,lifetime)/delta);
    }
    void finishFrame(double delta) { lifetime=Math.max(0,lifetime-delta);if(lifetime==0)gameObject.destroy(); }
}
`,
  'Tween.java': `package engine;
/** Animacja kontrolowana przez Game.step; cancel zatrzymuje ją w aktualnej pozycji. */
public class Tween extends Component {
    public final String property;
    public String easing = "linear";
    public boolean completed;
    private double elapsed, duration, fromX, fromY, toX, toY, offsetX, offsetY;
    Tween(GameObject object,String property,double x,double y,double duration) {
        if(!Double.isFinite(duration)||duration<0||!Double.isFinite(x)||!Double.isFinite(y))throw new IllegalArgumentException("Niepoprawny tween");
        this.property=property;this.duration=duration;toX=x;toY=y;
        if(property.equals("scale")){fromX=object.transform.scale.x;fromY=object.transform.scale.y;}
        else if(property.equals("rotation")){fromX=object.transform.rotation.z;}
        else {fromX=object.transform.x;fromY=object.transform.y;}
    }
    private void clearOffset() {gameObject.transform.visualOffset.x-=offsetX;gameObject.transform.visualOffset.y-=offsetY;offsetX=offsetY=0;}
    @Override public void onUpdate(double delta) {
        if(completed)return;
        elapsed=Math.min(duration,elapsed+delta);
        double t=duration==0?1:elapsed/duration;
        if(!easing.equals("linear")&&!easing.equals("smooth"))throw new IllegalArgumentException("Easing: linear lub smooth");
        double p=easing.equals("smooth")?t*t*(3-2*t):t;
        if(property.equals("shake")) {
            clearOffset();offsetX=t==1?0:Math.sin(elapsed*97)*toX*(1-t);offsetY=t==1?0:Math.cos(elapsed*83)*toX*(1-t);
            gameObject.transform.visualOffset.x+=offsetX;gameObject.transform.visualOffset.y+=offsetY;
        } else if(property.equals("position")){gameObject.transform.x=fromX+(toX-fromX)*p;gameObject.transform.y=fromY+(toY-fromY)*p;}
        else if(property.equals("scale")){gameObject.transform.scale.x=fromX+(toX-fromX)*p;gameObject.transform.scale.y=fromY+(toY-fromY)*p;}
        else gameObject.transform.rotation.z=fromX+(toX-fromX)*p;
        if(t==1){completed=true;gameObject.removeComponent(this);}
    }
    public void cancel() {if(completed)return;completed=true;clearOffset();gameObject.removeComponent(this);}
    @Override public void onDestroy() {clearOffset();completed=true;}
}
`,
  'Tweens.java': `package engine;
public final class Tweens {
    private Tweens() {}
    private static Tween add(GameObject object,String property,double x,double y,double seconds) {
        if(object==null||object.destroyed)throw new IllegalArgumentException("Brak aktywnego obiektu tweena");
        Tween next=new Tween(object,property,x,y,seconds);
        for(Tween old:object.getComponents(Tween.class))if(old.property.equals(property))old.cancel();
        object.addComponent(next);if(seconds==0)next.onUpdate(0);return next;
    }
    public static Tween position(GameObject object,double x,double y,double seconds){return add(object,"position",x,y,seconds);}
    public static Tween scale(GameObject object,double x,double y,double seconds){return add(object,"scale",x,y,seconds);}
    public static Tween rotation(GameObject object,double radians,double seconds){return add(object,"rotation",radians,0,seconds);}
    public static Tween shake(GameObject object,double strength,double seconds){return add(object,"shake",strength,0,seconds);}
}
`,
  'Camera2D.java': `package engine;
/** Kamera zmienia tylko renderowanie świata. HUD pozostaje nieruchomy. */
public class Camera2D extends Component {
    public double offsetX, offsetY;
    private double remaining,duration,strength,time;
    public void shake(double strength,double seconds) {
        if(!Double.isFinite(strength)||strength<0||!Double.isFinite(seconds)||seconds<0)throw new IllegalArgumentException("Niepoprawny shake kamery");
        this.strength=strength;remaining=duration=seconds;time=0;offsetX=offsetY=0;
    }
    @Override public void onUpdate(double delta) {
        remaining=Math.max(0,remaining-delta);time+=delta;
        offsetX=remaining==0?0:Math.sin(time*97)*strength*remaining/duration;
        offsetY=remaining==0?0:Math.cos(time*83)*strength*remaining/duration;
    }
    public void stopShake(){remaining=0;offsetX=offsetY=0;}
}
`,
};
