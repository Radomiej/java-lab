const lesson = (id, order, title, summary, objective, theory, tips, task) => ({
  id, track: "algorithms", order, title, summary, objective, theory, tips,
  tasks: [{ id: `${id}-task`, mode: "guided", mainClass: "Main", runMode: "console", ...task }],
});
const page = (title, text, code) => ({ title, text, code });
const consoleTask = (title, prompt, steps, hints, starter, solution, checks, values) => ({
  title, prompt, steps, hints,
  starterFiles: { "Main.java": starter },
  solutionFiles: { "Main.java": solution },
  checks,
  outputChecks: [{ kind: "outputLines", values, label: "Wynik uruchomionego programu" }],
});

export const algorithmsLessons = [
  lesson("algorithms-01", 1, "Tablica i przeglądanie danych", "int[], indeksy, max, suma i zliczanie",
    "Zapiszesz pierwsze algorytmy na tablicy liczb: znajdziesz największą wartość, policzysz sumę i zliczysz elementy spełniające warunek.",
    [
      page("Algorytm to przepis na kroki", "Algorytm opisuje dokładnie, jak przejść od danych do wyniku w skończonej liczbie kroków. Dane trzymamy w tablicy: int[] scores = {9, 1, 5, 2}. Element wybieramy indeksem od zera: scores[0] to 9, a scores.length mówi, ile jest komórek. Najprostszym algorytmem jest przejście przez całą tablicę pętlą.", "int[] scores = {9, 1, 5, 2};\n\nfor (int i = 0; i < scores.length; i++) {\n    System.out.println(scores[i]);\n}"),
      page("Maksimum: zapamiętaj najlepsze", "Szukanie maksimum zaczyna się od założenia, że pierwszy element jest największy. Potem każda kolejna komórka wygrywa, gdy jest większa od zapamiętanej wartości. Po całej pętli max trzyma największą liczbę.", "static int findMax(int[] values) {\n    int max = values[0];\n    for (int i = 1; i < values.length; i++) {\n        if (values[i] > max) {\n            max = values[i];\n        }\n    }\n    return max;\n}"),
      page("Akumulator: suma i zliczanie", "Suma i licznik działają tak samo: zaczynamy od zera i w każdym obrocie pętli coś dodajemy. Zliczanie dodaje jedynkę tylko wtedy, gdy element spełnia warunek — dlatego if siedzi wewnątrz pętli.", "int sum = 0;\nint bigger = 0;\nfor (int i = 0; i < values.length; i++) {\n    sum += values[i];\n    if (values[i] > 5) {\n        bigger++;\n    }\n}"),
    ],
    ["Indeksy tablicy zaczynają się od 0, a ostatni to length - 1.", "Startuj max od values[0] — wartość neutralna jak 0 zepsułaby wynik dla samych ujemnych."],
    consoleTask("Znajdź najlepszy wynik", "Uzupełnij metodę findMax tak, aby zwracała największą liczbę w tablicy. Program wypisuje wynik.",
      ["Zainicjuj max wartością values[0].", "W pętli od i = 1 sprawdzaj, czy values[i] > max.", "Gdy tak — przypisz values[i] do max i zwróć max za pętlą."],
      ["Nie zaczynaj od zera: dla samych ujemnych liczb wynik byłby błędny."],
      `public class Main {
    static int findMax(int[] values) {
        // TODO: zapamiętaj największą wartość
        return 0;
    }

    public static void main(String[] args) {
        int[] scores = {4, 9, 2, 7};
        System.out.println(findMax(scores));
    }
}
`,
      `public class Main {
    static int findMax(int[] values) {
        int max = values[0];
        for (int i = 1; i < values.length; i++) {
            if (values[i] > max) {
                max = values[i];
            }
        }
        return max;
    }

    public static void main(String[] args) {
        int[] scores = {4, 9, 2, 7};
        System.out.println(findMax(scores));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "int max = values[0]", label: "Start od pierwszego elementu" },
        { kind: "contains", file: "Main.java", value: "values[i] > max", label: "Porównanie z liderem" },
      ], ["9"])),

  lesson("algorithms-02", 2, "Sortowanie bąbelkowe", "porównanie sąsiadów i zamiana",
    "Posortujesz tablicę algorytmem bąbelkowym i zrozumiesz, dlaczego są dwie zagnieżdżone pętle.",
    [
      page("Para sąsiadów to jedna decyzja", "Sortowanie bąbelkowe przechodzi po tablicy i porównuje sąsiednie elementy. Gdy lewy jest większy, zamieniamy go z prawym przez zmienną pomocniczą temp. Jedno przejście wypycha największą liczbę na sam koniec — jak bąbelek.", "if (values[i] > values[i + 1]) {\n    int temp = values[i];\n    values[i] = values[i + 1];\n    values[i + 1] = temp;\n}"),
      page("Przejścia powtarzamy aż do porządku", "Jedno przejście ustawia tylko ostatni element. Potrzebujemy length - 1 przejść, dlatego pętla zewnętrzna liczy pass. Po każdym przejściu koniec tablicy jest już gotowy, więc wewnętrzna pętla może być coraz krótsza: i < values.length - 1 - pass.", "for (int pass = 0; pass < values.length - 1; pass++) {\n    for (int i = 0; i < values.length - 1 - pass; i++) {\n        if (values[i] > values[i + 1]) {\n            int temp = values[i];\n            values[i] = values[i + 1];\n            values[i + 1] = temp;\n        }\n    }\n}"),
      page("Pętla w pętli to n × n porównań", "Dla n elementów wykonujemy około n²/2 porównań — mówimy, że algorytm ma złożoność kwadratową O(n²). Dla małych tablic wystarczy; przy milionie elementów potrzebne są szybsze algorytmy z następnych lekcji.", "// Tabela liczby porównań (n = 4):\n// pass 0: pary (0,1) (1,2) (2,3)\n// pass 1: pary (0,1) (1,2)\n// pass 2: para (0,1)"),
    ],
    ["Zamiana bez temp gubi wartość: najpierw schowaj values[i] do temp.", "Wewnętrzna pętla nie musi sięgać końca — prawy brzeg jest już posortowany."],
    consoleTask("Posortuj wyniki drużyny", "Uzupełnij metodę bubbleSort tak, aby sortowała tablicę rosnąco. Program wypisuje posortowane wyniki, każdy w osobnej linii.",
      ["W metodzie bubbleSort dodaj zewnętrzną pętlę pass od 0 do values.length - 1.", "Wewnątrz dodaj pętlę i od 0 do values.length - 1 - pass, która porównuje values[i] z values[i + 1].", "Gdy lewy element jest większy, zamień parę miejscami przez zmienną temp."],
      ["Zamiana wygląda tak: int temp = values[i]; values[i] = values[i + 1]; values[i + 1] = temp;"],
      `public class Main {
    static void bubbleSort(int[] values) {
        // TODO: porównuj sąsiadów i zamieniaj miejscami
    }

    public static void main(String[] args) {
        int[] scores = {9, 1, 5, 2};
        bubbleSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      `public class Main {
    static void bubbleSort(int[] values) {
        for (int pass = 0; pass < values.length - 1; pass++) {
            for (int i = 0; i < values.length - 1 - pass; i++) {
                if (values[i] > values[i + 1]) {
                    int temp = values[i];
                    values[i] = values[i + 1];
                    values[i + 1] = temp;
                }
            }
        }
    }

    public static void main(String[] args) {
        int[] scores = {9, 1, 5, 2};
        bubbleSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "for (", label: "Pętle sortowania" },
        { kind: "contains", file: "Main.java", value: "values[i] > values[i + 1]", label: "Porównanie sąsiadów" },
      ], ["1", "2", "5", "9"])),

  lesson("algorithms-03", 3, "Sortowanie przez wybór", "minimum z nieposortowanej części",
    "Posortujesz tablicę wybierając w każdym kroku najmniejszy element z reszty i stawiając go na swoje miejsce.",
    [
      page("Idea: znajdź minimum i postaw na początku", "Sortowanie przez wybór dzieli tablicę na dwie części: posortowaną na lewo i resztę. W każdym kroku szukamy najmniejszego elementu w reszcie i zamieniamy go z pierwszym nieposortowanym. Posortowana część rośnie o jeden element na krok.", "for (int start = 0; start < values.length - 1; start++) {\n    int minIndex = start;\n    for (int i = start + 1; i < values.length; i++) {\n        if (values[i] < values[minIndex]) {\n            minIndex = i;\n        }\n    }\n    int temp = values[start];\n    values[start] = values[minIndex];\n    values[minIndex] = temp;\n}"),
      page("Dwa indeksy: start i minIndex", "start to granica posortowanej części, minIndex zapamiętuje pozycję najmniejszej znalezionej liczby. Zamianę wykonujemy raz na krok — poza wewnętrzną pętlą. To mniej zamian niż w bąbelkowym.", "// start = 0, tablica {4, 2, 7, 3}\n// minIndex zostaje 1 (wartość 2)\n// zamiana values[0] z values[1]: {2, 4, 7, 3}"),
      page("Dokładnie n - 1 kroków", "Ostatni element zawsze zostaje na miejscu sam. Jak bąbelkowe, sortowanie przez wybór robi O(n²) porównań, ale najwyżej n - 1 zamian — przewaga, gdy zamiana jest droga.", "// krok 0: minimum z {4,2,7,3} to 2 → {2,4,7,3}\n// krok 1: minimum z {4,7,3} to 3 → {2,3,7,4}\n// krok 2: minimum z {7,4} to 4 → {2,3,4,7}"),
    ],
    ["Wewnętrzna pętla zaczyna się od start + 1 — element na start to kandydat na minimum.", "Zamiana jest poza wewnętrzną pętlą; zamiana w środku dałaby bąbelkowe."],
    consoleTask("Ustaw minima na początku", "Uzupełnij metodę selectionSort tak, aby sortowała tablicę rosnąco wybierając minima. Program wypisuje posortowane wyniki.",
      ["Zewnętrzna pętla start od 0 do length - 1 ustawia granicę posortowanej części.", "Wewnętrzna pętla od start + 1 szuka minIndex — pozycji najmniejszej wartości.", "Po pętli zamień values[start] z values[minIndex] przez temp."],
      ["minIndex zaczyna się jako start, a nie 0."],
      `public class Main {
    static void selectionSort(int[] values) {
        // TODO: wybieraj minimum i stawiaj na start
    }

    public static void main(String[] args) {
        int[] scores = {4, 2, 7, 3};
        selectionSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      `public class Main {
    static void selectionSort(int[] values) {
        for (int start = 0; start < values.length - 1; start++) {
            int minIndex = start;
            for (int i = start + 1; i < values.length; i++) {
                if (values[i] < values[minIndex]) {
                    minIndex = i;
                }
            }
            int temp = values[start];
            values[start] = values[minIndex];
            values[minIndex] = temp;
        }
    }

    public static void main(String[] args) {
        int[] scores = {4, 2, 7, 3};
        selectionSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "int minIndex = start", label: "Kandydat na minimum" },
        { kind: "contains", file: "Main.java", value: "values[i] < values[minIndex]", label: "Szukanie minimum" },
      ], ["2", "3", "4", "7"])),

  lesson("algorithms-04", 4, "Sortowanie przez wstawianie", "klucz wędruje w posortowaną część",
    "Posortujesz tablicę wstawiając każdy element we właściwe miejsce rosnącej posortowanej części — jak karty w ręce.",
    [
      page("Klucz i posortowana lewa strona", "Sortowanie przez wstawianie bierze kolejny element (klucz) i przesuwa go w lewo, póki napotyka mniejszy albo początek tablicy. Lewa część jest zawsze posortowana — wstawiamy tylko w nią. Tak układamy karty na ręce.", "for (int i = 1; i < values.length; i++) {\n    int key = values[i];\n    int j = i - 1;\n    while (j >= 0 && values[j] > key) {\n        values[j + 1] = values[j];\n        j--;\n    }\n    values[j + 1] = key;\n}"),
      page("Przesuwanie zamiast zamiany", "Nie zamieniamy pary — zamiast tego przesuwamy większe elementy o jedno miejsce w prawo, robiąc dziurę dla klucza. Gdy klucz jest już na miejscu, pętla while kończy się warunkiem values[j] > key równym false.", "// {5, 1, 8, 2}, i = 1, key = 1\n// values[1] = 5 przesuwa się: {5, 5, 8, 2}\n// klucz wpada na start: {1, 5, 8, 2}"),
      page("Prawie posortowana jest szybka", "Dla prawie posortowanej tablicy wewnętrzne przesuwanie prawie nie pracuje — algorytm zbliża się wtedy do O(n). W najgorszym razie (kolejność odwrotna) to O(n²) przesunięć.", "// już posortowane {1, 2, 3}:\n// while od razu jest fałszywe — zero przesunięć"),
    ],
    ["key trzyma wartość, bo komórka values[i] zostanie nadpisana przesuwaniem.", "Warunek j >= 0 musi być pierwszy — inaczej zajrzymy poza tablicę."],
    consoleTask("Wstawiaj elementy na miejsce", "Uzupełnij metodę insertionSort tak, aby sortowała tablicę rosnąco. Program wypisuje posortowane wyniki.",
      ["Zewnętrzna pętla od i = 1 pobiera key = values[i].", "Pętla while przesuwa w prawo elementy większe od key, aż j < 0 albo values[j] <= key.", "Wstaw key do dziury: values[j + 1] = key."],
      ["Przesuwanie to values[j + 1] = values[j], a dopiero potem wpisujemy key."],
      `public class Main {
    static void insertionSort(int[] values) {
        // TODO: wstawiaj klucz w posortowaną część
    }

    public static void main(String[] args) {
        int[] scores = {5, 1, 8, 2};
        insertionSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      `public class Main {
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
        int[] scores = {5, 1, 8, 2};
        insertionSort(scores);
        for (int i = 0; i < scores.length; i++) {
            System.out.println(scores[i]);
        }
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "int key = values[i]", label: "Klucz z bieżącego elementu" },
        { kind: "contains", file: "Main.java", value: "values[j + 1] = key", label: "Wstawienie klucza" },
      ], ["1", "2", "5", "8"])),

  lesson("algorithms-05", 5, "Sortowanie przez scalanie", "dziel i scalaj posortowane połowy",
    "Połączysz dwie posortowane tablice w jedną i użyjesz tego kroku w rekurencyjnym sortowaniu przez scalanie.",
    [
      page("Scalanie dwóch posortowanych ciągów", "Dwie posortowane tablice scalamy palcami: patrzymy na czoła obu i zawsze bierzemy mniejszą wartość. Po skończeniu jednej strony dopisujemy resztę drugiej. Wynik jest posortowany.", "int[] result = new int[a.length + b.length];\nint i = 0, j = 0, k = 0;\nwhile (i < a.length && j < b.length) {\n    if (a[i] <= b[j]) {\n        result[k++] = a[i++];\n    } else {\n        result[k++] = b[j++];\n    }\n}\nwhile (i < a.length) result[k++] = a[i++];\nwhile (j < b.length) result[k++] = b[j++];"),
      page("Merge sort: podziel na połowy", "Sortowanie przez scalanie dzieli tablicę na połowy, sortuje każdą osobno tym samym algorytmem (rekurencja) i scala wyniki. Warunek stopu: jednoelementowa tablica jest już posortowana.", "static void mergeSort(int[] v) {\n    if (v.length < 2) {\n        return;\n    }\n    int mid = v.length / 2;\n    int[] left = Arrays.copyOfRange(v, 0, mid);\n    int[] right = Arrays.copyOfRange(v, mid, v.length);\n    mergeSort(left);\n    mergeSort(right);\n    int[] merged = merge(left, right);\n    for (int i = 0; i < v.length; i++) {\n        v[i] = merged[i];\n    }\n}"),
      page("Dzielenie to log n poziomów", "Połowa połowy połowy... Dzielenie wymaga log n kroków, a scalanie na każdym poziomie dotyka każdego elementu raz. Razem O(n log n) — dużo szybciej niż O(n²) prostych metod.", "// 8 → 4+4 → 2+2+2+2 → 1×8\n// 3 poziomy scalania po 8 elementów"),
    ],
    ["Do podziału używamy Arrays.copyOfRange — dodaj import java.util.Arrays.", "Scalanie wymaga osobnej tablicy wynikowej — nie da się w miejscu."],
    consoleTask("Scal dwie posortowane tablice", "Uzupełnij metodę merge tak, aby zwracała jedną posortowaną tablicę z elementów dwóch posortowanych tablic. Program wypisuje wynik.",
      ["Utwórz tablicę result o długości a.length + b.length.", "Trzy wskaźniki i, j, k porównują czoła: mniejsza wartość trafia do result.", "Po pętli dopisz resztkę tej tablicy, która nie została skonsumowana."],
      ["Dopięcie resztek to dwa krótkie while za główną pętlą."],
      `import java.util.Arrays;

public class Main {
    static int[] merge(int[] a, int[] b) {
        // TODO: scal posortowane tablice
        return new int[0];
    }

    public static void main(String[] args) {
        int[] merged = merge(new int[]{1, 4}, new int[]{2, 3, 5});
        System.out.println(Arrays.toString(merged));
    }
}
`,
      `import java.util.Arrays;

public class Main {
    static int[] merge(int[] a, int[] b) {
        int[] result = new int[a.length + b.length];
        int i = 0, j = 0, k = 0;
        while (i < a.length && j < b.length) {
            if (a[i] <= b[j]) {
                result[k++] = a[i++];
            } else {
                result[k++] = b[j++];
            }
        }
        while (i < a.length) {
            result[k++] = a[i++];
        }
        while (j < b.length) {
            result[k++] = b[j++];
        }
        return result;
    }

    public static void main(String[] args) {
        int[] merged = merge(new int[]{1, 4}, new int[]{2, 3, 5});
        System.out.println(Arrays.toString(merged));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "a[i] <= b[j]", label: "Porównanie czołów" },
        { kind: "contains", file: "Main.java", value: "while (i < a.length)", label: "Dopięcie resztki" },
      ], ["[1, 2, 3, 4, 5]"])),

  lesson("algorithms-06", 6, "Sortowanie szybkie", "pivot dzieli tablicę na mniejsze i większe",
    "Zaimplementujesz podział wokół pivota i rekurencyjne sortowanie szybkie — jeden z najszybszych algorytmów O(n log n).",
    [
      page("Pivot ustawia granicę", "Sortowanie szybkie wybiera pivot — u nas ostatni element zakresu. Podział (partition) przesuwa mniejsze lub równe na lewo od pivota, większe na prawo. Po jednym podziale pivot stoi już na właściwym miejscu.", "static int partition(int[] v, int lo, int hi) {\n    int pivot = v[hi];\n    int i = lo - 1;\n    for (int j = lo; j < hi; j++) {\n        if (v[j] <= pivot) {\n            i++;\n            int temp = v[i];\n            v[i] = v[j];\n            v[j] = temp;\n        }\n    }\n    int temp = v[i + 1];\n    v[i + 1] = v[hi];\n    v[hi] = temp;\n    return i + 1;\n}"),
      page("Rekurencja dokańcza dwie strony", "Po podziale sortujemy osobno lewą i prawą stronę — tym samym wywołaniem. Warunek stopu: zakres lo >= hi nic już nie wymaga. Średnio quick sort to O(n log n), choć pechowy pivot daje O(n²).", "static void quickSort(int[] v, int lo, int hi) {\n    if (lo < hi) {\n        int p = partition(v, lo, hi);\n        quickSort(v, lo, p - 1);\n        quickSort(v, p + 1, hi);\n    }\n}"),
      page("i liczy elementy mniejsze od pivota", "Indeks i pokazuje, ile elementów już trafiło na stronę mniejszą. Każde v[j] <= pivot zamieniamy na pozycję i + 1. Na koniec pivot wchodzi na i + 1 — tam jest jego miejsce w wyniku końcowym.", "// {4, 7, 2, 9, 5}, pivot = 5\n// mniejsze: 4 i 2 → lewa strona\n// pivot 5 na indeks 2: {4, 2, 5, 7, 9}"),
    ],
    ["Podział dotyka tylko zakresu lo..hi — nie całej tablicy.", "Wywołania rekurencyjne omijają p: pivot już stoi na miejscu."],
    consoleTask("Podziel tablicę wokół pivota", "Uzupełnij metodę partition tak, aby ustawiała ostatni element na właściwym miejscu: mniejsze na lewo, większe na prawo. Program wypisuje indeks pivota.",
      ["pivot to v[hi], a i = lo - 1 liczy mniejsze elementy.", "Dla każdego j < hi: gdy v[j] <= pivot, zwiększ i i zamień v[i] z v[j].", "Na końcu zamień v[i + 1] z v[hi] i zwróć i + 1."],
      ["Zamiana przez temp: int temp = v[i]; v[i] = v[j]; v[j] = temp;"],
      `public class Main {
    static int partition(int[] v, int lo, int hi) {
        // TODO: mniejsze na lewo od pivota
        return -1;
    }

    public static void main(String[] args) {
        int[] values = {4, 7, 2, 9, 5};
        System.out.println(partition(values, 0, values.length - 1));
    }
}
`,
      `public class Main {
    static int partition(int[] v, int lo, int hi) {
        int pivot = v[hi];
        int i = lo - 1;
        for (int j = lo; j < hi; j++) {
            if (v[j] <= pivot) {
                i++;
                int temp = v[i];
                v[i] = v[j];
                v[j] = temp;
            }
        }
        int temp = v[i + 1];
        v[i + 1] = v[hi];
        v[hi] = temp;
        return i + 1;
    }

    public static void main(String[] args) {
        int[] values = {4, 7, 2, 9, 5};
        System.out.println(partition(values, 0, values.length - 1));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "int pivot = v[hi]", label: "Pivot z końca zakresu" },
        { kind: "contains", file: "Main.java", value: "v[j] <= pivot", label: "Porównanie z pivotem" },
        { kind: "contains", file: "Main.java", value: "return i + 1", label: "Indeks pivota" },
      ], ["2"])),

  lesson("algorithms-07", 7, "Sortowanie przez zliczanie", "kubełki liczą wystąpienia",
    "Posortujesz liczby bez porównań — zliczając, ile razy każda wartość występuje, i rozpisując je z powrotem.",
    [
      page("Kubek na każdą wartość", "Gdy wartości pochodzą z małego zakresu, można policzyć je w tablicy liczników: count[4] mówi, ile razy wystąpiła czwórka. Potem przepisujemy wartości z powrotem — tyle razy, ile ich było. Zero porównań.", "int[] count = new int[max + 1];\nfor (int v : values) {\n    count[v]++;\n}\nint k = 0;\nfor (int v = 0; v <= max; v++) {\n    while (count[v] > 0) {\n        values[k++] = v;\n        count[v]--;\n    }\n}"),
      page("for (int v : values) — pętla po elementach", "To skrót pętli po wszystkich elementach tablicy: v przyjmuje po kolei każdą wartość, bez indeksu. Nadaje się do odczytu; nie zmienia tablicy.", "for (int v : values) {\n    count[v]++;\n}\n// to samo co:\nfor (int i = 0; i < values.length; i++) {\n    count[values[i]]++;\n}"),
      page("Działa tylko dla małego zakresu", "Tablica count musi pomieścić każdą możliwą wartość. Dla zakresu 0..9 to 10 komórek; dla wartości do miliona — milion komórek. Wtedy lepsze porównania jak w sortowaniu szybkim.", "// wartości 0..9 → count[10]\n// {4, 1, 3, 1, 2}: count[1] = 2, reszta po 1\n// wypisujemy: 1, 1, 2, 3, 4"),
    ],
    ["count musi mieć rozmiar max + 1 — indeks wartości to sama wartość.", "Zliczanie daje O(n + zakres) — szybciej niż O(n²), ale kosztem pamięci."],
    consoleTask("Zlicz wystąpienia wartości", "Uzupełnij metodę countingSort tak, aby sortowała wartości z zakresu 0..9 przez zliczanie. Program wypisuje posortowane liczby.",
      ["Utwórz int[] count = new int[10] i zlicz wystąpienia pętlą for-each.", "Zewnętrzna pętla przechodzi wartości v od 0 do 9.", "Dla każdego v dopisz go do values tyle razy, ile wynosi count[v] (pętla while odejmuje licznik)."],
      ["k to osobny indeks pisania w values — startuje od 0."],
      `public class Main {
    static void countingSort(int[] values) {
        // TODO: zlicz wystąpienia i wypisz je z powrotem
    }

    public static void main(String[] args) {
        int[] scores = {4, 1, 3, 1, 2};
        countingSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      `public class Main {
    static void countingSort(int[] values) {
        int[] count = new int[10];
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
        int[] scores = {4, 1, 3, 1, 2};
        countingSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "count[v]++", label: "Zliczanie wystąpień" },
        { kind: "contains", file: "Main.java", value: "while (count[v] > 0)", label: "Rozpisywanie kubełków" },
      ], ["1", "1", "2", "3", "4"])),

  lesson("algorithms-08", 8, "Shell i kopiec: szybsze metody", "odstępy zamiast sąsiadów i drzewo maksimum",
    "Poznasz dwie szybsze odmiany prostych algorytmów: sortowanie Shella z odstępami i sortowanie przez kopcowanie z drzewem maksimum.",
    [
      page("Shell: insertion na odległych parach", "Sortowanie Shella to sortowanie przez wstawianie, które zaczyna od dużego odstępu gap. Elementy daleko od siebie porównujemy najpierw, więc duże liczby szybko trafiają na koniec. Odstęp zmniejszamy — ostatni przejście to zwykłe wstawianie na prawie posortowanych danych.", "for (int gap = values.length / 2; gap > 0; gap /= 2) {\n    for (int i = gap; i < values.length; i++) {\n        int key = values[i];\n        int j = i;\n        while (j >= gap && values[j - gap] > key) {\n            values[j] = values[j - gap];\n            j -= gap;\n        }\n        values[j] = key;\n    }\n}"),
      page("Kopiec: rodzic zawsze największy", "Kopiec (heap) to drzewo w tablicy: rodzic komórki i to (i - 1) / 2, dzieci to 2i + 1 i 2i + 2. W max-heapie rodzic jest większy od dzieci, więc korzeń zawsze trzyma maksimum. Naprawa kopca (siftDown) przesuwa duże dziecko w górę.", "static void siftDown(int[] v, int size, int i) {\n    int largest = i;\n    int left = 2 * i + 1;\n    int right = 2 * i + 2;\n    if (left < size && v[left] > v[largest]) largest = left;\n    if (right < size && v[right] > v[largest]) largest = right;\n    if (largest != i) {\n        int temp = v[i]; v[i] = v[largest]; v[largest] = temp;\n        siftDown(v, size, largest);\n    }\n}"),
      page("Heap sort: zdejmuj maksimum", "Najpierw budujemy kopiec od środka do początku. Potem korzeń (maksimum) zamieniamy z ostatnim elementem, zmniejszamy kopiec i naprawiamy — każdy krok odkłada największą wartość na koniec. Razem O(n log n) bez dodatkowej tablicy.", "static void heapSort(int[] v) {\n    for (int i = v.length / 2 - 1; i >= 0; i--) {\n        siftDown(v, v.length, i);\n    }\n    for (int end = v.length - 1; end > 0; end--) {\n        int temp = v[0]; v[0] = v[end]; v[end] = temp;\n        siftDown(v, end, 0);\n    }\n}"),
    ],
    ["W kopcu dzieci komórki i to 2i + 1 i 2i + 2 — liczymy jak w drzewie na tablicy.", "Shell: gap /= 2 jest najprostszym wyborem; koniec na gap = 1."],
    consoleTask("Sortuj odstępami jak Shell", "Uzupełnij metodę shellSort tak, aby sortowała odstępem malejącym od length / 2 do 1. Program wypisuje posortowane liczby.",
      ["Zewnętrzna pętla: gap od values.length / 2, zmniejszane przez gap /= 2.", "Wewnątrz jest wstawianie z odstępem: key = values[i], j zaczyna się od i.", "Przesuwaj values[j - gap] o gap w prawo, póki j >= gap i element jest większy od key."],
      ["To insertionSort, w którym indeks 1 zastąpiono odstępem gap."],
      `public class Main {
    static void shellSort(int[] values) {
        // TODO: wstawianie z odstępem gap
    }

    public static void main(String[] args) {
        int[] scores = {8, 3, 7, 1, 5};
        shellSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      `public class Main {
    static void shellSort(int[] values) {
        for (int gap = values.length / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < values.length; i++) {
                int key = values[i];
                int j = i;
                while (j >= gap && values[j - gap] > key) {
                    values[j] = values[j - gap];
                    j -= gap;
                }
                values[j] = key;
            }
        }
    }

    public static void main(String[] args) {
        int[] scores = {8, 3, 7, 1, 5};
        shellSort(scores);
        for (int v : scores) {
            System.out.println(v);
        }
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "gap /= 2", label: "Zmniejszanie odstępu" },
        { kind: "contains", file: "Main.java", value: "j -= gap", label: "Skok o odstęp" },
      ], ["1", "3", "5", "7", "8"])),

  lesson("algorithms-09", 9, "Wyszukiwanie binarne", "odrzucamy połowę w każdym kroku",
    "Zaimplementujesz wyszukiwanie binarne w posortowanej tablicy i jego warianty dla powtarzających się wartości.",
    [
      page("Środek decyduje o połowie", "W posortowanej tablicy patrzymy na środek zakresu low..high. Cel większy od środka odrzuca całą lewą stronę, mniejszy — prawą. Zamiast n kroków liniowych mamy około log₂ n porównań.", "int low = 0;\nint high = sorted.length - 1;\nwhile (low <= high) {\n    int mid = (low + high) / 2;\n    if (sorted[mid] == target) {\n        return mid;\n    } else if (sorted[mid] < target) {\n        low = mid + 1;\n    } else {\n        high = mid - 1;\n    }\n}\nreturn -1;"),
      page("Warunek: tablica musi być posortowana", "Połowienie działa tylko na danych uporządkowanych. W nieposortowanej tablicy odrzucenie połowy może wyrzucić razem z nią cel — wtedy jedyne pewne jest przeszukiwanie liniowe.", "// {2, 4, 6, 8, 10}, cel 8\n// mid = 2 → sorted[2] = 6 < 8 → szukamy w {8, 10}"),
      page("Wariant: pierwsze wystąpienie", "Gdy wartości się powtarzają, trafienie na środek nie musi być pierwszym wystąpieniem. Wariant szukający pierwszego zapamiętuje traf i szuka dalej w lewej połowie.", "static int firstIndex(int[] sorted, int target) {\n    int low = 0, high = sorted.length - 1, found = -1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (sorted[mid] == target) {\n            found = mid;\n            high = mid - 1;   // szukaj wcześniejszego\n        } else if (sorted[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return found;\n}"),
    ],
    ["Brak wyniku zwracamy jako -1 — indeks 0 byłby mylący.", "low <= high: przy low == high zakres ma jeszcze jedną komórkę do sprawdzenia."],
    consoleTask("Znajdź wynik binarnie", "Uzupełnij metodę findIndex tak, aby w posortowanej tablicy szukała celu przeszukiwaniem binarnym i zwracała indeks albo -1.",
      ["Ustaw low na 0 i high na sorted.length - 1.", "W pętli while (low <= high) porównuj sorted[mid] z celem.", "Zwróć mid przy trafieniu, zwężaj połowy i zwróć -1 za pętlą."],
      ["mid to (low + high) / 2 — środek bieżącego zakresu."],
      `public class Main {
    static int findIndex(int[] sorted, int target) {
        // TODO: przeszukiwanie binarne
        return -1;
    }

    public static void main(String[] args) {
        int[] values = {2, 4, 6, 8, 10};
        System.out.println(findIndex(values, 8));
    }
}
`,
      `public class Main {
    static int findIndex(int[] sorted, int target) {
        int low = 0;
        int high = sorted.length - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (sorted[mid] == target) {
                return mid;
            } else if (sorted[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] values = {2, 4, 6, 8, 10};
        System.out.println(findIndex(values, 8));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "while (low <= high)", label: "Pętla połowienia" },
        { kind: "contains", file: "Main.java", value: "int mid = (low + high) / 2", label: "Środek zakresu" },
      ], ["3"])),

  lesson("algorithms-10", 10, "Rekurencja: silnia i potęgi", "metoda woła samą siebie",
    "Napiszesz metody rekurencyjne z warunkiem stopu i zobaczysz, jak szybkie potęgowanie połowi pracę.",
    [
      page("Rekurencja: mniejsza wersja tego samego", "Znasz już metody static. Metoda rekurencyjna wywołuje samą siebie z mniejszym problemem. Musi mieć warunek stopu — gałąź zwracającą wynik bez kolejnego wywołania. Bez niej wywołania nigdy się nie kończą: przepełnienie stosu.", "static int factorial(int n) {\n    if (n <= 1) {\n        return 1;            // warunek stopu\n    }\n    return n * factorial(n - 1);   // krok rekurencyjny\n}"),
      page("Jak wygląda stos wywołań", "factorial(4) czeka na factorial(3), to na factorial(2), to na factorial(1). Dopiero głębokie wywołanie zwraca 1 i wyniki składają się przy powrocie: 1, 2, 6, 24. Każde wywołanie ma własne zmienne na stosie.", "// factorial(4)\n// → 4 * factorial(3)\n//   → 3 * factorial(2)\n//     → 2 * factorial(1) = 1\n// wraca: 2, potem 6, potem 24"),
      page("Szybkie potęgowanie", "Zamiast mnożyć podstawę n razy, liczymy potęgę połowy wykładnika i podnosimy ją do kwadratu. power(2, 10) robi ~4 mnożenia zamiast 10. Parzysty wykładnik: half × half; nieparzysty: dodatkowo × podstawa.", "static int power(int base, int exp) {\n    if (exp == 0) {\n        return 1;\n    }\n    int half = power(base, exp / 2);\n    if (exp % 2 == 0) {\n        return half * half;\n    }\n    return half * half * base;\n}"),
    ],
    ["Najpierw warunek stopu, potem krok rekurencyjny — kolejność zapobiega nieskończonemu zejściu.", "exp % 2 == 0 wybiera parzystą gałąź szybkiego potęgowania."],
    consoleTask("Silnia przez rekurencję", "Uzupełnij metodę factorial tak, aby zwracała n! rekurencyjnie. Program wypisuje wynik dla 6.",
      ["Warunek stopu: dla n <= 1 zwróć 1.", "Krok rekurencyjny: zwróć n * factorial(n - 1).", "Uruchom program — main wypisuje factorial(6)."],
      ["Silnia rośnie szybko; 6! = 720."],
      `public class Main {
    static int factorial(int n) {
        // TODO: warunek stopu i krok rekurencyjny
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(factorial(6));
    }
}
`,
      `public class Main {
    static int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(factorial(6));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "if (n <= 1)", label: "Warunek stopu" },
        { kind: "contains", file: "Main.java", value: "factorial(n - 1)", label: "Krok rekurencyjny" },
      ], ["720"])),

  lesson("algorithms-11", 11, "Ciąg Fibonacciego", "rekurencja a iteracja",
    "Policzysz wyrazy ciągu Fibonacciego rekurencyjnie i iteracyjnie oraz porównasz koszt obu podejść.",
    [
      page("Definicja jest rekurencyjna", "Ciąg zaczyna się od 0 i 1, a każdy następny wyraz to suma dwóch poprzednich: 0, 1, 1, 2, 3, 5, 8, 13. W kodzie: fib(n) = fib(n - 1) + fib(n - 2), z warunkiem stopu n <= 1.", "static int fib(int n) {\n    if (n <= 1) {\n        return n;\n    }\n    return fib(n - 1) + fib(n - 2);\n}"),
      page("Rekurencja liczy to samo wiele razy", "fib(7) liczy fib(6) i fib(5); fib(6) liczy fib(5) i fib(4) — fib(5) powstaje dwa razy, fib(4) trzy. Drzewo wywołań rośnie wykładniczo: ~2ⁿ wywołań. Dla fib(40) to już ponad miliard operacji.", "// fib(4) → fib(3) + fib(2)\n// fib(3) → fib(2) + fib(1)\n// fib(2) → fib(1) + fib(0)\n// fib(2) policzone 2×, fib(1) 3×"),
      page("Iteracja pamięta tylko dwie ostatnie", "Wersja z pętlą trzyma dwa ostatnie wyrazy i przesuwa się do przodu — n kroków zamiast wykładniczej liczby wywołań. To ta sama definicja, tylko policzona od dołu.", "static int fibLoop(int n) {\n    int a = 0;\n    int b = 1;\n    for (int i = 2; i <= n; i++) {\n        int next = a + b;\n        a = b;\n        b = next;\n    }\n    return n <= 1 ? n : b;\n}"),
    ],
    ["Dla n <= 1 zwracamy samo n — fib(0) = 0, fib(1) = 1.", "Iteracyjne a, b to „dwa ostatnie” — w każdym kroku przesuwane."],
    consoleTask("Siódmy wyraz Fibonacciego", "Uzupełnij metodę fib tak, aby zwracała n-ty wyraz ciągu rekurencyjnie: fib(n) = fib(n - 1) + fib(n - 2).",
      ["Warunek stopu: dla n <= 1 zwróć n.", "Zwróć sumę dwóch wywołań rekurencyjnych fib(n - 1) + fib(n - 2).", "Uruchom program — main wypisuje fib(7)."],
      ["fib(7) = 13: 0, 1, 1, 2, 3, 5, 8, 13."],
      `public class Main {
    static int fib(int n) {
        // TODO: warunek stopu i krok rekurencyjny
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(fib(7));
    }
}
`,
      `public class Main {
    static int fib(int n) {
        if (n <= 1) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fib(7));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "if (n <= 1)", label: "Warunek stopu" },
        { kind: "contains", file: "Main.java", value: "fib(n - 1) + fib(n - 2)", label: "Krok rekurencyjny" },
      ], ["13"])),

  lesson("algorithms-12", 12, "NWD i NWW", "algorytm Euklidesa przez reszty",
    "Policzysz największy wspólny dzielnik algorytmem Euklidesa i użyjesz go do wyznaczenia najmniejszej wspólnej wielokrotności.",
    [
      page("Euklides: reszta zamiast dzielników", "Największy wspólny dzielnik a i b jest taki sam jak b i reszty a % b. Powtarzamy zamianę a → b, b → reszta, aż reszta wyniesie zero. Ostatnie niezerowe a to NWD.", "static int gcd(int a, int b) {\n    while (b != 0) {\n        int rest = a % b;\n        a = b;\n        b = rest;\n    }\n    return a;\n}"),
      page("Dlaczego to działa", "Każdy wspólny dzielnik a i b dzieli też resztę a % b, więc zbiór dzielników się nie zmienia. Reszty maleją, więc pętla kończy się. NWD(18, 12): 18 % 12 = 6, 12 % 6 = 0 → NWD = 6.", "// a = 18, b = 12\n// reszta = 6 → a = 12, b = 6\n// reszta = 0 → a = 6, koniec"),
      page("NWW przez NWD", "Najmniejsza wspólna wielokrotność wiąże się z NWD wzorem: NWW(a, b) = a × b / NWD(a, b). Liczby względnie pierwsze to takie, których NWD wynosi 1 — np. 8 i 15.", "static int lcm(int a, int b) {\n    return a * b / gcd(a, b);\n}\n\nstatic boolean areCoprime(int a, int b) {\n    return gcd(a, b) == 1;\n}"),
    ],
    ["Pętla kończy się przy b == 0 — wtedy a trzyma NWD.", "NWW liczymy przez NWD, a nie wielokrotnościami — to szybsze."],
    consoleTask("Największy wspólny dzielnik", "Uzupełnij metodę gcd tak, aby zwracała NWD dwóch liczb algorytmem Euklidesa. Program wypisuje wynik dla 18 i 12.",
      ["Pętla while (b != 0) liczy resztę a % b.", "W każdym obrocie przesuń: a = b, b = reszta.", "Zwróć a po pętli."],
      ["reszta to a % b — operator modulo z kursu pętli."],
      `public class Main {
    static int gcd(int a, int b) {
        // TODO: algorytm Euklidesa
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(gcd(18, 12));
    }
}
`,
      `public class Main {
    static int gcd(int a, int b) {
        while (b != 0) {
            int rest = a % b;
            a = b;
            b = rest;
        }
        return a;
    }

    public static void main(String[] args) {
        System.out.println(gcd(18, 12));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "a % b", label: "Reszta z dzielenia" },
        { kind: "contains", file: "Main.java", value: "b = rest", label: "Przesunięcie pary" },
      ], ["6"])),

  lesson("algorithms-13", 13, "Liczby pierwsze", "test pierwszości i sito Eratostenesa",
    "Sprawdzisz, czy liczba jest pierwsza, przez próbne dzielenie i wygenerujesz wszystkie pierwsze sitem.",
    [
      page("Pierwsza ma tylko dwa dzielniki", "Liczba pierwsza dzieli się wyłącznie przez 1 i siebie. Sprawdzamy dzielniki od 2 wzwyż; wystarczy iść do pierwiastka z n, bo większy dzielnik miałby mniejszego partnera. 1 nie jest pierwsza.", "static boolean isPrime(int n) {\n    if (n < 2) {\n        return false;\n    }\n    for (int d = 2; d * d <= n; d++) {\n        if (n % d == 0) {\n            return false;\n        }\n    }\n    return true;\n}"),
      page("d * d <= n zamiast pierwiastka", "Zamiast Math.sqrt porównujemy d² z n — to tanie i bez ułamków. Gdy d² przekroczy n, dalej dzielników już nie ma.", "// n = 29: d = 2,3,4,5\n// 6×6 = 36 > 29 → koniec, 29 jest pierwsza"),
      page("Sito Eratostenesa", "Dla wszystkich pierwszych do n szybsze jest sito: tablica flag, skreślamy wielokrotności każdej znalezionej pierwszej. Nie podzielamy nic — tylko skreślamy od kwadratu liczby.", "static int countPrimes(int limit) {\n    boolean[] crossed = new boolean[limit + 1];\n    int count = 0;\n    for (int n = 2; n <= limit; n++) {\n        if (!crossed[n]) {\n            count++;\n            for (int m = n * n; m <= limit; m += n) {\n                crossed[m] = true;\n            }\n        }\n    }\n    return count;\n}"),
    ],
    ["n < 2 od razu zwraca false — 0 i 1 nie są pierwsze.", "Sito skreśla od n * n: mniejsze wielokrotności już skreśliły wcześniejsze liczby."],
    consoleTask("Sprawdź pierwszość", "Uzupełnij metodę isPrime tak, aby zwracała true tylko dla liczb pierwszych. Program wypisuje wynik dla 29.",
      ["Dla n < 2 zwróć false.", "Pętla for (int d = 2; d * d <= n; d++) sprawdza dzielniki.", "Gdy n % d == 0 — zwróć false; po pętli zwróć true."],
      ["Warunek d * d <= n zastępuje pierwiastek."],
      `public class Main {
    static boolean isPrime(int n) {
        // TODO: test pierwszości
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(29));
    }
}
`,
      `public class Main {
    static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        for (int d = 2; d * d <= n; d++) {
            if (n % d == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPrime(29));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "d * d <= n", label: "Granica pierwiastka" },
        { kind: "contains", file: "Main.java", value: "n % d == 0", label: "Dzielnik znaleziony" },
      ], ["true"])),

  lesson("algorithms-14", 14, "Palindrom i odwracanie", "dwa wskaźniki od brzegów",
    "Sprawdzisz palindromy dwoma wskaźnikami i odwrócisz tekst oraz tablicę.",
    [
      page("Dwa wskaźniki idą do środka", "Palindrom czyta się tak samo od lewej i prawej: kajak, radar. Porównujemy znaki z brzegów i zbliżamy wskaźniki i oraz j. Pierwsza różnica rozstrzyga wynik.", "static boolean isPalindrome(String text) {\n    for (int i = 0, j = text.length() - 1; i < j; i++, j--) {\n        if (text.charAt(i) != text.charAt(j)) {\n            return false;\n        }\n    }\n    return true;\n}"),
      page("charAt wybiera znak z pozycji", "String nie jest tablicą, więc znak bierzemy metodą charAt(i). Tekst ma length() z nawiasami — inaczej niż tablicowe length bez nawiasów.", "String word = \"kajak\";\nword.charAt(0);   // 'k'\nword.charAt(4);   // 'k'\nword.length();    // 5"),
      page("Odwracanie w tablicy znaków", "Odwrócenie tekstu budujemy na char[]: zamieniamy brzegi jak w palindromie, ale przez swap. Z char[] z powrotem powstaje String przez new String(chars).", "static String reverse(String text) {\n    char[] chars = text.toCharArray();\n    for (int i = 0, j = chars.length - 1; i < j; i++, j--) {\n        char temp = chars[i];\n        chars[i] = chars[j];\n        chars[j] = temp;\n    }\n    return new String(chars);\n}"),
    ],
    ["length() dla String, length dla tablicy — łatwo pomylić nawiasy.", "Wynik String wymaga new String(chars) lub StringBuilder."],
    consoleTask("Sprawdź palindrom", "Uzupełnij metodę isPalindrome tak, aby zwracała true, gdy tekst czyta się tak samo od przodu i od tyłu.",
      ["Wskaźniki: i = 0, j = text.length() - 1, pętla i < j.", "Porównaj text.charAt(i) z text.charAt(j); różnica to false.", "Po pętli zwróć true."],
      ["Oba indeksy deklarujemy w jednym for: int i = 0, j = text.length() - 1."],
      `public class Main {
    static boolean isPalindrome(String text) {
        // TODO: porównuj znaki od brzegów do środka
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("kajak"));
    }
}
`,
      `public class Main {
    static boolean isPalindrome(String text) {
        for (int i = 0, j = text.length() - 1; i < j; i++, j--) {
            if (text.charAt(i) != text.charAt(j)) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("kajak"));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "text.charAt(i) != text.charAt(j)", label: "Porównanie brzegów" },
        { kind: "contains", file: "Main.java", value: "i < j", label: "Warunek pętli" },
      ], ["true"])),

  lesson("algorithms-15", 15, "Szyfr Cezara", "przesunięcie liter o k",
    "Zaszyfrujesz tekst przesuwając każdą literę o stałą liczbę pozycji w alfabecie — najprostszy szyfr podstawieniowy.",
    [
      page("Przesunięcie o k pozycji", "Szyfr Cezara zastępuje każdą literę literą oddaloną o k pozycji. Przy k = 3 litera A staje się D. Alfabet zawija się przez modulo 26: Z + 1 wraca do A.", "static String caesar(String text, int shift) {\n    String result = \"\";\n    for (int i = 0; i < text.length(); i++) {\n        char c = text.charAt(i);\n        if (c >= 'A' && c <= 'Z') {\n            c = (char) ('A' + (c - 'A' + shift) % 26);\n        }\n        result += c;\n    }\n    return result;\n}"),
      page("Arytmetyka na znakach", "char to liczba — kod znaku. 'A' + 1 daje 'B'. Odejmując 'A' dostajemy pozycję 0-25, po przesunięciu i modulo dodajemy 'A' z powrotem. Rzutowanie (char) zamienia liczbę z powrotem na znak.", "char c = 'C';\nint pos = c - 'A';       // 2\nchar next = (char) ('A' + (pos + 3) % 26);  // 'F'"),
      page("Deszyfrowanie to ujemny shift", "Odszyfrowanie przesuwa litery w drugą stronę — shift - k. Rotacja o 13 (ROT13) ma ciekawą własność: dwa razy zastosowana przywraca tekst, bo 13 + 13 = 26.", "// deszyfr: caesar(\"DEF\", -3) → \"ABC\"\n// ROT13: caesar(\"HELLO\", 13) → \"URYYB\"\n//      caesar(\"URYYB\", 13) → \"HELLO\""),
    ],
    ["Wynik buduj znak po znaku: result += c.", "Modulo pilnuje zawinięcia alfabetu — bez niego Z + 1 wypada poza litery."],
    consoleTask("Zaszyfruj Cezarem", "Uzupełnij metodę caesar tak, aby przesuwała wielkie litery o shift pozycji z zawinięciem alfabetu. Program wypisuje zaszyfrowany tekst.",
      ["Dla każdego i pobierz c = text.charAt(i) i dodaj do result.", "Gdy c jest w 'A'..'Z', zamień na (char)('A' + (c - 'A' + shift) % 26).", "Zwróć zbudowany result."],
      ["Pozycja litery to c - 'A' — wartość 0..25 przed przesunięciem."],
      `public class Main {
    static String caesar(String text, int shift) {
        // TODO: przesuń litery o shift
        return "";
    }

    public static void main(String[] args) {
        System.out.println(caesar("ABC", 3));
    }
}
`,
      `public class Main {
    static String caesar(String text, int shift) {
        String result = "";
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                c = (char) ('A' + (c - 'A' + shift) % 26);
            }
            result += c;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(caesar("ABC", 3));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "c - 'A' + shift", label: "Przesunięcie pozycji" },
        { kind: "contains", file: "Main.java", value: "% 26", label: "Zawinięcie alfabetu" },
      ], ["DEF"])),

  lesson("algorithms-16", 16, "Systemy liczbowe", "dzielenie przez podstawę i reszty",
    "Zamienisz liczbę dziesiętną na binarną i szesnastkową przez dzielenie z resztą oraz w drugą stronę przez mnożenie.",
    [
      page("Reszty czytane od końca", "Zamiana na system o podstawie b: dzielimy liczbę przez b i zapisujemy resztę. Wynik to reszty czytane od ostatniej do pierwszej. 13 / 2 = 6 r. 1, 6 / 2 = 3 r. 0, 3 / 2 = 1 r. 1, 1 / 2 = 0 r. 1 → 1101.", "static String toBase(int number, int base) {\n    String digits = \"0123456789ABCDEF\";\n    String result = \"\";\n    do {\n        result = digits.charAt(number % base) + result;\n        number /= base;\n    } while (number > 0);\n    return result;\n}"),
      page("Dopisywanie z przodu", "Reszty zbieramy w odwrotnej kolejności, więc każdą doklejamy PRZED wynik: digit + result. Zapis do...while gwarantuje jedną cyfrę nawet dla zera.", "// 13, baza 2:\n// reszta 1 → \"1\"\n// reszta 0 → \"01\"\n// reszta 1 → \"101\"\n// reszta 1 → \"1101\""),
      page("Z powrotem: mnożenie przez podstawę", "Zamiana zapisu na liczbę idzie od lewej: wartość = wartość × baza + cyfra. To horyzont — ta sama pętla działa dla binarnego, szesnastkowego i każdej innej podstawy.", "static int fromBase(String text, int base) {\n    String digits = \"0123456789ABCDEF\";\n    int value = 0;\n    for (int i = 0; i < text.length(); i++) {\n        value = value * base + digits.indexOf(text.charAt(i));\n    }\n    return value;\n}"),
    ],
    ["do...while wykonuje się raz — liczba 0 też wypisuje cyfrę.", "indexOf w stringu digits zamienia znak na wartość cyfry."],
    consoleTask("Zamień na binarny", "Uzupełnij metodę toBinary tak, aby zwracała liczbę zapisaną binarnie przez reszty z dzielenia przez 2.",
      ["Zbieraj reszty number % 2 i doklejaj je PRZED result.", "Dziel number przez 2 w każdym obrocie pętli while (number > 0).", "Zwróć zbudowany result."],
      ["Doklejanie z przodu: result = (number % 2) + result."],
      `public class Main {
    static String toBinary(int number) {
        // TODO: reszty z dzielenia przez 2
        return "";
    }

    public static void main(String[] args) {
        System.out.println(toBinary(13));
    }
}
`,
      `public class Main {
    static String toBinary(int number) {
        String result = "";
        while (number > 0) {
            result = (number % 2) + result;
            number /= 2;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(toBinary(13));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "number % 2", label: "Reszta z dzielenia" },
        { kind: "contains", file: "Main.java", value: "+ result", label: "Doklejanie z przodu" },
      ], ["1101"])),

  lesson("algorithms-17", 17, "Wzorzec w tekście", "okno przesuwa się po napisie",
    "Znajdziesz wzorzec w tekście naiwnym przeszukiwaniem i zliczysz jego wystąpienia.",
    [
      page("Okno o długości wzorca", "Naiwne szukanie wzorca ustawia okno o długości wzorca na każdej pozycji tekstu i porównuje znak po znaku. Pierwsza różnica przesuwa okno o jedno miejsce.", "static int find(String text, String pattern) {\n    for (int start = 0; start <= text.length() - pattern.length(); start++) {\n        int i = 0;\n        while (i < pattern.length() && text.charAt(start + i) == pattern.charAt(i)) {\n            i++;\n        }\n        if (i == pattern.length()) {\n            return start;\n        }\n    }\n    return -1;\n}"),
      page("start + i to pozycja w tekście", "Indeks i chodzi po wzorcu, a start + i po tekście. Trafienie wymaga i == pattern.length() — wszystkie znaki pasowały. Ostatnia sensowna pozycja start to length - pattern.length().", "// \"ala ma kota\", wzorzec \"kot\"\n// start od 0 do 8; trafienie na start = 7"),
      page("Zliczanie wszystkich wystąpień", "Zamiast return po trafieniu, zliczamy count++ i szukamy dalej od start + 1. Tak powstaje algorytm dla nakładających się wystąpień jak \"ana\" w \"banana\" — dwa trafy.", "static int countMatches(String text, String pattern) {\n    int count = 0;\n    for (int start = 0; start <= text.length() - pattern.length(); start++) {\n        if (text.substring(start, start + pattern.length()).equals(pattern)) {\n            count++;\n        }\n    }\n    return count;\n}"),
    ],
    ["substring(a, b) wycina fragment [a, b) — wariant porównujący znaki też działa.", "Granica start <= length - pattern.length() pilnuje wyjścia poza tekst."],
    consoleTask("Znajdź wzorzec", "Uzupełnij metodę find tak, aby zwracała pozycję pierwszego wystąpienia wzorca w tekście albo -1.",
      ["Pętla start od 0 do text.length() - pattern.length().", "Wewnętrzny indeks i porównuje text.charAt(start + i) z pattern.charAt(i).", "Gdy i == pattern.length() zwróć start; po pętli -1."],
      ["while rośnie i tylko przy zgodnych znakach."],
      `public class Main {
    static int find(String text, String pattern) {
        // TODO: naiwne szukanie wzorca
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(find("ala ma kota", "kot"));
    }
}
`,
      `public class Main {
    static int find(String text, String pattern) {
        for (int start = 0; start <= text.length() - pattern.length(); start++) {
            int i = 0;
            while (i < pattern.length() && text.charAt(start + i) == pattern.charAt(i)) {
                i++;
            }
            if (i == pattern.length()) {
                return start;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(find("ala ma kota", "kot"));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "text.charAt(start + i) == pattern.charAt(i)", label: "Porównanie znaków" },
        { kind: "contains", file: "Main.java", value: "i == pattern.length()", label: "Pełne dopasowanie" },
      ], ["7"])),

  lesson("algorithms-18", 18, "Macierze", "int[][] i dwie pętle",
    "Wykonasz operacje na macierzy dwuwymiarowej: sumę przekątnej, transpozycję i mnożenie.",
    [
      page("Tablica tablic", "Macierz to int[][] — wiersze po kolumnach. m[0][1] to pierwszy wiersz, druga komórka. Przejście przez całą macierz wymaga dwóch pętli: wiersz po wierszu.", "int[][] m = {\n    {1, 2},\n    {3, 4}\n};\nfor (int r = 0; r < m.length; r++) {\n    for (int c = 0; c < m[r].length; c++) {\n        System.out.print(m[r][c] + \" \");\n    }\n    System.out.println();\n}"),
      page("Przekątna: r == c", "Suma głównej przekątnej bierze tylko komórki, gdzie wiersz równa się kolumnie. Kwadratowa macierz ma length wierszy i tyle samo kolumn.", "static int diagonalSum(int[][] m) {\n    int sum = 0;\n    for (int r = 0; r < m.length; r++) {\n        sum += m[r][r];\n    }\n    return sum;\n}"),
      page("Transpozycja zamienia wymiary", "Transponowana macierz t ma wiersze z kolumn oryginału: t[c][r] = m[r][c]. Mnożenie to suma iloczynów wiersza z kolumną — trzy zagnieżdżone pętle.", "static int[][] transpose(int[][] m) {\n    int[][] t = new int[m[0].length][m.length];\n    for (int r = 0; r < m.length; r++) {\n        for (int c = 0; c < m[r].length; c++) {\n            t[c][r] = m[r][c];\n        }\n    }\n    return t;\n}"),
    ],
    ["m.length to liczba wierszy, m[0].length to liczba kolumn.", "Transpozycja nowej macierzy ma odwrócone wymiary."],
    consoleTask("Suma przekątnej macierzy", "Uzupełnij metodę diagonalSum tak, aby sumowała elementy głównej przekątnej macierzy kwadratowej.",
      ["Zmienna sum zaczyna się od 0.", "Pętla po r od 0 do m.length dodaje m[r][r] do sum.", "Zwróć sum."],
      ["Na przekątnej wiersz i kolumna są równe."],
      `public class Main {
    static int diagonalSum(int[][] m) {
        // TODO: suma elementów przekątnej
        return 0;
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2}, {3, 4}};
        System.out.println(diagonalSum(m));
    }
}
`,
      `public class Main {
    static int diagonalSum(int[][] m) {
        int sum = 0;
        for (int r = 0; r < m.length; r++) {
            sum += m[r][r];
        }
        return sum;
    }

    public static void main(String[] args) {
        int[][] m = {{1, 2}, {3, 4}};
        System.out.println(diagonalSum(m));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "m[r][r]", label: "Element przekątnej" },
        { kind: "contains", file: "Main.java", value: "sum +=", label: "Akumulator sumy" },
      ], ["5"])),

  lesson("algorithms-19", 19, "Stos i odwrócona notacja", "LIFO: odkładamy i zdejmujemy",
    "Zbudujesz stos na tablicy i użyjesz go do obliczenia wyrażenia w odwróconej notacji polskiej (ONP).",
    [
      page("Stos: ostatni wchodzi, pierwszy wychodzi", "Stos działa jak talia kart: push kładzie na wierzchu, pop zdejmuje z wierzchu. W tablicy wystarczy wskaźnik top na wolne miejsce — pop bierze wartość spod top.", "int[] stack = new int[100];\nint top = 0;\nstack[top++] = 5;   // push 5\nstack[top++] = 3;   // push 3\nint value = stack[--top];  // pop → 3"),
      page("ONP: operandy na stos, operator działa", "W odwróconej notacji polskiej operator stoi PO argumentach: \"3 4 +\" to 3 + 4. Liczby odkładamy na stos; operator zdejmuje dwie wartości, liczy wynik i odkłada go z powrotem. Nawiasy nie są potrzebne.", "for (String token : tokens) {\n    if (token.equals(\"+\")) {\n        int b = stack[--top];\n        int a = stack[--top];\n        stack[top++] = a + b;\n    } else {\n        stack[top++] = Integer.parseInt(token);\n    }\n}"),
      page("Kolejność operandów ma znaczenie", "Przy - i / pierwszy zdjęty element to PRAWY operand: dla \"4 2 -\" zdejmujemy b = 2, potem a = 4, liczymy a - b = 2. Zamiana kolejności zmienia wynik.", "// \"4 2 -\": b = 2, a = 4 → 2\n// \"4 2 /\": b = 2, a = 4 → 2\n// \"2 4 /\": b = 4, a = 2 → 0"),
    ],
    ["Integer.parseInt(token) zamienia tekst liczby na int.", "Błąd stosu: pop przy top == 0 to brak operandu — ONP musi być poprawna."],
    consoleTask("Policz wyrażenie ONP", "Uzupełnij metodę evalRpn tak, aby obliczała wyrażenie w odwróconej notacji polskiej z tokenów + i -.",
      ["Stos: int[] stack i top = 0; liczby odkładaj przez Integer.parseInt.", "Token \"+\" zdejmuje dwie wartości, dodaje i odkłada wynik.", "Token \"-\" zdejmuje b, potem a i odkłada a - b. Wynik to stack[0]."],
      ["for (String token : tokens) przechodzi po tablicy tokenów."],
      `public class Main {
    static int evalRpn(String[] tokens) {
        // TODO: stos + operatory
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(evalRpn(new String[]{"2", "3", "+"}));
    }
}
`,
      `public class Main {
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
        System.out.println(evalRpn(new String[]{"2", "3", "+"}));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "stack[top++]", label: "Odkładanie na stos" },
        { kind: "contains", file: "Main.java", value: "stack[--top]", label: "Zdejmowanie ze stosu" },
      ], ["5"])),

  lesson("algorithms-20", 20, "Graf: BFS i DFS", "sąsiedzi, kolejka i odwiedzone",
    "Przejdziesz graf zapisaną listą sąsiedztwa — wszerz kolejką (BFS) i w głąb rekurencją (DFS).",
    [
      page("Graf jako lista sąsiedztwa", "Wierzchołki numerujemy 0..n-1, a lista sąsiedztwa to int[][]: g[v] to tablica numerów połączonych z v. Flaga visited[] pilnuje, by nie wejść w cykl po raz drugi.", "int[][] graph = {\n    {1, 2},    // 0 łączy się z 1 i 2\n    {0, 3},    // 1 z 0 i 3\n    {0},       // 2 z 0\n    {1}        // 3 z 1\n};"),
      page("BFS: kolejka dochodzi falowo", "Przeszukiwanie wszerz zaczyna od wierzchołka, odkłada sąsiadów do kolejki i przetwarza po kolei — najpierw najbliżsi, potem dalsi. Kolejka to tablica z dwoma wskaźnikami.", "boolean[] visited = new boolean[n];\nint[] queue = new int[n];\nint head = 0, tail = 0;\nvisited[start] = true;\nqueue[tail++] = start;\nwhile (head < tail) {\n    int v = queue[head++];\n    for (int next : graph[v]) {\n        if (!visited[next]) {\n            visited[next] = true;\n            queue[tail++] = next;\n        }\n    }\n}"),
      page("DFS: rekurencja w głąb", "Przeszukiwanie w głąb idzie po jednej gałęzi do końca, zanim wróci. Rekurencja w naturalny sposób robi stos wywołań — warunek stopu to odwiedzony wierzchołek.", "static void dfs(int v, int[][] graph, boolean[] visited) {\n    visited[v] = true;\n    for (int next : graph[v]) {\n        if (!visited[next]) {\n            dfs(next, graph, visited);\n        }\n    }\n}"),
    ],
    ["Odwiedzenie ustawiamy PRZY odkładaniu do kolejki — inaczej ten sam wierzchołek wpadnie wielokrotnie.", "BFS używa kolejki (koniec vs początek), DFS — stosu lub rekurencji."],
    consoleTask("Policz osiągalne wierzchołki", "Uzupełnij metodę reachable tak, aby zwracała liczbę wierzchołków osiągalnych ze startu przez BFS.",
      ["boolean[] visited i kolejka int[] queue z head/tail.", "Odwiedź start, odłóż go; pętla while (head < tail) zdejmuje v.", "Dla każdego next w graph[v] bez visited: odwiedź i odłóż; zwróć count."],
      ["count rośnie przy każdym nowym visited — łącznie ze startem."],
      `public class Main {
    static int reachable(int[][] graph, int start) {
        // TODO: BFS i licznik osiągalnych
        return 0;
    }

    public static void main(String[] args) {
        int[][] graph = {{1, 2}, {0, 3}, {0}, {1}};
        System.out.println(reachable(graph, 0));
    }
}
`,
      `public class Main {
    static int reachable(int[][] graph, int start) {
        boolean[] visited = new boolean[graph.length];
        int[] queue = new int[graph.length];
        int head = 0, tail = 0, count = 0;
        visited[start] = true;
        queue[tail++] = start;
        while (head < tail) {
            int v = queue[head++];
            count++;
            for (int next : graph[v]) {
                if (!visited[next]) {
                    visited[next] = true;
                    queue[tail++] = next;
                }
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int[][] graph = {{1, 2}, {0, 3}, {0}, {1}};
        System.out.println(reachable(graph, 0));
    }
}
`,
      [
        { kind: "contains", file: "Main.java", value: "visited[next] = true", label: "Odwiedzanie sąsiada" },
        { kind: "contains", file: "Main.java", value: "queue[head++]", label: "Zdejmowanie z kolejki" },
      ], ["4"])),
];
