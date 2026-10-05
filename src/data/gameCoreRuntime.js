export const gameCoreRuntimeFiles = {
  "Vector3.java": `package engine;
public final class Vector3 {
    public double x, y, z;
    public Vector3(double x, double y, double z) { this.x = x; this.y = y; this.z = z; }
}
`,
  "Vector2.java": `package engine;
public final class Vector2 {
    public double x, y;
    public Vector2() { this(0, 0); }
    public Vector2(double x, double y) { this.x = x; this.y = y; }
}
`,
  "Sprite.java": `package engine;
public class Sprite extends Component {
    public String texture;
    public double width, height;
    /** Odbicie poziome (flipX) lub pionowe (flipY), bez zmiany collidera. */
    public boolean flipX, flipY;
    public Sprite() { this("player", 32, 32); }
    public Sprite(String texture) { this(texture, 32, 32); }
    public Sprite(String texture, double width, double height) {
        this.texture = texture; this.width = width; this.height = height;
    }
}
`,
  "Collider2D.java": `package engine;
public class Collider2D extends Component {
    public boolean isStatic;
    public boolean isTrigger;
    public Collider2D() { this(true); }
    public Collider2D(boolean isStatic) { this.isStatic = isStatic; }
}
`,
  "Trigger2D.java": `package engine;
public class Trigger2D extends Collider2D {
    public Trigger2D() { super(); }
    public Trigger2D(boolean isStatic) { super(isStatic); }
}
`,
  "CharacterController2D.java": `package engine;
public class CharacterController2D extends Component {
    public final Vector2 velocity = new Vector2();
    public boolean collideWorldBounds = true;
    /** Hook silnika wykonywany po ruchu i kolizjach. */
    public void onAfterMove(double delta) {}
    public void move(double x, double y) { move(x, y, 200); }
    public void move(double x, double y, double speed) {
        double length = Math.sqrt(x * x + y * y);
        velocity.x = length == 0 ? 0 : x / length * speed;
        velocity.y = length == 0 ? 0 : y / length * speed;
    }
}
`,
  "Component.java": `package engine;

public abstract class Component {
    public GameObject gameObject;
    public boolean enabled = true;
    boolean created;
    boolean removed;
    boolean destroyed;
    public final void attach(GameObject owner) { gameObject = owner; }
    public void onCreate() {}
    public void onUpdate(double delta) {}
    public void onDestroy() {}
    public void onCollision(GameObject other) {}
    public void onTrigger(GameObject other) {}
    public void onComponentChange(ComponentChange change) {}
    public void onDrawBackground() {}
    public void onDrawUI() {}
    public void start() { onCreate(); }
    public void update(double delta) { onUpdate(delta); }
    public final Game getGame() { return gameObject == null ? null : gameObject.game; }
    public final <T extends Component> T getComponent(Class<T> type) { return gameObject.getComponent(type); }
    public final java.util.ArrayList<Component> getComponents() { return gameObject.getComponents(); }
    public final <T extends Component> java.util.ArrayList<T> getComponents(Class<T> type) { return gameObject.getComponents(type); }
    public final boolean hasComponent(Class<?> type) { return gameObject.hasComponent(type); }
    public final int removeComponents(Class<?> type) { return gameObject.removeComponents(type); }
    public final <T extends Component> T requireComponent(Class<T> type) {
        T component = getComponent(type);
        if (component == null) throw new IllegalArgumentException("Brak wymaganego komponentu");
        return component;
    }
    final void initialize() { if (!created && !removed) { created = true; start(); } }
    final void disposeComponent() { if (!destroyed) { destroyed = true; onDestroy(); } }
}
`,
  "ComponentChange.java": `package engine;
public final class ComponentChange {
    public final String type;
    public final Component component;
    public final GameObject object;
    ComponentChange(String type, Component component, GameObject object) {
        this.type = type; this.component = component; this.object = object;
    }
}
`,
  "ComponentChangeListener.java": `package engine;
public interface ComponentChangeListener { void onChange(ComponentChange change); }
`,
  "Game.java": `package engine;
public class Game {
    private final java.util.ArrayList<GameObject> objects = new java.util.ArrayList<>();
    private final java.util.ArrayList<Component> removed = new java.util.ArrayList<>();
    private boolean started;
    private boolean disposed;
    public String background = "#0b2033";
    public boolean debug;
    public void onCreate() {}
    public void onUpdate(double delta) {}
    public void onDestroy() {}
    public final GameObject createObject(String name) {
        if (disposed) throw new IllegalArgumentException("Gra jest zamknieta");
        GameObject object = new GameObject(this, name);
        objects.add(object); return object;
    }
    public final GameObject createObject() { return createObject("Obiekt"); }
    public final java.util.ArrayList<GameObject> getObjects() { return new java.util.ArrayList<>(objects); }
    public final boolean isDisposed() { return disposed; }
    public final void start() {
        if (started || disposed) throw new IllegalArgumentException("Gre mozna uruchomic tylko raz");
        started = true; onCreate(); initialize(); flush();
    }
    private void initialize() {
        for (int pass = 0; pass < 1000; pass++) {
            boolean pending = false;
            for (GameObject object : getObjects()) {
                if (object.destroyed) continue;
                for (Component component : object.getComponents()) {
                    if (disposed || object.destroyed) break;
                    if (!component.created && !component.removed) { pending = true; component.initialize(); }
                }
            }
            if (!pending) return;
        }
        throw new IllegalArgumentException("onCreate tworzy komponenty bez konca");
    }
    public final void step(double delta) {
        if (!started || disposed) return;
        if (delta != delta || delta < 0 || delta == Double.POSITIVE_INFINITY) throw new IllegalArgumentException("Niepoprawny czas klatki");
        delta = Math.min(delta, 0.1);
        initialize();
        java.util.ArrayList<GameObject> snapshot = getObjects();
        java.util.ArrayList<java.util.ArrayList<Component>> components = new java.util.ArrayList<>();
        for (GameObject object : snapshot) components.add(object.getComponents());
        try {
            GameCanvas.clear(background);
            for (GameObject object : snapshot) for (Component component : object.getComponents())
                if (object.active && !object.destroyed && component.created && component.enabled && !component.removed) component.onDrawBackground();
            for (GameObject object : snapshot) {
                CharacterController2D controller = object.getComponent(CharacterController2D.class);
                if (controller != null) { controller.velocity.x = 0; controller.velocity.y = 0; }
            }
            onUpdate(delta);
            for (int i = 0; i < snapshot.size() && !disposed; i++) snapshot.get(i).updateComponents(delta, components.get(i));
            if (!disposed) Physics2D.step(this, snapshot, delta);
            double cameraX=0,cameraY=0;
            for(GameObject object:getObjects()) {
                Camera2D camera=object.getComponent(Camera2D.class);
                if(object.active&&!object.destroyed&&camera!=null&&camera.enabled){cameraX=camera.offsetX;cameraY=camera.offsetY;break;}
            }
            if (!disposed) for (GameObject object : getObjects()) {
                Sprite sprite = object.getComponent(Sprite.class);
                if (object.active && !object.destroyed && sprite != null && sprite.enabled && sprite.created)
                    GameCanvas.drawSprite(sprite.texture, object.transform.x + object.transform.visualOffset.x - cameraX, object.transform.y + object.transform.visualOffset.y - cameraY, sprite.width, sprite.height,
                        object.transform.rotation.z, object.transform.scale.x * (sprite.flipX ? -1 : 1), object.transform.scale.y * (sprite.flipY ? -1 : 1));
            }
            if (!disposed) GameCanvas.drawDebugState(debug);
            if (!disposed) for (GameObject object : getObjects()) {
                Collider2D collider=object.getComponent(Collider2D.class);
                CharacterController2D controller=object.getComponent(CharacterController2D.class);
                if(object.active && !object.destroyed && (collider!=null && collider.enabled && collider.created || collider==null && controller!=null && controller.enabled && controller.created))
                    GameCanvas.drawCollider(collider instanceof CircleCollider2D ? "circle" : "rect",
                        object.transform.x-cameraX,object.transform.y-cameraY,Physics2D.extent(object,true)*2,Physics2D.extent(object,false)*2,
                        collider!=null && (collider.isTrigger || collider instanceof Trigger2D));
            }
            if (!disposed) for (GameObject object : getObjects()) for (Component component : object.getComponents())
                if(object.active&&!object.destroyed&&component.created&&component.enabled&&!component.removed)component.onDrawUI();
        } finally { flush(); Input.endFrame(); }
    }
    void removed(Component component) { removed.add(component); }
    private void flush() {
        for (Component component : new java.util.ArrayList<>(removed)) { removed.remove(component); component.disposeComponent(); }
        for (GameObject object : getObjects()) if (object.destroyed) { objects.remove(object); object.cleanup(); }
    }
    public final void dispatchContact(GameObject first, GameObject second, boolean trigger) {
        if (disposed || first.game != this || second.game != this) return;
        first.contact(second, trigger); second.contact(first, trigger);
        flush();
    }
    public final void dispose() {
        if (disposed) return;
        disposed = true;
        for (GameObject object : getObjects()) object.destroy();
        flush(); onDestroy();
    }
}
`,
  "GameLoop.java": `package engine;

public final class GameLoop {
    private GameLoop() {}
    private static boolean running;
    public static void start() { running = true; }
    public static void stop() { running = false; }
    public static boolean isRunning() { return running; }
}
`,
  "GameCanvas.java": `package engine;

public final class GameCanvas {
    private GameCanvas() {}
    private static final StringBuilder frame = new StringBuilder();
    private static double width = 600;
    private static double height = 400;
    public static double getWidth() { return width; }
    public static double getHeight() { return height; }
    public static void setSize(double nextWidth, double nextHeight) { width = nextWidth; height = nextHeight; }

    public static void clear(String color) { frame.setLength(0); frame.append("clear|").append(color).append((char) 10); }
    public static void drawRect(double x, double y, double width, double height, String color) { frame.append("rect|").append(x).append('|').append(y).append('|').append(width).append('|').append(height).append('|').append(color).append((char) 10); }
    public static void drawText(String text, double x, double y, String color) { frame.append("text|").append(text.replace("|", "/").replace((char) 10, ' ')).append('|').append(x).append('|').append(y).append('|').append(color).append((char) 10); }
    public static void drawCenteredText(String text, double x, double y, String color) { frame.append("text|").append(text.replace("|", "/").replace((char) 10, ' ')).append('|').append(x).append('|').append(y).append('|').append(color).append("|center").append((char) 10); }
    public static String frame() { return frame.toString(); }
    public static void drawDebugState(boolean enabled) { frame.append("debug|").append(enabled).append((char)10); }
    /** Metadane debugowania: renderer wyświetla je po włączeniu Collidery. */
    public static void drawCollider(String shape,double x,double y,double width,double height,boolean trigger) {
        frame.append("collider|").append(shape).append('|').append(x).append('|').append(y).append('|').append(width).append('|').append(height).append('|').append(trigger).append((char)10);
    }
    public static void drawSprite(String texture, double x, double y, double width, double height) {
        drawSprite(texture, x, y, width, height, 0, 1, 1);
    }
    public static void drawSprite(String texture, double x, double y, double width, double height, double rotation, double scaleX, double scaleY) {
        frame.append("sprite|").append(texture).append('|').append(x).append('|').append(y).append('|').append(width).append('|').append(height)
            .append('|').append(rotation).append('|').append(scaleX).append('|').append(scaleY).append((char) 10);
    }
}
`,
  "Input.java": `package engine;

public final class Input {
    private Input() {}
    private static String keys = "";
    private static String pressedKeys = "";

    private static String normalize(String key) {
        if(key==null || key.isEmpty() || key.indexOf('|')>=0)throw new IllegalArgumentException("Niepoprawny klawisz");
        if(key.equals(" "))return "Space";
        return key.length()==1?key.toLowerCase():key;
    }
    public static boolean isKeyDown(String key) { return keys.indexOf("|" + normalize(key) + "|") >= 0; }
    public static boolean isKeyPressed(String key) { return pressedKeys.indexOf("|" + normalize(key) + "|") >= 0; }
    public static void endFrame() { pressedKeys = ""; }
    public static void setKey(String key, boolean pressed) {
        key=normalize(key);
        String token = "|" + key + "|";
        if (pressed && !isKeyDown(key)) {
            keys += token;
            if (pressedKeys.indexOf(token) < 0) pressedKeys += token;
        }
        if (!pressed) keys = keys.replace(token, "");
    }
}
`,
  "Transform.java": `package engine;

public final class Transform {
    public double x;
    public double y;
    public final Vector3 rotation = new Vector3(0, 0, 0);
    public final Vector3 scale = new Vector3(1, 1, 1);
    public final Vector2 visualOffset = new Vector2();

    public Transform(double x, double y) {
        this.x = x;
        this.y = y;
    }
}
`,
  "GameObject.java": `package engine;

public class GameObject {
    public final Transform transform;
    public String name;
    public boolean active = true;
    public boolean destroyed;
    public final Game game;
    private boolean updating;
    private final java.util.ArrayList<Component> components = new java.util.ArrayList<>();
    private final java.util.ArrayList<Component> removed = new java.util.ArrayList<>();
    private final java.util.ArrayList<ComponentChangeListener> listeners = new java.util.ArrayList<>();

    public GameObject(String name, double x, double y) {
        this.game = null;
        this.name = name;
        this.transform = new Transform(x, y);
    }
    GameObject(Game game, String name) { this.game = game; this.name = name; this.transform = new Transform(0, 0); }
    public GameObject setPosition(double x, double y) { transform.x = x; transform.y = y; return this; }

    public <T extends Component> T addComponent(T component) {
        if (destroyed) throw new IllegalArgumentException("Obiekt jest usuniety");
        if (component == null) throw new IllegalArgumentException("Komponent nie może być null");
        if (component.gameObject != null) throw new IllegalArgumentException("Komponent jest już podłączony");
        component.attach(this);
        components.add(component);
        notifyChange("added", component);
        if (game == null) component.initialize();
        return component;
    }
    public <T extends Component> T getComponent(Class<T> type) {
        if (type == null) throw new IllegalArgumentException("Brak typu komponentu");
        for (Component component : components) if (type.isInstance(component)) return (T) component;
        return null;
    }
    public java.util.ArrayList<Component> getComponents() { return new java.util.ArrayList<>(components); }
    public <T extends Component> java.util.ArrayList<T> getComponents(Class<T> type) {
        if (type == null) throw new IllegalArgumentException("Brak typu komponentu");
        java.util.ArrayList<T> result = new java.util.ArrayList<>();
        for (Component component : components) if (type.isInstance(component)) result.add((T) component);
        return result;
    }
    public boolean hasComponent(Class<?> type) {
        if (type == null) throw new IllegalArgumentException("Brak typu komponentu");
        for (Component component : components) if (type.isInstance(component)) return true;
        return false;
    }
    public boolean removeComponent(Component component) {
        if (!components.remove(component)) return false;
        component.removed = true;
        if (game != null) game.removed(component); else removed.add(component);
        notifyChange("removed", component);
        if (game == null && !updating) flushRemoved();
        return true;
    }
    public boolean removeComponent(Class<?> type) {
        if (type == null) throw new IllegalArgumentException("Brak typu komponentu");
        for (Component component : getComponents()) if (type.isInstance(component)) return removeComponent(component);
        return false;
    }
    public int removeComponents(Class<?> type) {
        if (type == null) throw new IllegalArgumentException("Brak typu komponentu");
        int count = 0;
        for (Component component : getComponents()) if (type.isInstance(component) && removeComponent(component)) count++;
        return count;
    }
    public Runnable onComponentChange(ComponentChangeListener listener) {
        if (listener == null) throw new IllegalArgumentException("Brak listenera");
        listeners.add(listener); return () -> listeners.remove(listener);
    }
    private void notifyChange(String type, Component component) {
        ComponentChange change = new ComponentChange(type, component, this);
        for (ComponentChangeListener listener : new java.util.ArrayList<>(listeners)) listener.onChange(change);
        for (Component observer : getComponents()) if (observer.created && !observer.removed) observer.onComponentChange(change);
    }
    private void flushRemoved() {
        for (Component component : new java.util.ArrayList<>(removed)) { removed.remove(component); component.disposeComponent(); }
    }
    public void destroy() {
        if (destroyed) return;
        destroyed = true;
        if (game == null && !updating) cleanup();
    }
    void cleanup() {
        for (Component component : getComponents()) { component.removed = true; component.disposeComponent(); }
        components.clear(); flushRemoved(); listeners.clear();
    }
    void contact(GameObject other, boolean trigger) {
        for (Component component : getComponents()) {
            if (destroyed || other.destroyed || !active || !other.active) return;
            if (component.created && !component.removed && component.enabled) {
                if (trigger) component.onTrigger(other); else component.onCollision(other);
            }
        }
    }

    public void update(double delta) {
        updateComponents(delta, getComponents());
    }
    void updateComponents(double delta, java.util.ArrayList<Component> snapshot) {
        updating = true;
        try {
            for (Component component : snapshot) {
                if (!active || destroyed || (game != null && game.isDisposed())) break;
                if (!component.removed && component.created && component.enabled) component.update(delta);
            }
        } finally { updating = false; if (game == null) { flushRemoved(); if (destroyed) cleanup(); } }
    }

    public void draw(String color) {
        if (!active || destroyed) return;
        GameCanvas.drawRect(transform.x, transform.y, 28, 28, color);
        GameCanvas.drawCenteredText(name, transform.x + 14, transform.y + 42, "#d9eff0");
    }
}
`,
  "PlayerController2D.java": `package engine;

public abstract class PlayerController2D extends Component {
}
`,
};

export const gameCoreApiDescription = [
  { name: "Sprite", methods: "texture, width, height, flipX, flipY, enabled", description: "Tekstura z atlasu; pozycja obiektu oznacza środek sprite’a. flipX odbija lewo/prawo, flipY góra/dół, bez zmiany collidera." },
  { name: "Collider2D", methods: "isStatic, enabled", description: "Prostokątne ciało blokujące ruch kontrolera." },
  { name: "Trigger2D", methods: "onTrigger, enabled", description: "Kontakt bez blokowania ruchu; regułę kontaktu piszesz we własnym komponencie." },
  { name: "CharacterController2D", methods: "move, velocity, collideWorldBounds, enabled", description: "Ruch w Game.step; move normalizuje kierunek i przyjmuje prędkość w pikselach na sekundę." },
  { name: "Transform", methods: "x, y, rotation.z, scale.x, scale.y", description: "Pozycja środka w pikselach CSS, obrót sprite’a w radianach i skala obrazu. Kolizje pozostają osiowymi AABB." },
  { name: "Game", methods: "createObject, start, step, getObjects, dispatchContact, dispose", description: "Scena i cykl życia gry: onCreate, onUpdate, onDestroy." },
  { name: "GameCanvas", methods: "clear, drawRect, drawText, drawCenteredText, drawSprite, getWidth, getHeight", description: "Rysowanie i rozmiar planszy w pikselach CSS." },
  { name: "Input", methods: "isKeyDown, isKeyPressed", description: "Trzymanie klawisza i nowe naciśnięcie w bieżącej klatce." },
  { name: "GameLoop", methods: "start, stop, isRunning", description: "Flaga zgodności dla starszych przykładów. Cykl sceny obsługuje Game, a pętlę przeglądarki worker TeaVM." },
  { name: "GameObject", methods: "setPosition, addComponent, getComponent, getComponents, hasComponent, removeComponent, removeComponents, onComponentChange, destroy, update, draw", description: "Obiekt sceny z pozycją i komponentami użytkownika." },
  { name: "Component", methods: "onCreate, onUpdate, onDestroy, onCollision, onTrigger, onComponentChange, getComponent, getComponents, hasComponent, removeComponents, requireComponent, getGame, enabled, gameObject", description: "Własne zachowanie; getComponents() zwraca kopię listy, wariant z Class filtruje typ. start/update pozostają obsługiwane." },
  { name: "PlayerController2D", methods: "attach, update", description: "Bazowa klasa własnego kontrolera gracza." },
];
