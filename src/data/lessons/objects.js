export const objectLessons = [
  {
    id: "objects-05",
    track: "objects",
    order: 5,
    title: "Klasa i obiekt",
    summary: "własny typ danych i new",
    objective: "Zobaczysz, jak klasa opisuje dane, a obiekt przechowuje konkretny stan.",
    theory: [
      { title: "Klasa opisuje rzecz", text: "Klasa łączy dane i zachowania. Pole opisuje stan obiektu, a metoda opisuje czynność.", code: "class Quest {\n    String title;\n    int points;\n}" },
      { title: "new tworzy obiekt", text: "Samo napisanie klasy nie tworzy jeszcze questa. Operator new tworzy egzemplarz, którego pola możesz ustawić.", code: "Quest quest = new Quest();\nquest.title = \"Smok\";" },
    ],
    tips: ["Klasa zwykle ma nazwę w liczbie pojedynczej.", "Obiekt to konkretny egzemplarz klasy."],
    tasks: [{
      id: "objects-05-task", title: "Pierwszy quest", mode: "guided",
      prompt: "Zdefiniuj klasę Quest z polem title i utwórz jej obiekt w main.",
      steps: ["Dodaj klasę Quest.", "Dodaj pole String title.", "Utwórz obiekt przez new Quest() i ustaw tytuł."],
      hints: ["Dwie klasy mogą znajdować się w jednym pliku, jeśli tylko Main jest publiczna."],
      starterFiles: { "Main.java": `class Quest {
    // TODO: dodaj pole title
}

public class Main {
    public static void main(String[] args) {
        // TODO: utwórz quest
    }
}
` },
      solutionFiles: { "Main.java": `class Quest {
    String title;
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest();
        quest.title = "Smok";
        System.out.println(quest.title);
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "class Quest", label: "Klasa Quest" },
        { kind: "contains", file: "Main.java", value: "String title", label: "Stan obiektu" },
        { kind: "contains", file: "Main.java", value: "new Quest()", label: "Utworzenie obiektu" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
  {
    id: "objects-06", track: "objects", order: 6, title: "Konstruktor i enkapsulacja", summary: "bezpieczne tworzenie obiektu",
    objective: "Nauczysz się wymagać poprawnych danych już podczas tworzenia obiektu.",
    theory: [
      { title: "Konstruktor ustawia start", text: "Konstruktor ma nazwę klasy i nie ma typu zwracanego. Dzięki niemu obiekt od początku może być gotowy do użycia.", code: "Quest(String title) {\n    this.title = title;\n}" },
      { title: "private chroni pole", text: "Pole private nie jest zmieniane bezpośrednio z zewnątrz. Udostępniamy kontrolowane metody, np. getTitle().", code: "private String title;\nString getTitle() { return title; }" },
    ],
    tips: ["this.title oznacza pole bieżącego obiektu.", "Getter odczytuje, setter zmienia — jeśli zmiana jest potrzebna."],
    tasks: [{
      id: "objects-06-task", title: "Quest z konstruktorem", mode: "guided",
      prompt: "Zabezpiecz pole title i dodaj konstruktor oraz getter.",
      steps: ["Zmień title na private.", "Dodaj konstruktor Quest(String title).", "Dodaj String getTitle() i użyj go w main."],
      hints: ["Konstruktor nie ma słowa void."],
      starterFiles: { "Main.java": `class Quest {
    String title;

    // TODO: konstruktor i getter
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Zaginiony klucz");
        // TODO: wypisz tytuł przez getter
    }
}
` },
      solutionFiles: { "Main.java": `class Quest {
    private String title;

    Quest(String title) {
        this.title = title;
    }

    String getTitle() {
        return title;
    }
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Zaginiony klucz");
        System.out.println(quest.getTitle());
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "private String title", label: "Enkapsulowane pole" },
        { kind: "contains", file: "Main.java", value: "Quest(String title)", label: "Konstruktor" },
        { kind: "contains", file: "Main.java", value: "String getTitle()", label: "Getter" },
        { kind: "contains", file: "Main.java", value: "quest.getTitle()", label: "Kontrolowany odczyt" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
  {
    id: "objects-07", track: "objects", order: 7, title: "Kompozycja", summary: "obiekt zbudowany z innych obiektów",
    objective: "Zrozumiesz relację has-a i zbudujesz planer złożony z mniejszych klas.",
    theory: [
      { title: "Kompozycja to has-a", text: "Jeśli Planner ma listę zadań, to nie dziedziczy po zadaniu. Planner posiada obiekt Task — to kompozycja.", code: "class Planner {\n    private Task task;\n\n    Planner(Task task) {\n        this.task = task;\n    }\n}" },
      { title: "Każda klasa ma jedną rolę", text: "Task opisuje zadanie, a Planner zarządza planem. Takie rozdzielenie ułatwia testowanie i zmianę kodu.", code: "Task task = new Task(\"Mapa\");\nPlanner planner = new Planner(task);" },
    ],
    tips: ["Kompozycję rozpoznasz po polu typu innej klasy.", "Nie upychaj całego programu w jednej klasie."],
    tasks: [{
      id: "objects-07-task", title: "Planner posiada task", mode: "guided",
      prompt: "Zbuduj Planner, który przechowuje obiekt Task.",
      steps: ["Dodaj klasę Task z polem name i konstruktorem.", "Dodaj prywatne pole Task task w Planner.", "Przekaż Task do konstruktora Plannera."],
      hints: ["Typ pola to Task, a wartość powstaje przez new Task(...)."],
      starterFiles: { "Main.java": `class Task {
    private String name;

    Task(String name) {
        this.name = name;
    }
}

class Planner {
    // TODO: Planner ma posiadać Task
}

public class Main {
    public static void main(String[] args) {
        Task task = new Task("Mapa");
        // TODO: utwórz Planner
    }
}
` },
      solutionFiles: { "Main.java": `class Task {
    private String name;

    Task(String name) {
        this.name = name;
    }
}

class Planner {
    private Task task;

    Planner(Task task) {
        this.task = task;
    }
}

public class Main {
    public static void main(String[] args) {
        Task task = new Task("Mapa");
        Planner planner = new Planner(task);
        System.out.println("Planner gotowy");
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "private Task task", label: "Pole złożonego obiektu" },
        { kind: "contains", file: "Main.java", value: "Planner(Task task)", label: "Wstrzyknięcie zależności" },
        { kind: "contains", file: "Main.java", value: "new Planner(task)", label: "Użycie kompozycji" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
  {
    id: "objects-08", track: "objects", order: 8, title: "Obiekt gotowy do testowania", summary: "czytelna współpraca klas",
    objective: "Połączysz konstruktor, enkapsulację i kompozycję w małym modelu domenowym.",
    theory: [
      { title: "Modeluj dane, nie przypadkowe zmienne", text: "Dobra klasa ukrywa szczegóły i udostępnia krótkie metody opisujące zachowanie.", code: "quest.complete();\nSystem.out.println(quest.isCompleted());" },
      { title: "Małe kroki ułatwiają testy", text: "Jeśli metoda robi jedną rzecz, łatwo ją sprawdzić osobno. To przygotowanie do testów jednostkowych.", code: "boolean isCompleted() {\n    return completed;\n}" },
    ],
    tips: ["Nazwa metody powinna odpowiadać temu, co robi.", "Stan prywatny zmieniaj przez metody, nie przez publiczne pola."],
    tasks: [{
      id: "objects-08-task", title: "Ukończ quest", mode: "practice",
      prompt: "Dodaj prywatny stan completed, metodę complete() oraz isCompleted().",
      steps: ["Dodaj private boolean completed = false.", "W complete() ustaw completed na true.", "W main wywołaj complete() i sprawdź stan."],
      hints: ["To ćwiczenie łączy wcześniejsze elementy — wróć do przykładów konstruktorów i getterów."],
      starterFiles: { "Main.java": `class Quest {
    private String title;
    // TODO: completed, complete() i isCompleted()

    Quest(String title) {
        this.title = title;
    }
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Most");
        // TODO: ukończ quest i wypisz stan
    }
}
` },
      solutionFiles: { "Main.java": `class Quest {
    private String title;
    private boolean completed = false;

    Quest(String title) {
        this.title = title;
    }

    void complete() {
        completed = true;
    }

    boolean isCompleted() {
        return completed;
    }
}

public class Main {
    public static void main(String[] args) {
        Quest quest = new Quest("Most");
        quest.complete();
        System.out.println(quest.isCompleted());
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "private boolean completed", label: "Prywatny stan" },
        { kind: "contains", file: "Main.java", value: "void complete()", label: "Metoda zmiany stanu" },
        { kind: "contains", file: "Main.java", value: "boolean isCompleted()", label: "Metoda odczytu stanu" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
];
