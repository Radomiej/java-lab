export const coreApiContract = `import engine.*;
class Counter extends Component {
    int creates, updates, destroys;
    public void onCreate() { creates++; }
    public void onUpdate(double dt) { updates++; }
    public void onDestroy() { destroys++; }
}
class ChildCounter extends Counter {}
public class Main {
    static void check(boolean value, String label) {
        if (!value) throw new IllegalArgumentException(label);
        System.out.println("PASS " + label);
    }
    public static void main(String[] args) {
        GameObject object = new GameObject("Gracz", 0, 0);
        ChildCounter first = object.addComponent(new ChildCounter());
        Counter second = object.addComponent(new Counter());
        check(object.getComponent(Counter.class) == first, "lookup uwzglednia dziedziczenie");
        check(object.getComponents(Counter.class).size() == 2, "wszystkie pasujace komponenty");
        check(first.requireComponent(Counter.class) == first, "lookup z komponentu");
        java.util.ArrayList<Component> owned = first.getComponents();
        check(owned.size() == 2, "wszystkie komponenty z zachowania");
        owned.clear();
        check(first.getComponents().size() == 2, "lista z komponentu jest kopia");
        object.getComponents().clear();
        check(object.hasComponent(Counter.class), "lista jest kopia");
        object.update(0.1);
        check(first.creates == 1 && first.updates == 1, "nowe hooki lifecycle");
        check(object.removeComponent(first), "usuniecie instancji");
        object.update(0.1);
        check(first.updates == 1 && first.destroys == 1, "usuniety komponent nie aktualizuje sie");
        check(object.removeComponents(Counter.class) == 1, "usuniecie po klasie");
        check(!object.hasComponent(Counter.class) && second.destroys == 1, "lookup po usunieciu");
        object.destroy(); object.destroy();
        Counter[] counters = { new Counter(), new Counter() };
        Game game = new Game() {
            public void onCreate() {
                GameObject hero = createObject("Hero");
                hero.addComponent(counters[0]);
                hero.addComponent(counters[1]);
            }
        };
        game.start();
        check(counters[0].creates == 1 && counters[1].creates == 1, "game inicjalizuje komponenty");
        game.step(0.02);
        check(counters[0].updates == 1 && counters[1].updates == 1, "game aktualizuje swiat");
        game.dispose(); game.dispose();
        check(counters[0].destroys == 1 && counters[1].destroys == 1, "jednokrotne sprzatanie gry");
        game.step(0.02);
        check(counters[0].updates == 1, "zamknieta gra nie aktualizuje");
        boolean rejected = false;
        try { game.createObject("Late"); } catch (IllegalArgumentException error) { rejected = true; }
        check(rejected, "zamknieta gra odrzuca nowe obiekty");
        int[] changes = { 0 };
        GameObject watched = new GameObject("Watched", 0, 0);
        Runnable unsubscribe = watched.onComponentChange(change -> changes[0]++);
        Counter observed = watched.addComponent(new Counter());
        watched.removeComponent(observed);
        unsubscribe.run(); watched.addComponent(new Counter());
        check(changes[0] == 2, "listener zmian i wyrejestrowanie");
        Counter victim = new Counter(), late = new Counter();
        Game mutation = new Game() {
            public void onCreate() {
                GameObject hero = createObject("Mutation");
                hero.addComponent(new Component() {
                    boolean changed;
                    public void onUpdate(double dt) {
                        if (!changed) { changed = true; gameObject.removeComponent(victim); gameObject.addComponent(late); }
                    }
                });
                hero.addComponent(victim);
            }
        };
        mutation.start(); mutation.step(0.01);
        check(victim.updates == 0 && victim.destroys == 1, "usuniecie w trakcie klatki");
        check(late.creates == 0 && late.updates == 0, "nowy komponent czeka do nastepnej klatki");
        mutation.step(0.01);
        check(late.creates == 1 && late.updates == 1, "nowy komponent inicjalizuje sie raz");
        mutation.dispose();
        check(late.destroys == 1, "sprzatanie dynamicznego komponentu");
        Counter neverCreated = new Counter();
        Game earlyDestroy = new Game() {
            public void onCreate() {
                GameObject hero = createObject("Destroy in create");
                hero.addComponent(new Component() { public void onCreate() { gameObject.destroy(); } });
                hero.addComponent(neverCreated);
            }
        };
        earlyDestroy.start();
        check(neverCreated.creates == 0 && earlyDestroy.getObjects().size() == 0, "destroy zatrzymuje dalsza inicjalizacje");
        earlyDestroy.dispose();
        int[] contacts = { 0 };
        Game contactGame = new Game();
        GameObject a = contactGame.createObject("A"), b = contactGame.createObject("B");
        a.addComponent(new Component() { public void onTrigger(GameObject other) { contacts[0]++; } });
        b.addComponent(new Component() { public void onTrigger(GameObject other) { contacts[0]++; } });
        contactGame.start(); contactGame.dispatchContact(a, b, true);
        check(contacts[0] == 2, "kontakt trafia do obu obiektow");
        rejected = false;
        try { contactGame.step(-1); } catch (IllegalArgumentException error) { rejected = true; }
        check(rejected, "odrzucenie ujemnego czasu");
        contactGame.dispose();
    }
}`;
