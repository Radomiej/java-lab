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
  "algorithms-01": [
    independentTask("algorithms-01", "independent-1", {
      title: "Suma elementów",
      prompt: "Uzupełnij metodę sum tak, aby zwracała sumę wszystkich elementów tablicy.",
      steps: ["Zmienna sum zaczyna się od 0.", "W pętli dodawaj values[i] do sum.", "Zwróć sum za pętlą."],
      starter: `public class Main {
    static int sum(int[] values) {
        // TODO: zsumuj elementy
        return 0;
    }

    public static void main(String[] args) {
        int[] scores = {4, 5, 6};
        System.out.println(sum(scores));
    }
}
`,
      solution: `public class Main {
    static int sum(int[] values) {
        int sum = 0;
        for (int i = 0; i < values.length; i++) {
            sum += values[i];
        }
        return sum;
    }

    public static void main(String[] args) {
        int[] scores = {4, 5, 6};
        System.out.println(sum(scores));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "sum +=", label: "Akumulator sumy" },
        { kind: "contains", file: "Main.java", value: "values[i]", label: "Odczyt elementu" },
      ],
    }),
    independentTask("algorithms-01", "independent-2", {
      title: "Zlicz większe od progu",
      prompt: "Uzupełnij metodę countAbove tak, aby zwracała liczbę elementów większych od limit.",
      steps: ["Licznik bigger zaczyna się od 0.", "W pętli sprawdzaj if (values[i] > limit) i zwiększaj licznik.", "Zwróć licznik."],
      starter: `public class Main {
    static int countAbove(int[] values, int limit) {
        // TODO: zlicz elementy powyżej limit
        return 0;
    }

    public static void main(String[] args) {
        int[] scores = {3, 8, 2, 9};
        System.out.println(countAbove(scores, 5));
    }
}
`,
      solution: `public class Main {
    static int countAbove(int[] values, int limit) {
        int bigger = 0;
        for (int i = 0; i < values.length; i++) {
            if (values[i] > limit) {
                bigger++;
            }
        }
        return bigger;
    }

    public static void main(String[] args) {
        int[] scores = {3, 8, 2, 9};
        System.out.println(countAbove(scores, 5));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "values[i] > limit", label: "Warunek progu" },
        { kind: "contains", file: "Main.java", value: "bigger++", label: "Licznik trafień" },
      ],
    }),
  ],
  "algorithms-02": [
    independentTask("algorithms-02", "independent-1", {
      title: "Bąbelkowe z wczesnym wyjściem",
      prompt: "Uzupełnij metodę bubbleSortEarly tak, aby kończyła przejścia, gdy w jednym z nich nie było żadnej zamiany.",
      steps: ["Zewnętrzna pętla powtarza przejścia; flaga swapped startuje false.", "Wewnętrzna zamiana ustawia swapped na true.", "Gdy po przejściu swapped jest false — przerwij pętlę break."],
      starter: `public class Main {
    static void bubbleSortEarly(int[] values) {
        // TODO: przejścia bąbelkowe z flagą swapped
    }

    public static void main(String[] args) {
        int[] scores = {2, 4, 1, 3};
        bubbleSortEarly(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      solution: `public class Main {
    static void bubbleSortEarly(int[] values) {
        for (int pass = 0; pass < values.length - 1; pass++) {
            boolean swapped = false;
            for (int i = 0; i < values.length - 1 - pass; i++) {
                if (values[i] > values[i + 1]) {
                    int temp = values[i];
                    values[i] = values[i + 1];
                    values[i + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) {
                break;
            }
        }
    }

    public static void main(String[] args) {
        int[] scores = {2, 4, 1, 3};
        bubbleSortEarly(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "swapped = true", label: "Flaga zamiany" },
        { kind: "contains", file: "Main.java", value: "if (!swapped)", label: "Wczesne wyjście" },
      ],
    }),
    independentTask("algorithms-02", "independent-2", {
      title: "Sortuj malejąco",
      prompt: "Uzupełnij metodę sortDescending tak, aby sortowała tablicę malejąco bąbelkowym porównywaniem sąsiadów.",
      steps: ["Te same dwie pętle co w sortowaniu rosnącym.", "Zamieniaj parę tylko gdy values[i] < values[i + 1].", "Uruchom — program wypisuje wyniki od największego."],
      starter: `public class Main {
    static void sortDescending(int[] values) {
        // TODO: bąbelkowe malejąco
    }

    public static void main(String[] args) {
        int[] scores = {9, 1, 5, 2};
        sortDescending(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      solution: `public class Main {
    static void sortDescending(int[] values) {
        for (int pass = 0; pass < values.length - 1; pass++) {
            for (int i = 0; i < values.length - 1 - pass; i++) {
                if (values[i] < values[i + 1]) {
                    int temp = values[i];
                    values[i] = values[i + 1];
                    values[i + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] scores = {9, 1, 5, 2};
        sortDescending(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "values[i] < values[i + 1]", label: "Porównanie malejące" },
        { kind: "contains", file: "Main.java", value: "int temp", label: "Zamiana przez temp" },
      ],
    }),
  ],
  "algorithms-03": [
    independentTask("algorithms-03", "independent-1", {
      title: "Indeks minimum",
      prompt: "Uzupełnij metodę minIndex tak, aby zwracała indeks najmniejszego elementu w zakresie od indeksu from.",
      steps: ["minIndex zaczyna się jako from.", "Pętla od from + 1 porównuje values[i] z values[minIndex].", "Zwróć minIndex."],
      starter: `public class Main {
    static int minIndex(int[] values, int from) {
        // TODO: indeks minimum od from
        return -1;
    }

    public static void main(String[] args) {
        int[] scores = {4, 2, 7, 3};
        System.out.println(minIndex(scores, 2));
    }
}
`,
      solution: `public class Main {
    static int minIndex(int[] values, int from) {
        int minIndex = from;
        for (int i = from + 1; i < values.length; i++) {
            if (values[i] < values[minIndex]) {
                minIndex = i;
            }
        }
        return minIndex;
    }

    public static void main(String[] args) {
        int[] scores = {4, 2, 7, 3};
        System.out.println(minIndex(scores, 2));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "int minIndex = from", label: "Start od granicy" },
        { kind: "contains", file: "Main.java", value: "values[i] < values[minIndex]", label: "Nowe minimum" },
      ],
    }),
    independentTask("algorithms-03", "independent-2", {
      title: "Wybór w stronę malejącą",
      prompt: "Uzupełnij metodę selectionDescending tak, aby sortowała tablicę malejąco wybierając maksima.",
      steps: ["Te same dwie pętle co w wersji rosnącej.", "maxIndex zapamiętuje pozycję największej wartości.", "Zamień values[start] z values[maxIndex]."],
      starter: `public class Main {
    static void selectionDescending(int[] values) {
        // TODO: wybieraj maksimum na start
    }

    public static void main(String[] args) {
        int[] scores = {4, 2, 7, 3};
        selectionDescending(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      solution: `public class Main {
    static void selectionDescending(int[] values) {
        for (int start = 0; start < values.length - 1; start++) {
            int maxIndex = start;
            for (int i = start + 1; i < values.length; i++) {
                if (values[i] > values[maxIndex]) {
                    maxIndex = i;
                }
            }
            int temp = values[start];
            values[start] = values[maxIndex];
            values[maxIndex] = temp;
        }
    }

    public static void main(String[] args) {
        int[] scores = {4, 2, 7, 3};
        selectionDescending(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "int maxIndex = start", label: "Kandydat na maksimum" },
        { kind: "contains", file: "Main.java", value: "values[i] > values[maxIndex]", label: "Szukanie maksimum" },
      ],
    }),
  ],
  "algorithms-04": [
    independentTask("algorithms-04", "independent-1", {
      title: "Wstawianie na innej tablicy",
      prompt: "Uzupełnij metodę insertionSort tak, aby posortowała nową tablicę {7, 3, 9, 1} wstawianiem.",
      steps: ["Pętla od i = 1 pobiera key = values[i].", "while przesuwa w prawo elementy większe od key.", "Wstaw key do values[j + 1]."],
      starter: `public class Main {
    static void insertionSort(int[] values) {
        // TODO: wstawianie klucza
    }

    public static void main(String[] args) {
        int[] scores = {7, 3, 9, 1};
        insertionSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      solution: `public class Main {
    static void insertionSort(int[] values) {
        for (int i = 1; i < values.length; i++) {
            int key = values[i];
            int j = i - 1;
            while (j >= 0 && values[j] > key) {
                values[j + 1] = values[j];
                j--;
            }
            values[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] scores = {7, 3, 9, 1};
        insertionSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "int key = values[i]", label: "Klucz" },
        { kind: "contains", file: "Main.java", value: "values[j + 1] = key", label: "Wstawienie" },
      ],
    }),
    independentTask("algorithms-04", "independent-2", {
      title: "Wstawianie malejąco",
      prompt: "Uzupełnij metodę insertionDescending tak, aby sortowała tablicę malejąco wstawianiem.",
      steps: ["Klucz key = values[i] i wskaźnik j = i - 1.", "Przesuwaj w prawo elementy mniejsze od key (values[j] < key).", "Wstaw key do values[j + 1]."],
      starter: `public class Main {
    static void insertionDescending(int[] values) {
        // TODO: wstawianie malejąco
    }

    public static void main(String[] args) {
        int[] scores = {5, 1, 8, 2};
        insertionDescending(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      solution: `public class Main {
    static void insertionDescending(int[] values) {
        for (int i = 1; i < values.length; i++) {
            int key = values[i];
            int j = i - 1;
            while (j >= 0 && values[j] < key) {
                values[j + 1] = values[j];
                j--;
            }
            values[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] scores = {5, 1, 8, 2};
        insertionDescending(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "values[j] < key", label: "Przesuwanie mniejszych" },
        { kind: "contains", file: "Main.java", value: "values[j + 1] = key", label: "Wstawienie klucza" },
      ],
    }),
  ],
  "algorithms-05": [
    independentTask("algorithms-05", "independent-1", {
      title: "Merge sort całej tablicy",
      prompt: "Uzupełnij metodę mergeSort tak, aby sortowała tablicę rekurencyjnie przez dzielenie na połowy i scalanie.",
      steps: ["Warunek stopu: v.length < 2 kończy wywołanie.", "Podziel v na left i right przez Arrays.copyOfRange i posortuj rekurencyjnie.", "Scal wyniki metodą merge i przepisz do v."],
      starter: `import java.util.Arrays;

public class Main {
    static int[] merge(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) { result[k++] = a[i++]; }
            else { result[k++] = b[j++]; }
        }
        while (i < a.length) { result[k++] = a[i++]; }
        while (j < b.length) { result[k++] = b[j++]; }
        return result;
    }

    static void mergeSort(int[] v) {
        // TODO: podziel i scalaj rekurencyjnie
    }

    public static void main(String[] args) {
        int[] scores = {5, 1, 4, 2};
        mergeSort(scores);
        System.out.println(Arrays.toString(scores));
    }
}
`,
      solution: `import java.util.Arrays;

public class Main {
    static int[] merge(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) { result[k++] = a[i++]; }
            else { result[k++] = b[j++]; }
        }
        while (i < a.length) { result[k++] = a[i++]; }
        while (j < b.length) { result[k++] = b[j++]; }
        return result;
    }

    static void mergeSort(int[] v) {
        if (v.length < 2) {
            return;
        }
        int mid = v.length / 2;
        int[] left = Arrays.copyOfRange(v, 0, mid);
        int[] right = Arrays.copyOfRange(v, mid, v.length);
        mergeSort(left);
        mergeSort(right);
        int[] merged = merge(left, right);
        for (int i = 0; i < v.length; i++) {
            v[i] = merged[i];
        }
    }

    public static void main(String[] args) {
        int[] scores = {5, 1, 4, 2};
        mergeSort(scores);
        System.out.println(Arrays.toString(scores));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "v.length < 2", label: "Warunek stopu" },
        { kind: "contains", file: "Main.java", value: "mergeSort(left)", label: "Rekurencja na połowach" },
        { kind: "contains", file: "Main.java", value: "merge(left, right)", label: "Scalanie wyników" },
      ],
    }),
    independentTask("algorithms-05", "independent-2", {
      title: "Scalanie malejąco",
      prompt: "Uzupełnij metodę mergeDesc tak, aby scalała dwie tablice posortowane malejąco w jedną malejącą.",
      steps: ["Te same trzy wskaźniki co w merge.", "Porównanie odwrócone: bierz większą wartość (a[i] >= b[j]).", "Dopisz resztkę niepobranej strony."],
      starter: `import java.util.Arrays;

public class Main {
    static int[] mergeDesc(int[] a, int[] b) {
        // TODO: scal malejąco
        return new int[0];
    }

    public static void main(String[] args) {
        int[] merged = mergeDesc(new int[]{5, 3}, new int[]{4, 2, 1});
        System.out.println(Arrays.toString(merged));
    }
}
`,
      solution: `import java.util.Arrays;

public class Main {
    static int[] mergeDesc(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] >= b[j]) { result[k++] = a[i++]; }
            else { result[k++] = b[j++]; }
        }
        while (i < a.length) { result[k++] = a[i++]; }
        while (j < b.length) { result[k++] = b[j++]; }
        return result;
    }

    public static void main(String[] args) {
        int[] merged = mergeDesc(new int[]{5, 3}, new int[]{4, 2, 1});
        System.out.println(Arrays.toString(merged));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "a[i] >= b[j]", label: "Porównanie malejące" },
        { kind: "contains", file: "Main.java", value: "while (j < b.length)", label: "Resztka drugiej strony" },
      ],
    }),
  ],
  "algorithms-06": [
    independentTask("algorithms-06", "independent-1", {
      title: "Quick sort całej tablicy",
      prompt: "Uzupełnij metodę quickSort tak, aby sortowała rekurencyjnie przez partition. Metoda partition jest już napisana.",
      steps: ["Warunek: tylko gdy lo < hi cokolwiek robimy.", "int p = partition(v, lo, hi) ustawia pivot.", "Wywołaj quickSort na lo..p-1 i p+1..hi."],
      starter: `public class Main {
    static int partition(int[] v, int lo, int hi) {
        int pivot = v[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (v[j] <= pivot) {
                i++;
                int temp = v[i]; v[i] = v[j]; v[j] = temp;
            }
        }
        int temp = v[i + 1]; v[i + 1] = v[hi]; v[hi] = temp;
        return i + 1;
    }

    static void quickSort(int[] v, int lo, int hi) {
        // TODO: partition i dwie rekurencje
    }

    public static void main(String[] args) {
        int[] values = {4, 7, 2, 9, 5};
        quickSort(values, 0, values.length - 1);
        for (int i = 0; i < values.length; i++) {
            System.out.println(values[i]);
        }
    }
}
`,
      solution: `public class Main {
    static int partition(int[] v, int lo, int hi) {
        int pivot = v[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (v[j] <= pivot) {
                i++;
                int temp = v[i]; v[i] = v[j]; v[j] = temp;
            }
        }
        int temp = v[i + 1]; v[i + 1] = v[hi]; v[hi] = temp;
        return i + 1;
    }

    static void quickSort(int[] v, int lo, int hi) {
        if (lo < hi) {
            int p = partition(v, lo, hi);
            quickSort(v, lo, p - 1);
            quickSort(v, p + 1, hi);
        }
    }

    public static void main(String[] args) {
        int[] values = {4, 7, 2, 9, 5};
        quickSort(values, 0, values.length - 1);
        for (int i = 0; i < values.length; i++) {
            System.out.println(values[i]);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "partition(v, lo, hi)", label: "Podział wokół pivota" },
        { kind: "contains", file: "Main.java", value: "quickSort(v, lo, p - 1)", label: "Lewa rekurencja" },
        { kind: "contains", file: "Main.java", value: "quickSort(v, p + 1, hi)", label: "Prawa rekurencja" },
      ],
    }),
    independentTask("algorithms-06", "independent-2", {
      title: "Quick sort malejąco",
      prompt: "Uzupełnij metodę quickDescending tak, aby sortowała malejąco — pivot dzieli na większe i mniejsze.",
      steps: ["Te same partition i rekurencja; zmień warunek na v[j] >= pivot.", "Pivot ląduje na i + 1 jak wcześniej.", "Wywołaj quickDescending na obu stronach."],
      starter: `public class Main {
    static int partitionDesc(int[] v, int lo, int hi) {
        // TODO: większe na lewo od pivota
        return -1;
    }

    static void quickDescending(int[] v, int lo, int hi) {
        // TODO: partition i rekurencje
    }

    public static void main(String[] args) {
        int[] values = {4, 7, 2, 9, 5};
        quickDescending(values, 0, values.length - 1);
        for (int i = 0; i < values.length; i++) {
            System.out.println(values[i]);
        }
    }
}
`,
      solution: `public class Main {
    static int partitionDesc(int[] v, int lo, int hi) {
        int pivot = v[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (v[j] >= pivot) {
                i++;
                int temp = v[i]; v[i] = v[j]; v[j] = temp;
            }
        }
        int temp = v[i + 1]; v[i + 1] = v[hi]; v[hi] = temp;
        return i + 1;
    }

    static void quickDescending(int[] v, int lo, int hi) {
        if (lo < hi) {
            int p = partitionDesc(v, lo, hi);
            quickDescending(v, lo, p - 1);
            quickDescending(v, p + 1, hi);
        }
    }

    public static void main(String[] args) {
        int[] values = {4, 7, 2, 9, 5};
        quickDescending(values, 0, values.length - 1);
        for (int i = 0; i < values.length; i++) {
            System.out.println(values[i]);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "v[j] >= pivot", label: "Większe na lewo" },
        { kind: "contains", file: "Main.java", value: "quickDescending(v, p + 1, hi)", label: "Rekurencja po prawej" },
      ],
    }),
  ],
  "algorithms-07": [
    independentTask("algorithms-07", "independent-1", {
      title: "Zliczanie w małym zakresie",
      prompt: "Uzupełnij metodę countingSort tak, aby sortowała wartości z zakresu 0..5 przez zliczanie.",
      steps: ["count ma 6 komórek (wartości 0..5).", "Zlicz wystąpienia pętlą for-each.", "Wypisz każde v tyle razy, ile wynosi count[v], do tablicy wyniku."],
      starter: `public class Main {
    static void countingSort(int[] values) {
        // TODO: kubełki 0..5
    }

    public static void main(String[] args) {
        int[] scores = {3, 0, 3, 2};
        countingSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      solution: `public class Main {
    static void countingSort(int[] values) {
        int[] count = new int[6];
        for (int v : values) {
            count[v]++;
        }
        int k = 0;
        for (int v = 0; v < count.length; v++) {
            while (count[v] > 0) {
                values[k++] = v;
                count[v]--;
            }
        }
    }

    public static void main(String[] args) {
        int[] scores = {3, 0, 3, 2};
        countingSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new int[6]", label: "Kubełki zakresu 0..5" },
        { kind: "contains", file: "Main.java", value: "while (count[v] > 0)", label: "Rozpisywanie" },
      ],
    }),
    independentTask("algorithms-07", "independent-2", {
      title: "Ile razy występuje wartość",
      prompt: "Uzupełnij metodę countOccurrences tak, aby zliczała wystąpienia podanej wartości w tablicy.",
      steps: ["Licznik count zaczyna się od 0.", "Dla każdego values[i] równego wanted zwiększ count.", "Zwróć count."],
      starter: `public class Main {
    static int countOccurrences(int[] values, int wanted) {
        // TODO: zlicz wystąpienia wanted
        return 0;
    }

    public static void main(String[] args) {
        int[] scores = {4, 1, 3, 1};
        System.out.println(countOccurrences(scores, 1));
    }
}
`,
      solution: `public class Main {
    static int countOccurrences(int[] values, int wanted) {
        int count = 0;
        for (int i = 0; i < values.length; i++) {
            if (values[i] == wanted) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[] scores = {4, 1, 3, 1};
        System.out.println(countOccurrences(scores, 1));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "values[i] == wanted", label: "Porównanie z celem" },
        { kind: "contains", file: "Main.java", value: "count++", label: "Licznik wystąpień" },
      ],
    }),
  ],
  "algorithms-08": [
    independentTask("algorithms-08", "independent-1", {
      title: "Sortowanie przez kopcowanie",
      prompt: "Uzupełnij metodę heapSort tak, aby sortowała tablicę przez kopiec: najpierw budowa, potem zdejmowanie korzenia. siftDown jest napisane.",
      steps: ["Pierwsza pętla: dla i od v.length / 2 - 1 w dół do 0 wołaj siftDown.", "Druga pętla: end od ostatniego do 1 — zamień korzeń z końcem i siftDown na end.", "Metoda siftDown naprawia kopiec od indeksu i."],
      starter: `public class Main {
    static void siftDown(int[] v, int size, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        if (left < size && v[left] > v[largest]) largest = left;
        if (right < size && v[right] > v[largest]) largest = right;
        if (largest != i) {
            int temp = v[i]; v[i] = v[largest]; v[largest] = temp;
            siftDown(v, size, largest);
        }
    }

    static void heapSort(int[] v) {
        // TODO: zbuduj kopiec i zdejmuj maksimum
    }

    public static void main(String[] args) {
        int[] scores = {4, 1, 9, 2, 6};
        heapSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      solution: `public class Main {
    static void siftDown(int[] v, int size, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        if (left < size && v[left] > v[largest]) largest = left;
        if (right < size && v[right] > v[largest]) largest = right;
        if (largest != i) {
            int temp = v[i]; v[i] = v[largest]; v[largest] = temp;
            siftDown(v, size, largest);
        }
    }

    static void heapSort(int[] v) {
        for (int i = v.length / 2 - 1; i >= 0; i--) {
            siftDown(v, v.length, i);
        }
        for (int end = v.length - 1; end > 0; end--) {
            int temp = v[0]; v[0] = v[end]; v[end] = temp;
            siftDown(v, end, 0);
        }
    }

    public static void main(String[] args) {
        int[] scores = {4, 1, 9, 2, 6};
        heapSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "v.length / 2 - 1", label: "Budowa od środka" },
        { kind: "contains", file: "Main.java", value: "siftDown(v, end, 0)", label: "Naprawa po zdjęciu" },
      ],
    }),
    independentTask("algorithms-08", "independent-2", {
      title: "Sortowanie głupie (gnome)",
      prompt: "Uzupełnij metodę gnomeSort tak, aby sortowała jak ogrodnik: po zamianie cofa się o krok, bez zamiany idzie do przodu.",
      steps: ["Indeks i zaczyna się od 1.", "Gdy values[i-1] <= values[i] — i++ do przodu.", "Gdy większe — zamień i cofnij i (ale nie poniżej 1)."],
      starter: `public class Main {
    static void gnomeSort(int[] values) {
        // TODO: krok do przodu albo zamiana i cofnięcie
    }

    public static void main(String[] args) {
        int[] scores = {5, 2, 8, 1};
        gnomeSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      solution: `public class Main {
    static void gnomeSort(int[] values) {
        int i = 1;
        while (i < values.length) {
            if (values[i - 1] <= values[i]) {
                i++;
            } else {
                int temp = values[i];
                values[i] = values[i - 1];
                values[i - 1] = temp;
                i--;
                if (i == 0) {
                    i = 1;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] scores = {5, 2, 8, 1};
        gnomeSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "values[i - 1] <= values[i]", label: "Sprawdzenie sąsiada" },
        { kind: "contains", file: "Main.java", value: "i--", label: "Cofnięcie po zamianie" },
      ],
    }),
  ],
  "algorithms-09": [
    independentTask("algorithms-09", "independent-1", {
      title: "Pierwsze wystąpienie",
      prompt: "Uzupełnij metodę firstIndex tak, aby w posortowanej tablicy z powtórzeniami zwracała indeks pierwszego wystąpienia celu albo -1.",
      steps: ["Jak w findIndex: low, high, mid i połowienie.", "Przy trafieniu zapamiętaj found = mid i szukaj dalej w lewo: high = mid - 1.", "Zwróć found po pętli."],
      starter: `public class Main {
    static int firstIndex(int[] sorted, int target) {
        // TODO: pierwsze wystąpienie binarnie
        return -1;
    }

    public static void main(String[] args) {
        int[] values = {1, 2, 2, 2, 3};
        System.out.println(firstIndex(values, 2));
    }
}
`,
      solution: `public class Main {
    static int firstIndex(int[] sorted, int target) {
        int low = 0, high = sorted.length - 1, found = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (sorted[mid] == target) {
                found = mid;
                high = mid - 1;
            } else if (sorted[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return found;
    }

    public static void main(String[] args) {
        int[] values = {1, 2, 2, 2, 3};
        System.out.println(firstIndex(values, 2));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "found = mid", label: "Zapamiętanie trafu" },
        { kind: "contains", file: "Main.java", value: "high = mid - 1", label: "Szukanie w lewo" },
      ],
    }),
    independentTask("algorithms-09", "independent-2", {
      title: "Ostatnie wystąpienie",
      prompt: "Uzupełnij metodę lastIndex tak, aby zwracała indeks ostatniego wystąpienia celu albo -1.",
      steps: ["Te same low, high, mid i połowienie.", "Przy trafieniu found = mid i szukaj dalej w prawo: low = mid + 1.", "Zwróć found po pętli."],
      starter: `public class Main {
    static int lastIndex(int[] sorted, int target) {
        // TODO: ostatnie wystąpienie binarnie
        return -1;
    }

    public static void main(String[] args) {
        int[] values = {1, 2, 2, 2, 3};
        System.out.println(lastIndex(values, 2));
    }
}
`,
      solution: `public class Main {
    static int lastIndex(int[] sorted, int target) {
        int low = 0, high = sorted.length - 1, found = -1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (sorted[mid] == target) {
                found = mid;
                low = mid + 1;
            } else if (sorted[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return found;
    }

    public static void main(String[] args) {
        int[] values = {1, 2, 2, 2, 3};
        System.out.println(lastIndex(values, 2));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "found = mid", label: "Zapamiętanie trafu" },
        { kind: "contains", file: "Main.java", value: "low = mid + 1", label: "Szukanie w prawo" },
      ],
    }),
  ],
  "algorithms-10": [
    independentTask("algorithms-10", "independent-1", {
      title: "Szybkie potęgowanie",
      prompt: "Uzupełnij metodę power tak, aby liczyła potęgę rekurencyjnie, poławiąc wykładnik.",
      steps: ["Warunek stopu: exp == 0 zwraca 1.", "half = power(base, exp / 2) liczy połowę wykładnika.", "Parzyste exp: half * half; nieparzyste: dodatkowo * base."],
      starter: `public class Main {
    static int power(int base, int exp) {
        // TODO: szybkie potęgowanie rekurencyjne
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(power(2, 10));
    }
}
`,
      solution: `public class Main {
    static int power(int base, int exp) {
        if (exp == 0) {
            return 1;
        }
        int half = power(base, exp / 2);
        if (exp % 2 == 0) {
            return half * half;
        }
        return half * half * base;
    }

    public static void main(String[] args) {
        System.out.println(power(2, 10));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "if (exp == 0)", label: "Warunek stopu" },
        { kind: "contains", file: "Main.java", value: "half * half", label: "Kwadrat połowy" },
      ],
    }),
    independentTask("algorithms-10", "independent-2", {
      title: "Suma cyfr rekurencyjnie",
      prompt: "Uzupełnij metodę digitSum tak, aby zwracała sumę cyfr liczby przez rekurencję.",
      steps: ["Warunek stopu: liczba < 10 zwraca samą siebie.", "Ostatnia cyfra to number % 10.", "Reszta liczby to number / 10 — sumuj cyfrę z wywołaniem rekurencyjnym."],
      starter: `public class Main {
    static int digitSum(int number) {
        // TODO: ostatnia cyfra + rekurencja
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(digitSum(1234));
    }
}
`,
      solution: `public class Main {
    static int digitSum(int number) {
        if (number < 10) {
            return number;
        }
        return number % 10 + digitSum(number / 10);
    }

    public static void main(String[] args) {
        System.out.println(digitSum(1234));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "number % 10", label: "Ostatnia cyfra" },
        { kind: "contains", file: "Main.java", value: "digitSum(number / 10)", label: "Rekurencja na reszcie" },
      ],
    }),
  ],
  "algorithms-11": [
    independentTask("algorithms-11", "independent-1", {
      title: "Fibonacci iteracyjnie",
      prompt: "Uzupełnij metodę fibLoop tak, aby zwracała n-ty wyraz ciągu pętlą z dwiema zapamiętanymi wartościami.",
      steps: ["a = 0 i b = 1 to dwa ostatnie wyrazy.", "W pętli od 2 do n: next = a + b, potem a = b i b = next.", "Zwróć n dla n <= 1, inaczej b."],
      starter: `public class Main {
    static int fibLoop(int n) {
        // TODO: dwa ostatnie wyrazy w pętli
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(fibLoop(10));
    }
}
`,
      solution: `public class Main {
    static int fibLoop(int n) {
        int a = 0;
        int b = 1;
        for (int i = 2; i <= n; i++) {
            int next = a + b;
            a = b;
            b = next;
        }
        return n <= 1 ? n : b;
    }

    public static void main(String[] args) {
        System.out.println(fibLoop(10));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "int next = a + b", label: "Następny wyraz" },
        { kind: "contains", file: "Main.java", value: "b = next", label: "Przesunięcie pary" },
      ],
    }),
    independentTask("algorithms-11", "independent-2", {
      title: "Suma wyrazów Fibonacciego",
      prompt: "Uzupełnij metodę sumFib tak, aby sumowała wyrazy fib(0) do fib(n) włącznie, licząc je iteracyjnie.",
      steps: ["a = 0, b = 1 i sum zaczyna się od a + b.", "Dla i od 2 do n: next = a + b, dodaj do sum i przesuń parę.", "Dla n == 0 wynik to 0 — obsłuż to warunkiem na starcie."],
      starter: `public class Main {
    static int sumFib(int n) {
        // TODO: suma fib(0)..fib(n)
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(sumFib(6));
    }
}
`,
      solution: `public class Main {
    static int sumFib(int n) {
        int a = 0;
        int b = 1;
        int sum = a + b;
        for (int i = 2; i <= n; i++) {
            int next = a + b;
            sum += next;
            a = b;
            b = next;
        }
        return n == 0 ? 0 : sum;
    }

    public static void main(String[] args) {
        System.out.println(sumFib(6));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "sum += next", label: "Akumulacja wyrazu" },
        { kind: "contains", file: "Main.java", value: "int next = a + b", label: "Kolejny wyraz" },
      ],
    }),
  ],
  "algorithms-12": [
    independentTask("algorithms-12", "independent-1", {
      title: "Najmniejsza wspólna wielokrotność",
      prompt: "Uzupełnij metodę lcm tak, aby zwracała NWW przez wzór a * b / gcd(a, b). gcd jest napisane.",
      steps: ["gcd jest dostępne w tej samej klasie.", "Zwróć a * b / gcd(a, b).", "Uruchom — main wypisuje lcm(6, 8)."],
      starter: `public class Main {
    static int gcd(int a, int b) {
        while (b != 0) {
            int rest = a % b;
            a = b;
            b = rest;
        }
        return a;
    }

    static int lcm(int a, int b) {
        // TODO: NWW przez NWD
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(lcm(6, 8));
    }
}
`,
      solution: `public class Main {
    static int gcd(int a, int b) {
        while (b != 0) {
            int rest = a % b;
            a = b;
            b = rest;
        }
        return a;
    }

    static int lcm(int a, int b) {
        return a * b / gcd(a, b);
    }

    public static void main(String[] args) {
        System.out.println(lcm(6, 8));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "a * b / gcd(a, b)", label: "Wzór NWW" },
        { kind: "contains", file: "Main.java", value: "gcd(a, b)", label: "Użycie NWD" },
      ],
    }),
    independentTask("algorithms-12", "independent-2", {
      title: "Liczby względnie pierwsze",
      prompt: "Uzupełnij metodę areCoprime tak, aby zwracała true, gdy NWD dwóch liczb wynosi 1. gcd jest napisane.",
      steps: ["Wywołaj gcd(a, b).", "Zwróć porównanie wyniku do 1.", "Uruchom — main sprawdza 8 i 15."],
      starter: `public class Main {
    static int gcd(int a, int b) {
        while (b != 0) {
            int rest = a % b;
            a = b;
            b = rest;
        }
        return a;
    }

    static boolean areCoprime(int a, int b) {
        // TODO: NWD == 1
        return false;
    }

    public static void main(String[] args) {
        System.out.println(areCoprime(8, 15));
    }
}
`,
      solution: `public class Main {
    static int gcd(int a, int b) {
        while (b != 0) {
            int rest = a % b;
            a = b;
            b = rest;
        }
        return a;
    }

    static boolean areCoprime(int a, int b) {
        return gcd(a, b) == 1;
    }

    public static void main(String[] args) {
        System.out.println(areCoprime(8, 15));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "gcd(a, b) == 1", label: "Warunek względnej pierwszości" },
      ],
    }),
  ],
  "algorithms-13": [
    independentTask("algorithms-13", "independent-1", {
      title: "Sito Eratostenesa",
      prompt: "Uzupełnij metodę countPrimes tak, aby zliczała liczby pierwsze do limit włącznie, skreślając wielokrotności sitem.",
      steps: ["boolean[] crossed o rozmiarze limit + 1.", "Dla n od 2 do limit: gdy nieskreślone — count++ i skreśl wielokrotności od n * n co n.", "Zwróć count."],
      starter: `public class Main {
    static int countPrimes(int limit) {
        // TODO: sito Eratostenesa
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(countPrimes(30));
    }
}
`,
      solution: `public class Main {
    static int countPrimes(int limit) {
        boolean[] crossed = new boolean[limit + 1];
        int count = 0;
        for (int n = 2; n <= limit; n++) {
            if (!crossed[n]) {
                count++;
                for (int m = n * n; m <= limit; m += n) {
                    crossed[m] = true;
                }
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countPrimes(30));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "!crossed[n]", label: "Znaleziona pierwsza" },
        { kind: "contains", file: "Main.java", value: "crossed[m] = true", label: "Skreślanie wielokrotności" },
      ],
    }),
    independentTask("algorithms-13", "independent-2", {
      title: "N-ta liczba pierwsza",
      prompt: "Uzupełnij metodę nthPrime tak, aby zwracała n-tą liczbę pierwszą, używając isPrime.",
      steps: ["isPrime jest dostępne w klasie.", "Kandydat candidate rośnie od 2, licznik found zlicza trafienia.", "Gdy found == n — zwróć candidate."],
      starter: `public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }

    static int nthPrime(int n) {
        // TODO: szukaj kolejnych pierwszych
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(nthPrime(6));
    }
}
`,
      solution: `public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) return false;
        }
        return true;
    }

    static int nthPrime(int n) {
        int found = 0;
        int candidate = 1;
        while (found < n) {
            candidate++;
            if (isPrime(candidate)) {
                found++;
            }
        }
        return candidate;
    }

    public static void main(String[] args) {
        System.out.println(nthPrime(6));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "isPrime(candidate)", label: "Test pierwszości" },
        { kind: "contains", file: "Main.java", value: "found < n", label: "Licznik trafień" },
      ],
    }),
  ],
  "algorithms-14": [
    independentTask("algorithms-14", "independent-1", {
      title: "Odwróć tekst",
      prompt: "Uzupełnij metodę reverse tak, aby zwracała tekst czytany od tyłu, na tablicy znaków.",
      steps: ["char[] chars = text.toCharArray().", "Zamieniaj brzegi: chars[i] z chars[j] idąc do środka.", "Zwróć new String(chars)."],
      starter: `public class Main {
    static String reverse(String text) {
        // TODO: zamiana brzegów w char[]
        return "";
    }

    public static void main(String[] args) {
        System.out.println(reverse("Java"));
    }
}
`,
      solution: `public class Main {
    static String reverse(String text) {
        char[] chars = text.toCharArray();
        for (int i = 0, j = chars.length - 1; i < j; i++, j--) {
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        return new String(chars);
    }

    public static void main(String[] args) {
        System.out.println(reverse("Java"));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "toCharArray()", label: "Tablica znaków" },
        { kind: "contains", file: "Main.java", value: "new String(chars)", label: "String z tablicy" },
      ],
    }),
    independentTask("algorithms-14", "independent-2", {
      title: "Anagramy",
      prompt: "Uzupełnij metodę areAnagrams tak, aby zwracała true, gdy słowa mają te same litery w innej kolejności — przez zliczanie liter.",
      steps: ["Różne długości od razu dają false.", "int[] letters o 26 komórkach: dla znaku a dodaj do a.charAt(i) - 'a', dla b odejmij.", "Po pętli zwróć, czy wszystkie komórki są zerami."],
      starter: `public class Main {
    static boolean areAnagrams(String a, String b) {
        // TODO: zliczanie liter 0..25
        return false;
    }

    public static void main(String[] args) {
        System.out.println(areAnagrams("tok", "kot"));
    }
}
`,
      solution: `public class Main {
    static boolean areAnagrams(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        int[] letters = new int[26];
        for (int i = 0; i < a.length(); i++) {
            letters[a.charAt(i) - 'a']++;
            letters[b.charAt(i) - 'a']--;
        }
        for (int count : letters) {
            if (count != 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(areAnagrams("tok", "kot"));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "- 'a'", label: "Indeks litery" },
        { kind: "contains", file: "Main.java", value: "count != 0", label: "Niezgodna litera" },
      ],
    }),
  ],
  "algorithms-15": [
    independentTask("algorithms-15", "independent-1", {
      title: "Odszyfruj Cezarem",
      prompt: "Uzupełnij metodę caesarDec tak, aby odszyfrowywała tekst przesuwając litery w tył o shift.",
      steps: ["Odszyfrowanie to caesar z ujemnym przesunięciem.", "W Java -k % 26 bywa ujemne — dodaj + 26 przed modulo.", "Lub napisz własną pętlę przesuwającą o -shift."],
      starter: `public class Main {
    static String caesarDec(String text, int shift) {
        // TODO: przesuń litery w tył
        return "";
    }

    public static void main(String[] args) {
        System.out.println(caesarDec("DEF", 3));
    }
}
`,
      solution: `public class Main {
    static String caesarDec(String text, int shift) {
        String result = "";
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                c = (char) ('A' + (c - 'A' - shift + 26) % 26);
            }
            result += c;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(caesarDec("DEF", 3));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "- shift", label: "Przesunięcie w tył" },
        { kind: "contains", file: "Main.java", value: "% 26", label: "Zawinięcie alfabetu" },
      ],
    }),
    independentTask("algorithms-15", "independent-2", {
      title: "ROT13",
      prompt: "Uzupełnij metodę rot13 tak, aby przesuwała litery o 13 pozycji — ta sama operacja szyfruje i odszyfrowuje.",
      steps: ["To szyfr Cezara ze stałym shift = 13.", "Skopiuj pętlę Cezara lub wywołaj ją z 13.", "Dla znaków poza 'A'..'Z' zostaw bez zmian."],
      starter: `public class Main {
    static String rot13(String text) {
        // TODO: przesunięcie o 13
        return "";
    }

    public static void main(String[] args) {
        System.out.println(rot13("HELLO"));
    }
}
`,
      solution: `public class Main {
    static String rot13(String text) {
        String result = "";
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                c = (char) ('A' + (c - 'A' + 13) % 26);
            }
            result += c;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(rot13("HELLO"));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "+ 13", label: "Przesunięcie o 13" },
        { kind: "contains", file: "Main.java", value: "% 26", label: "Zawinięcie" },
      ],
    }),
  ],
  "algorithms-16": [
    independentTask("algorithms-16", "independent-1", {
      title: "Zamiana na szesnastkowy",
      prompt: "Uzupełnij metodę toHex tak, aby zwracała liczbę zapisaną szesnastkowo, używając stringa cyfr.",
      steps: ["String digits = \"0123456789ABCDEF\".", "Reszta number % 16 wybiera cyfrę digits.charAt — doklejaj PRZED result.", "Dziel number przez 16 w każdym obrocie."],
      starter: `public class Main {
    static String toHex(int number) {
        // TODO: reszty z dzielenia przez 16
        return "";
    }

    public static void main(String[] args) {
        System.out.println(toHex(255));
    }
}
`,
      solution: `public class Main {
    static String toHex(int number) {
        String digits = "0123456789ABCDEF";
        String result = "";
        while (number > 0) {
            result = digits.charAt(number % 16) + result;
            number /= 16;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(toHex(255));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "number % 16", label: "Reszta szesnastkowa" },
        { kind: "contains", file: "Main.java", value: "digits.charAt", label: "Cyfra z reszty" },
      ],
    }),
    independentTask("algorithms-16", "independent-2", {
      title: "Z binarnego na dziesiętny",
      prompt: "Uzupełnij metodę fromBinary tak, aby zamieniała zapis binarny na liczbę przez mnożenie przez 2.",
      steps: ["value zaczyna się od 0.", "Dla każdego znaku textu: value = value * 2 + (znak - '0').", "Znak '1' ma kod o 1 większy niż '0'."],
      starter: `public class Main {
    static int fromBinary(String text) {
        // TODO: mnożenie przez 2 + cyfra
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(fromBinary("1101"));
    }
}
`,
      solution: `public class Main {
    static int fromBinary(String text) {
        int value = 0;
        for (int i = 0; i < text.length(); i++) {
            value = value * 2 + (text.charAt(i) - '0');
        }
        return value;
    }

    public static void main(String[] args) {
        System.out.println(fromBinary("1101"));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "value * 2", label: "Przesunięcie wartości" },
        { kind: "contains", file: "Main.java", value: "- '0'", label: "Cyfra ze znaku" },
      ],
    }),
  ],
  "algorithms-17": [
    independentTask("algorithms-17", "independent-1", {
      title: "Zlicz wystąpienia wzorca",
      prompt: "Uzupełnij metodę countMatches tak, aby zliczała wszystkie wystąpienia wzorca w tekście, także nakładające się.",
      steps: ["count zaczyna się od 0, pętla start jak w find.", "Przy pełnym dopasowaniu count++ i szukaj dalej.", "Zwróć count po pętli."],
      starter: `public class Main {
    static int countMatches(String text, String pattern) {
        // TODO: zlicz trafienia
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(countMatches("banana", "ana"));
    }
}
`,
      solution: `public class Main {
    static int countMatches(String text, String pattern) {
        int count = 0;
        for (int start = 0; start <= text.length() - pattern.length(); start++) {
            int i = 0;
            while (i < pattern.length() && text.charAt(start + i) == pattern.charAt(i)) {
                i++;
            }
            if (i == pattern.length()) {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(countMatches("banana", "ana"));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "count++", label: "Licznik trafień" },
        { kind: "contains", file: "Main.java", value: "i == pattern.length()", label: "Pełne dopasowanie" },
      ],
    }),
    independentTask("algorithms-17", "independent-2", {
      title: "Najdłuższe słowo",
      prompt: "Uzupełnij metodę longestWord tak, aby zwracała długość najdłuższego słowa w zdaniu (słowa dzielą spacje).",
      steps: ["Bieżąca długość current rośnie przy literach, resetuje się przy spacji.", "Spacja porównuje current z max i zeruje current.", "Po pętli zwróć max z current i max."],
      starter: `public class Main {
    static int longestWord(String text) {
        // TODO: najdłuższe słowo między spacjami
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(longestWord("ala ma kota"));
    }
}
`,
      solution: `public class Main {
    static int longestWord(String text) {
        int max = 0;
        int current = 0;
        for (int i = 0; i < text.length(); i++) {
            if (text.charAt(i) == ' ') {
                if (current > max) {
                    max = current;
                }
                current = 0;
            } else {
                current++;
            }
        }
        return Math.max(max, current);
    }

    public static void main(String[] args) {
        System.out.println(longestWord("ala ma kota"));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "text.charAt(i) == ' '", label: "Granica słowa" },
        { kind: "contains", file: "Main.java", value: "current++", label: "Długość słowa" },
      ],
    }),
  ],
  "algorithms-18": [
    independentTask("algorithms-18", "independent-1", {
      title: "Transponuj macierz",
      prompt: "Uzupełnij metodę transpose tak, aby zwracała macierz z zamienionymi wierszami i kolumnami.",
      steps: ["Nowa macierz t ma wymiary odwrócone: new int[m[0].length][m.length].", "Każda komórka t[c][r] = m[r][c].", "Zwróć t."],
      starter: `public class Main {
    static int[][] transpose(int[][] m) {
        // TODO: wiersze na kolumny
        return new int[0][0];
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2}, {3, 4}};
        int[][] t = transpose(m);
        for (int r = 0; r < t.length; r++) {
            for (int c = 0; c < t[r].length; c++) {
                System.out.print(t[r][c]);
            }
            System.out.println();
        }
    }
}
`,
      solution: `public class Main {
    static int[][] transpose(int[][] m) {
        int[][] t = new int[m[0].length][m.length];
        for (int r = 0; r < m.length; r++) {
            for (int c = 0; c < m[r].length; c++) {
                t[c][r] = m[r][c];
            }
        }
        return t;
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2}, {3, 4}};
        int[][] t = transpose(m);
        for (int r = 0; r < t.length; r++) {
            for (int c = 0; c < t[r].length; c++) {
                System.out.print(t[r][c]);
            }
            System.out.println();
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "t[c][r] = m[r][c]", label: "Zamiana wymiarów" },
        { kind: "contains", file: "Main.java", value: "m[0].length", label: "Liczba kolumn" },
      ],
    }),
    independentTask("algorithms-18", "independent-2", {
      title: "Mnożenie macierzy",
      prompt: "Uzupełnij metodę multiply tak, aby mnożyła dwie macierze kwadratowe: result[r][c] to suma iloczynów wiersza r i kolumny c.",
      steps: ["result ma wymiary a.length × b[0].length.", "Trzy pętle: r, c i k przez kolumny a / wiersze b.", "result[r][c] += a[r][k] * b[k][c]."],
      starter: `public class Main {
    static int[][] multiply(int[][] a, int[][] b) {
        // TODO: suma iloczynów wiersz × kolumna
        return new int[0][0];
    }

    public static void main(String[] args) {
        int[][] a = {{1, 2}, {3, 4}};
        int[][] result = multiply(a, a);
        System.out.println(result[1][1]);
    }
}
`,
      solution: `public class Main {
    static int[][] multiply(int[][] a, int[][] b) {
        int[][] result = new int[a.length][b[0].length];
        for (int r = 0; r < a.length; r++) {
            for (int c = 0; c < b[0].length; c++) {
                for (int k = 0; k < b.length; k++) {
                    result[r][c] += a[r][k] * b[k][c];
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[][] a = {{1, 2}, {3, 4}};
        int[][] result = multiply(a, a);
        System.out.println(result[1][1]);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "a[r][k] * b[k][c]", label: "Iloczyn wiersza i kolumny" },
        { kind: "contains", file: "Main.java", value: "result[r][c] +=", label: "Akumulator komórki" },
      ],
    }),
  ],
  "algorithms-19": [
    independentTask("algorithms-19", "independent-1", {
      title: "Odejmowanie w ONP",
      prompt: "Uzupełnij metodę evalRpn tak, aby obsługiwała też odejmowanie: \"4 2 -\" to 4 - 2 = 2.",
      steps: ["Liczby i \"+\" jak w lekcji głównej.", "Token \"-\": b to górna wartość, a dolna — odkładamy a - b.", "Zwróć stack[0]."],
      starter: `public class Main {
    static int evalRpn(String[] tokens) {
        int[] stack = new int[tokens.length];
        int top = 0;
        for (String token : tokens) {
            if (token.equals("+")) {
                int b = stack[--top];
                int a = stack[--top];
                stack[top++] = a + b;
            } else {
                stack[top++] = Integer.parseInt(token);
            }
        }
        return stack[0];
    }

    public static void main(String[] args) {
        System.out.println(evalRpn(new String[]{"4", "2", "-"}));
    }
}
`,
      solution: `public class Main {
    static int evalRpn(String[] tokens) {
        int[] stack = new int[tokens.length];
        int top = 0;
        for (String token : tokens) {
            if (token.equals("+")) {
                int b = stack[--top];
                int a = stack[--top];
                stack[top++] = a + b;
            } else if (token.equals("-")) {
                int b = stack[--top];
                int a = stack[--top];
                stack[top++] = a - b;
            } else {
                stack[top++] = Integer.parseInt(token);
            }
        }
        return stack[0];
    }

    public static void main(String[] args) {
        System.out.println(evalRpn(new String[]{"4", "2", "-"}));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "a - b", label: "Kolejność operandów" },
        { kind: "contains", file: "Main.java", value: "stack[--top]", label: "Zdjęcie operandu" },
      ],
    }),
    independentTask("algorithms-19", "independent-2", {
      title: "Nawiasy zbalansowane",
      prompt: "Uzupełnij metodę balanced tak, aby sprawdzała, czy każdy '(' ma pasujące ')', używając licznika głębokości.",
      steps: ["depth zaczyna się od 0.", "'(' zwiększa depth, ')' zmniejsza; spadek poniżej 0 to false.", "Po pętli wynik to depth == 0."],
      starter: `public class Main {
    static boolean balanced(String text) {
        // TODO: licznik głębokości nawiasów
        return false;
    }

    public static void main(String[] args) {
        System.out.println(balanced("(())()"));
    }
}
`,
      solution: `public class Main {
    static boolean balanced(String text) {
        int depth = 0;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c == '(') {
                depth++;
            } else if (c == ')') {
                depth--;
                if (depth < 0) {
                    return false;
                }
            }
        }
        return depth == 0;
    }

    public static void main(String[] args) {
        System.out.println(balanced("(())()"));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "depth < 0", label: "Za dużo zamknięć" },
        { kind: "contains", file: "Main.java", value: "depth == 0", label: "Bilans końcowy" },
      ],
    }),
  ],
  "algorithms-20": [
    independentTask("algorithms-20", "independent-1", {
      title: "Ścieżka w grafie DFS",
      prompt: "Uzupełnij metodę hasPath tak, aby sprawdzała rekurencyjnie, czy z wierzchołka v da się dojść do target.",
      steps: ["Odwiedź v; gdy v == target zwróć true.", "Dla każdego sąsiada bez visited: jeśli hasPath(next,...) zwraca true — zwróć true.", "Po pętli false — ślepy zaułek."],
      starter: `public class Main {
    static boolean hasPath(int v, int target, int[][] graph, boolean[] visited) {
        // TODO: DFS w stronę celu
        return false;
    }

    public static void main(String[] args) {
        int[][] graph = {{1, 2}, {0, 3}, {0}, {1}};
        System.out.println(hasPath(0, 3, graph, new boolean[graph.length]));
    }
}
`,
      solution: `public class Main {
    static boolean hasPath(int v, int target, int[][] graph, boolean[] visited) {
        if (v == target) {
            return true;
        }
        visited[v] = true;
        for (int next : graph[v]) {
            if (!visited[next] && hasPath(next, target, graph, visited)) {
                return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        int[][] graph = {{1, 2}, {0, 3}, {0}, {1}};
        System.out.println(hasPath(0, 3, graph, new boolean[graph.length]));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "v == target", label: "Trafienie celu" },
        { kind: "contains", file: "Main.java", value: "hasPath(next, target", label: "Rekurencja DFS" },
      ],
    }),
    independentTask("algorithms-20", "independent-2", {
      title: "Liczba składowych grafu",
      prompt: "Uzupełnij metodę countComponents tak, aby zliczała spójne składowe grafu — każdy BFS z nowego wierzchołka to jedna.",
      steps: ["boolean[] visited; dla każdego v nieodwiedzonego zwiększ components i przejdź BFS.", "BFS jak w lekcji: kolejka, visited, sąsiedzi.", "Zwróć components."],
      starter: `public class Main {
    static int countComponents(int[][] graph) {
        // TODO: BFS z każdego nowego wierzchołka
        return 0;
    }

    public static void main(String[] args) {
        int[][] graph = {{1}, {0}, {}};
        System.out.println(countComponents(graph));
    }
}
`,
      solution: `public class Main {
    static int countComponents(int[][] graph) {
        boolean[] visited = new boolean[graph.length];
        int components = 0;
        for (int start = 0; start < graph.length; start++) {
            if (!visited[start]) {
                components++;
                int[] queue = new int[graph.length];
                int head = 0, tail = 0;
                visited[start] = true;
                queue[tail++] = start;
                while (head < tail) {
                    int v = queue[head++];
                    for (int next : graph[v]) {
                        if (!visited[next]) {
                            visited[next] = true;
                            queue[tail++] = next;
                        }
                    }
                }
            }
        }
        return components;
    }

    public static void main(String[] args) {
        int[][] graph = {{1}, {0}, {}};
        System.out.println(countComponents(graph));
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "!visited[start]", label: "Nowa składowa" },
        { kind: "contains", file: "Main.java", value: "components++", label: "Licznik składowych" },
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
      prompt: "Zbuduj bohatera, który posiada przekazany obiekt Inventory. Dodaj Inventory getInventory(), zwracające ten sam ekwipunek, nie nową instancję.",
      steps: ["Dodaj Inventory z liczbą slotów.", "Dodaj prywatne Inventory inventory w Hero.", "Przekaż ekwipunek do konstruktora Hero i udostępnij go przez getInventory()."],
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

    Inventory getInventory() {
        return inventory;
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
            System.out.println("Nazwa jest wymagana");
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
  "game-dev-13": [
    independentTask("game-dev-13", "independent-1", {
      title: "Potwór z komponentem",
      prompt: "Utwórz obiekt Potwór z komponentem Atak i narysuj go w scenie.",
      steps: ["Użyj klas GameObject i Component.", "Ustaw pozycję 360, 140.", "Wywołaj draw()."],
      starter: `class Component { String name; Component(String name) { this.name = name; } }
class GameObject {
    String name; int x; int y; Component component;
    GameObject(String name, int x, int y, Component component) { this.name = name; this.x = x; this.y = y; this.component = component; }
    void draw() { System.out.println("GAME|" + name + "|" + x + "|" + y + "|" + component.name); }
}
public class Main {
    public static void main(String[] args) {
        // TODO: utwórz Potwór z komponentem Atak
    }
}
`,
      solution: `class Component { String name; Component(String name) { this.name = name; } }
class GameObject {
    String name; int x; int y; Component component;
    GameObject(String name, int x, int y, Component component) { this.name = name; this.x = x; this.y = y; this.component = component; }
    void draw() { System.out.println("GAME|" + name + "|" + x + "|" + y + "|" + component.name); }
}
public class Main {
    public static void main(String[] args) {
        GameObject enemy = new GameObject("Potwór", 360, 140, new Component("Atak"));
        enemy.draw();
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new GameObject(\"Potwór\", 360, 140", label: "Utworzenie potwora" },
        { kind: "contains", file: "Main.java", value: "new Component(\"Atak\")", label: "Komponent ataku" },
        { kind: "contains", file: "Main.java", value: "enemy.draw()", label: "Rysowanie potwora" },
      ],
      runMode: "game",
    }),
    independentTask("game-dev-13", "independent-2", {
      title: "Trzy obiekty sceny",
      prompt: "Zbuduj scenę z graczem, potworem i skarbem.",
      steps: ["Utwórz trzy GameObjecty.", "Nadaj im różne pozycje.", "Wywołaj draw dla każdego obiektu."],
      starter: `class GameObject {
    String name; int x; int y;
    GameObject(String name, int x, int y) { this.name = name; this.x = x; this.y = y; }
    void draw() { System.out.println("GAME|" + name + "|" + x + "|" + y + "|Scena"); }
}
public class Main {
    public static void main(String[] args) {
        // TODO: trzy obiekty
    }
}
`,
      solution: `class GameObject {
    String name; int x; int y;
    GameObject(String name, int x, int y) { this.name = name; this.x = x; this.y = y; }
    void draw() { System.out.println("GAME|" + name + "|" + x + "|" + y + "|Scena"); }
}
public class Main {
    public static void main(String[] args) {
        GameObject player = new GameObject("Gracz", 100, 100);
        GameObject enemy = new GameObject("Potwór", 300, 120);
        GameObject treasure = new GameObject("Skarb", 500, 220);
        player.draw(); enemy.draw(); treasure.draw();
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "new GameObject(\"Gracz\"", label: "Gracz" },
        { kind: "contains", file: "Main.java", value: "new GameObject(\"Potwór\"", label: "Potwór" },
        { kind: "contains", file: "Main.java", value: "new GameObject(\"Skarb\"", label: "Skarb" },
      ],
      runMode: "game",
    }),
  ],
  "game-dev-14": [
    independentTask("game-dev-14", "independent-1", {
      title: "Scena w pętli",
      prompt: "Przechowaj obiekty w tablicy i narysuj je pętlą for-each.",
      steps: ["Utwórz GameObject[] scene.", "Dodaj dwa obiekty.", "Przejdź po scenie pętlą."],
      starter: `class GameObject {
    String name;
    GameObject(String name) { this.name = name; }
    void draw() { System.out.println("GAME|" + name + "|120|120|Scena"); }
}
public class Main {
    public static void main(String[] args) {
        // TODO: tablica i pętla
    }
}
`,
      solution: `class GameObject {
    String name;
    GameObject(String name) { this.name = name; }
    void draw() { System.out.println("GAME|" + name + "|120|120|Scena"); }
}
public class Main {
    public static void main(String[] args) {
        GameObject[] scene = { new GameObject("Gracz"), new GameObject("Moneta") };
        for (GameObject object : scene) { object.draw(); }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "GameObject[] scene", label: "Tablica sceny" },
        { kind: "contains", file: "Main.java", value: "for (GameObject object : scene)", label: "Pętla sceny" },
      ],
      runMode: "game",
    }),
    independentTask("game-dev-14", "independent-2", {
      title: "Komponent zdrowia",
      prompt: "Dodaj komponent Health z wartością życia i przypisz go do gracza.",
      steps: ["Utwórz klasę Health.", "Dodaj pole hearts.", "Wypisz obiekt Gracz z komponentem Health."],
      starter: `class Health {
    // TODO: hearts i konstruktor
}
class GameObject {
    // TODO: obiekt z komponentem
}
public class Main {
    public static void main(String[] args) {
        // TODO: gracz z życiem
    }
}
`,
      solution: `class Health {
    int hearts;
    Health(int hearts) { this.hearts = hearts; }
}
class GameObject {
    String name; Health health;
    GameObject(String name, Health health) { this.name = name; this.health = health; }
    void draw() { System.out.println("GAME|" + name + "|160|180|HP " + health.hearts); }
}
public class Main {
    public static void main(String[] args) {
        GameObject player = new GameObject("Gracz", new Health(3));
        player.draw();
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "class Health", label: "Komponent zdrowia" },
        { kind: "contains", file: "Main.java", value: "new Health(3)", label: "Trzy życia" },
        { kind: "contains", file: "Main.java", value: "health.hearts", label: "Stan komponentu" },
      ],
      runMode: "game",
    }),
  ],
  "game-dev-15": [
    independentTask("game-dev-15", "independent-1", {
      title: "Dwie monety",
      prompt: "Zwiększ wynik dwa razy i pokaż dwie monety w scenie.",
      steps: ["Dodaj metodę collect.", "Wywołaj ją dwa razy.", "Wypisz SCORE|2."],
      starter: `class Score {
    int points;
    // TODO: collect
}
public class Main {
    public static void main(String[] args) {
        Score score = new Score();
        // TODO: dwie monety
    }
}
`,
      solution: `class Score {
    int points;
    void collect() { points++; }
}
public class Main {
    public static void main(String[] args) {
        Score score = new Score();
        score.collect(); score.collect();
        System.out.println("GAME|Moneta 1|220|180|Punkt");
        System.out.println("GAME|Moneta 2|380|180|Punkt");
        System.out.println("SCORE|" + score.points);
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "void collect()", label: "Zbieranie punktu" },
        { kind: "contains", file: "Main.java", value: "score.collect(); score.collect()", label: "Dwie monety" },
        { kind: "contains", file: "Main.java", value: "SCORE|", label: "Wynik gry" },
      ],
      runMode: "game",
    }),
    independentTask("game-dev-15", "independent-2", {
      title: "Warunek zwycięstwa",
      prompt: "Dodaj warunek, który wyświetli WYGRANA po zebraniu trzech monet.",
      steps: ["Utwórz score z trzema punktami.", "Sprawdź points >= 3.", "Wypisz komunikat WYGRANA."],
      starter: `public class Main {
    public static void main(String[] args) {
        int points = 0;
        // TODO: warunek zwycięstwa
    }
}
`,
      solution: `public class Main {
    public static void main(String[] args) {
        int points = 3;
        System.out.println("SCORE|" + points);
        if (points >= 3) {
            System.out.println("WYGRANA");
        }
    }
}
`,
      checks: [
        { kind: "contains", file: "Main.java", value: "points >= 3", label: "Próg zwycięstwa" },
        { kind: "contains", file: "Main.java", value: "WYGRANA", label: "Komunikat zwycięstwa" },
      ],
      runMode: "game",
    }),
  ],
};

export function addIndependentTasks(lesson) {
  const [firstTask] = lesson.tasks;
  if (lesson.track === "game-dev") return lesson;
  return {
    ...lesson,
    tasks: [
      { ...firstTask, mode: "guided" },
      ...(additionalTasks[lesson.id] || []),
    ],
  };
}
