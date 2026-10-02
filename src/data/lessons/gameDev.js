const engineFiles = {
  "Main.java": `import engine.GameCanvas;
import engine.GameObject;
import engine.GameLoop;
import org.teavm.jso.JSExport;

public class Main {
    private static PlayerController player;
    public static void main(String[] args) {
        GameObject object = new GameObject("Gracz", 180, 120);
        player = object.addComponent(new PlayerController());
        GameLoop.start();
    }
    @JSExport public static void tick(double delta) {
        try { if (GameLoop.isRunning()) update(delta); }
        finally { engine.Input.endFrame(); }
    }
    @JSExport public static String frame() { return GameCanvas.frame(); }
    @JSExport public static void setKey(String key, boolean pressed) { engine.Input.setKey(key, pressed); }
    @JSExport public static void resize(double width, double height) { GameCanvas.setSize(width, height); }
    @JSExport public static void dispose() {
        if (player != null) player.gameObject.destroy();
        GameLoop.stop();
    }
    public static void update(double delta) {
        GameCanvas.clear("#0b2033");
        player.gameObject.update(delta);
        player.gameObject.draw("#76b9f2");
    }
}
`,
  "PlayerController.java": `import engine.Input;
import engine.PlayerController2D;

public class PlayerController extends PlayerController2D {
    @Override public void update(double delta) {
        if (Input.isKeyDown("ArrowLeft") || Input.isKeyDown("a")) gameObject.transform.x -= 120 * delta;
        if (Input.isKeyDown("ArrowRight") || Input.isKeyDown("d")) gameObject.transform.x += 120 * delta;
        if (Input.isKeyDown("ArrowUp") || Input.isKeyDown("w")) gameObject.transform.y -= 120 * delta;
        if (Input.isKeyDown("ArrowDown") || Input.isKeyDown("s")) gameObject.transform.y += 120 * delta;
    }
}
`,
};

const engineChecks = [
  { kind: "contains", file: "PlayerController.java", value: "class PlayerController extends PlayerController2D", label: "Własny kontroler gracza" },
  { kind: "contains", file: "PlayerController.java", value: "Input.isKeyDown", label: "Odczyt klawiatury" },
  { kind: "contains", file: "Main.java", value: "GameLoop.start()", label: "Start runtime TeaVM" },
  { kind: "contains", file: "Main.java", value: "GameCanvas.clear", label: "Rysowanie na canvasie" },
];

const task = (id, title, prompt, steps) => ({
  id, title, mode: "guided", prompt, steps, hints: [], starterFiles: engineFiles,
  solutionFiles: engineFiles, checks: engineChecks, mainClass: "Main", runMode: "game", engine: true,
});
const independentTask = (id, title, prompt, steps) => ({ ...task(id, title, prompt, steps), mode: "independent", hints: undefined });

const scoreFiles = {
  ...engineFiles,
  "ScoreComponent.java": `import engine.Component;
import engine.GameCanvas;
import engine.Input;

public class ScoreComponent extends Component {
    private int points;
    public void collect() { points++; }
    @Override public void update(double delta) {
        if (Input.isKeyPressed("Space")) collect();
        GameCanvas.drawText("Punkty: " + points, 10, 20, "#ffffff");
    }
}
`,
  "Main.java": engineFiles["Main.java"].replace(
    "player = object.addComponent(new PlayerController());",
    "player = object.addComponent(new PlayerController());\n        object.addComponent(new ScoreComponent());",
  ),
};

export const gameDevLessons = [
  {
    id: "game-dev-13", track: "game-dev", order: 13,
    title: "Pierwszy obiekt w silniku", summary: "GameObject, Transform i canvas",
    objective: "Utworzysz obiekt silnika i narysujesz go przez fasadę Canvas ↔ TeaVM.",
    theory: [
      { title: "Runtime silnika jest gotowy", text: "Klasy z pakietu engine są wbudowane i chronione. Ty tworzysz kod gry oraz własne klasy.", code: `GameObject player = new GameObject("Gracz", 180, 120);` },
      { title: "Pozycja jest stanem obiektu", text: "Transform przechowuje x i y. GameCanvas tłumaczy rysowanie Java na operacje canvasu.", code: `player.transform.x += 4;` },
    ],
    tips: ["Nie edytuj engine/* — to API silnika.", "Nowe zachowania twórz we własnych plikach Java."],
    tasks: [task("game-dev-13-task", "Narysuj obiekt silnika", "Utwórz GameObject i narysuj go przez GameCanvas.", ["Użyj GameObject z pakietu engine.", "Dodaj własny komponent lub klasę pomocniczą.", "Wywołaj draw() w update()."]), independentTask("game-dev-13-independent-1", "Dodaj przeciwnika", "Utwórz własną klasę Enemy i narysuj drugi obiekt.", ["Dodaj plik Enemy.java.", "Utwórz obiekt Enemy w start().", "Narysuj go innym kolorem."]), independentTask("game-dev-13-independent-2", "Przesuń skarb", "Dodaj własny obiekt Treasure i ustaw jego Transform.", ["Utwórz klasę Treasure.", "Nadaj skarbowi pozycję.", "Narysuj go na canvasie."])],
  },
  {
    id: "game-dev-14", track: "game-dev", order: 14,
    title: "Własny PlayerController", summary: "klasy użytkownika i wejście",
    objective: "Napiszesz własny kontroler i podłączysz go do pętli update(delta).",
    theory: [
      { title: "Silnik daje bazę, gra daje logikę", text: "PlayerController2D tylko definiuje kontrakt. Cały sposób poruszania piszesz sam.", code: `class PlayerController extends PlayerController2D { void update(double delta) { ... } }` },
      { title: "Input jest fasadą", text: "Input.isKeyDown odczytuje stan klawiszy przechwycony przez canvas i przekazany do TeaVM.", code: `if (Input.isKeyDown("ArrowRight")) { ... }` },
    ],
    tips: ["Użytkownik tworzy klasy gry; engine dostarcza tylko API."],
    tasks: [task("game-dev-14-task", "Steruj graczem", "Rozszerz PlayerController2D i obsłuż cztery kierunki.", ["Utwórz własną klasę kontrolera.", "Sprawdź Input dla strzałek lub WASD.", "Zmień transform w update(delta)."]), independentTask("game-dev-14-independent-1", "Sprint", "Dodaj przyspieszenie po wciśnięciu Shift.", ["Sprawdź dodatkowy klawisz.", "Zmień prędkość ruchu.", "Przetestuj na canvasie."]), independentTask("game-dev-14-independent-2", "Granice planszy", "Nie pozwól graczowi wyjść poza canvas.", ["Odczytaj pozycję.", "Dodaj warunki graniczne.", "Przetestuj wszystkie kierunki."])],
  },
  {
    id: "game-dev-15", track: "game-dev", order: 15,
    title: "Własny komponent gry", summary: "kompozycja i pętla gry",
    objective: "Dodasz własny komponent i połączysz go z obiektem w działającej pętli gry.",
    theory: [
      { title: "Komponenty należą do użytkownika", text: "Engine nie narzuca Health, Score ani Enemy. Te klasy tworzysz sam i podpinasz do GameObject.", code: `class ScoreComponent { int points; }` },
      { title: "Pętla jest sterowana przez runtime", text: "TeaVM eksportuje tick, frame i setKey. Worker wywołuje tick co klatkę, a GameObject aktualizuje swoje komponenty.", code: `object.addComponent(new ScoreComponent());\nobject.update(delta);` },
    ],
    tips: ["Trzymaj reguły gry w klasach użytkownika, nie w wrapperze."],
    tasks: [task("game-dev-15-task", "Dodaj komponent punktów", "Napisz własny komponent Score i pokaż wynik podczas działania sceny.", ["Utwórz klasę ScoreComponent.", "Dodaj metodę collect().", "Wyświetl stan komponentu w update()."]), independentTask("game-dev-15-independent-1", "Komponent zdrowia", "Dodaj własny HealthComponent do gracza.", ["Utwórz klasę komponentu.", "Dodaj pole hearts.", "Zmniejsz zdrowie po zdarzeniu."]), independentTask("game-dev-15-independent-2", "Kolizja z monetą", "Napisz własną regułę zbierania monety.", ["Dodaj klasę Coin.", "Sprawdź odległość obiektów.", "Zwiększ wynik po kolizji."])],
  },
];

const scoreTask = gameDevLessons[2].tasks[0];
scoreTask.solutionFiles = scoreFiles;
scoreTask.checks = [
  ...engineChecks,
  { kind: "contains", file: "ScoreComponent.java", value: "extends Component", label: "Własny komponent punktów" },
  { kind: "contains", file: "Main.java", value: "new ScoreComponent()", label: "Podłączenie komponentu" },
];
scoreTask.prompt = "Napisz ScoreComponent: każde nowe wciśnięcie spacji zwiększa punkty o 1. Pokaż wynik na canvasie i podłącz komponent do gracza.";

const sprintTask = gameDevLessons[1].tasks[1];
sprintTask.solutionFiles = {
  ...engineFiles,
  "PlayerController.java": engineFiles["PlayerController.java"]
    .replace("@Override public void update(double delta) {", "@Override public void update(double delta) {\n        double speed = Input.isKeyDown(\"Shift\") ? 240 : 120;")
    .replaceAll("120 * delta", "speed * delta"),
};
sprintTask.prompt = "Dodaj sprint: ruch ma prędkość 120 pikseli na sekundę, a z wciśniętym Shiftem 240. Obsłuż cztery kierunki.";
sprintTask.gameTests = [
  { label: "Zwykły ruch w prawo", keys: ["ArrowRight"], delta: 0.1, expected: { x: 192, y: 120 } },
  { label: "Sprint w prawo", keys: ["ArrowRight", "Shift"], delta: 0.1, expected: { x: 204, y: 120 } },
  { label: "Sprint w lewo", keys: ["ArrowLeft", "Shift"], delta: 0.1, expected: { x: 156, y: 120 } },
  { label: "Sprint w górę", keys: ["ArrowUp", "Shift"], delta: 0.1, expected: { x: 180, y: 96 } },
  { label: "Sprint w dół", keys: ["ArrowDown", "Shift"], delta: 0.1, expected: { x: 180, y: 144 } },
];

const boundsTask = gameDevLessons[1].tasks[2];
boundsTask.solutionFiles = {
  ...engineFiles,
  "PlayerController.java": engineFiles["PlayerController.java"]
    .replace("import engine.Input;", "import engine.Input;\nimport engine.GameCanvas;")
    .replace("    }\n}", `        gameObject.transform.x = Math.max(0, Math.min(Math.max(0, GameCanvas.getWidth() - 28), gameObject.transform.x));
        gameObject.transform.y = Math.max(0, Math.min(Math.max(0, GameCanvas.getHeight() - 28), gameObject.transform.y));
    }
}`),
};
boundsTask.prompt = "Zatrzymaj cały prostokąt gracza (28 × 28) wewnątrz planszy. Uwzględnij GameCanvas.getWidth() i getHeight(), również po zmianie rozmiaru panelu.";
boundsTask.gameTests = [
  { label: "Lewa granica", keys: ["ArrowLeft"], steps: 100, delta: 0.1, expected: { x: 0 } },
  { label: "Górna granica", keys: ["ArrowUp"], steps: 100, delta: 0.1, expected: { y: 0 } },
  { label: "Prawa granica po zmianie rozmiaru", width: 350, keys: ["ArrowRight"], steps: 100, delta: 0.1, expected: { x: 322 } },
  { label: "Dolna granica po zmianie rozmiaru", height: 250, keys: ["ArrowDown"], steps: 100, delta: 0.1, expected: { y: 222 } },
];

function extraObjectFiles(className, name, x, y, color) {
  return {
    ...engineFiles,
    [`${className}.java`]: `import engine.GameObject;
public class ${className} extends GameObject {
    public ${className}() { super("${name}", ${x}, ${y}); }
}
`,
    "Main.java": engineFiles["Main.java"]
      .replace("private static PlayerController player;", `private static PlayerController player;\n    private static ${className} extra;`)
      .replace("GameLoop.start();", `extra = new ${className}();\n        GameLoop.start();`)
      .replace('player.gameObject.draw("#76b9f2");', `player.gameObject.draw("#76b9f2");\n        extra.draw("${color}");`),
  };
}
const enemyTask = gameDevLessons[0].tasks[1];
enemyTask.solutionFiles = extraObjectFiles("Enemy", "Przeciwnik", 60, 80, "#ee6666");
enemyTask.prompt = "Utwórz Enemy.java: własną klasę Enemy rozszerzającą GameObject. Dodaj czerwonego przeciwnika w pozycji (60, 80) i rysuj go obok gracza.";
enemyTask.gameTests = [{ label: "Czerwony przeciwnik we wskazanej pozycji", rectIndex: 1, color: "#ee6666", expected: { x: 60, y: 80 } }];
enemyTask.steps = ["Dodaj plik Enemy.java.", "Utwórz Enemy w main().", "Narysuj go po graczu."];
const treasureTask = gameDevLessons[0].tasks[2];
treasureTask.solutionFiles = extraObjectFiles("Treasure", "Skarb", 240, 180, "#ffd166");
treasureTask.prompt = "Utwórz Treasure.java: własną klasę Treasure rozszerzającą GameObject. Ustaw skarb w pozycji (240, 180), nadaj mu złoty kolor i rysuj po graczu.";
treasureTask.gameTests = [{ label: "Złoty skarb we wskazanej pozycji", rectIndex: 1, color: "#ffd166", expected: { x: 240, y: 180 } }];

const healthTask = gameDevLessons[2].tasks[1];
healthTask.solutionFiles = {
  ...engineFiles,
  "HealthComponent.java": `import engine.Component;
import engine.GameCanvas;
import engine.Input;
public class HealthComponent extends Component {
    private int hearts = 3;
    public void damage() { hearts = Math.max(0, hearts - 1); }
    @Override public void update(double delta) {
        if (Input.isKeyPressed("h")) damage();
        GameCanvas.drawText("Zdrowie: " + hearts, 10, 20, "#ffffff");
    }
}
`,
  "Main.java": engineFiles["Main.java"].replace(
    "player = object.addComponent(new PlayerController());",
    "player = object.addComponent(new PlayerController());\n        object.addComponent(new HealthComponent());",
  ),
};
healthTask.prompt = "Dodaj HealthComponent z trzema sercami. Każde nowe naciśnięcie H odbiera jedno serce; zdrowie nie może spaść poniżej zera. Wyświetl Zdrowie: liczba na canvasie.";
healthTask.gameTests = [
  { label: "Początkowe zdrowie", text: "Zdrowie: 3" },
  { label: "Utrata serca po H", keys: ["h"], text: "Zdrowie: 2" },
  { label: "Trzymanie H nie powtarza obrażeń", keys: ["h"], steps: 10, text: "Zdrowie: 2" },
];
scoreTask.gameTests = [
  { label: "Początkowy wynik", text: "Punkty: 0" },
  { label: "Punkt po spacji", keys: ["Space"], text: "Punkty: 1" },
  { label: "Trzymanie spacji daje jeden punkt", keys: ["Space"], steps: 10, text: "Punkty: 1" },
];

const coinTask = gameDevLessons[2].tasks[2];
coinTask.solutionFiles = {
  ...engineFiles,
  "Coin.java": `import engine.GameObject;
public class Coin extends GameObject {
    public Coin() { super("Moneta", 240, 120); }
    public boolean collect(GameObject player) {
        if (!active) return false;
        boolean overlaps = player.transform.x < transform.x + 28
            && player.transform.x + 28 > transform.x
            && player.transform.y < transform.y + 28
            && player.transform.y + 28 > transform.y;
        if (!overlaps) return false;
        active = false;
        return true;
    }
}
`,
  "Main.java": engineFiles["Main.java"]
    .replace("private static PlayerController player;", "private static PlayerController player;\n    private static Coin coin;\n    private static int points;")
    .replace("GameLoop.start();", "coin = new Coin();\n        GameLoop.start();")
    .replace('player.gameObject.draw("#76b9f2");', `if (coin.collect(player.gameObject)) points++;
        player.gameObject.draw("#76b9f2");
        coin.draw("#ffd166");
        GameCanvas.drawText("Punkty: " + points, 10, 20, "#ffffff");`),
};
coinTask.prompt = "Dodaj Coin w (240, 120). Po nałożeniu prostokąta gracza na monetę zwiększ wynik o 1 i ukryj monetę. Zebraną monetę można zaliczyć tylko raz. Pokaż Punkty: liczba na canvasie.";
coinTask.gameTests = [
  { label: "Brak punktu przed kolizją", text: "Punkty: 0" },
  { label: "Punkt po wejściu w monetę", keys: ["ArrowRight"], steps: 5, delta: 0.1, text: "Punkty: 1" },
  { label: "Moneta daje punkt tylko raz", keys: ["ArrowRight"], steps: 30, delta: 0.1, text: "Punkty: 1" },
  { label: "Brak punktu przy ominięciu monety", keys: ["ArrowUp"], steps: 10, delta: 0.1, text: "Punkty: 0" },
];

gameDevLessons[0].tasks[0].gameTests = [
  { label: "Gracz w pozycji startowej", expected: { x: 180, y: 120 }, color: "#76b9f2" },
];
gameDevLessons[1].tasks[0].gameTests = [
  { label: "Ruch w prawo", keys: ["ArrowRight"], delta: 0.1, expected: { x: 192, y: 120 } },
  { label: "Ruch w lewo", keys: ["ArrowLeft"], delta: 0.1, expected: { x: 168, y: 120 } },
  { label: "Ruch w górę", keys: ["ArrowUp"], delta: 0.1, expected: { x: 180, y: 108 } },
  { label: "Ruch w dół", keys: ["ArrowDown"], delta: 0.1, expected: { x: 180, y: 132 } },
  { label: "Brak ruchu bez klawiszy", steps: 10, expected: { x: 180, y: 120 } },
];
gameDevLessons[1].tasks[0].prompt = "Rozszerz PlayerController2D i obsłuż cztery strzałki. Poruszaj graczem z prędkością 120 pikseli na sekundę, uwzględniając delta.";

gameDevLessons[0].tasks[0].gameTests = [{ label: "Sprite gracza w scenie", texture: "player", expected: { x: 180, y: 120 } }];
enemyTask.gameTests = [{ label: "Sprite przeciwnika w scenie", texture: "slime", expected: { x: 60, y: 80 } }];
treasureTask.gameTests = [{ label: "Sprite skarbu w scenie", texture: "gem", expected: { x: 240, y: 180 } }];

const sceneBootstrap = `import engine.*;
import org.teavm.jso.JSExport;
public class Main {
    private static StudentGame game;
    public static void main(String[] args) { game = new StudentGame(); game.start(); }
    @JSExport public static void tick(double delta) { game.step(delta); }
    @JSExport public static String frame() { return GameCanvas.frame(); }
    @JSExport public static void setKey(String key, boolean pressed) { Input.setKey(key, pressed); }
    @JSExport public static void resize(double width, double height) { GameCanvas.setSize(width, height); }
    @JSExport public static void dispose() { game.dispose(); }
}
`;
const firstSceneFiles = {
  "Main.java": sceneBootstrap,
  "StudentGame.java": `import engine.*;
public class StudentGame extends Game {
    @Override public void onCreate() {
        GameObject player = createObject("Gracz").setPosition(180, 120);
        player.addComponent(new Sprite("player", 32, 32));
    }
}
`,
};
const firstSceneTask = gameDevLessons[0].tasks[0];
firstSceneTask.starterFiles = firstSceneFiles;
firstSceneTask.solutionFiles = firstSceneFiles;
firstSceneTask.checks = [];
firstSceneTask.prompt = "Utwórz scenę StudentGame. W onCreate dodaj gracza w (180, 120) z komponentem Sprite o teksturze player. Silnik sam rysuje komponenty sceny.";
firstSceneTask.steps = ["Otwórz StudentGame.java.", "Utwórz obiekt przez createObject i ustaw pozycję.", "Dodaj Sprite i uruchom scenę."];
for (const [exercise, className, texture, x, y] of [
  [enemyTask, "Enemy", "slime", 60, 80],
  [treasureTask, "Treasure", "gem", 240, 180],
]) {
  exercise.starterFiles = firstSceneFiles;
  exercise.checks = [];
  exercise.solutionFiles = {
    ...firstSceneFiles,
    "StudentGame.java": firstSceneFiles["StudentGame.java"].replace(
      'player.addComponent(new Sprite("player", 32, 32));',
      `player.addComponent(new Sprite("player", 32, 32));\n        createObject("${className}").setPosition(${x}, ${y}).addComponent(new ${className}());`,
    ),
    [`${className}.java`]: `import engine.*;
public class ${className} extends Component {
    @Override public void onCreate() {
        gameObject.addComponent(new Sprite("${texture}", 32, 32));
    }
}
`,
  };
  exercise.prompt = `Dodaj własny komponent ${className} w osobnym pliku. Podłącz go do nowego obiektu w (${x}, ${y}). W onCreate komponentu dodaj Sprite o teksturze ${texture}.`;
  exercise.steps = [`Utwórz ${className}.java.`, "Dodaj obiekt i własny komponent w StudentGame.", "Uruchom scenę."];
}
gameDevLessons[0].summary = "Scena Game, GameObject i Sprite";
gameDevLessons[0].theory = [
  { title: "Scena tworzy obiekty", text: "Twoja klasa rozszerza Game. onCreate uruchamia się raz; silnik zarządza obiektami sceny i sprzątaniem.", code: 'GameObject player = createObject("Gracz").setPosition(180, 120);' },
  { title: "Komponent określa wygląd", text: "Sprite wybiera teksturę z atlasu. Pozycja jest środkiem obrazu. Nie piszesz ręcznej pętli rysowania.", code: 'player.addComponent(new Sprite("player", 32, 32));' },
];

const sceneController = `import engine.*;
public class PlayerController extends Component {
    @Override public void onUpdate(double delta) {
        double x = (Input.isKeyDown("ArrowRight") || Input.isKeyDown("d") ? 1 : 0)
            - (Input.isKeyDown("ArrowLeft") || Input.isKeyDown("a") ? 1 : 0);
        double y = (Input.isKeyDown("ArrowDown") || Input.isKeyDown("s") ? 1 : 0)
            - (Input.isKeyDown("ArrowUp") || Input.isKeyDown("w") ? 1 : 0);
        requireComponent(CharacterController2D.class).move(x, y, 120);
    }
}
`;
const movementSceneFiles = {
  ...firstSceneFiles,
  "StudentGame.java": firstSceneFiles["StudentGame.java"].replace(
    'player.addComponent(new Sprite("player", 32, 32));',
    'player.addComponent(new Sprite("player", 32, 32));\n        player.addComponent(new CharacterController2D());\n        player.addComponent(new PlayerController());',
  ),
  "PlayerController.java": sceneController,
};
const movementTask = gameDevLessons[1].tasks[0];
movementTask.starterFiles = movementSceneFiles;
movementTask.solutionFiles = movementSceneFiles;
movementTask.prompt = "Napisz PlayerController jako własny Component. Odczytaj strzałki i WASD, a następnie wywołaj move na CharacterController2D z prędkością 120 pikseli na sekundę.";
movementTask.steps = ["Otwórz PlayerController.java.", "Wyznacz kierunek z Input.", "Wywołaj move na wymaganym komponencie ruchu."];
movementTask.javaTestMainClass = "PlayerControllerTests";
movementTask.javaTestFiles = {
  "PlayerControllerTests.java": `import engine.*;
public class PlayerControllerTests {
    static void check(boolean passed, String label) {
        if (!passed) throw new IllegalArgumentException(label);
        System.out.println("PASS " + label);
    }
    public static void main(String[] args) {
        Game game = new Game();
        GameObject player = game.createObject("test player").setPosition(100, 100);
        player.addComponent(new CharacterController2D());
        player.addComponent(new PlayerController());
        game.start();
        try {
            game.step(0.1);
            check(player.transform.x == 100 && player.transform.y == 100, "Brak ruchu bez wejścia");
            Input.setKey("ArrowRight", true); game.step(0.1); Input.setKey("ArrowRight", false);
            check(player.transform.x > 100 && player.transform.y == 100, "Ruch w prawo");
            double stopped = player.transform.x; game.step(0.1);
            check(player.transform.x == stopped, "Zatrzymanie po puszczeniu klawisza");
        } finally { Input.setKey("ArrowRight", false); game.dispose(); }
    }
}
`,
};
sprintTask.starterFiles = movementSceneFiles;
sprintTask.solutionFiles = {...movementSceneFiles, "PlayerController.java": sceneController.replace('move(x, y, 120)', 'move(x, y, Input.isKeyDown("Shift") ? 240 : 120)')};
boundsTask.starterFiles = movementSceneFiles;
boundsTask.solutionFiles = {
  ...movementSceneFiles,
  "PlayerController.java": sceneController.replace(
    'requireComponent(CharacterController2D.class).move(x, y, 120);',
    `CharacterController2D controller = requireComponent(CharacterController2D.class);
        controller.move(x, y, 120);
        if (delta > 0) {
            double px = gameObject.transform.x, py = gameObject.transform.y;
            double nx = Math.max(16, Math.min(Math.max(16, GameCanvas.getWidth() - 16), px + controller.velocity.x * delta));
            double ny = Math.max(16, Math.min(Math.max(16, GameCanvas.getHeight() - 16), py + controller.velocity.y * delta));
            controller.velocity.x = (nx - px) / delta;
            controller.velocity.y = (ny - py) / delta;
        }`,
  ),
};
boundsTask.prompt = "Utrzymaj cały sprite 32 × 32 wewnątrz planszy. Pozycja oznacza środek; ogranicz ruch z uwzględnieniem połowy rozmiaru i aktualnych wymiarów canvasu.";
boundsTask.gameTests = [
  {label:"Lewa granica",texture:"player",keys:["ArrowLeft"],steps:100,delta:0.1,expected:{x:16}},
  {label:"Górna granica",texture:"player",keys:["ArrowUp"],steps:100,delta:0.1,expected:{y:16}},
  {label:"Prawa granica",texture:"player",width:350,keys:["ArrowRight"],steps:100,delta:0.1,expected:{x:334}},
  {label:"Dolna granica",texture:"player",height:250,keys:["ArrowDown"],steps:100,delta:0.1,expected:{y:234}},
];
for (const exercise of [scoreTask, healthTask]) {
  const className = exercise === scoreTask ? "ScoreComponent" : "HealthComponent";
  const componentSource = exercise.solutionFiles[`${className}.java`].replace('void update(', 'void onUpdate(');
  exercise.starterFiles = movementSceneFiles;
  exercise.solutionFiles = {
    ...movementSceneFiles,
    [`${className}.java`]: componentSource,
    "StudentGame.java": movementSceneFiles["StudentGame.java"].replace('player.addComponent(new PlayerController());', `player.addComponent(new PlayerController());\n        player.addComponent(new ${className}());`),
  };
}
coinTask.starterFiles = movementSceneFiles;
coinTask.solutionFiles = {
  ...movementSceneFiles,
  "Collector.java": `import engine.*;
public class Collector extends Component {
    private int points;
    @Override public void onTrigger(GameObject other) {
        if (other.hasComponent(Coin.class) && !other.destroyed) { points++; other.destroy(); }
    }
    @Override public void onUpdate(double delta) { GameCanvas.drawText("Punkty: " + points, 10, 20, "#ffffff"); }
}
`,
  "Coin.java": `import engine.*;
public class Coin extends Component {
    @Override public void onCreate() {
        gameObject.addComponent(new Sprite("coin", 32, 32));
        gameObject.addComponent(new Trigger2D());
    }
}
`,
  "StudentGame.java": movementSceneFiles["StudentGame.java"].replace('player.addComponent(new PlayerController());', 'player.addComponent(new PlayerController());\n        player.addComponent(new Collector());\n        createObject("Moneta").setPosition(240, 120).addComponent(new Coin());'),
};
coinTask.prompt = "Dodaj własne komponenty Coin i Collector. Moneta w (240, 120) ma Sprite i Trigger2D. W onTrigger gracza zwiększ punkty i zniszcz monetę; pokaż wynik na canvasie.";
coinTask.steps = ["Dodaj Coin.java i Collector.java.", "Podłącz komponenty do obiektów sceny.", "Obsłuż kontakt w onTrigger."];
for (const lesson of gameDevLessons) for (const exercise of lesson.tasks) {
  exercise.checks = [];
  exercise.gameTests = exercise.gameTests.map(test => test.text !== undefined ? test : {...test,texture:test.texture || "player"});
}
gameDevLessons[1].theory = [
  {title:"Własna logika wejścia",text:"PlayerController jest Twoim komponentem. Input podaje stan klawiszy; CharacterController2D wykonuje ruch i obsługuje kolizje.",code:'requireComponent(CharacterController2D.class).move(x, y, 120);'},
  {title:"Czas i prędkość",text:"move przyjmuje piksele na sekundę. Silnik mnoży prędkość przez czas klatki; nie mnożysz jej ponownie przez delta.",code:'public void onUpdate(double delta) { /* odczyt Input i move */ }'},
];
gameDevLessons[2].theory = [
  {title:"Własne komponenty",text:"Score, Health i Collector należą do Twojej gry. Dodajesz je do obiektów sceny; silnik wywołuje onCreate, onUpdate i onDestroy.",code:'player.addComponent(new HealthComponent());'},
  {title:"Kontakty",text:"Collider2D blokuje ruch. Trigger2D przekazuje kontakt do onTrigger bez blokowania. Regułę zbierania piszesz sam.",code:'public void onTrigger(GameObject other) { /* reguła gry */ }'},
];
