export const gamePhysicsRuntimeFiles = {
  'Physics2D.java': `package engine;
public final class Physics2D {
    private Physics2D() {}
    private static boolean live(GameObject o){return o.active&&!o.destroyed;}
    private static Collider2D collider(GameObject o){return o.getComponent(Collider2D.class);}
    public static double extent(GameObject o,boolean x) {
        Collider2D c=collider(o);
        if(c instanceof CircleCollider2D){double r=((CircleCollider2D)c).radius;if(!Double.isFinite(r)||r<=0)throw new IllegalArgumentException("Niepoprawny promien");return r;}
        Sprite s=o.getComponent(Sprite.class);return s==null?16:(x?s.width:s.height)/2;
    }
    private static boolean circle(GameObject o){return collider(o) instanceof CircleCollider2D;}
    private static double clamp(double x,double min,double max){return Math.max(min,Math.min(max,x));}
    public static boolean overlaps(GameObject a,GameObject b) {
        double dx=a.transform.x-b.transform.x,dy=a.transform.y-b.transform.y;
        if(circle(a)&&circle(b)){double r=extent(a,true)+extent(b,true);return dx*dx+dy*dy<=r*r;}
        if(circle(a)||circle(b)) {
            GameObject c=circle(a)?a:b,box=circle(a)?b:a;double r=extent(c,true);
            double x=c.transform.x-clamp(c.transform.x,box.transform.x-extent(box,true),box.transform.x+extent(box,true));
            double y=c.transform.y-clamp(c.transform.y,box.transform.y-extent(box,false),box.transform.y+extent(box,false));
            return x*x+y*y<=r*r;
        }
        return Math.abs(dx)<extent(a,true)+extent(b,true)&&Math.abs(dy)<extent(a,false)+extent(b,false);
    }
    private static boolean body(GameObject o) {
        Collider2D c=collider(o);CharacterController2D v=o.getComponent(CharacterController2D.class);
        return c!=null?c.enabled&&c.created:v!=null&&v.enabled&&v.created;
    }
    private static boolean trigger(GameObject o){Collider2D c=collider(o);return c!=null&&(c.isTrigger||c instanceof Trigger2D);}
    private static boolean ignored(GameObject a,GameObject b){Projectile2D p=a.getComponent(Projectile2D.class),q=b.getComponent(Projectile2D.class);return p!=null&&p.owner==b||q!=null&&q.owner==a;}
    private static double circleHit(double sx,double sy,double dx,double dy,double cx,double cy,double r) {
        double x=sx-cx,y=sy-cy,c=x*x+y*y-r*r;if(c<=0)return 0;
        double a=dx*dx+dy*dy,b=2*(x*dx+y*dy),disc=b*b-4*a*c;
        if(a==0||disc<0)return 2;double t=(-b-Math.sqrt(disc))/(2*a);return t>=0&&t<=1?t:2;
    }
    private static double rectHit(double sx,double sy,double dx,double dy,double x,double y,double w,double h) {
        double entry=0,exit=1;
        for(int axis=0;axis<2;axis++) {
            double p=axis==0?sx:sy,d=axis==0?dx:dy,lo=(axis==0?x:y)-(axis==0?w:h),hi=(axis==0?x:y)+(axis==0?w:h);
            if(d==0){if(p<lo||p>hi)return 2;continue;}
            double a=(lo-p)/d,b=(hi-p)/d;entry=Math.max(entry,Math.min(a,b));exit=Math.min(exit,Math.max(a,b));if(entry>exit)return 2;
        }
        return entry;
    }
    private static double roundedRectHit(double sx,double sy,double dx,double dy,double x,double y,double w,double h,double r) {
        double t=Math.min(rectHit(sx,sy,dx,dy,x,y,w+r,h),rectHit(sx,sy,dx,dy,x,y,w,h+r));
        for(int i=-1;i<=1;i+=2)for(int j=-1;j<=1;j+=2)t=Math.min(t,circleHit(sx,sy,dx,dy,x+i*w,y+j*h,r));
        return t;
    }
    private static double hit(GameObject shot,GameObject other,double dx,double dy) {
        double sx=shot.transform.x,sy=shot.transform.y,x=other.transform.x,y=other.transform.y;
        if(circle(shot)&&circle(other))return circleHit(sx,sy,dx,dy,x,y,extent(shot,true)+extent(other,true));
        if(circle(shot))return roundedRectHit(sx,sy,dx,dy,x,y,extent(other,true),extent(other,false),extent(shot,true));
        if(circle(other))return roundedRectHit(sx,sy,dx,dy,x,y,extent(shot,true),extent(shot,false),extent(other,true));
        return rectHit(sx,sy,dx,dy,x,y,extent(shot,true)+extent(other,true),extent(shot,false)+extent(other,false));
    }
    private static double axisExtent(GameObject moving,GameObject other,boolean x) {
        double perpendicular=Math.abs(x?moving.transform.y-other.transform.y:moving.transform.x-other.transform.x);
        if(circle(moving)&&circle(other)) {double r=extent(moving,true)+extent(other,true);return Math.sqrt(Math.max(0,r*r-perpendicular*perpendicular));}
        if(circle(moving)||circle(other)) {
            GameObject c=circle(moving)?moving:other,box=circle(moving)?other:moving;
            double r=extent(c,true),gap=Math.max(0,perpendicular-extent(box,!x));
            return extent(box,x)+Math.sqrt(Math.max(0,r*r-gap*gap));
        }
        return extent(moving,x)+extent(other,x);
    }
    static void step(Game game,java.util.ArrayList<GameObject> objects,double delta) {
        java.util.ArrayList<GameObject> first=new java.util.ArrayList<>(),second=new java.util.ArrayList<>();
        for(GameObject o:objects) {
            CharacterController2D v=o.getComponent(CharacterController2D.class);Collider2D own=collider(o);
            if(!live(o)||v==null||!v.enabled||!v.created||own!=null&&!own.enabled)continue;
            double dx=v.velocity.x*delta,dy=v.velocity.y*delta;
            if(!Double.isFinite(dx)||!Double.isFinite(dy))throw new IllegalArgumentException("Niepoprawny ruch");
            Projectile2D projectile=o.getComponent(Projectile2D.class);
            if(projectile!=null&&projectile.enabled) {
                double earliest=2;GameObject target=null;
                for(GameObject other:objects)if(other!=o&&live(other)&&body(other)&&!ignored(o,other)){
                    double t=hit(o,other,dx,dy);if(t<earliest){earliest=t;target=other;}
                }
                double travel=target==null?1:earliest;o.transform.x+=dx*travel;o.transform.y+=dy*travel;
                if(target!=null){game.dispatchContact(o,target,true);o.destroy();}
                if(!o.destroyed)projectile.finishFrame(delta);
                if(game.isDisposed())return;
                continue;
            }
            int steps=(int)Math.min(2048,Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/Math.max(1,Math.min(extent(o,true),extent(o,false))/2))));
            for(int n=0;n<steps&&live(o);n++)for(int axis=0;axis<2&&live(o);axis++) {
                double movement=(axis==0?dx:dy)/steps,origin=axis==0?o.transform.x:o.transform.y;
                if(axis==0)o.transform.x+=movement;else o.transform.y+=movement;
                for(GameObject other:objects) {
                    // Projectile contacts belong exclusively to their swept pass.
                    Projectile2D otherProjectile=other.getComponent(Projectile2D.class);
                    if(other==o||!live(o)||!live(other)||!body(other)||otherProjectile!=null&&otherProjectile.enabled||ignored(o,other)||!overlaps(o,other))continue;
                    boolean sensor=trigger(o)||trigger(other);
                    if(!sensor&&movement!=0){double bound=(axis==0?other.transform.x:other.transform.y)+(movement>0?-1:1)*axisExtent(o,other,axis==0);if(axis==0)o.transform.x=bound;else o.transform.y=bound;}
                    boolean sent=false;for(int i=0;i<first.size();i++)if(first.get(i)==o&&second.get(i)==other||first.get(i)==other&&second.get(i)==o)sent=true;
                    if(!sent){first.add(o);second.add(other);game.dispatchContact(o,other,sensor);}
                    if(game.isDisposed())return;
                }
            }
            if(live(o)&&v.collideWorldBounds){double w=Math.min(extent(o,true),GameCanvas.getWidth()/2),h=Math.min(extent(o,false),GameCanvas.getHeight()/2);o.transform.x=clamp(o.transform.x,w,GameCanvas.getWidth()-w);o.transform.y=clamp(o.transform.y,h,GameCanvas.getHeight()-h);}
        }
    }
}
`,
};
