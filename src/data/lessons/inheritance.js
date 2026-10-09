export const inheritanceLessons = [
  {
    id: "inheritance-09", track: "inheritance", order: 9, title: "Dziedziczenie przez extends", summary: "wspólna baza dla typów",
    objective: "Zobaczysz, jak klasa potomna przejmuje wspólny kod klasy bazowej.",
    theory: [
      { title: "Relacja is-a", text: "Jeśli Mage jest Character, można zapisać class Mage extends Character. Dziedziczenie opisuje wspólną kategorię.", code: "class Character {\n    String name;\n}\n\nclass Mage extends Character {\n    int mana;\n}" },
      { title: "super wywołuje konstruktor rodzica", text: "Jeśli Character ma konstruktor Character(String name), Mage musi przekazać mu nazwę przez super(name). W przykładzie tego kursu zapisujemy to jako pierwszą instrukcję konstruktora. Następnie inicjalizujemy własne pola Maga. To nadal jeden obiekt Mage, nie osobny obiekt rodzica.", code: "Mage(String name, int mana) {\n    super(name);\n    this.mana = mana;\n}" },
    ],
    tips: ["Nie używaj dziedziczenia tylko po to, aby skrócić kod.", "Wspólne cechy powinny naprawdę należeć do klasy bazowej."],
    tasks: [{
      id: "inheritance-09-task", title: "Bohater i mag", mode: "guided",
      prompt: "Utwórz konstruktor Mage(String name), który przekazuje nazwę do Character przez super(name). W main utwórz Maga o nazwie Luna i wypisz odziedziczone pole name.",
      steps: ["Dodaj Character z konstruktorem name.", "Dodaj Mage extends Character.", "W konstruktorze Mage użyj super(name)."],
      hints: ["Słowo extends pojawia się w deklaracji klasy, nie w konstruktorze."],
      starterFiles: { "Main.java": `class Character {
    protected String name;

    Character(String name) {
        this.name = name;
    }
}

class Mage extends Character {
    // TODO: konstruktor Maga
}

public class Main {
    public static void main(String[] args) {
        // TODO: utwórz maga
    }
}
` },
      solutionFiles: { "Main.java": `class Character {
    protected String name;

    Character(String name) {
        this.name = name;
    }
}

class Mage extends Character {
    Mage(String name) {
        super(name);
    }
}

public class Main {
    public static void main(String[] args) {
        Mage mage = new Mage("Luna");
        System.out.println(mage.name);
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "class Mage extends Character", label: "Dziedziczenie" },
        { kind: "contains", file: "Main.java", value: "super(name)", label: "Konstruktor klasy bazowej" },
        { kind: "contains", file: "Main.java", value: "new Mage", label: "Obiekt klasy potomnej" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
  {
    id: "inheritance-10", track: "inheritance", order: 10, title: "Overriding", summary: "własna wersja metody rodzica",
    objective: "Przesłonisz metodę klasy bazowej i zobaczysz, że typ potomny może zachować się inaczej.",
    theory: [
      { title: "Ta sama metoda, inne zachowanie", text: "Overriding polega na zdefiniowaniu w klasie potomnej metody o tej samej sygnaturze. Adnotacja @Override pomaga znaleźć literówki.", code: "@Override\nString describe() {\n    return \"Mag\";\n}" },
      { title: "Nie kopiuj bez powodu", text: "Metoda potomna może użyć super.describe(), jeśli chce zachować część zachowania rodzica i dodać coś od siebie.", code: "return super.describe() + \" z maną\";" },
    ],
    tips: ["Sygnatura musi pasować: nazwa, parametry i typ zwracany.", "@Override zapisuj nad przesłanianą metodą."],
    tasks: [{
      id: "inheritance-10-task", title: "Opis postaci", mode: "guided",
      prompt: "Character.describe() zwraca tekst Character. Przesłoń tę metodę w Mage, aby zwracała dokładnie Mage. Wywołanie new Mage().describe() w main ma wypisać Mage.",
      steps: ["Dodaj describe() zwracające Character.", "W Mage dodaj @Override.", "Zwróć opis Maga z własnej metody."],
      hints: ["Adnotacja zaczyna się od znaku @ i stoi bezpośrednio przed metodą."],
      starterFiles: { "Main.java": `class Character {
    String describe() {
        return "Character";
    }
}

class Mage extends Character {
    // TODO: przesłoń describe()
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Mage().describe());
    }
}
` },
      solutionFiles: { "Main.java": `class Character {
    String describe() {
        return "Character";
    }
}

class Mage extends Character {
    @Override
    String describe() {
        return "Mage";
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(new Mage().describe());
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "@Override", label: "Jawne przesłanianie" },
        { kind: "contains", file: "Main.java", value: "String describe()", label: "Ta sama sygnatura" },
        { kind: "contains", file: "Main.java", value: "return \"Mage\"", label: "Nowe zachowanie" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
  {
    id: "inheritance-11", track: "inheritance", order: 11, title: "Polimorfizm", summary: "typ bazowy, różne obiekty",
    objective: "Użyjesz referencji klasy bazowej do przechowywania różnych klas potomnych.",
    theory: [
      { title: "Wspólny kontrakt", text: "Referencja Character może wskazywać na Mage albo Warrior. Przy wywołaniu przesłoniętej metody Java wybierze zachowanie prawdziwego obiektu.", code: "Character hero = new Mage();\nSystem.out.println(hero.describe());" },
      { title: "Jedna tablica, różne zachowania", text: "Character[] to tablica referencji do postaci. Może przechowywać Mage i Warrior, ponieważ oba typy dziedziczą po Character. W pętli for (Character hero : team) zmienna hero wskazuje kolejno każdy obiekt. hero.describe() wybiera przesłoniętą metodę tego obiektu, bez if sprawdzającego jego typ.", code: "Character[] team = { new Mage(), new Warrior() };\nfor (Character hero : team) {\n    System.out.println(hero.describe());\n}" },
    ],
    tips: ["Typ po lewej opisuje możliwości referencji, a new po prawej konkretny obiekt.", "Wspólny kontrakt powinien być mały i czytelny."],
    tasks: [{
      id: "inheritance-11-task", title: "Drużyna bohaterów", mode: "practice",
      prompt: "Mage.describe() ma zwracać Mage, a Warrior.describe() — Warrior. Utwórz tablicę Character z Magiem i Wojownikiem w tej kolejności. Pętla ma wypisać Mage i Warrior, każdy w osobnej linii.",
      steps: ["Utwórz Character z describe().", "Dodaj Mage i Warrior z @Override.", "Utwórz Character[] team i przejdź po nim pętlą."],
      hints: ["Pętla może mieć typ Character, nawet gdy tablica zawiera potomków."],
      starterFiles: { "Main.java": `class Character {
    String describe() { return "Character"; }
}

class Mage extends Character {
    // TODO
}

class Warrior extends Character {
    // TODO
}

public class Main {
    public static void main(String[] args) {
        // TODO: tablica Character i pętla
    }
}
` },
      solutionFiles: { "Main.java": `class Character {
    String describe() { return "Character"; }
}

class Mage extends Character {
    @Override String describe() { return "Mage"; }
}

class Warrior extends Character {
    @Override String describe() { return "Warrior"; }
}

public class Main {
    public static void main(String[] args) {
        Character[] team = { new Mage(), new Warrior() };
        for (Character hero : team) {
            System.out.println(hero.describe());
        }
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "Character[] team", label: "Tablica typu bazowego" },
        { kind: "contains", file: "Main.java", value: "new Mage()", label: "Pierwszy typ potomny" },
        { kind: "contains", file: "Main.java", value: "new Warrior()", label: "Drugi typ potomny" },
        { kind: "contains", file: "Main.java", value: "hero.describe()", label: "Polimorficzne wywołanie" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
  {
    id: "inheritance-12", track: "inheritance", order: 12, title: "Wyjątki i bezpieczny program", summary: "try, catch i własny komunikat",
    objective: "Nauczysz się obsługiwać sytuację, w której dane nie spełniają reguł programu.",
    theory: [
      { title: "try/catch przejmuje błąd", text: "Kod ryzykowny umieszczamy w try, a reakcję na konkretny wyjątek opisujemy w catch.", code: "try {\n    int value = Integer.parseInt(text);\n} catch (NumberFormatException error) {\n    System.out.println(\"Niepoprawna liczba\");\n}" },
      { title: "Komunikat pomaga użytkownikowi", text: "Nie wystarczy ukryć wyjątku. Napisz, co użytkownik może poprawić.", code: "throw new IllegalArgumentException(\"Punkty nie mogą być ujemne\");" },
    ],
    tips: ["Łap konkretny typ wyjątku zamiast samego Exception, gdy to możliwe.", "Nie używaj wyjątków jako zwykłego if-a."],
    tasks: [{
      id: "inheritance-12-task", title: "Bezpieczne punkty", mode: "guided",
      prompt: "addPoints zwraca przekazaną liczbę, jeśli jest nieujemna. Dla wartości ujemnej rzuca IllegalArgumentException z komunikatem Punkty nie mogą być ujemne. W main wywołaj addPoints(-5) w try/catch i wypisz ten komunikat, bez nieobsłużonego wyjątku.",
      steps: ["Dodaj static int addPoints(int points).", "Jeśli points < 0, rzuć IllegalArgumentException.", "W main użyj try/catch i wypisz komunikat."],
      hints: ["Rzucenie wyjątku zapiszesz jako throw new IllegalArgumentException(\"...\")."],
      starterFiles: { "Main.java": `public class Main {
    static int addPoints(int points) {
        // TODO: odrzuć ujemną wartość
        return points;
    }

    public static void main(String[] args) {
        // TODO: try/catch
    }
}
` },
      solutionFiles: { "Main.java": `public class Main {
    static int addPoints(int points) {
        if (points < 0) {
            throw new IllegalArgumentException("Punkty nie mogą być ujemne");
        }
        return points;
    }

    public static void main(String[] args) {
        try {
            addPoints(-5);
        } catch (IllegalArgumentException error) {
            System.out.println("Punkty nie mogą być ujemne");
        }
    }
}
` },
      checks: [
        { kind: "contains", file: "Main.java", value: "throw new IllegalArgumentException", label: "Rzucenie wyjątku" },
        { kind: "contains", file: "Main.java", value: "try {", label: "Blok try" },
        { kind: "contains", file: "Main.java", value: "catch (IllegalArgumentException", label: "Obsługa błędu" },
      ], mainClass: "Main", runMode: "console",
    }],
  },
];
