// SERVER ONLY: reference implementations must never enter a client bundle.
// 20 task variants for the „2 · Game Dev” family on the lab-game-v2 engine.
// Scenes run headless: JavaTest steps the game and asserts object state.

const LEVEL_LINE = [
  'Scena jest prawie gotowa — dodaj komponenty do obiektów zgodnie z komentarzami TODO w GameMain.',
  'Scena w GameMain jest gotowa — zaimplementuj ciała metod oznaczone TODO w klasach komponentów.',
  'Napisz wszystko samodzielnie: klasę GameMain ze sceną oraz klasy komponentów; możesz dodawać własne pliki .java.',
];

// Shared student components reused across variants (impl only; focus variants skeletonize them).
const playerController = speed => `public class PlayerController extends Component {
    public double speed = ${speed};
    @Override public void onUpdate(double delta) {
        double x = (getGame().input.isKeyDown("d") || getGame().input.isKeyDown("ArrowRight")) ? 1 : 0;
        requireComponent(CharacterController2D.class).move(x, 0, speed);
    }
}
`;

const healthImpl = `public class Health extends Component {
    public double maxHealth, currentHealth;
    public boolean dead;
    public Health(double max) { maxHealth = max; currentHealth = max; }
    public boolean damage(double amount) {
        if (dead || amount <= 0) return false;
        currentHealth = Math.max(0, currentHealth - amount);
        if (currentHealth == 0) dead = true;
        return true;
    }
    public void heal(double amount) {
        if (dead || amount <= 0) return;
        currentHealth = Math.min(maxHealth, currentHealth + amount);
    }
}
`;

export const javaGameDevVariants = [
  {
    id: 'walk-right',
    build({ pick }) {
      const speed = pick([100, 120, 150]), expected = 100 + speed;
      return {
        title: 'Marsz w prawo',
        contract: `Komponent PlayerController: gdy trzymany jest klawisz „d” lub „ArrowRight”, obiekt „Player” porusza się w prawo z prędkością ${speed} px/s przez CharacterController2D.move; po puszczeniu klawisza staje w miejscu. Scena: „Player” na (100, 100) z ShapeRenderer, Collider2D(24,24), CharacterController2D i PlayerController (pole public double speed).`,
        components: {
          PlayerController: {
            focus: true,
            impl: playerController(speed),
            skeleton: `public class PlayerController extends Component {
    public double speed = ${speed};
    @Override public void onUpdate(double delta) {
        // TODO: odczytaj klawisz "d"/"ArrowRight" i wywołaj move(x, 0, speed)
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'player.addComponent(new Collider2D(24, 24));',
          'player.addComponent(new CharacterController2D());',
          'player.addComponent(new PlayerController());',
        ],
        todo: [{ match: 'player.addComponent(new PlayerController());', hint: 'dodaj graczowi komponent PlayerController' }],
        needs: [{ var: 'player', name: 'Player', components: [{ type: 'PlayerController', var: 'ctl' }] }],
        phases: [
          { keys: ['d'], steps: 10, after: [{ label: `Player przesuwa się w prawo przy „d” (oczekiwano x=${expected})`, expr: `Math.abs(player.transform.x - ${expected}) <= 1.5` }] },
          { steps: 5, after: [{ label: 'Player zatrzymuje się po puszczeniu klawisza', expr: `Math.abs(player.transform.x - ${expected}) <= 1.5` }] },
        ],
        checks: [
          { label: 'Player ma wymaganą prędkość', expr: `Math.abs(ctl.speed - ${speed}) <= 0.001` },
        ],
      };
    },
  },
  {
    id: 'patrol-enemy',
    build({ int }) {
      const left = int(80, 140), right = left + int(120, 200), speed = int(60, 100);
      return {
        title: 'Patrol przeciwnika',
        contract: `Komponent Patrol: obiekt „Slime” patroluje poziomo między x=${left} a x=${right} z prędkością ${speed} px/s i odwraca kierunek na granicach. Klasa Patrol ma publiczne pola double left, right, speed i int dir (1 = w prawo) oraz konstruktor Patrol(double left, double right, double speed). Scena: „Slime” na (${left}, 100) z ShapeRenderer, Collider2D(24,24), CharacterController2D i Patrol.`,
        components: {
          Patrol: {
            focus: true,
            impl: `public class Patrol extends Component {
    public double left, right, speed;
    public int dir = 1;
    public Patrol(double left, double right, double speed) { this.left = left; this.right = right; this.speed = speed; }
    @Override public void onUpdate(double delta) {
        requireComponent(CharacterController2D.class).move(dir, 0, speed);
        if (transform.x >= right) dir = -1;
        else if (transform.x <= left) dir = 1;
    }
}
`,
            skeleton: `public class Patrol extends Component {
    public double left, right, speed;
    public int dir = 1;
    public Patrol(double left, double right, double speed) { this.left = left; this.right = right; this.speed = speed; }
    @Override public void onUpdate(double delta) {
        // TODO: ruszaj w kierunku dir; na granicach left/right odwróć dir
    }
}
`,
          },
        },
        setup: [
          'GameObject slime = createObject("Slime");',
          'slime.setPosition(' + left + ', 100);',
          'slime.addComponent(new ShapeRenderer(24, 24, "#f87171"));',
          'slime.addComponent(new Collider2D(24, 24));',
          'slime.addComponent(new CharacterController2D());',
          `slime.addComponent(new Patrol(${left}, ${right}, ${speed}));`,
        ],
        todo: [{ match: `slime.addComponent(new Patrol(${left}, ${right}, ${speed}));`, hint: `dodaj Slime komponent Patrol(${left}, ${right}, ${speed})` }],
        needs: [{ var: 'slime', name: 'Slime', components: [{ type: 'Patrol', var: 'patrol' }] }],
        phases: [
          { steps: 10, after: [{ label: `Slime rusza w prawo (po 1 s x≈${left + speed})`, expr: `Math.abs(slime.transform.x - ${left + speed}) <= 1.5` }] },
          { steps: 30, after: [
            { label: 'Slime zawraca na granicach i nie wyjeżdża poza patrol', expr: `slime.transform.x <= ${right + 5} && slime.transform.x >= ${left - 5}` },
            { label: 'Slime nie jedzie ciągle w prawo (odwrócił się)', expr: `slime.transform.x < ${left + speed * 4 - 10}` },
          ] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'auto-run',
    build({ int }) {
      const stopX = int(250, 350), speed = int(80, 150);
      return {
        title: 'Automatyczny bieg',
        contract: `Komponent AutoRun: obiekt „Runner” sam porusza się w prawo z prędkością ${speed} px/s i zatrzymuje się dokładnie na x=${stopX} (velocity 0, pozycja = stopX). Klasa ma publiczne pola double speed = ${speed} i double stopX = ${stopX}. Scena: „Runner” na (100, 120) z ShapeRenderer, Collider2D(24,24), CharacterController2D i AutoRun.`,
        components: {
          AutoRun: {
            focus: true,
            impl: `public class AutoRun extends Component {
    public double speed = ${speed}, stopX = ${stopX};
    @Override public void onUpdate(double delta) {
        CharacterController2D controller = requireComponent(CharacterController2D.class);
        if (transform.x >= stopX) {
            transform.x = stopX;
            controller.move(0, 0, speed);
        } else {
            controller.move(1, 0, speed);
        }
    }
}
`,
            skeleton: `public class AutoRun extends Component {
    public double speed = ${speed}, stopX = ${stopX};
    @Override public void onUpdate(double delta) {
        // TODO: jedź w prawo do stopX, potem zatrzymaj ruch na pozycji stopX
    }
}
`,
          },
        },
        setup: [
          'GameObject runner = createObject("Runner");',
          'runner.setPosition(100, 120);',
          'runner.addComponent(new ShapeRenderer(24, 24, "#76b9f2"));',
          'runner.addComponent(new Collider2D(24, 24));',
          'runner.addComponent(new CharacterController2D());',
          'runner.addComponent(new AutoRun());',
        ],
        todo: [{ match: 'runner.addComponent(new AutoRun());', hint: 'dodaj Runner komponent AutoRun' }],
        needs: [{ var: 'runner', name: 'Runner', components: [{ type: 'CharacterController2D', var: 'cc' }, { type: 'AutoRun', var: 'run' }] }],
        phases: [
          { steps: 10, after: [{ label: 'Runner ruszył sam z miejsca', expr: 'runner.transform.x > 150' }] },
          { steps: 30, after: [
            { label: `Runner zatrzymał się na stopX=${stopX}`, expr: `Math.abs(runner.transform.x - ${stopX}) <= 0.5` },
            { label: 'Po zatrzymaniu prędkość wynosi 0', expr: 'Math.abs(cc.velocity.x) <= 0.001' },
          ] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'coin-pickup',
    build({ int }) {
      const coinX = 60 + int(140, 220);
      return {
        title: 'Zbieranie monety',
        contract: `Obiekt „Coin” z Trigger2D i komponentem Pickup: kontakt z graczem dodaje 1 złoto do komponentu Wallet gracza i niszczy monetę. Klasy: Wallet (public int gold) na „Player”, Pickup z onTrigger(GameObject other) na „Coin”. Scena: „Player” (60, 100) z Collider2D(24,24), CharacterController2D, PlayerController i Wallet; „Coin” (${coinX}, 100) z Trigger2D(20,20) i Pickup.`,
        components: {
          PlayerController: { focus: false, impl: playerController(120), skeleton: '' },
          Wallet: {
            focus: false,
            impl: `public class Wallet extends Component {
    public int gold;
}
`,
            skeleton: '',
          },
          Pickup: {
            focus: true,
            impl: `public class Pickup extends Component {
    @Override public void onTrigger(GameObject other) {
        Wallet wallet = other.getComponent(Wallet.class);
        if (wallet != null) {
            wallet.gold += 1;
            gameObject.destroy();
        }
    }
}
`,
            skeleton: `public class Pickup extends Component {
    @Override public void onTrigger(GameObject other) {
        // TODO: dodaj 1 do wallet.gold drugiego obiektu i zniszcz monetę
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(60, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'player.addComponent(new Collider2D(24, 24));',
          'player.addComponent(new CharacterController2D());',
          'player.addComponent(new PlayerController());',
          'player.addComponent(new Wallet());',
          `GameObject coin = createObject("Coin");`,
          `coin.setPosition(${coinX}, 100);`,
          'coin.addComponent(ShapeRenderer.circle(8, "#ffd166"));',
          'coin.addComponent(new Trigger2D(20, 20));',
          'coin.addComponent(new Pickup());',
        ],
        todo: [{ match: 'coin.addComponent(new Pickup());', hint: 'dodaj monecie komponent Pickup' }],
        needs: [
          { var: 'player', name: 'Player', components: [{ type: 'Wallet', var: 'wallet' }] },
          { var: 'coin', name: 'Coin', components: [] },
        ],
        phases: [{ keys: ['d'], steps: 25 }],
        checks: [
          { label: 'Kontakt z monetą dodaje 1 złoto', expr: 'wallet.gold == 1' },
          { label: 'Moneta znika po zebraniu', expr: 'game.find("Coin") == null' },
        ],
      };
    },
  },
  {
    id: 'hp-damage',
    build({ int }) {
      const max = int(4, 8);
      return {
        title: 'Punkty zdrowia',
        contract: `Komponent Health na „Player”: publiczne pola double maxHealth, currentHealth, boolean dead; konstruktor Health(double max). damage(amount) zmniejsza HP, przy 0 ustawia dead i zwraca true; heal(amount) leczy do max, ale nie działa po śmierci. Scena: „Player” na (100, 100) ze ShapeRenderer i Health(${max}).`,
        components: {
          Health: {
            focus: true,
            impl: healthImpl,
            skeleton: `public class Health extends Component {
    public double maxHealth, currentHealth;
    public boolean dead;
    public Health(double max) { maxHealth = max; currentHealth = max; }
    public boolean damage(double amount) {
        // TODO: zmniejsz currentHealth, ustaw dead przy 0, zwróć czy obrażenia przeszły
        return false;
    }
    public void heal(double amount) {
        // TODO: lecz do maxHealth, bez efektu po śmierci
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          `player.addComponent(new Health(${max}));`,
        ],
        todo: [{ match: `player.addComponent(new Health(${max}));`, hint: `dodaj graczowi komponent Health(${max})` }],
        needs: [{ var: 'player', name: 'Player', components: [{ type: 'Health', var: 'health' }] }],
        phases: [
          { actions: ['health.damage(2);'], steps: 0 },
          { actions: [`check("damage(2) odejmuje punkty", health.currentHealth == ${max - 2});`, `health.damage(${max});`, 'health.heal(3);'], steps: 0 },
        ],
        checks: [
          { label: 'Śmiertelne obrażenia ustawiają dead i zerują HP', expr: 'health.dead && health.currentHealth == 0' },
          { label: 'heal nie wskrzesza po śmierci', expr: 'health.currentHealth == 0' },
          { label: 'damage po śmierci zwraca false', expr: '!health.damage(1)' },
        ],
      };
    },
  },
  {
    id: 'touch-damage',
    build({ int }) {
      const damage = int(1, 3), max = int(5, 8);
      return {
        title: 'Kolce zadają obrażenia',
        contract: `Obiekt „Spike” z Trigger2D i komponentem Spike: wejście w kontakt z graczem zadaje ${damage} obrażeń jego komponentowi Health — raz na wejście (użyj onContactEnter na colliderze). Klasa Spike ma publiczne pole double damage = ${damage} i rejestruje listener w onCreate. Scena: „Player” (100, 100) z Collider2D(24,24), ShapeRenderer i Health(${max}); „Spike” (110, 100) z Trigger2D(24,24) i Spike.`,
        components: {
          Health: { focus: false, impl: healthImpl, skeleton: '' },
          Spike: {
            focus: true,
            impl: `public class Spike extends Component {
    public double damage = ${damage};
    @Override public void onCreate() {
        requireComponent(Collider2D.class).onContactEnter(Health.class, other -> {
            Health health = other.getComponent(Health.class);
            if (health != null) health.damage(damage);
        });
    }
}
`,
            skeleton: `public class Spike extends Component {
    public double damage = ${damage};
    @Override public void onCreate() {
        // TODO: requireComponent(Collider2D.class).onContactEnter(Health.class, other -> { ... })
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'player.addComponent(new Collider2D(24, 24));',
          `player.addComponent(new Health(${max}));`,
          'GameObject spike = createObject("Spike");',
          'spike.setPosition(110, 100);',
          'spike.addComponent(new ShapeRenderer(20, 20, "#f87171"));',
          'spike.addComponent(new Trigger2D(24, 24));',
          'spike.addComponent(new Spike());',
        ],
        todo: [{ match: 'spike.addComponent(new Spike());', hint: 'dodaj kolcom komponent Spike' }],
        needs: [
          { var: 'player', name: 'Player', components: [{ type: 'Health', var: 'health' }] },
          { var: 'spike', name: 'Spike', components: [{ type: 'Spike', var: 'spikes' }] },
        ],
        phases: [
          { steps: 1, after: [{ label: `Wejście w kolce zadaje ${damage} obrażeń`, expr: `Math.abs(health.currentHealth - ${max - damage}) <= 0.001` }] },
          { steps: 5, after: [{ label: 'Obrażenia padają raz na wejście, nie co klatkę', expr: `Math.abs(health.currentHealth - ${max - damage}) <= 0.001` }] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'fire-projectile',
    build({ pick, int }) {
      const speed = pick([250, 300, 350]), lifetime = int(10, 20) / 10;
      return {
        title: 'Strzał w prawo',
        contract: `Komponent Weapon na „Player”: po wciśnięciu „Space” tworzy obiekt „Projectile” na pozycji (x+20, y), z Projectile2D lecącym w prawo z prędkością ${speed} px/s i czasem życia ${lifetime} s; kolejny strzał dopiero po cooldown ${0.4} s. Klasa ma publiczne pola double speed, cooldown, timer. Scena: „Player” (100, 100) z CharacterController2D i Weapon.`,
        components: {
          Weapon: {
            focus: true,
            impl: `public class Weapon extends Component {
    public double speed = ${speed}, cooldown = 0.4, timer;
    @Override public void onUpdate(double delta) {
        timer = Math.max(0, timer - delta);
        if (timer == 0 && getGame().input.isKeyPressed("Space")) {
            GameObject shot = getGame().createObject("Projectile");
            shot.setPosition(transform.x + 20, transform.y);
            shot.addComponent(new Projectile2D(1, 0, speed, ${lifetime}, gameObject));
            timer = cooldown;
        }
    }
}
`,
            skeleton: `public class Weapon extends Component {
    public double speed = ${speed}, cooldown = 0.4, timer;
    @Override public void onUpdate(double delta) {
        // TODO: odliczaj timer; na isKeyPressed("Space") utwórz "Projectile" z Projectile2D(1, 0, speed, ${lifetime}, gameObject) i ustaw timer
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'player.addComponent(new CharacterController2D());',
          'player.addComponent(new Weapon());',
        ],
        todo: [{ match: 'player.addComponent(new Weapon());', hint: 'dodaj graczowi komponent Weapon' }],
        needs: [{ var: 'player', name: 'Player', components: [{ type: 'Weapon', var: 'weapon' }] }],
        phases: [
          { keys: ['Space'], steps: 1 },
          { actions: ['GameObject shot = game.find("Projectile");', 'check("Space tworzy pocisk", shot != null);'], steps: 8 },
        ],
        checks: [
          { label: 'Pocisk leci w prawo od gracza', expr: 'shot != null && shot.transform.x > player.transform.x + 100' },
          { label: 'Pocisk ma kierunek (1, 0)', expr: 'shot == null || shot.getComponent(Projectile2D.class).direction.x == 1' },
        ],
      };
    },
  },
  {
    id: 'camera-follow',
    build() {
      return {
        title: 'Kamera za graczem',
        contract: 'Komponent FollowCamera na obiekcie „Camera”: w onCreate ustawia kamerę Camera2D tak, by podążała za obiektem „Player” (metoda follow). Scena: „Player” (300, 100) z Collider2D, PlayerController i CharacterController2D; „Camera” z Camera2D i FollowCamera.',
        components: {
          PlayerController: { focus: false, impl: playerController(120), skeleton: '' },
          FollowCamera: {
            focus: true,
            impl: `public class FollowCamera extends Component {
    @Override public void onCreate() {
        requireComponent(Camera2D.class).follow(getGame().find("Player"));
    }
}
`,
            skeleton: `public class FollowCamera extends Component {
    @Override public void onCreate() {
        // TODO: requireComponent(Camera2D.class).follow(gracz)
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(300, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'player.addComponent(new Collider2D(24, 24));',
          'player.addComponent(new CharacterController2D());',
          'player.addComponent(new PlayerController());',
          'GameObject camera = createObject("Camera");',
          'camera.addComponent(new Camera2D());',
          'camera.addComponent(new FollowCamera());',
        ],
        todo: [{ match: 'camera.addComponent(new FollowCamera());', hint: 'dodaj kamerze komponent FollowCamera' }],
        needs: [
          { var: 'player', name: 'Player', components: [] },
          { var: 'camera', name: 'Camera', components: [{ type: 'FollowCamera', var: 'follow' }] },
        ],
        phases: [{ keys: ['d'], steps: 10 }],
        checks: [
          { label: 'Kamera podąża za graczem (view.x ≈ 100)', expr: 'Math.abs(game.getCameraView().x - 100) <= 1.5' },
          { label: 'Widok nie jest sklejony z (0, 0)', expr: 'game.getCameraView().x > 50' },
        ],
      };
    },
  },
  {
    id: 'hud-gold',
    build() {
      return {
        title: 'Licznik złota na HUD',
        contract: 'Obiekt „HUD” (UITransform 160×40 z anchorem TOP_LEFT, TextRenderer) ma komponent Hud: publiczna metoda addGold(int) zwiększa licznik i ustawia tekst „Złoto: <n>”. Startowo „Złoto: 0”.',
        components: {
          Hud: {
            focus: true,
            impl: `public class Hud extends Component {
    private TextRenderer text;
    private int gold;
    @Override public void onCreate() {
        text = requireComponent(TextRenderer.class);
        refresh();
    }
    public void addGold(int amount) {
        gold += amount;
        refresh();
    }
    private void refresh() {
        text.text = "Złoto: " + gold;
    }
}
`,
            skeleton: `public class Hud extends Component {
    private TextRenderer text;
    private int gold;
    @Override public void onCreate() {
        // TODO: pobierz TextRenderer i ustaw tekst "Złoto: 0"
    }
    public void addGold(int amount) {
        // TODO: zwiększ gold i odśwież tekst
    }
    private void refresh() {
        // TODO
    }
}
`,
          },
        },
        setup: [
          'GameObject hud = createObject("HUD");',
          'UITransform ui = hud.addComponent(new UITransform(160, 40));',
          'ui.anchor = UIAnchor.TOP_LEFT;',
          'hud.addComponent(new TextRenderer("-"));',
          'hud.addComponent(new Hud());',
        ],
        todo: [{ match: 'hud.addComponent(new Hud());', hint: 'dodaj obiektowi HUD komponent Hud' }],
        needs: [{ var: 'hud', name: 'HUD', components: [{ type: 'UITransform', var: 'ui' }, { type: 'TextRenderer', var: 'text' }, { type: 'Hud', var: 'hudC' }] }],
        phases: [
          { steps: 1, after: [
            { label: 'Licznik startuje od „Złoto: 0”', expr: '"Złoto: 0".equals(text.text)' },
            { label: 'HUD jest zakotwiczony w lewym górnym rogu', expr: '"TOP_LEFT".equals(ui.anchor)' },
          ] },
          { actions: ['hudC.addGold(3);'], after: [{ label: 'addGold aktualizuje tekst licznika', expr: '"Złoto: 3".equals(text.text)' }] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'hp-bar',
    build({ int }) {
      const max = int(4, 8);
      return {
        title: 'Pasek zdrowia',
        contract: `Obiekt „Bar” (UITransform + ProgressBar 200×16) ma komponent HpBar, który co klatkę ustawia ProgressBar na procent HP gracza (setValue(currentHealth, maxHealth)). Scena: „Player” z Health(${max}).`,
        components: {
          Health: { focus: false, impl: healthImpl, skeleton: '' },
          HpBar: {
            focus: true,
            impl: `public class HpBar extends Component {
    @Override public void onUpdate(double delta) {
        Health health = getGame().find("Player").getComponent(Health.class);
        requireComponent(ProgressBar.class).setValue(health.currentHealth, health.maxHealth);
    }
}
`,
            skeleton: `public class HpBar extends Component {
    @Override public void onUpdate(double delta) {
        // TODO: ProgressBar.setValue(hp gracza, max gracza)
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          `player.addComponent(new Health(${max}));`,
          'GameObject bar = createObject("Bar");',
          'bar.addComponent(new UITransform(220, 20));',
          'bar.addComponent(new ProgressBar(200, 16));',
          'bar.addComponent(new HpBar());',
        ],
        todo: [{ match: 'bar.addComponent(new HpBar());', hint: 'dodaj paskowi komponent HpBar' }],
        needs: [
          { var: 'player', name: 'Player', components: [{ type: 'Health', var: 'health' }] },
          { var: 'bar', name: 'Bar', components: [{ type: 'ProgressBar', var: 'progress' }] },
        ],
        phases: [
          { steps: 1, after: [{ label: 'Pasek startuje na 100%', expr: 'Math.abs(progress.getProgress() - 100) <= 0.5' }] },
          { actions: ['health.damage(2);'], steps: 1, after: [{ label: 'Pasek odzwierciedla obrażenia', expr: `Math.abs(progress.getProgress() - ${(100 * (max - 2)) / max}) <= 0.5` }] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'bounce-bounds',
    build() {
      return {
        title: 'Odbijająca się piłka',
        contract: 'Komponent Bounce na obiekcie „Ball” (320, 180): przesuwa obiekt o (vx, vy)·delta co klatkę i odbija prędkość na krawędziach widoku 640×360 (margines 20 px). Publiczne pola double vx = 200, vy = 120.',
        components: {
          Bounce: {
            focus: true,
            impl: `public class Bounce extends Component {
    public double vx = 200, vy = 120;
    @Override public void onUpdate(double delta) {
        if ((transform.x <= 20 && vx < 0) || (transform.x >= 620 && vx > 0)) vx = -vx;
        if ((transform.y <= 20 && vy < 0) || (transform.y >= 340 && vy > 0)) vy = -vy;
        transform.x += vx * delta;
        transform.y += vy * delta;
    }
}
`,
            skeleton: `public class Bounce extends Component {
    public double vx = 200, vy = 120;
    @Override public void onUpdate(double delta) {
        // TODO: odbij vx/vy przy krawędziach (20/620, 20/340) i przesuń transform
    }
}
`,
          },
        },
        setup: [
          'GameObject ball = createObject("Ball");',
          'ball.setPosition(320, 180);',
          'ball.addComponent(ShapeRenderer.circle(12, "#ffd166"));',
          'ball.addComponent(new Bounce());',
        ],
        todo: [{ match: 'ball.addComponent(new Bounce());', hint: 'dodaj piłce komponent Bounce' }],
        needs: [{ var: 'ball', name: 'Ball', components: [{ type: 'Bounce', var: 'bounce' }] }],
        phases: [
          { steps: 10, after: [{ label: 'Po 1 s piłka jest przy (520, 300)', expr: 'Math.abs(ball.transform.x - 520) <= 1 && Math.abs(ball.transform.y - 300) <= 1' }] },
          { steps: 10, after: [
            { label: 'Piłka odbija się od prawej krawędzi', expr: 'bounce.vx < 0' },
            { label: 'Piłka odbija się od dolnej krawędzi', expr: 'bounce.vy < 0' },
            { label: 'Piłka zostaje w granicach', expr: 'ball.transform.x <= 620.5 && ball.transform.y <= 340.5' },
          ] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'timed-spawn',
    build({ int }) {
      const interval = int(15, 20) / 10, max = int(3, 4);
      return {
        title: 'Spawner przeciwników',
        contract: `Komponent Spawner: co ${interval} s tworzy obiekt „Enemy” w swojej pozycji ze ShapeRenderer — najwyżej ${max} razy, potem staje. Publiczne pola double interval = ${interval}, timer, int max = ${max}, spawned.`,
        components: {
          Spawner: {
            focus: true,
            impl: `public class Spawner extends Component {
    public double interval = ${interval}, timer;
    public int max = ${max}, spawned;
    @Override public void onUpdate(double delta) {
        if (spawned >= max) return;
        timer += delta;
        if (timer >= interval) {
            timer = 0;
            spawned++;
            GameObject enemy = getGame().createObject("Enemy");
            enemy.setPosition(transform.x, transform.y);
            enemy.addComponent(new ShapeRenderer(20, 20, "#f87171"));
        }
    }
}
`,
            skeleton: `public class Spawner extends Component {
    public double interval = ${interval}, timer;
    public int max = ${max}, spawned;
    @Override public void onUpdate(double delta) {
        // TODO: co interval sekund twórz "Enemy" ze ShapeRenderer; stop przy max
    }
}
`,
          },
        },
        setup: [
          'GameObject spawner = createObject("Spawner");',
          'spawner.setPosition(320, 180);',
          'spawner.addComponent(new ShapeRenderer(24, 24, "#a78bfa"));',
          'spawner.addComponent(new Spawner());',
        ],
        todo: [{ match: 'spawner.addComponent(new Spawner());', hint: 'dodaj spawnerowi komponent Spawner' }],
        needs: [{ var: 'spawner', name: 'Spawner', components: [{ type: 'Spawner', var: 'spawn' }] }],
        phases: [
          { steps: 30, after: [{ label: 'Po 3 s powstał co najmniej 1 enemy', expr: 'spawn.spawned >= 1 && game.find("Enemy") != null' }] },
          { steps: 70, after: [
            { label: `Spawner zatrzymuje się na max=${max}`, expr: `spawn.spawned == ${max}` },
            { label: 'Na scenie jest spawner i wszyscy stworzeni przeciwnicy', expr: `game.getObjects().size() == ${1 + max}` },
          ] },
          { steps: 20, after: [{ label: 'Limit utrzymuje się w czasie', expr: `spawn.spawned == ${max}` }] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'countdown',
    build() {
      return {
        title: 'Odliczanie do końca',
        contract: 'Komponent GameTimer (public double remaining = 2.5): co klatkę zmniejsza remaining i ustawia na obiekcie „HUD” tekst „Czas: <sufit sekund>”; przy 0 ustawia „Koniec” i pauzuje grę (game.pause()). Scena: „Timer” z GameTimer; „HUD” z UITransform i TextRenderer.',
        components: {
          GameTimer: {
            focus: true,
            impl: `public class GameTimer extends Component {
    public double remaining = 2.5;
    @Override public void onUpdate(double delta) {
        if (remaining <= 0) return;
        remaining -= delta;
        TextRenderer label = getGame().find("HUD").getComponent(TextRenderer.class);
        if (remaining <= 0) {
            remaining = 0;
            label.text = "Koniec";
            getGame().pause();
        } else {
            label.text = "Czas: " + (int) Math.ceil(remaining);
        }
    }
}
`,
            skeleton: `public class GameTimer extends Component {
    public double remaining = 2.5;
    @Override public void onUpdate(double delta) {
        // TODO: odliczaj; tekst "Czas: n" na HUD; przy 0 "Koniec" i game.pause()
    }
}
`,
          },
        },
        setup: [
          'GameObject timer = createObject("Timer");',
          'timer.addComponent(new GameTimer());',
          'GameObject hud = createObject("HUD");',
          'hud.addComponent(new UITransform(160, 40));',
          'hud.addComponent(new TextRenderer("Czas"));',
        ],
        todo: [{ match: 'timer.addComponent(new GameTimer());', hint: 'dodaj obiektowi Timer komponent GameTimer' }],
        needs: [{ var: 'hud', name: 'HUD', components: [{ type: 'TextRenderer', var: 'text' }] }, { var: 'timer', name: 'Timer', components: [{ type: 'GameTimer', var: 'clock' }] }],
        phases: [
          { steps: 10, after: [{ label: 'Po 1 s zostaje ~1,5 s i napis „Czas: 2”', expr: 'Math.abs(clock.remaining - 1.5) <= 0.05 && "Czas: 2".equals(text.text)' }] },
          { steps: 20, after: [{ label: 'Po limicie gra jest zapauzowana z „Koniec”', expr: 'game.isPaused() && "Koniec".equals(text.text) && clock.remaining == 0' }] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'flee-enemy',
    build({ int }) {
      const speed = int(60, 100), radius = int(120, 180);
      return {
        title: 'Uciekający przeciwnik',
        contract: `Komponent FleeAI na „Slime”: gdy „Player” jest bliżej niż radius=${radius} px, Slime ucieka w przeciwną stronę z prędkością ${speed} px/s; poza zasięgiem stoi. Publiczne pola double speed = ${speed}, radius = ${radius}. Scena: „Player” (100, 100) ze ShapeRenderer; „Slime” (180, 100) z Collider2D(24,24), CharacterController2D i FleeAI.`,
        components: {
          FleeAI: {
            focus: true,
            impl: `public class FleeAI extends Component {
    public double speed = ${speed}, radius = ${radius};
    @Override public void onUpdate(double delta) {
        GameObject player = getGame().find("Player");
        double dx = transform.x - player.transform.x, dy = transform.y - player.transform.y;
        CharacterController2D controller = requireComponent(CharacterController2D.class);
        if (Math.hypot(dx, dy) < radius) controller.move(dx, dy, speed);
        else controller.move(0, 0, speed);
    }
}
`,
            skeleton: `public class FleeAI extends Component {
    public double speed = ${speed}, radius = ${radius};
    @Override public void onUpdate(double delta) {
        // TODO: gdy gracz w zasięgu radius — move w kierunku OD gracza, inaczej stop
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'GameObject slime = createObject("Slime");',
          'slime.setPosition(180, 100);',
          'slime.addComponent(new ShapeRenderer(24, 24, "#f87171"));',
          'slime.addComponent(new Collider2D(24, 24));',
          'slime.addComponent(new CharacterController2D());',
          'slime.addComponent(new FleeAI());',
        ],
        todo: [{ match: 'slime.addComponent(new FleeAI());', hint: 'dodaj Slime komponent FleeAI' }],
        needs: [{ var: 'slime', name: 'Slime', components: [{ type: 'FleeAI', var: 'ai' }] }, { var: 'player', name: 'Player', components: [] }],
        phases: [{ steps: 10 }],
        checks: [
          { label: `Slime ucieka od gracza (x≈${180 + speed})`, expr: `Math.abs(slime.transform.x - ${180 + speed}) <= 1.5` },
          { label: 'Slime oddala się, nie zbliża', expr: 'slime.transform.x > player.transform.x' },
        ],
      };
    },
  },
  {
    id: 'chase-enemy',
    build({ int }) {
      const speed = int(60, 100);
      return {
        title: 'Pościg za graczem',
        contract: `Komponent ChaseAI na „Slime”: co klatkę porusza się w stronę „Player” z prędkością ${speed} px/s (move w kierunku różnicy pozycji). Publiczne pole double speed = ${speed}. Scena: „Player” (100, 100) ze ShapeRenderer; „Slime” (300, 100) z Collider2D(24,24), CharacterController2D i ChaseAI.`,
        components: {
          ChaseAI: {
            focus: true,
            impl: `public class ChaseAI extends Component {
    public double speed = ${speed};
    @Override public void onUpdate(double delta) {
        GameObject player = getGame().find("Player");
        double dx = player.transform.x - transform.x, dy = player.transform.y - transform.y;
        requireComponent(CharacterController2D.class).move(dx, dy, speed);
    }
}
`,
            skeleton: `public class ChaseAI extends Component {
    public double speed = ${speed};
    @Override public void onUpdate(double delta) {
        // TODO: move w stronę gracza z prędkością speed
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'GameObject slime = createObject("Slime");',
          'slime.setPosition(300, 100);',
          'slime.addComponent(new ShapeRenderer(24, 24, "#f87171"));',
          'slime.addComponent(new Collider2D(24, 24));',
          'slime.addComponent(new CharacterController2D());',
          'slime.addComponent(new ChaseAI());',
        ],
        todo: [{ match: 'slime.addComponent(new ChaseAI());', hint: 'dodaj Slime komponent ChaseAI' }],
        needs: [{ var: 'slime', name: 'Slime', components: [{ type: 'ChaseAI', var: 'ai' }] }, { var: 'player', name: 'Player', components: [] }],
        phases: [{ steps: 10 }],
        checks: [
          { label: `Slime zbliża się do gracza (x≈${300 - speed})`, expr: `Math.abs(slime.transform.x - ${300 - speed}) <= 1.5` },
          { label: 'Slime skraca dystans, nie ucieka', expr: 'slime.transform.x < 300' },
        ],
      };
    },
  },
  {
    id: 'invuln-flash',
    build({ int }) {
      const duration = int(10, 15) / 10, max = int(4, 6);
      return {
        title: 'Nietykalność po trafieniu',
        contract: `Komponent Invulnerable na „Player”: metoda hit() zadaje 1 obrażenie komponentowi Health tylko gdy remaining<=0, po czym ustawia nietykalność na ${duration} s (pole remaining) i migocze Sprite. hit() zwraca true/false. Scena: „Player” ze Sprite(Assets.PLAYER01,32,32), Health(${max}) i Invulnerable (pola public double duration=${duration}, remaining).`,
        components: {
          Health: { focus: false, impl: healthImpl, skeleton: '' },
          Invulnerable: {
            focus: true,
            impl: `public class Invulnerable extends Component {
    public double duration = ${duration}, remaining;
    public boolean hit() {
        if (remaining > 0) return false;
        Health health = getComponent(Health.class);
        if (health == null || health.dead) return false;
        health.damage(1);
        remaining = duration;
        return true;
    }
    @Override public void onUpdate(double delta) {
        if (remaining <= 0) return;
        remaining = Math.max(0, remaining - delta);
        Sprite sprite = getComponent(Sprite.class);
        if (sprite != null) sprite.enabled = remaining == 0 || ((int) (remaining * 10) % 2) == 0;
    }
}
`,
            skeleton: `public class Invulnerable extends Component {
    public double duration = ${duration}, remaining;
    public boolean hit() {
        // TODO: tylko gdy remaining<=0 — damage(1) na Health i start nietykalności
        return false;
    }
    @Override public void onUpdate(double delta) {
        // TODO: odliczaj remaining i migocz sprite.enabled
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new Sprite(Assets.PLAYER01, 32, 32));',
          `player.addComponent(new Health(${max}));`,
          'player.addComponent(new Invulnerable());',
        ],
        todo: [{ match: 'player.addComponent(new Invulnerable());', hint: 'dodaj graczowi komponent Invulnerable' }],
        needs: [{ var: 'player', name: 'Player', components: [{ type: 'Health', var: 'health' }, { type: 'Invulnerable', var: 'inv' }] }],
        phases: [
          { actions: ['check("hit zadaje obrażenia", inv.hit() && health.currentHealth == ' + (max - 1) + ');', 'check("hit w nietykalności odrzucony", !inv.hit() && health.currentHealth == ' + (max - 1) + ');'], steps: Math.ceil(duration / 0.1) + 5 },
        ],
        checks: [
          { label: 'Nietykalność wygasa po czasie', expr: 'inv.remaining <= 0.01' },
          { label: 'Po wygaśnięciu hit znów działa', expr: `inv.hit() && Math.abs(health.currentHealth - ${max - 2}) <= 0.001` },
        ],
      };
    },
  },
  {
    id: 'speed-boost',
    build() {
      return {
        title: 'Przyspieszenie z pickupu',
        contract: 'Obiekt „Boost” z Trigger2D i komponentem Boost: kontakt z graczem podwaja pole speed jego PlayerController i niszczy pickup. Scena: „Player” (100, 100) z Collider2D, CharacterController2D i PlayerController (speed=120); „Boost” (170, 100) z Trigger2D(20,20) i Boost.',
        components: {
          PlayerController: { focus: false, impl: playerController(120), skeleton: '' },
          Boost: {
            focus: true,
            impl: `public class Boost extends Component {
    @Override public void onTrigger(GameObject other) {
        PlayerController controller = other.getComponent(PlayerController.class);
        if (controller != null) {
            controller.speed = controller.speed * 2;
            gameObject.destroy();
        }
    }
}
`,
            skeleton: `public class Boost extends Component {
    @Override public void onTrigger(GameObject other) {
        // TODO: podwój speed w PlayerController drugiego obiektu i zniszcz pickup
    }
}
`,
          },
        },
        setup: [
          'GameObject player = createObject("Player");',
          'player.setPosition(100, 100);',
          'player.addComponent(new ShapeRenderer(24, 24, "#4ade80"));',
          'player.addComponent(new Collider2D(24, 24));',
          'player.addComponent(new CharacterController2D());',
          'player.addComponent(new PlayerController());',
          'GameObject boost = createObject("Boost");',
          'boost.setPosition(170, 100);',
          'boost.addComponent(ShapeRenderer.circle(8, "#a78bfa"));',
          'boost.addComponent(new Trigger2D(20, 20));',
          'boost.addComponent(new Boost());',
        ],
        todo: [{ match: 'boost.addComponent(new Boost());', hint: 'dodaj pickupowi komponent Boost' }],
        needs: [{ var: 'player', name: 'Player', components: [{ type: 'PlayerController', var: 'ctl' }] }],
        phases: [{ keys: ['d'], steps: 15 }],
        checks: [
          { label: 'Pickup podwaja prędkość gracza', expr: 'Math.abs(ctl.speed - 240) <= 0.001' },
          { label: 'Pickup znika po zebraniu', expr: 'game.find("Boost") == null' },
          { label: 'Gracz jedzie szybciej po zebraniu', expr: 'player.transform.x > 300' },
        ],
      };
    },
  },
  {
    id: 'moving-platform',
    build({ int }) {
      const amplitude = int(30, 60), period = int(15, 25) / 10;
      const steps1 = Math.round(period / 2 * 10);
      const y1 = 200 + amplitude * Math.sin((steps1 * 0.1) / period * Math.PI * 2);
      const y2 = 200 + amplitude * Math.sin((2 * steps1 * 0.1) / period * Math.PI * 2);
      return {
        title: 'Oscylująca platforma',
        contract: `Komponent Oscillator na „Platform” (200, 200): przesuwa ją pionowo sinusoidą — startY zapamiętane w onCreate, w onUpdate transform.y = startY + sin(time/period·2π)·amplitude. Publiczne pola double amplitude = ${amplitude}, period = ${period}, startY, time.`,
        components: {
          Oscillator: {
            focus: true,
            impl: `public class Oscillator extends Component {
    public double amplitude = ${amplitude}, period = ${period}, startY, time;
    @Override public void onCreate() { startY = transform.y; }
    @Override public void onUpdate(double delta) {
        time += delta;
        transform.y = startY + Math.sin(time / period * Math.PI * 2) * amplitude;
    }
}
`,
            skeleton: `public class Oscillator extends Component {
    public double amplitude = ${amplitude}, period = ${period}, startY, time;
    @Override public void onCreate() {
        // TODO: zapamiętaj pozycję startową
    }
    @Override public void onUpdate(double delta) {
        // TODO: transform.y = startY + sin(time/period * 2π) * amplitude
    }
}
`,
          },
        },
        setup: [
          'GameObject platform = createObject("Platform");',
          'platform.setPosition(200, 200);',
          'platform.addComponent(new ShapeRenderer(80, 16, "#94a3b8"));',
          'platform.addComponent(new Oscillator());',
        ],
        todo: [{ match: 'platform.addComponent(new Oscillator());', hint: 'dodaj platformie komponent Oscillator' }],
        needs: [{ var: 'platform', name: 'Platform', components: [{ type: 'Oscillator', var: 'osc' }] }],
        phases: [
          { steps: steps1, after: [{ label: `Po pół okresu platforma przy szczycie (y≈${y1.toFixed(0)})`, expr: `Math.abs(platform.transform.y - ${y1}) <= 1` }] },
          { steps: steps1, after: [{ label: 'Po całym okresie wraca do startY', expr: `Math.abs(platform.transform.y - ${y2}) <= 1.5` }] },
        ],
        checks: [],
      };
    },
  },
  {
    id: 'kill-score',
    build({ int }) {
      const reward = int(5, 20), speed = 300;
      return {
        title: 'Punkty za trafienie',
        contract: `Komponent ScoreReward na „Enemy” (onTrigger): kontakt z obiektem o tagu „shot” niszczy pocisk i enemy oraz dodaje ${reward} pkt do ScoreBoard na „Score”. ScoreBoard ma public int points i add(int). Scena: „Score” ze ScoreBoard; „Enemy” (200, 100) z Collider2D i ScoreReward (pole int reward = ${reward}); „Shot” (140, 100) z tagiem „shot” i Projectile2D(1,0,${speed},2,null).`,
        components: {
          ScoreBoard: {
            focus: false,
            impl: `public class ScoreBoard extends Component {
    public int points;
    public void add(int amount) { points += amount; }
}
`,
            skeleton: '',
          },
          ScoreReward: {
            focus: true,
            impl: `public class ScoreReward extends Component {
    public int reward = ${reward};
    @Override public void onTrigger(GameObject other) {
        if (!other.hasTag("shot")) return;
        other.destroy();
        gameObject.destroy();
        getGame().find("Score").getComponent(ScoreBoard.class).add(reward);
    }
}
`,
            skeleton: `public class ScoreReward extends Component {
    public int reward = ${reward};
    @Override public void onTrigger(GameObject other) {
        // TODO: jeśli other ma tag "shot": zniszcz oba i dodaj reward do ScoreBoard
    }
}
`,
          },
        },
        setup: [
          'GameObject score = createObject("Score");',
          'score.addComponent(new ScoreBoard());',
          'GameObject enemy = createObject("Enemy");',
          'enemy.setPosition(200, 100);',
          'enemy.addComponent(new ShapeRenderer(24, 24, "#f87171"));',
          'enemy.addComponent(new Collider2D(24, 24));',
          'enemy.addComponent(new ScoreReward());',
          'GameObject shot = createObject("Shot");',
          'shot.addTag("shot");',
          'shot.setPosition(140, 100);',
          `shot.addComponent(new Projectile2D(1, 0, ${speed}, 2, null));`,
        ],
        todo: [{ match: 'enemy.addComponent(new ScoreReward());', hint: 'dodaj Enemy komponent ScoreReward' }],
        needs: [
          { var: 'score', name: 'Score', components: [{ type: 'ScoreBoard', var: 'board' }] },
          { var: 'enemy', name: 'Enemy', components: [{ type: 'ScoreReward', var: 'reward' }] },
        ],
        phases: [{ steps: 8 }],
        checks: [
          { label: `Trafiony enemy daje ${reward} pkt`, expr: `board.points == ${reward}` },
          { label: 'Enemy i pocisk znikają po trafieniu', expr: 'game.find("Enemy") == null && game.find("Shot") == null' },
        ],
      };
    },
  },
  {
    id: 'restart-run',
    build() {
      return {
        title: 'Sterowanie rundą',
        contract: 'Komponent RunController na „Run” (pole public String state, startowo „READY”): wciśnięcie „Enter” w stanie READY zmienia state na „RUNNING”; „Escape” w stanie RUNNING ustawia „PAUSED” i pauzuje grę.',
        components: {
          RunController: {
            focus: true,
            impl: `public class RunController extends Component {
    public String state = "READY";
    @Override public void onUpdate(double delta) {
        if ("READY".equals(state) && getGame().input.isKeyPressed("Enter")) {
            state = "RUNNING";
        } else if ("RUNNING".equals(state) && getGame().input.isKeyPressed("Escape")) {
            state = "PAUSED";
            getGame().pause();
        }
    }
}
`,
            skeleton: `public class RunController extends Component {
    public String state = "READY";
    @Override public void onUpdate(double delta) {
        // TODO: Enter -> RUNNING; Escape -> PAUSED + game.pause()
    }
}
`,
          },
        },
        setup: [
          'GameObject run = createObject("Run");',
          'run.addComponent(new RunController());',
        ],
        todo: [{ match: 'run.addComponent(new RunController());', hint: 'dodaj obiektowi Run komponent RunController' }],
        needs: [{ var: 'run', name: 'Run', components: [{ type: 'RunController', var: 'rc' }] }],
        phases: [
          { steps: 1, after: [{ label: 'Start w stanie READY', expr: '"READY".equals(rc.state)' }] },
          { keys: ['Enter'], steps: 1, after: [{ label: 'Enter uruchamia rundę', expr: '"RUNNING".equals(rc.state)' }] },
          { keys: ['Escape'], steps: 1, after: [{ label: 'Escape pauzuje rundę', expr: '"PAUSED".equals(rc.state) && game.isPaused()' }] },
        ],
        checks: [],
      };
    },
  },
];

// --- shared emitters -------------------------------------------------------

function javaTestSource(spec) {
  const lines = [];
  for (const need of spec.needs) {
    lines.push(`            GameObject ${need.var} = game.find(${JSON.stringify(need.name)});`);
    lines.push(`            check("istnieje obiekt ${need.name}", ${need.var} != null);`);
    for (const component of need.components) {
      lines.push(`            ${component.type} ${component.var} = ${need.var} == null ? null : ${need.var}.getComponent(${component.type}.class);`);
      lines.push(`            check("${need.name} ma komponent ${component.type}", ${component.var} != null);`);
    }
  }
  const emitCheck = (item, indent) => lines.push(`${indent}try { check(${JSON.stringify(item.label)}, ${item.expr}); } catch (Throwable t) { check(${JSON.stringify(item.label)}, false); }`);
  for (const phase of spec.phases) {
    lines.push('            game.input.clear();');
    for (const key of phase.keys || []) lines.push(`            game.input.setKey(${JSON.stringify(key)}, true);`);
    for (const action of phase.actions || []) lines.push(`            ${action}`);
    if (phase.steps) lines.push(`            for (int i = 0; i < ${phase.steps}; i++) game.step(${phase.delta ?? 0.1});`);
    for (const item of phase.after || []) emitCheck(item, '            ');
  }
  for (const item of spec.checks) {
    lines.push(`            try { check(${JSON.stringify(item.label)}, ${item.expr}); } catch (Throwable t) { check(${JSON.stringify(item.label)}, false); }`);
  }
  return `public class JavaTest {
    static int passed, failed;
    static void check(String label, boolean ok) {
        System.out.println((ok ? "PASS" : "FAIL") + ": " + label);
        if (ok) passed++; else failed++;
    }
    public static void main(String[] args) {
        GameCanvas.setSize(640, 360);
        GameMain game = new GameMain();
        try {
            game.start();
            game.step(0);
${lines.join('\n')}
        } catch (Throwable t) {
            check("scena działa bez błędów", false);
        } finally {
            game.dispose();
        }
        System.out.println((failed == 0 ? "TESTY ZALICZONE" : "TESTY NIEZALICZONE") + " (" + passed + "/" + (passed + failed) + ")");
    }
}
`;
}

function gameMain(setup) {
  return `public class GameMain extends Game {
    @Override public void onCreate() {
        ${setup.join('\n        ')}
    }
}
`;
}

// ctx: {int(min,max), pick(array), level: 0 easy | 1 standard | 2 challenge}
export function assembleGameDevTask(variant, ctx) {
  const spec = variant.build(ctx);
  const reference = { 'GameMain.java': gameMain(spec.setup) };
  for (const [name, component] of Object.entries(spec.components)) reference[`${name}.java`] = component.impl;
  let starter;
  if (ctx.level === 2) {
    starter = { 'GameMain.java': '// TODO: napisz klasę GameMain extends Game ze sceną oraz klasy komponentów zgodnie z poleceniem. Własne pliki .java są dozwolone.\n' };
  } else if (ctx.level === 0) {
    const todo = new Map(spec.todo.map(item => [item.match, item.hint]));
    starter = { 'GameMain.java': gameMain(spec.setup.map(line => (todo.has(line) ? `// TODO: ${todo.get(line)}` : line))) };
    for (const [name, component] of Object.entries(spec.components)) starter[`${name}.java`] = component.impl;
  } else {
    starter = { 'GameMain.java': gameMain(spec.setup) };
    for (const [name, component] of Object.entries(spec.components)) starter[`${name}.java`] = component.focus ? component.skeleton : component.impl;
  }
  const required = Object.keys(spec.components).join(', ');
  const prompt = `${spec.contract} ${LEVEL_LINE[ctx.level]}`;
  const criteria = [
    'Zachowanie spełnia scenariusz testowy — obiekty, komponenty, prędkości i granice jak w poleceniu.',
    `Wymagane nazwy obiektów i klas (${required}, GameMain) są zachowane — test odwołuje się do nich wprost.`,
    'Rozwiązanie działa dla stanu sceny, nie tylko dla wyglądu kodu; publiczne pola z kontraktu zostają publiczne.',
  ];
  return {
    title: spec.title, prompt, criteria,
    starterFiles: starter, referenceFiles: reference,
    params: { kind: 'game-task', variant: variant.id, javaTest: javaTestSource(spec) },
  };
}

