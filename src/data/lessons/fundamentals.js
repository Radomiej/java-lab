export const fundamentalsLessons = [
  {
    id: "fundamentals-01",
    track: "fundamentals",
    order: 1,
    title: "Pierwszy program Javy",
    summary: "class, main i pierwszy komunikat",
    objective: "Zrozumiesz, gdzie Java zaczyna wykonywanie programu i jak wypisać informację w konsoli.",
    theory: [
      {
        title: "Klasa jest kontenerem programu",
        text: "Kod Javy umieszczamy w klasie. Nazwa pliku powinna pasować do nazwy publicznej klasy, dlatego plik nazywa się Main.java.",
        code: "public class Main {\n    // kod klasy\n}",
      },
      {
        title: "main to punkt startowy",
        text: "Metoda main ma stałą sygnaturę. To od niej środowisko uruchamia program konsolowy.",
        code: "public static void main(String[] args) {\n    System.out.println(\"Witaj, Java!\");\n}",
      },
    ],
    tips: ["Java rozróżnia wielkość liter.", "Każda instrukcja kończy się średnikiem."],
    tasks: [
      {
        id: "fundamentals-01-task",
        title: "Powitaj gracza",
        mode: "guided",
        prompt: "Uzupełnij metodę main tak, aby program wypisał dokładnie dwa komunikaty.",
        steps: [
          "Zostaw klasę o nazwie Main.",
          "Dodaj metodę public static void main(String[] args).",
          "Wypisz tekst Witaj, Java! oraz drugi tekst Zaczynamy quest.",
        ],
        hints: ["Użyj System.out.println(\"tekst\"); dla każdej linii."],
        starterFiles: {
          "Main.java": `public class Main {
    public static void main(String[] args) {
        // TODO: wypisz dwa komunikaty
    }
}
`,
        },
        solutionFiles: {
          "Main.java": `public class Main {
    public static void main(String[] args) {
        System.out.println("Witaj, Java!");
        System.out.println("Zaczynamy quest");
    }
}
`,
        },
        checks: [
          { kind: "contains", file: "Main.java", value: "public static void main", label: "Punkt startowy main" },
        ],
        outputChecks: [
          { kind: "outputLines", values: ["Witaj, Java!", "Zaczynamy quest"], label: "Wynik programu" },
        ],
        mainClass: "Main",
        runMode: "console",
      },
    ],
  },
  {
    id: "fundamentals-02",
    track: "fundamentals",
    order: 2,
    title: "Zmienne i typy danych",
    summary: "int, double, boolean i String",
    objective: "Nauczysz się przechowywać dane w zmiennych i dobierać typ do wartości.",
    theory: [
      {
        title: "Zmienna ma typ",
        text: "Typ mówi Javie, jakie wartości przechowujemy. int służy do liczb całkowitych, double do ułamków, boolean do prawdy/fałszu, a String do tekstu.",
        code: "int points = 10;\ndouble health = 7.5;\nboolean ready = true;\nString name = \"Ada\";",
      },
      {
        title: "Nazwa opisuje znaczenie",
        text: "Czytelna nazwa zmiennej jest częścią rozwiązania. Zamiast x wybierz points albo playerName.",
        code: "int rewardPoints = 25;\nSystem.out.println(rewardPoints);",
      },
    ],
    tips: ["String zaczyna się wielką literą, bo jest klasą.", "Nie mieszaj tekstu i liczby bez świadomego łączenia ich operatorem +."],
    tasks: [
      {
        id: "fundamentals-02-task",
        title: "Karta postaci",
        mode: "guided",
        prompt: "Zadeklaruj dane postaci i wypisz jej nazwę oraz liczbę punktów.",
        steps: [
          "Utwórz String playerName o wartości Ada.",
          "Utwórz int points o wartości 100.",
          "Wypisz obie zmienne za pomocą println.",
        ],
        hints: ["Deklaracja ma postać: typ nazwa = wartość;"],
        starterFiles: {
          "Main.java": `public class Main {
    public static void main(String[] args) {
        // TODO: utwórz playerName i points
    }
}
`,
        },
        solutionFiles: {
          "Main.java": `public class Main {
    public static void main(String[] args) {
        String playerName = "Ada";
        int points = 100;
        System.out.println(playerName);
        System.out.println(points);
    }
}
`,
        },
        checks: [
          { kind: "contains", file: "Main.java", value: "String playerName", label: "Tekstowa nazwa gracza" },
          { kind: "contains", file: "Main.java", value: "int points", label: "Liczba punktów" },
        ],
        outputChecks: [{ kind: "outputLines", values: ["Ada", "100"], label: "Karta postaci w konsoli" }],
        mainClass: "Main",
        runMode: "console",
      },
    ],
  },
  {
    id: "fundamentals-03",
    track: "fundamentals",
    order: 3,
    title: "Warunki i pętle",
    summary: "if, else oraz powtarzanie instrukcji",
    objective: "Połączysz decyzję if/else z pętlą for, aby opisać prostą regułę gry.",
    theory: [
      {
        title: "Warunek wybiera ścieżkę",
        text: "Wyrażenie w if musi dawać boolean. Gdy jest prawdziwe, Java wykonuje pierwszy blok, a w przeciwnym razie może wykonać else.",
        code: "if (points >= 100) {\n    System.out.println(\"Awans\");\n} else {\n    System.out.println(\"Graj dalej\");\n}",
      },
      {
        title: "Pętla for powtarza krok",
        text: "Pętla for ma inicjalizację, warunek i zmianę licznika. Trzymaj licznik czytelny, żeby łatwo przewidzieć liczbę powtórzeń.",
        code: "for (int round = 1; round <= 3; round++) {\n    System.out.println(round);\n}",
      },
    ],
    tips: ["Do porównania używaj ==, a do przypisania =.", "Sprawdź, czy warunek pętli kiedyś stanie się fałszywy."],
    tasks: [
      {
        id: "fundamentals-03-task",
        title: "Trzy rundy treningu",
        mode: "guided",
        prompt: "Wypisz numery rund 1, 2 i 3, każdy w osobnej linii. Po pętli sprawdź punkty i wypisz w czwartej linii Zaliczone, jeśli points >= 50, albo Ćwicz dalej w przeciwnym razie.",
        steps: [
          "Utwórz int points z wartością 75.",
          "Napisz pętlę for z licznikiem od 1 do 3. W jej środku wypisz licznik przez System.out.println(round).",
          "Po pętli dodaj if/else sprawdzający points >= 50. Wypisz Zaliczone lub Ćwicz dalej — nie oba komunikaty.",
        ],
        hints: ["Warunek może być zapisany jako points >= 50."],
        starterFiles: {
          "Main.java": `public class Main {
    public static void main(String[] args) {
        int points = 75;
        // TODO: pętla i warunek
    }
}
`,
        },
        solutionFiles: {
          "Main.java": `public class Main {
    public static void main(String[] args) {
        int points = 75;
        for (int round = 1; round <= 3; round++) {
            System.out.println(round);
        }
        if (points >= 50) {
            System.out.println("Zaliczone");
        } else {
            System.out.println("Ćwicz dalej");
        }
    }
}
`,
        },
        checks: [
          { kind: "contains", file: "Main.java", value: "for (", label: "Pętla for" },
          { kind: "contains", file: "Main.java", value: "round <= 3", label: "Trzy rundy" },
          { kind: "contains", file: "Main.java", value: "if (", label: "Instrukcja if" },
          { kind: "contains", file: "Main.java", value: "points >= 50", label: "Reguła punktów" },
        ],
        outputChecks: [{ kind: "outputLines", values: ["1", "2", "3", "Zaliczone"], label: "Trzy rundy i decyzja" }],
        mainClass: "Main",
        runMode: "console",
      },
    ],
  },
  {
    id: "fundamentals-04",
    track: "fundamentals",
    order: 4,
    title: "Metody i odpowiedzialność",
    summary: "parametry, return i dzielenie problemu",
    objective: "Napiszesz własną metodę, która przyjmuje dane i zwraca wynik.",
    theory: [
      {
        title: "Metoda ma kontrakt",
        text: "Sygnatura mówi, jak używać metody: typ zwracany, nazwa i parametry. Metoda int calculateReward(int base) musi zwrócić int.",
        code: "static int calculateReward(int base) {\n    return base * 2;\n}",
      },
      {
        title: "static: pytasz klasę, nie konkretny obiekt",
        text: "Metoda static należy do klasy. Pomyśl o niej jak o kalkulatorze: podajesz liczbę i dostajesz wynik, bez wybierania konkretnego gracza. calculateReward potrzebuje tylko argumentu base, dlatego nie tworzymy obiektu Main przez new. Wywołanie Main.calculateReward(15) oznacza: poproś klasę Main o obliczenie nagrody. W tej samej klasie można skrócić je do calculateReward(15).",
        code: "// Wywołanie metody klasy — bez new Main()\nint reward = Main.calculateReward(15);\nSystem.out.println(reward); // 30",
      },
      {
        title: "Zwykła metoda: pytasz konkretny obiekt",
        text: "Metoda bez static jest metodą obiektu (instancji). Wyobraź sobie dwóch graczy: Ada ma 10 punktów, a Borin 40. Wywołanie ada.addPoints(5) zmienia punkty Ady, nie Borina. Obiekt wskazujesz przed kropką. To zapowiedź następnego kursu o obiektach — tutaj korzystamy z metod static, bo obliczamy wynik z argumentów, bez danych konkretnego gracza.",
        code: "// Fragment klasy Player — metoda bez static\nint points;\n\nvoid addPoints(int amount) {\n    points += amount; // punkty tego gracza\n}\n\n// Przykładowe wywołania w main:\n// Player ada = new Player();\n// Player borin = new Player();\n// ada.addPoints(5); // Borin pozostaje bez zmian",
      },
      {
        title: "static nie oznacza public",
        text: "static odpowiada na pytanie: czy potrzebuję obiektu? public i private odpowiadają: kto może wywołać metodę? Metoda static nie jest automatycznie dostępna dla wszystkich. private static można wywołać tylko wewnątrz jej klasy. public static można wywołać z innej klasy, jeśli sama klasa też jest dostępna. Bez public/private metoda jest dostępna w tym samym pakiecie — do pakietów wrócimy później.",
        code: "// Te deklaracje umieszczamy wewnątrz klasy Main:\npublic static int calculateReward(int base) {\n    return base * 2;\n}\n\nprivate static int doublePoints(int points) {\n    return points * 2;\n}",
      },
      {
        title: "Wywołaj metodę w main",
        text: "Metoda nie wykona się sama. Wywołujemy ją z nazwą i argumentem, a wynik możemy przypisać do zmiennej albo wypisać. main też jest static: środowisko uruchamia ją bez tworzenia obiektu Main. Dlatego możemy w niej bezpośrednio wywołać naszą calculateReward, która również jest static. Zwykłą metodę wywołalibyśmy na wskazanym obiekcie. Metoda static nie ma własnego this i nie odczytuje bezpośrednio pól konkretnego obiektu.",
        code: "int reward = calculateReward(10);\nSystem.out.println(reward);",
      },
    ],
    tips: ["return kończy wykonanie metody i oddaje wartość.", "Nazwij metodę czasownikiem lub krótką czynnością."],
    tasks: [
      {
        id: "fundamentals-04-task",
        title: "Policz nagrodę",
        mode: "guided",
        prompt: "Utwórz metodę calculateReward, która podwaja bazową liczbę punktów, i użyj jej w main.",
        steps: [
          "Zdefiniuj static int calculateReward(int base).",
          "Zwróć base * 2.",
          "Wywołaj metodę dla wartości 15 i wypisz wynik.",
        ],
        hints: ["Metoda może znajdować się nad albo pod main — ważniejsza jest poprawna sygnatura."],
        starterFiles: {
          "Main.java": `public class Main {
    // TODO: dodaj metodę calculateReward

    public static void main(String[] args) {
        // TODO: wywołaj metodę dla 15
    }
}
`,
        },
        solutionFiles: {
          "Main.java": `public class Main {
    static int calculateReward(int base) {
        return base * 2;
    }

    public static void main(String[] args) {
        System.out.println(calculateReward(15));
    }
}
`,
        },
        checks: [
          { kind: "contains", file: "Main.java", value: "static int calculateReward(int base)", label: "Metoda z parametrem" },
          { kind: "contains", file: "Main.java", value: "calculateReward(15)", label: "Wywołanie metody" },
        ],
        outputChecks: [{ kind: "outputLines", values: ["30"], label: "Obliczona nagroda" }],
        mainClass: "Main",
        runMode: "console",
      },
    ],
  },
];
