function independentTask(lessonId, suffix, definition) {
  return {
    id: `${lessonId}-${suffix}`,
    mode: "independent",
    title: definition.title,
    prompt: definition.prompt,
    steps: definition.steps,
    starterFiles: { "Main.java": definition.starter },
    solutionFiles: { "Main.java": definition.solution },
    checks: definition.checks,
    mainClass: definition.mainClass || "Main",
    runMode: definition.runMode || "console",
  };
}

const additionalTasks = {
  "fundamentals-01": [
    independentTask("fundamentals-01", "independent-1", {
      title: "Komunikat misji",
      prompt: "Utwórz zmienną tekstową z nazwą misji i wypisz komunikat z jej użyciem.",
      steps: ["Zadeklaruj String mission.", "Nadaj zmiennej wartość Znajdź skarb.", "Wypisz tekst Misja: oraz wartość zmiennej."],
      starter: `public class Main {
    public static void main(String[] args) {
        // TODO: zmienna mission i komunikat
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        String mission = "Znajdź skarb";
        System.out.println("Misja: " + mission);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "String mission", label: "Zmienna misji" },
        { kind: "contains", file: "Main.java", value: "System.out.println(\"Misja: \" + mission)", label: "Komunikat z wartością" },
      ],
    }),
    independentTask("fundamentals-01", "independent-2", {
      title: "Trzy linie historii",
      prompt: "Wypisz trzy kolejne etapy krótkiej historii gracza.",
      steps: ["Zostaw punkt startowy main.", "Wypisz Start.", "Wypisz Las, a następnie Skarb."],
      starter: `public class Main {
    public static void main(String[] args) {
        // TODO: trzy komunikaty historii
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("Start");
        System.out.println("Las");
        System.out.println("Skarb");
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "System.out.println(\"Start\")", label: "Początek historii" },
        { kind: "contains", file: "Main.java", value: "System.out.println(\"Las\")", label: "Drugi etap" },
        { kind: "contains", file: "Main.java", value: "System.out.println(\"Skarb\")", label: "Finał historii" },
      ],
    }),
  ],
  "fundamentals-02": [
    independentTask("fundamentals-02", "independent-1", {
      title: "Zdrowie i gotowość",
      prompt: "Zapisz poziom zdrowia i gotowość gracza w zmiennych o odpowiednich typach.",
      steps: ["Utwórz double health o wartości 87.5.", "Utwórz boolean ready o wartości true.", "Wypisz obie wartości."],
      starter: `public class Main {
    public static void main(String[] args) {
        // TODO: health i ready
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        double health = 87.5;
        boolean ready = true;
        System.out.println(health);
        System.out.println(ready);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "double health", label: "Liczba ułamkowa" },
        { kind: "contains", file: "Main.java", value: "boolean ready", label: "Wartość logiczna" },
        { kind: "contains", file: "Main.java", value: "System.out.println(health)", label: "Wypisanie zdrowia" },
      ],
    }),
    independentTask("fundamentals-02", "independent-2", {
      title: "Suma punktów",
      prompt: "Połącz punkty bazowe i premię w nowej zmiennej totalPoints.",
      steps: ["Utwórz int basePoints o wartości 40.", "Utwórz int bonus o wartości 15.", "Oblicz totalPoints przez dodawanie i wypisz wynik."],
      starter: `public class Main {
    public static void main(String[] args) {
        // TODO: punkty bazowe, premia i suma
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        int basePoints = 40;
        int bonus = 15;
        int totalPoints = basePoints + bonus;
        System.out.println(totalPoints);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "int basePoints", label: "Punkty bazowe" },
        { kind: "contains", file: "Main.java", value: "int bonus", label: "Premia" },
        { kind: "contains", file: "Main.java", value: "int totalPoints = basePoints + bonus", label: "Suma punktów" },
      ],
    }),
  ],
  "fundamentals-03": [
    independentTask("fundamentals-03", "independent-1", {
      title: "Parzyste rundy",
      prompt: "Przejdź przez pięć rund i wypisz tylko numery parzyste.",
      steps: ["Użyj pętli for od 1 do 5.", "Sprawdź resztę z dzielenia przez 2.", "Wypisz rundę tylko wtedy, gdy jest parzysta."],
      starter: `public class Main {
    public static void main(String[] args) {
        // TODO: wypisz parzyste rundy
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        for (int round = 1; round <= 5; round++) {
            if (round % 2 == 0) {
                System.out.println(round);
            }
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "round <= 5", label: "Pięć rund" },
        { kind: "contains", file: "Main.java", value: "round % 2 == 0", label: "Sprawdzenie parzystości" },
        { kind: "contains", file: "Main.java", value: "System.out.println(round)", label: "Wypisanie rundy" },
      ],
    }),
    independentTask("fundamentals-03", "independent-2", {
      title: "Odliczanie żyć",
      prompt: "Użyj pętli while, aby odliczyć trzy życia gracza do zera.",
      steps: ["Utwórz int lives = 3.", "Powtarzaj kod, dopóki lives jest większe od zera.", "Wypisz życie i zmniejsz licznik o jeden."],
      starter: `public class Main {
    public static void main(String[] args) {
        int lives = 3;
        // TODO: odlicz życia
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        int lives = 3;
        while (lives > 0) {
            System.out.println(lives);
            lives--;
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "int lives = 3", label: "Licznik żyć" },
        { kind: "contains", file: "Main.java", value: "while (lives > 0)", label: "Pętla while" },
        { kind: "contains", file: "Main.java", value: "lives--", label: "Zmniejszanie licznika" },
      ],
    }),
  ],
  "fundamentals-04": [
    independentTask("fundamentals-04", "independent-1", {
      title: "Dodaj premię",
      prompt: "Napisz metodę addBonus, która dodaje premię do bazowych punktów.",
      steps: ["Zdefiniuj static int addBonus(int points, int bonus).", "Zwróć sumę obu parametrów.", "Wywołaj metodę dla 80 i 20."],
      starter: `public class Main {
    // TODO: dodaj addBonus

    public static void main(String[] args) {
        // TODO: wywołaj metodę
    }
}
`,
      solution: `public class Main {
    static int addBonus(int points, int bonus) {
        return points + bonus;
    }

    public static void main(String[] args) {
        System.out.println(addBonus(80, 20));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "static int addBonus(int points, int bonus)", label: "Metoda z dwoma parametrami" },
        { kind: "contains", file: "Main.java", value: "return points + bonus", label: "Dodanie premii" },
        { kind: "contains", file: "Main.java", value: "addBonus(80, 20)", label: "Wywołanie metody" },
      ],
    }),
    independentTask("fundamentals-04", "independent-2", {
      title: "Sprawdź awans",
      prompt: "Utwórz metodę canLevelUp, która zwraca informację, czy gracz ma co najmniej 100 punktów.",
      steps: ["Zdefiniuj static boolean canLevelUp(int points).", "Zwróć porównanie points >= 100.", "Użyj wyniku w instrukcji if."],
      starter: `public class Main {
    // TODO: dodaj canLevelUp

    public static void main(String[] args) {
        // TODO: sprawdź awans
    }
}
`,
      solution: `public class Main {
    static boolean canLevelUp(int points) {
        return points >= 100;
    }

    public static void main(String[] args) {
        if (canLevelUp(120)) {
            System.out.println("Awans");
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "static boolean canLevelUp(int points)", label: "Metoda logiczna" },
        { kind: "contains", file: "Main.java", value: "points >= 100", label: "Próg awansu" },
        { kind: "contains", file: "Main.java", value: "if (canLevelUp(120))", label: "Użycie wyniku" },
      ],
    }),
  ],
  "objects-05": [
    independentTask("objects-05", "independent-1", {
      title: "Dwa questy",
      prompt: "Utwórz klasę Quest i dwa różne obiekty tej klasy.",
      steps: ["Dodaj pole String title.", "Utwórz quest Mapa i quest Klucz przez new.", "Wypisz tytuł drugiego obiektu."],
      starter: `class Quest {
    String title;
}

public class Main {
    public static void main(String[] args) {
        // TODO: dwa obiekty Quest
    }
}
`,
      solution: `class Quest {
    String title;
}

public class Main {
    public static void main(String[] args) {
        Quest first = new Quest();
        first.title = "Mapa";
        Quest second = new Quest();
        second.title = "Klucz";
        System.out.println(second.title);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "Quest first = new Quest()", label: "Pierwszy obiekt" },
        { kind: "contains", file: "Main.java", value: "Quest second = new Quest()", label: "Drugi obiekt" },
        { kind: "contains", file: "Main.java", value: "second.title", label: "Odczyt stanu obiektu" },
      ],
    }),
    independentTask("objects-05", "independent-2", {
      title: "Opis obiektu",
      prompt: "Dodaj metodę describe, która zwraca opis questa z jego tytułem.",
      steps: ["Zdefiniuj klasę Quest z polem title.", "Dodaj metodę String describe().", "Utwórz obiekt i wypisz quest.describe()."],
      starter: `class Quest {
    String title;

    // TODO: dodaj describe
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest();
        quest.title = "Smok";
        // TODO: wypisz opis
    }
}
`,
      solution: `class Quest {
    String title;

    String describe() {
        return "Quest: " + title;
    }
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest();
        quest.title = "Smok";
        System.out.println(quest.describe());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "String describe()", label: "Metoda obiektu" },
        { kind: "contains", file: "Main.java", value: "return \"Quest: \" + title", label: "Opis questa" },
        { kind: "contains", file: "Main.java", value: "quest.describe()", label: "Wywołanie metody" },
      ],
    }),
  ],
  "objects-06": [
    independentTask("objects-06", "independent-1", {
      title: "Zmiana tytułu",
      prompt: "Zabezpiecz tytuł questa i udostępnij kontrolowaną metodę rename.",
      steps: ["Zmień pole title na private.", "Dodaj konstruktor i metodę rename(String newTitle).", "Odczytaj tytuł przez getTitle()."],
      starter: `class Quest {
    // TODO: private title, konstruktor, rename i getTitle
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Mapa");
        // TODO: zmień i wypisz tytuł
    }
}
`,
      solution: `class Quest {
    private String title;

    Quest(String title) {
        this.title = title;
    }

    void rename(String newTitle) {
        title = newTitle;
    }

    String getTitle() {
        return title;
    }
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Mapa");
        quest.rename("Zamek");
        System.out.println(quest.getTitle());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "private String title", label: "Ukryte pole" },
        { kind: "contains", file: "Main.java", value: "void rename(String newTitle)", label: "Metoda zmiany" },
        { kind: "contains", file: "Main.java", value: "quest.rename(\"Zamek\")", label: "Zmiana tytułu" },
      ],
    }),
    independentTask("objects-06", "independent-2", {
      title: "Punkty obiektu",
      prompt: "Zbuduj klasę Player z prywatnymi punktami i metodą addPoints.",
      steps: ["Dodaj private int points.", "Ustaw początkowe punkty w konstruktorze.", "Dodaj addPoints oraz getPoints i użyj obu metod."],
      starter: `class Player {
    // TODO: prywatne punkty i metody
}

public class Main {
    public static void main(String[] args) {
        Player player = new Player(10);
        // TODO: dodaj 5 punktów i wypisz wynik
    }
}
`,
      solution: `class Player {
    private int points;

    Player(int points) {
        this.points = points;
    }

    void addPoints(int value) {
        points += value;
    }

    int getPoints() {
        return points;
    }
}

public class Main {
    public static void main(String[] args) {
        Player player = new Player(10);
        player.addPoints(5);
        System.out.println(player.getPoints());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "private int points", label: "Prywatne punkty" },
        { kind: "contains", file: "Main.java", value: "void addPoints(int value)", label: "Metoda dodawania" },
        { kind: "contains", file: "Main.java", value: "player.getPoints()", label: "Getter punktów" },
      ],
    }),
  ],
  "objects-07": [
    independentTask("objects-07", "independent-1", {
      title: "Team posiada questa",
      prompt: "Zbuduj klasę Team, która przechowuje obiekt Quest i zwraca jego tytuł.",
      steps: ["Dodaj Quest z konstruktorem i getterem.", "Dodaj prywatne pole Quest quest w Team.", "Dodaj currentTitle() i wywołaj ją w main."],
      starter: `class Quest {
    private String title;

    Quest(String title) {
        this.title = title;
    }

    String getTitle() {
        return title;
    }
}

class Team {
    // TODO: pole quest, konstruktor i currentTitle
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Mapa");
        // TODO: utwórz Team i wypisz tytuł
    }
}
`,
      solution: `class Quest {
    private String title;

    Quest(String title) {
        this.title = title;
    }

    String getTitle() {
        return title;
    }
}

class Team {
    private Quest quest;

    Team(Quest quest) {
        this.quest = quest;
    }

    String currentTitle() {
        return quest.getTitle();
    }
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Mapa");
        Team team = new Team(quest);
        System.out.println(team.currentTitle());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "private Quest quest", label: "Kompozycja Team i Quest" },
        { kind: "contains", file: "Main.java", value: "Team(Quest quest)", label: "Konstruktor zależności" },
        { kind: "contains", file: "Main.java", value: "team.currentTitle()", label: "Użycie obiektu złożonego" },
      ],
    }),
    independentTask("objects-07", "independent-2", {
      title: "Bohater i ekwipunek",
      prompt: "Zbuduj bohatera, który posiada obiekt Inventory.",
      steps: ["Dodaj Inventory z liczbą slotów.", "Dodaj prywatne Inventory inventory w Hero.", "Przekaż ekwipunek do konstruktora Hero."],
      starter: `class Inventory {
    // TODO: slots i konstruktor
}

class Hero {
    // TODO: Hero posiada Inventory
}

public class Main {
    public static void main(String[] args) {
        Inventory inventory = new Inventory(6);
        // TODO: utwórz bohatera
    }
}
`,
      solution: `class Inventory {
    private int slots;

    Inventory(int slots) {
        this.slots = slots;
    }
}

class Hero {
    private Inventory inventory;

    Hero(Inventory inventory) {
        this.inventory = inventory;
    }
}

public class Main {
    public static void main(String[] args) {
        Inventory inventory = new Inventory(6);
        Hero hero = new Hero(inventory);
        System.out.println("Bohater gotowy");
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "private int slots", label: "Stan ekwipunku" },
        { kind: "contains", file: "Main.java", value: "private Inventory inventory", label: "Ekwipunek bohatera" },
        { kind: "contains", file: "Main.java", value: "new Hero(inventory)", label: "Połączenie obiektów" },
      ],
    }),
  ],
  "objects-08": [
    independentTask("objects-08", "independent-1", {
      title: "Reset questa",
      prompt: "Dodaj do questa metodę reset, która ustawia stan completed na false.",
      steps: ["Dodaj prywatne pole boolean completed.", "Dodaj complete() i reset().", "Sprawdź stan po ukończeniu i zresetowaniu questa."],
      starter: `class Quest {
    // TODO: completed, complete(), reset() i isCompleted()
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest();
        // TODO: sprawdź reset stanu
    }
}
`,
      solution: `class Quest {
    private boolean completed = false;

    void complete() {
        completed = true;
    }

    void reset() {
        completed = false;
    }

    boolean isCompleted() {
        return completed;
    }
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest();
        quest.complete();
        quest.reset();
        System.out.println(quest.isCompleted());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "void reset()", label: "Metoda resetowania" },
        { kind: "contains", file: "Main.java", value: "completed = false", label: "Wyzerowanie stanu" },
        { kind: "contains", file: "Main.java", value: "quest.reset()", label: "Użycie resetu" },
      ],
    }),
    independentTask("objects-08", "independent-2", {
      title: "Portfel nagród",
      prompt: "Zbuduj klasę RewardWallet, która ukrywa punkty i pozwala je zwiększać.",
      steps: ["Dodaj private int points.", "Dodaj add(int value), które zmienia stan.", "Dodaj total() i wypisz wynik po dwóch nagrodach."],
      starter: `class RewardWallet {
    // TODO: punkty i metody
}

public class Main {
    public static void main(String[] args) {
        RewardWallet wallet = new RewardWallet();
        // TODO: dodaj nagrody i wypisz sumę
    }
}
`,
      solution: `class RewardWallet {
    private int points;

    void add(int value) {
        points += value;
    }

    int total() {
        return points;
    }
}

public class Main {
    public static void main(String[] args) {
        RewardWallet wallet = new RewardWallet();
        wallet.add(10);
        wallet.add(25);
        System.out.println(wallet.total());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "private int points", label: "Ukryty stan nagród" },
        { kind: "contains", file: "Main.java", value: "void add(int value)", label: "Dodawanie nagrody" },
        { kind: "contains", file: "Main.java", value: "wallet.total()", label: "Odczyt sumy" },
      ],
    }),
  ],
  "inheritance-09": [
    independentTask("inheritance-09", "independent-1", {
      title: "Wojownik z klasy bazowej",
      prompt: "Utwórz klasę Warrior dziedziczącą po Character.",
      steps: ["Dodaj Character z polem name i konstruktorem.", "Dodaj Warrior extends Character.", "Wywołaj super(name) i utwórz wojownika."],
      starter: `class Character {
    protected String name;

    Character(String name) {
        this.name = name;
    }
}

class Warrior extends Character {
    // TODO: konstruktor wojownika
}

public class Main {
    public static void main(String[] args) {
        // TODO: utwórz wojownika
    }
}
`,
      solution: `class Character {
    protected String name;

    Character(String name) {
        this.name = name;
    }
}

class Warrior extends Character {
    Warrior(String name) {
        super(name);
    }
}

public class Main {
    public static void main(String[] args) {
        Warrior warrior = new Warrior("Borin");
        System.out.println(warrior.name);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "class Warrior extends Character", label: "Klasa potomna" },
        { kind: "contains", file: "Main.java", value: "Warrior(String name)", label: "Konstruktor potomka" },
        { kind: "contains", file: "Main.java", value: "super(name)", label: "Wywołanie konstruktora bazowego" },
      ],
    }),
    independentTask("inheritance-09", "independent-2", {
      title: "Łotrzyk i poziom",
      prompt: "Dodaj klasę Rogue, która dziedziczy imię i przechowuje własny poziom.",
      steps: ["Utwórz Character z konstruktorem name.", "Dodaj Rogue extends Character i pole level.", "Przekaż name przez super, a level przez this."],
      starter: `class Character {
    protected String name;

    Character(String name) {
        this.name = name;
    }
}

class Rogue extends Character {
    // TODO: level i konstruktor
}

public class Main {
    public static void main(String[] args) {
        // TODO: utwórz łotrzyka
    }
}
`,
      solution: `class Character {
    protected String name;

    Character(String name) {
        this.name = name;
    }
}

class Rogue extends Character {
    private int level;

    Rogue(String name, int level) {
        super(name);
        this.level = level;
    }
}

public class Main {
    public static void main(String[] args) {
        Rogue rogue = new Rogue("Nox", 3);
        System.out.println(rogue.name);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "class Rogue extends Character", label: "Dziedziczenie łotrzyka" },
        { kind: "contains", file: "Main.java", value: "private int level", label: "Własne pole potomka" },
        { kind: "contains", file: "Main.java", value: "this.level = level", label: "Inicjalizacja poziomu" },
      ],
    }),
  ],
  "inheritance-10": [
    independentTask("inheritance-10", "independent-1", {
      title: "Opis wojownika",
      prompt: "Przesłoń metodę describe w klasie Warrior.",
      steps: ["Dodaj describe() w Character.", "Użyj @Override w Warrior.", "Zwróć tekst Warrior z metody potomnej."],
      starter: `class Character {
    String describe() {
        return "Character";
    }
}

class Warrior extends Character {
    // TODO: przesłoń describe()
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Warrior().describe());
    }
}
`,
      solution: `class Character {
    String describe() {
        return "Character";
    }
}

class Warrior extends Character {
    @Override
    String describe() {
        return "Warrior";
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Warrior().describe());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "@Override", label: "Adnotacja przesłonięcia" },
        { kind: "contains", file: "Main.java", value: "class Warrior extends Character", label: "Klasa potomna" },
        { kind: "contains", file: "Main.java", value: "return \"Warrior\"", label: "Opis wojownika" },
      ],
    }),
    independentTask("inheritance-10", "independent-2", {
      title: "Opis z tarczą",
      prompt: "Przesłoń describe tak, aby zachować opis rodzica i dodać własny fragment.",
      steps: ["Dodaj Character.describe() zwracające Bohater.", "Utwórz Knight extends Character.", "Zwróć super.describe() + tekst o tarczy."],
      starter: `class Character {
    String describe() {
        return "Bohater";
    }
}

class Knight extends Character {
    // TODO: describe z super
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Knight().describe());
    }
}
`,
      solution: `class Character {
    String describe() {
        return "Bohater";
    }
}

class Knight extends Character {
    @Override
    String describe() {
        return super.describe() + " z tarczą";
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Knight().describe());
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "class Knight extends Character", label: "Klasa rycerza" },
        { kind: "contains", file: "Main.java", value: "super.describe()", label: "Wykorzystanie rodzica" },
        { kind: "contains", file: "Main.java", value: "z tarczą", label: "Dodany opis" },
      ],
    }),
  ],
  "inheritance-11": [
    independentTask("inheritance-11", "independent-1", {
      title: "Uzdrowiciel i łucznik",
      prompt: "Przechowaj dwa różne typy postaci w tablicy Character.",
      steps: ["Dodaj Character z metodą role().", "Utwórz Healer i Archer z @Override.", "Przejdź po Character[] party i wywołaj role()."],
      starter: `class Character {
    String role() { return "Character"; }
}

class Healer extends Character {
    // TODO
}

class Archer extends Character {
    // TODO
}

public class Main {
    public static void main(String[] args) {
        // TODO: tablica i pętla
    }
}
`,
      solution: `class Character {
    String role() { return "Character"; }
}

class Healer extends Character {
    @Override String role() { return "Healer"; }
}

class Archer extends Character {
    @Override String role() { return "Archer"; }
}

public class Main {
    public static void main(String[] args) {
        Character[] party = { new Healer(), new Archer() };
        for (Character member : party) {
            System.out.println(member.role());
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "Character[] party", label: "Tablica bazowa" },
        { kind: "contains", file: "Main.java", value: "new Healer()", label: "Uzdrowiciel" },
        { kind: "contains", file: "Main.java", value: "new Archer()", label: "Łucznik" },
      ],
    }),
    independentTask("inheritance-11", "independent-2", {
      title: "Polimorficzny atak",
      prompt: "Zaimplementuj różne ataki klas Mage i Warrior, a potem wywołaj je przez typ bazowy.",
      steps: ["Dodaj attack() w Character.", "Przesłoń attack() w Mage i Warrior.", "Przejdź po tablicy Character i wypisz ataki."],
      starter: `class Character {
    String attack() { return "Atak"; }
}

class Mage extends Character {
    // TODO: magiczny atak
}

class Warrior extends Character {
    // TODO: atak mieczem
}

public class Main {
    public static void main(String[] args) {
        // TODO: wywołaj polimorficzne ataki
    }
}
`,
      solution: `class Character {
    String attack() { return "Atak"; }
}

class Mage extends Character {
    @Override String attack() { return "Czar"; }
}

class Warrior extends Character {
    @Override String attack() { return "Miecz"; }
}

public class Main {
    public static void main(String[] args) {
        Character[] team = { new Mage(), new Warrior() };
        for (Character hero : team) {
            System.out.println(hero.attack());
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "String attack()", label: "Wspólna metoda" },
        { kind: "contains", file: "Main.java", value: "return \"Czar\"", label: "Atak maga" },
        { kind: "contains", file: "Main.java", value: "return \"Miecz\"", label: "Atak wojownika" },
      ],
    }),
  ],
  "inheritance-12": [
    independentTask("inheritance-12", "independent-1", {
      title: "Bezpieczne parsowanie",
      prompt: "Przekonwertuj tekst na liczbę i obsłuż niepoprawny format przez try/catch.",
      steps: ["Użyj Integer.parseInt.", "Umieść konwersję w try.", "W catch NumberFormatException wypisz komunikat."],
      starter: `public class Main {
    public static void main(String[] args) {
        String text = "42";
        // TODO: try/catch dla parseInt
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        String text = "42";
        try {
            int points = Integer.parseInt(text);
            System.out.println(points);
        } catch (NumberFormatException error) {
            System.out.println("Niepoprawna liczba");
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "Integer.parseInt(text)", label: "Konwersja tekstu" },
        { kind: "contains", file: "Main.java", value: "catch (NumberFormatException", label: "Konkretny wyjątek" },
        { kind: "contains", file: "Main.java", value: "Niepoprawna liczba", label: "Komunikat błędu" },
      ],
    }),
    independentTask("inheritance-12", "independent-2", {
      title: "Wymagana nazwa",
      prompt: "Napisz metodę requireName, która odrzuca pustą nazwę przez IllegalArgumentException.",
      steps: ["Zdefiniuj metodę zwracającą String.", "Sprawdź null lub name.isBlank().", "Rzuć wyjątek i obsłuż go w main."],
      starter: `public class Main {
    static String requireName(String name) {
        // TODO: walidacja nazwy
        return name;
    }

    public static void main(String[] args) {
        // TODO: wywołaj metodę w try/catch
    }
}
`,
      solution: `public class Main {
    static String requireName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Nazwa jest wymagana");
        }
        return name;
    }

    public static void main(String[] args) {
        try {
            requireName("");
        } catch (IllegalArgumentException error) {
            System.out.println(error.getMessage());
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "name.isBlank()", label: "Sprawdzenie pustej nazwy" },
        { kind: "contains", file: "Main.java", value: "throw new IllegalArgumentException", label: "Rzucenie wyjątku" },
        { kind: "contains", file: "Main.java", value: "requireName(\"\")", label: "Test niepoprawnej nazwy" },
      ],
    }),
  ],
  "swing-13": [
    independentTask("swing-13", "independent-1", {
      title: "Ustawienia okna",
      prompt: "Utwórz okno ustawień i skonfiguruj jego rozmiar oraz bezpieczne zamykanie.",
      steps: ["Użyj SwingUtilities.invokeLater.", "Utwórz JFrame o tytule Ustawienia i rozmiarze 320×200.", "Dodaj setDefaultCloseOperation i setVisible."],
      runMode: "swing",
      starter: `import javax.swing.JFrame;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        // TODO: okno ustawień
    }
}
`,
      solution: `import javax.swing.JFrame;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Ustawienia");
            frame.setSize(320, 200);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new JFrame(\"Ustawienia\")", label: "Tytuł okna" },
        { kind: "contains", file: "Main.java", value: "frame.setSize(320, 200)", label: "Rozmiar okna" },
        { kind: "contains", file: "Main.java", value: "SwingUtilities.invokeLater", label: "Wątek interfejsu" },
      ],
    }),
    independentTask("swing-13", "independent-2", {
      title: "Okno z panelem",
      prompt: "Dodaj pusty JPanel do okna uruchamianego na EDT.",
      steps: ["Utwórz JFrame i JPanel.", "Ustaw panel przez frame.add(panel).", "Zamknij okno przez setDefaultCloseOperation."],
      runMode: "swing",
      starter: `import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        // TODO: JFrame i JPanel
    }
}
`,
      solution: `import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Panel");
            JPanel panel = new JPanel();
            frame.add(panel);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new JPanel()", label: "Panel" },
        { kind: "contains", file: "Main.java", value: "frame.add(panel)", label: "Dodanie panelu" },
        { kind: "contains", file: "Main.java", value: "frame.pack()", label: "Dopasowanie rozmiaru" },
      ],
    }),
  ],
  "swing-14": [
    independentTask("swing-14", "independent-1", {
      title: "Przycisk reset",
      prompt: "Dodaj etykietę i przycisk, który przywraca jej początkowy tekst.",
      steps: ["Utwórz JLabel i JButton.", "Dodaj listener do przycisku.", "W listenerze ustaw tekst etykiety przez setText."],
      runMode: "swing",
      starter: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: label i przycisk reset
    }
}
`,
      solution: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JLabel label = new JLabel("Zmieniono");
            JButton reset = new JButton("Reset");
            reset.addActionListener(event -> label.setText("Początek"));
            JPanel panel = new JPanel();
            panel.add(label);
            panel.add(reset);
            JFrame frame = new JFrame("Reset");
            frame.add(panel);
            frame.pack();
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new JLabel", label: "Etykieta" },
        { kind: "contains", file: "Main.java", value: "new JButton(\"Reset\")", label: "Przycisk reset" },
        { kind: "contains", file: "Main.java", value: "label.setText(\"Początek\")", label: "Zmiana tekstu" },
      ],
    }),
    independentTask("swing-14", "independent-2", {
      title: "Zapisz tekst",
      prompt: "Zbuduj panel z polem tekstowym, przyciskiem i etykietą statusu.",
      steps: ["Utwórz JTextField input.", "Dodaj JButton Zapisz i JLabel status.", "Po kliknięciu przepisz input.getText() do statusu."],
      runMode: "swing",
      starter: `import javax.swing.JFrame;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: formularz zapisu
    }
}
`,
      solution: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JTextField input = new JTextField(12);
            JButton save = new JButton("Zapisz");
            JLabel status = new JLabel("Brak danych");
            save.addActionListener(event -> status.setText(input.getText()));
            JPanel panel = new JPanel();
            panel.add(input);
            panel.add(save);
            panel.add(status);
            JFrame frame = new JFrame("Formularz");
            frame.add(panel);
            frame.pack();
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new JTextField", label: "Pole tekstowe" },
        { kind: "contains", file: "Main.java", value: "new JButton(\"Zapisz\")", label: "Przycisk zapisu" },
        { kind: "contains", file: "Main.java", value: "input.getText()", label: "Odczyt wpisanego tekstu" },
      ],
    }),
  ],
  "swing-15": [
    independentTask("swing-15", "independent-1", {
      title: "Licznik kliknięć",
      prompt: "Zwiększaj licznik za każdym kliknięciem przycisku.",
      steps: ["Utwórz tablicę clicks z jedną wartością 0.", "Dodaj listener do przycisku.", "Zwiększ clicks[0] i pokaż wynik w etykiecie."],
      runMode: "swing",
      starter: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: licznik kliknięć
    }
}
`,
      solution: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            int[] clicks = {0};
            JLabel label = new JLabel("Kliknięcia: 0");
            JButton button = new JButton("Kliknij");
            button.addActionListener(event -> {
                clicks[0]++;
                label.setText("Kliknięcia: " + clicks[0]);
            });
            JPanel panel = new JPanel();
            panel.add(label);
            panel.add(button);
            JFrame frame = new JFrame("Licznik");
            frame.add(panel);
            frame.pack();
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "int[] clicks = {0}", label: "Stan licznika" },
        { kind: "contains", file: "Main.java", value: "clicks[0]++", label: "Zwiększanie licznika" },
        { kind: "contains", file: "Main.java", value: "label.setText", label: "Odświeżenie etykiety" },
      ],
    }),
    independentTask("swing-15", "independent-2", {
      title: "Dwa stany przycisku",
      prompt: "Dodaj przycisk Start, który zmienia status na Uruchomiono!.",
      steps: ["Utwórz JLabel status.", "Dodaj JButton start.", "Podepnij addActionListener i zmień tekst statusu."],
      runMode: "swing",
      starter: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: status i przycisk Start
    }
}
`,
      solution: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JLabel status = new JLabel("Gotowy");
            JButton start = new JButton("Start");
            start.addActionListener(event -> status.setText("Uruchomiono!"));
            JPanel panel = new JPanel();
            panel.add(status);
            panel.add(start);
            JFrame frame = new JFrame("Start");
            frame.add(panel);
            frame.pack();
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new JButton(\"Start\")", label: "Przycisk start" },
        { kind: "contains", file: "Main.java", value: "addActionListener", label: "Reakcja na kliknięcie" },
        { kind: "contains", file: "Main.java", value: "Uruchomiono!", label: "Nowy status" },
      ],
    }),
  ],
  "swing-16": [
    independentTask("swing-16", "independent-1", {
      title: "Formularz gracza",
      prompt: "Zbuduj formularz z polem imienia i pokaż wpisaną nazwę po kliknięciu.",
      steps: ["Utwórz JTextField nameInput.", "Dodaj JButton Zapisz i JLabel status.", "W listenerze ustaw status na wpisaną nazwę."],
      runMode: "swing",
      starter: `import javax.swing.JFrame;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: formularz gracza
    }
}
`,
      solution: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JTextField nameInput = new JTextField(12);
            JButton save = new JButton("Zapisz");
            JLabel status = new JLabel("Wpisz imię");
            save.addActionListener(event -> status.setText("Gracz: " + nameInput.getText()));
            JPanel panel = new JPanel();
            panel.add(nameInput);
            panel.add(save);
            panel.add(status);
            JFrame frame = new JFrame("Gracz");
            frame.add(panel);
            frame.pack();
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new JTextField", label: "Pole imienia" },
        { kind: "contains", file: "Main.java", value: "nameInput.getText()", label: "Odczyt imienia" },
        { kind: "contains", file: "Main.java", value: "status.setText", label: "Status gracza" },
      ],
    }),
    independentTask("swing-16", "independent-2", {
      title: "Dziennik questów",
      prompt: "Dodaj pole tekstowe, które po kliknięciu dopisuje nazwę questa do dziennika.",
      steps: ["Utwórz JTextField questInput i JTextArea log.", "Dodaj JButton Dodaj quest.", "W listenerze użyj log.append z wartością questInput.getText()."],
      runMode: "swing",
      starter: `import javax.swing.JFrame;
import javax.swing.JPanel;

public class Main {
    public static void main(String[] args) {
        // TODO: dziennik questów
    }
}
`,
      solution: `import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Main {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JTextField questInput = new JTextField(12);
            JTextArea log = new JTextArea(5, 20);
            JButton add = new JButton("Dodaj quest");
            add.addActionListener(event -> log.append(questInput.getText() + "\\n"));
            JPanel panel = new JPanel();
            panel.add(questInput);
            panel.add(add);
            panel.add(log);
            JFrame frame = new JFrame("Dziennik");
            frame.add(panel);
            frame.pack();
            frame.setVisible(true);
        });
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new JTextArea", label: "Dziennik tekstowy" },
        { kind: "contains", file: "Main.java", value: "new JButton(\"Dodaj quest\")", label: "Przycisk dodawania" },
        { kind: "contains", file: "Main.java", value: "log.append", label: "Dopisanie questa" },
      ],
    }),
  ],
};

export function addIndependentTasks(lesson) {
  const [firstTask] = lesson.tasks;
  return {
    ...lesson,
    tasks: [
      { ...firstTask, mode: "guided" },
      ...(additionalTasks[lesson.id] || []),
    ],
  };
}
