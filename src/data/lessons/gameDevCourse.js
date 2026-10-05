const playerController = `public class PlayerController extends Component {
    public double speed = 120;
    public boolean sprint;
    @Override public void onUpdate(double delta) {
        double x = (Input.isKeyDown("d") || Input.isKeyDown("ArrowRight") ? 1 : 0) - (Input.isKeyDown("a") || Input.isKeyDown("ArrowLeft") ? 1 : 0);
        double y = (Input.isKeyDown("s") || Input.isKeyDown("ArrowDown") ? 1 : 0) - (Input.isKeyDown("w") || Input.isKeyDown("ArrowUp") ? 1 : 0);
        requireComponent(CharacterController2D.class).move(x, y, sprint && Input.isKeyDown("Shift") ? speed * 2 : speed);
        if (x != 0 || y != 0) gameObject.transform.rotation.z = Math.atan2(y, x);
    }
}
`;
const scene = (setup='', fields='', extra='') => `public class GameMain extends Game {
    public GameObject player;
    ${fields}
    @Override public void onCreate() {
        player = createObject("Gracz").setPosition(180, 120);
        player.addComponent(new Sprite("player"));
        player.addComponent(new CharacterController2D());
        player.addComponent(new CircleCollider2D(12));
        player.addComponent(new PlayerController());
        ${setup}
    }
    ${extra}
}
`;
const baseFiles = {'GameMain.java':scene(),'PlayerController.java':playerController};
function javaTest(body) {
  return `public class JavaTest {
    static void check(boolean value, String message) { if (!value) throw new IllegalArgumentException(message); }
    public static void main(String[] args) {
        GameMain game = new GameMain();
        try { game.start(); ${body} System.out.println("PASS testy obiektow Java"); }
        finally { Input.setKey("d", false); Input.setKey("w", false); Input.setKey("Shift", false); Input.setKey("Space", false); game.dispose(); }
    }
}
`;
}
function task(id,title,prompt,files,test,starter=baseFiles,index=0) {
  return {id,title,prompt,mode:index===0?'guided':'independent',steps:['Otwórz pliki gry i uruchom przykład.','Zaimplementuj wymagane zachowanie.','RUN kompiluje, sprawdza obiekty i pokazuje scenę.'],
    ...(index===0?{hints:['Ctrl+klik otwiera API; hover pokazuje dokumentację.']}:{}),
    starterFiles:starter,solutionFiles:files,engine:true,mainClass:'GameMain',runMode:'game',checks:[],gameTests:[{label:'Testy obiektów Java'}],
    javaTestMainClass:'JavaTest',javaTestFiles:{'JavaTest.java':javaTest(test)}};
}
function lesson(number,title,summary,theory,tasks) {
  return {id:`game-dev-${number}`,track:'game-dev',order:number,title,summary,objective:summary,
    theory:theory.map(([title,text,code])=>({title,text,code})),tips:['Pozycja to środek sprite’a. Czas podajemy w sekundach.'],tasks};
}
const walkTest='Input.setKey("d", true); game.step(0.1); check(Math.abs(game.player.transform.x-192)<0.001,"Ruch w prawo");';
const grassFiles={...baseFiles,'GameMain.java':scene('createObject("Trawa").addComponent(new TileMap("grass", 32));')};
const collector=`public class Collector extends Component {
    public int points;
    @Override public void onTrigger(GameObject other) {
        if (other.name.equals("Moneta") && !other.destroyed) { points++; other.destroy(); }
    }
    @Override public void onDrawUI() { GameCanvas.drawText("Punkty: " + points, 10, 20, "#ffffff"); }
}
`;
const coinsFiles={...grassFiles,'Collector.java':collector,'GameMain.java':scene(`createObject("Trawa").addComponent(new TileMap("grass",32));
        player.addComponent(new Collector());
        for (int i=0; i<3; i++) {
            GameObject coin=createObject("Moneta").setPosition(240+i*70,120);
            coin.addComponent(new Sprite("coin",20,20));
            CircleCollider2D sensor=coin.addComponent(new CircleCollider2D(10)); sensor.isTrigger=true;
        }`)};
const coinTest='Input.setKey("d",true); for(int i=0;i<5;i++)game.step(0.1); Input.setKey("d",false); game.step(0.1); check(game.player.getComponent(Collector.class).points==1,"Moneta zebrana raz");';
function aiFiles(type,setup='') {
  return {...grassFiles,'GameMain.java':scene(`createObject("Trawa").addComponent(new TileMap("grass",32));
        enemy=createObject("Wróg").setPosition(80,120);
        enemy.addComponent(new Sprite("slime")); enemy.addComponent(new CharacterController2D());
        enemy.addComponent(new CircleCollider2D(12));
        enemy.addComponent(new ${type}(player)); ${setup}`,'public GameObject enemy;')};
}
const weapon=`public class Weapon extends Component {
    public double cooldown = 0.3;
    public double remaining;
    public double bulletSpeed = 350;
    public double bulletLifetime = 2;
    @Override public void onUpdate(double delta) {
        remaining=Math.max(0, remaining-delta);
        if (!Input.isKeyPressed("Space") || remaining>0) return;
        GameObject bullet=getGame().createObject("Pocisk").setPosition(gameObject.transform.x, gameObject.transform.y);
        bullet.addComponent(new Sprite("projectile",12,12));
        bullet.addComponent(new Projectile2D(Math.cos(gameObject.transform.rotation.z), Math.sin(gameObject.transform.rotation.z), bulletSpeed, bulletLifetime, gameObject));
        bullet.addComponent(new Hit()); remaining=cooldown;
    }
}
`;
const hit=`public class Hit extends Component {
    @Override public void onTrigger(GameObject other) {
        Health health=other.getComponent(Health.class);
        if(health!=null) { health.hearts--; if(health.hearts<=0)other.destroy(); }
    }
}
`;
const health=`public class Health extends Component {
    public int hearts = 3;
    @Override public void onDrawUI() { GameCanvas.drawText("Wróg HP: " + hearts, 10, 20, "white"); }
}
`;
const bulletsFiles={...grassFiles,'Weapon.java':weapon,'Hit.java':hit,'Health.java':health,'GameMain.java':scene(`createObject("Trawa").addComponent(new TileMap("grass",32));
        player.addComponent(new Weapon());
        enemy=createObject("Wróg").setPosition(300,120);
        enemy.addComponent(new Sprite("slime")); enemy.addComponent(new CircleCollider2D(12)); enemy.addComponent(new Health());`,'public GameObject enemy;')};
const bulletTest='Input.setKey("Space",true); game.step(0.1); for(int i=0;i<4;i++)game.step(0.1); check(game.enemy.getComponent(Health.class).hearts==2,"Pocisk trafia raz");';
function effectFiles(expression) {
  return {...grassFiles,'Effects.java':`public class Effects extends Component {
    @Override public void onUpdate(double delta) {
        if(Input.isKeyPressed("Space")) { ${expression} }
    }
}
`,'GameMain.java':scene('createObject("Trawa").addComponent(new TileMap("grass",32)); camera=createObject("Kamera").addComponent(new Camera2D()); player.addComponent(new Effects());','public Camera2D camera;')};
}

export const gameDevLessons = [
  lesson(401,'Chodzenie postacią','Sterowanie, komponent ruchu i obrót sprite’a',[
    ['Komponent ucznia','PlayerController odczytuje klawisze, a gotowy kontroler wykonuje ruch i kolizje.','requireComponent(CharacterController2D.class).move(x,y,120);'],
    ['Kierunek patrzenia','Obrót podajemy w radianach. atan2 wyznacza kąt kierunku; grafika powinna wskazywać w prawo.','gameObject.transform.rotation.z = Math.atan2(y,x);'],
  ],[
    task('game-401-guided','Ruch WASD','Uruchom gotowy przykład chodzenia. Prześledź, jak PlayerController mapuje WASD i strzałki na ruch oraz obrót postaci.',baseFiles,walkTest),
    task('game-401-sprint','Sprint','Z wciśniętym Shiftem poruszaj się dwukrotnie szybciej.',{...baseFiles,'GameMain.java':scene('player.getComponent(PlayerController.class).sprint=true;')},'Input.setKey("Shift",true); Input.setKey("d",true); game.step(0.1); check(Math.abs(game.player.transform.x-204)<0.001,"Sprint");',baseFiles,1),
    task('game-401-rotation','Obrót postaci','Obracaj gracza w kierunku ruchu, zachowując ostatni kąt po zatrzymaniu.',baseFiles,'Input.setKey("w",true); game.step(0.1); check(Math.abs(game.player.transform.rotation.z+Math.PI/2)<0.001,"Obrót w górę");', {...baseFiles,'PlayerController.java':playerController.replace('if (x != 0 || y != 0) gameObject.transform.rotation.z = Math.atan2(y, x);','// Dodaj obrót')},2),
  ]),
  lesson(402,'Trawa i plansza','Tło kafelkowe bez setek GameObjectów',[
    ['TileMap','Gotowy komponent wypełnia tło kafelkami, przed sprite’ami. Nie tworzy przeszkód.','createObject("Trawa").addComponent(new TileMap("grass",32));'],
    ['Własne rysowanie','Własny komponent może dorysować ścieżkę w fazie tła. Rozmiary podajemy w pikselach.','public void onDrawBackground() { GameCanvas.drawRect(0,100,600,32,"#b89a68"); }'],
  ],[
    task('game-402-guided','Trawa','Dodaj TileMap z teksturą grass i kafelkiem 32 px.',grassFiles,'game.step(0); check(GameCanvas.frame().contains("sprite|grass"),"Trawa");'),
    task('game-402-sand','Piaskowa plansza','Wypełnij tło teksturą sand z kafelkami 48 px.',{...baseFiles,'GameMain.java':scene('createObject("Piasek").addComponent(new TileMap("sand",48));')},'game.step(0); check(GameCanvas.frame().contains("sprite|sand|24.0|24.0|48.0"),"Piasek 48 px");',grassFiles,1),
    task('game-402-path','Ścieżka','Dodaj własny komponent Path rysujący prostokąt ścieżki na trawie.',{...grassFiles,'Path.java':'public class Path extends Component { public void onDrawBackground() { GameCanvas.drawRect(0,100,600,32,"#b89a68"); } }','GameMain.java':grassFiles['GameMain.java'].replace('new TileMap("grass", 32));','new TileMap("grass", 32)); createObject("Ścieżka").addComponent(new Path());')},'game.step(0); check(GameCanvas.frame().contains("rect|0.0|100.0|600.0|32.0"),"Ścieżka");',grassFiles,2),
  ]),
  lesson(403,'Monety, collidery i UI','Kontakt kołowy, punkty i własne komponenty',[
    ['Kołowy trigger','isTrigger pozwala wejść w monetę bez blokowania; onTrigger obsługuje regułę zbierania.','CircleCollider2D sensor = coin.addComponent(new CircleCollider2D(10));\nsensor.isTrigger=true;'],
    ['UI po świecie','onDrawUI rysuje po sprite’ach. Po zebraniu usuń monetę, żeby nie naliczać punktów ponownie.','public void onDrawUI() { GameCanvas.drawText("Punkty: " + points,10,20,"white"); }'],
  ],[
    task('game-403-guided','Zbieraj monety','Dodaj Collector: kontakt z Monetą zwiększa points o 1 i niszczy monetę.',coinsFiles,coinTest,grassFiles),
    task('game-403-bonus','Podwójne punkty','Każda moneta daje 2 punkty.',{...coinsFiles,'Collector.java':collector.replace('points++;','points+=2;')},coinTest.replace('points==1','points==2'),coinsFiles,1),
    task('game-403-hud','HUD monet','Pokaż własny tekst Monety: liczba w onDrawUI.',{...coinsFiles,'Collector.java':collector.replace('Punkty:','Monety:')},'game.step(0); check(GameCanvas.frame().contains("text|Monety: 0"),"HUD");',coinsFiles,2),
  ]),
  lesson(404,'Przeciwnicy i omijanie','Gotowe zachowania AI; dobór komponentów zamiast wrapperów JS',[
    ['Generator kierunku','FollowTarget2D goni, FleeTarget2D ucieka, FlankTarget2D obiega cel. Podłącz tylko jeden aktywny generator.','enemy.addComponent(new FollowTarget2D(player));'],
    ['Przeszkody','ObstacleAvoidance2D koryguje kierunek wokół colliderów. To lokalne omijanie, nie szukanie drogi przez labirynt.','enemy.addComponent(new ObstacleAvoidance2D());'],
  ],[
    task('game-404-guided','Pościg z przeszkodą','Dodaj FollowTarget2D i ObstacleAvoidance2D. Przeszkoda ma Sprite i Collider2D.',aiFiles('FollowTarget2D','enemy.addComponent(new ObstacleAvoidance2D()); GameObject wall=createObject("Kamień").setPosition(130,120); wall.addComponent(new Sprite("stone")); wall.addComponent(new Collider2D());'),'game.step(0.1); check(game.enemy.transform.x>80 && game.enemy.transform.y!=120,"Pościg i omijanie");',grassFiles),
    task('game-404-flee','Ucieczka','Wróg ma oddalać się od gracza do safeDistance.',aiFiles('FleeTarget2D'),'game.step(0.1); check(game.enemy.transform.x<80,"Ucieczka");',aiFiles('FollowTarget2D'),1),
    task('game-404-flank','Flankowanie','Wróg ma obiegać gracza w promieniu 100 px.',aiFiles('FlankTarget2D'),'game.step(0.1); check(game.enemy.transform.y!=120,"Flankowanie");',aiFiles('FollowTarget2D'),2),
  ]),
  lesson(405,'Pociski i trafienia','Kołowe pociski, właściciel i czas życia',[
    ['Lot','Projectile2D dodaje ruch i kołowy trigger. owner jest ignorowany przed kontaktem. Kontrola odcinka chroni przed przelatywaniem przez cel.','bullet.addComponent(new Projectile2D(1,0,350,2,player));'],
    ['Reguły ucznia','Weapon tworzy pociski, Hit obsługuje kontakt, Health przechowuje zdrowie. Silnik nie narzuca obrażeń.','public void onTrigger(GameObject other) { /* własne obrażenia */ }'],
  ],[
    task('game-405-guided','Strzelaj spacją','Dodaj Weapon, Hit i Health. Spacja strzela w kierunku patrzenia i zabiera 1 HP.',bulletsFiles,bulletTest,grassFiles),
    task('game-405-cooldown','Cooldown','Ustaw cooldown na 0.6 s i odrzucaj zbyt szybkie strzały.',{...bulletsFiles,'Weapon.java':weapon.replace('cooldown = 0.3','cooldown = 0.6')},'game.enemy.setPosition(300,350); Input.setKey("Space",true); game.step(0.1); Input.setKey("Space",false); game.step(0.1); Input.setKey("Space",true); game.step(0.1); int shots=0; for(GameObject object:game.getObjects())if(object.hasComponent(Projectile2D.class))shots++; check(shots==1,"Cooldown blokuje drugi strzal"); check(Math.abs(game.player.getComponent(Weapon.class).remaining-0.4)<0.001,"Cooldown 0.6 s");',bulletsFiles,1),
    task('game-405-lifetime','Krótki pocisk','Pocisk ma istnieć tylko przez 0.2 s, nawet jeśli nie trafi.',{...bulletsFiles,'Weapon.java':weapon.replace('bulletLifetime = 2','bulletLifetime = 0.2')},'game.enemy.setPosition(300,350); Input.setKey("Space",true); game.step(0.1); GameObject shot=null; for(GameObject object:game.getObjects())if(object.hasComponent(Projectile2D.class))shot=object; check(shot!=null,"Pocisk utworzony"); game.step(0.1); check(!shot.destroyed,"Pocisk zyje przed deadline"); game.step(0.1); check(shot.destroyed,"Pocisk wygasl po 0.2 s bez trafienia");',bulletsFiles,2),
  ]),
  lesson(406,'Tweeny i wstrząsy','Animacja skali, shake obiektu i kamery',[
    ['Tween','Tweens animuje pozycję, skalę lub obrót przez określony czas. easing może być linear lub smooth; nowy tween zastępuje poprzedni tej właściwości.','Tweens.scale(gameObject,1.5,1.5,0.5).easing="smooth";'],
    ['Shake','Shake obiektu zmienia visualOffset, nie pozycję fizyczną. Kamera przesuwa obraz sprite’ów; UI pozostaje nieruchome.','Tweens.shake(gameObject,8,0.3);\ngetGame().getObjects(); // kamera jest własnym obiektem sceny'],
  ],[
    task('game-406-guided','Animacja skali','Spacja płynnie powiększa gracza do skali 2 w 0.5 s.',effectFiles('Tweens.scale(gameObject,2,2,0.5);'),'Input.setKey("Space",true); game.step(0.1); game.step(0.1); check(game.player.transform.scale.x>1 && game.player.transform.scale.x<2,"Animacja skali");',grassFiles),
    task('game-406-shake','Shake postaci','Spacja wstrząsa obrazem gracza o sile 8 przez 0.3 s, bez zmiany pozycji fizycznej.',effectFiles('Tweens.shake(gameObject,8,0.3);'),'Input.setKey("Space",true); game.step(0.1); game.step(0.1); check(game.player.transform.visualOffset.x!=0,"Shake obrazu"); check(game.player.transform.x==180,"Bez ruchu fizyki");',effectFiles('Tweens.scale(gameObject,2,2,0.5);'),1),
    task('game-406-camera','Shake kamery','Spacja uruchamia shake kamery o sile 8 na 0.3 s.',effectFiles('((GameMain)getGame()).camera.shake(8,0.3);'),'Input.setKey("Space",true); game.step(0.1); game.step(0.1); check(game.camera.offsetX!=0,"Shake kamery"); check(game.player.transform.x==180,"Kamera nie rusza gracza");',effectFiles('Tweens.scale(gameObject,2,2,0.5);'),2),
  ]),
];
