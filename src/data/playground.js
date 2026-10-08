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
        double x = (getGame().input.isKeyDown("D") || getGame().input.isKeyDown("ArrowRight") ? 1 : 0)
                 - (getGame().input.isKeyDown("A") || getGame().input.isKeyDown("ArrowLeft") ? 1 : 0);
        double y = (getGame().input.isKeyDown("S") || getGame().input.isKeyDown("ArrowDown") ? 1 : 0)
                 - (getGame().input.isKeyDown("W") || getGame().input.isKeyDown("ArrowUp") ? 1 : 0);
        requireComponent(TopDownCharacterController2D.class).move(x, y);
    }
}
`}};
export const playgroundLesson={id:'playground-game',track:'playground',order:501,title:'Własna gra',summary:'Własny projekt Java i pełne API silnika.',theory:[],tips:[],tasks:[{id:'playground-game-project',mode:'playground',title:'Własny projekt',engine:true,mainClass:'GameMain',runMode:'game',starterFiles:playgroundProject.files,checks:[],outputChecks:[]}]};
