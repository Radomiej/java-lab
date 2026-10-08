// C38 reference used by JDK, TeaVM and JavaScript executions: five 0.1 s
// WORLD steps, create first, then update, centered 40 x 20 rectangle.
export const conformanceReferenceFiles={
 'GameMain.java':`public class GameMain extends Game {
 public final java.util.List<String> events=new java.util.ArrayList<>();
 @Override public void onCreate(){GameObject p=createObject("P");p.setPosition(100,80);p.addComponent(new ShapeRenderer(40,20,"#fff"));p.addComponent(new Move(this));}
}`,
 'Move.java':`public class Move extends Component {
 private final GameMain scene;public Move(GameMain scene){this.scene=scene;}
 @Override public void onCreate(){scene.events.add("create");}
 @Override public void onUpdate(double delta){transform.x+=120*delta;scene.events.add("update");}
}`,
};
export const conformanceReferenceSteps=[.1,.1,.1,.1,.1];
