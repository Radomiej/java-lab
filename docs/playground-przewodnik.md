# Playground — przewodnik po pisaniu własnej gry

Playground to miejsce, w którym piszesz własną grę od zera, bez zadań i ściąg.
Silnik jest ten sam co w kursie Game Dev (Java, `engineApiVersion` 2.0.0).

## 1. Struktura projektu

- Projekt to **płaski zestaw plików `.java`** — bez katalogów i bez `package`.
- **`GameMain.java` jest wymagany** — klasa `GameMain extends Game` to punkt wejścia.
- Własne komponenty zapisuj w osobnych plikach, np. `PlayerController.java`.
- Zwykłe importy działają: `import java.util.ArrayList;` — klasy silnika
  (`engine.*`) importowane są automatycznie.
- Maksymalnie **100 plików**; nazwy klas silnika (np. `Game`, `Sprite`) są
  zarezerwowane — nie nadpisuj ich własnymi klasami.

## 2. Pierwsza gra w 5 minut

```java
public class GameMain extends Game {
    @Override public void onCreate() {
        GameObject player = createObject("Player").setPosition(320, 180);
        player.addComponent(new Sprite(Assets.PLAYER01, 32, 32));
        player.addComponent(new CircleCollider2D(12));
        player.addComponent(new TopDownCharacterController2D());
        player.addComponent(new MoveWithKeys());
        createObject("Camera").addComponent(new Camera2D()).follow(player);
    }
}
```

```java
public class MoveWithKeys extends Component {
    @Override public void onUpdate(double delta) {
        TopDownCharacterController2D body = requireComponent(TopDownCharacterController2D.class);
        double x = (getGame().input.isKeyDown(Keys.D) ? 1 : 0) - (getGame().input.isKeyDown(Keys.A) ? 1 : 0);
        double y = (getGame().input.isKeyDown(Keys.S) ? 1 : 0) - (getGame().input.isKeyDown(Keys.W) ? 1 : 0);
        body.walk(x, y);
    }
}
```

## 3. Ściąga API

**Cykl życia komponentu:** `onCreate` (raz przy starcie), `onUpdate(delta)`
(co klatkę, logika), `onLateUpdate(delta)` (po ruchu — tu działa kamera),
`onEnable` / `onDisable`, `onDestroy`, `onCollision(other)` (fizyczny kontakt),
`onTrigger(other)` (wykrycie bez blokowania), `onDrawUI` (HUD na ekranie).

**Wejście:** `getGame().input` — `isKeyDown(Keys.D)`, `isKeyPressed(Keys.SPACE)`,
`isMousePressed()`, `getPointerPosition()` (null przed pierwszym ruchem myszy).
Stałe klawiszy: `Keys.W/A/S/D`, strzałki, `SPACE`, `ENTER`, `ESCAPE`,
`ACTION_A…ACTION_SELECT`.

**Scena i obiekty:** `createObject(name)`, `find(name)`, `getObjects()`,
`setWorldBounds(x,y,w,h)`, `pause()/resume()`. Obiekt: `setPosition(x,y)`,
`addComponent(c)`, `getComponent(Typ.class)`, `requireComponent(Typ.class)`,
`setActive(bool)`, `destroy()`, `addTag/hasTag`.

**Kolizje:** `Collider2D(width,height)`, `CircleCollider2D(radius)`,
`asTrigger()`, `layer`, `mask`. Warstwy: `Layers.DEFAULT/ENEMY/PLAYER/PROJECTILE/
PICKUP/WALL/ALL`. Zapytania: `getGame().physics.queryRadius(x,y,r,layer)`,
`findNearest(x,y,r,layer)`.

**Losowość:** `getGame().random` — `range(a,b)`, `nextInt(a,b)`, `next()`.

**Mapa kafelków:** `new TileMap(Assets.GRASS,32)` — `setTile(col,row,asset)`,
`tileAt(x,y)` (tekstura pod pozycją świata), `generate(w,h,seed,warstwy...)`.

**Kamera:** `new Camera2D()` — **pozycja GameObjectu kamery to środek widoku**.
`follow(cel)` kopiuje pozycję celu w `onLateUpdate`; `followX`/`followY`
wybierają osie. `screenToWorld(p)`/`worldToScreen(p)` tłumaczą współrzędne,
`shake(siła,sekundy)` drga obrazem bez ruszania pozycji, `offsetX/offsetY`
to dodatkowe przesunięcie widoku.

**Screen:** `Screen.width`, `Screen.height` — logiczny rozmiar widoku
(640×480 domyślnie, zmienia się z `GameCanvas.setSize`). Przykład:
`camera.setPosition(Screen.width/2, Screen.height/2);`

**Animacje:** `Tweens.position(obj,x,y,s)`, `Tweens.scale(obj,x,y,s)`,
`Tweens.rotation(obj,rad,s)`, `Tweens.shake(obj,siła,s)`,
`SpriteAnimator(frames,fps)`.

**Zdrowie i broń:** `Health(max)`, `Weapon` (pole `range`), `Projectile2D(dx,dy,
speed,lifetime,owner)` z `maxHits` i `hitLayers`.

**HUD:** `TextRenderer`, `ProgressBar`, `Button`, `UITransform` + `UIAnchor` —
pozycjonowanie względem ekranu niezależnie od kamery.

## 4. Przepisy

**Platformówka** (preset `platformer-mario`): `PlatformerCharacterController2D`
z `walk(±1)` i `jump()` gdy `isGrounded()`; `TileMap` z `setTile` na podłogę;
monety jako `CircleCollider2D(10).asTrigger()` + `onTrigger`; restart na `R`.

**Survivor** (preset `survivor`): `TopDownCharacterController2D`, `Weapon` z
`range`, spawner przeciwników z `getGame().random`, `Health(100)`,
`Experience`/`Wallet`, orb doświadczenia jako trigger, kamera `follow(player)`.

**Wyścig z góry** (preset `racing-2d`): fizyka `CharacterController2D.move`
z wektorem prędkości, bramki jako `Collider2D(...).asTrigger()`, `tileAt` do
sprawdzania, czy kart jest na torze (DIRT), licznik okrążeń w komponencie.

Preset `deadcells` pokazuje wariant akcyjny: dash, spike damage, slash.

## 5. Presety i JSON

- Lista **„Wczytaj przykład…”** w Playground wczytuje preset (4 gry powyżej).
- **„Eksportuj JSON"** pobiera `moja-gra-java.json` z wszystkimi plikami.
- **„Importuj JSON"** przywraca zapisany projekt (limit 256 KiB).
- Format: `{version: 1, engineApiVersion: "2.0.0", mainClass: "GameMain",
  files: {...}}` — wymagany plik `GameMain.java`.

## 6. Typowe błędy

- **„cannot find symbol"** — literówka w nazwie klasy/metody; sprawdź
  pisownię (`Sprite`, nie `Sprit`) i import klasy komponentu.
- **„class X is public, should be declared in a file named X.java"** — nazwa
  pliku musi równać się nazwie klasy publicznej.
- **NullPointerException** — `find("Nazwa")` zwróciło null; sprawdź nazwę
  obiektu albo użyj `getComponent`/`requireComponent`.
- **Błąd runtime z komunikatem po polsku** — silnik waliduje argumenty
  (np. `Promień musi być dodatni i skończony`); przeczytaj pierwszą linię
  stosu — wskazuje plik i linię twojego kodu.
- **Pusty ekran** — brak `Sprite`/`ShapeRenderer` na obiekcie albo kamera
  patrzy w puste miejsce: ustaw `camera.setPosition(Screen.width/2,
  Screen.height/2)` albo `follow(player)`.

## 7. Limity

- 256 KiB na zapisany projekt JSON, 100 plików, `engineApiVersion` 2.0.0,
  `GameMain.java` wymagany i nazwy klas silnika zarezerwowane.
