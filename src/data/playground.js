export const playgroundProject={version:1,mainClass:'GameMain',files:{
  'GameMain.java':`public class GameMain extends Game {
    @Override public void onCreate() {
        createObject("Trawa").addComponent(new TileMap("grass", 32));
        GameObject player = createObject("Gracz").setPosition(180, 120);
        player.addComponent(new Sprite("player"));
        player.addComponent(new CircleCollider2D(12));
        player.addComponent(new TopDownCharacterController2D());
        player.addComponent(new PlayerController());
    }
}
`,
  'PlayerController.java':`public class PlayerController extends Component {
    @Override public void onUpdate(double delta) {
        double x = (Input.isKeyDown("D") || Input.isKeyDown("ArrowRight") ? 1 : 0)
                 - (Input.isKeyDown("A") || Input.isKeyDown("ArrowLeft") ? 1 : 0);
        double y = (Input.isKeyDown("S") || Input.isKeyDown("ArrowDown") ? 1 : 0)
                 - (Input.isKeyDown("W") || Input.isKeyDown("ArrowUp") ? 1 : 0);
        requireComponent(TopDownCharacterController2D.class).move(x, y);
    }
}
`}};
export const playgroundLesson={id:'playground-game',track:'playground',order:501,title:'Własna gra',summary:'Własny projekt Java i pełne API silnika.',theory:[],tips:[],tasks:[{id:'playground-game-project',mode:'playground',title:'Własny projekt',engine:true,mainClass:'GameMain',runMode:'game',starterFiles:playgroundProject.files,checks:[],outputChecks:[]}]};
