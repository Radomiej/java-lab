export const playgroundProject={version:1,engineApiVersion:'2.0.0',mainClass:'GameMain',files:{
  'GameMain.java':`public class GameMain extends Game {
    @Override public void onCreate() {
        createObject("Trawa").addComponent(new TileMap("grass", 32));
        GameObject player = createObject("Gracz").setPosition(180, 120);
        player.addComponent(new Sprite(Assets.PLAYER01));
        player.addComponent(new CircleCollider2D(12));
        player.addComponent(new TopDownCharacterController2D());
        player.addComponent(new PlayerController());
    }
}
`,
  'PlayerController.java':`public class PlayerController extends Component {
    @Override public void onUpdate(double delta) {
        double x = (getGame().input.isKeyDown(Keys.D) || getGame().input.isKeyDown(Keys.RIGHT) ? 1 : 0)
                 - (getGame().input.isKeyDown(Keys.A) || getGame().input.isKeyDown(Keys.LEFT) ? 1 : 0);
        double y = (getGame().input.isKeyDown(Keys.S) || getGame().input.isKeyDown(Keys.DOWN) ? 1 : 0)
                 - (getGame().input.isKeyDown(Keys.W) || getGame().input.isKeyDown(Keys.UP) ? 1 : 0);
        requireComponent(TopDownCharacterController2D.class).move(x, y);
    }
}
`}};
export const playgroundLesson={id:'playground-game',track:'playground',order:601,title:'Własna gra',summary:'Własny projekt Java i pełne API silnika.',theory:[],tips:[],tasks:[{id:'playground-game-project',mode:'playground',title:'Własny projekt',engine:true,mainClass:'GameMain',runMode:'game',starterFiles:playgroundProject.files,checks:[],outputChecks:[]}]};
